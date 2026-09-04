drop policy "Admin and owner can insert invoices" on "public"."payments";

drop view if exists "public"."client_stats";

drop view if exists "public"."project_stats";

drop view if exists "public"."invoice_summary";


  create table "public"."credit_applications" (
    "id" bigint generated always as identity not null,
    "credit_id" bigint not null,
    "invoice_id" uuid not null,
    "amount_applied" numeric(14,2) not null,
    "amount_applied_usd" numeric not null,
    "created_at" timestamp with time zone not null default now(),
    "payment_id" uuid
      );


alter table "public"."credit_applications" enable row level security;


  create table "public"."project_credits" (
    "id" bigint generated always as identity not null,
    "payment_id" uuid not null,
    "amount" numeric(14,2) not null,
    "created_at" timestamp with time zone not null default now()
      );


alter table "public"."project_credits" enable row level security;

CREATE INDEX credit_applications_credit_id_idx ON public.credit_applications USING btree (credit_id);

CREATE INDEX credit_applications_invoice_id_idx ON public.credit_applications USING btree (invoice_id);

CREATE INDEX credit_applications_payment_id_idx ON public.credit_applications USING btree (payment_id);

CREATE UNIQUE INDEX credit_applications_pkey ON public.credit_applications USING btree (id);

CREATE INDEX project_credits_payment_id_idx ON public.project_credits USING btree (payment_id);

CREATE UNIQUE INDEX project_credits_pkey ON public.project_credits USING btree (id);

alter table "public"."credit_applications" add constraint "credit_applications_pkey" PRIMARY KEY using index "credit_applications_pkey";

alter table "public"."project_credits" add constraint "project_credits_pkey" PRIMARY KEY using index "project_credits_pkey";

alter table "public"."credit_applications" add constraint "credit_applications_amount_applied_check" CHECK ((amount_applied > (0)::numeric)) not valid;

alter table "public"."credit_applications" validate constraint "credit_applications_amount_applied_check";

alter table "public"."credit_applications" add constraint "credit_applications_amount_applied_usd_check" CHECK ((amount_applied_usd > (0)::numeric)) not valid;

alter table "public"."credit_applications" validate constraint "credit_applications_amount_applied_usd_check";

alter table "public"."credit_applications" add constraint "credit_applications_credit_id_fkey" FOREIGN KEY (credit_id) REFERENCES public.project_credits(id) ON DELETE CASCADE not valid;

alter table "public"."credit_applications" validate constraint "credit_applications_credit_id_fkey";

alter table "public"."credit_applications" add constraint "credit_applications_invoice_id_fkey" FOREIGN KEY (invoice_id) REFERENCES public.invoices(id) ON DELETE CASCADE not valid;

alter table "public"."credit_applications" validate constraint "credit_applications_invoice_id_fkey";

alter table "public"."credit_applications" add constraint "credit_applications_payment_id_fkey" FOREIGN KEY (payment_id) REFERENCES public.payments(id) ON DELETE CASCADE not valid;

alter table "public"."credit_applications" validate constraint "credit_applications_payment_id_fkey";

alter table "public"."project_credits" add constraint "project_credits_amount_check" CHECK ((amount > (0)::numeric)) not valid;

alter table "public"."project_credits" validate constraint "project_credits_amount_check";

alter table "public"."project_credits" add constraint "project_credits_payment_id_fkey" FOREIGN KEY (payment_id) REFERENCES public.payments(id) ON DELETE CASCADE not valid;

alter table "public"."project_credits" validate constraint "project_credits_payment_id_fkey";

create or replace view "public"."invoice_summary" as  WITH payment_usage AS (
         SELECT pi.invoice_id,
            COALESCE(sum(pi.amount_applied) FILTER (WHERE (p.status = 'approved'::text)), (0)::numeric) AS paid_amount,
            COALESCE(sum(pi.amount_applied) FILTER (WHERE (p.status = 'pending'::text)), (0)::numeric) AS pending_amount
           FROM (public.payment_invoices pi
             JOIN public.payments p ON ((p.id = pi.payment_id)))
          GROUP BY pi.invoice_id
        ), credit_usage AS (
         SELECT ca.invoice_id,
            COALESCE(sum(ca.amount_applied) FILTER (WHERE (p.status = 'approved'::text)), (0)::numeric) AS credit_usage,
            COALESCE(sum(ca.amount_applied) FILTER (WHERE (p.status = 'pending'::text)), (0)::numeric) AS pending_credit_amount
           FROM (((public.credit_applications ca
             JOIN public.payments p ON ((p.id = ca.payment_id)))
             JOIN public.project_credits pc ON ((pc.id = ca.credit_id)))
             JOIN public.payments credit_payment ON ((credit_payment.id = pc.payment_id)))
          WHERE ((credit_payment.status = 'approved'::text) AND (p.status = ANY (ARRAY['approved'::text, 'pending'::text])))
          GROUP BY ca.invoice_id
        )
 SELECT i.id,
    i.invoice_number,
    i.project_id,
    i.amount,
    i.currency,
    i.due_date,
    i.pdf_path,
    i.metadata,
    i.created_at,
    i.notes,
    i.exchange_rate_to_usd,
    i.amount_usd,
        CASE
            WHEN ((COALESCE(pu.paid_amount, (0)::numeric) + COALESCE(cu.credit_usage, (0)::numeric)) >= i.amount) THEN 'paid'::text
            WHEN ((COALESCE(pu.pending_amount, (0)::numeric) + COALESCE(cu.pending_credit_amount, (0)::numeric)) > (0)::numeric) THEN 'processing'::text
            ELSE 'unpaid'::text
        END AS computed_status,
    (COALESCE(pu.paid_amount, (0)::numeric) + COALESCE(cu.credit_usage, (0)::numeric)) AS paid_amount,
    (COALESCE(pu.pending_amount, (0)::numeric) + COALESCE(cu.pending_credit_amount, (0)::numeric)) AS pending_amount,
    COALESCE(cu.credit_usage, (0)::numeric) AS credit_paid_amount,
    COALESCE(cu.pending_credit_amount, (0)::numeric) AS credit_pending_amount,
    GREATEST((i.amount - (((COALESCE(pu.paid_amount, (0)::numeric) + COALESCE(pu.pending_amount, (0)::numeric)) + COALESCE(cu.credit_usage, (0)::numeric)) + COALESCE(cu.pending_credit_amount, (0)::numeric))), (0)::numeric) AS outstanding_amount
   FROM ((public.invoices i
     LEFT JOIN payment_usage pu ON ((pu.invoice_id = i.id)))
     LEFT JOIN credit_usage cu ON ((cu.invoice_id = i.id)));


create or replace view "public"."project_stats" as  SELECT p.id AS project_id,
    p.name,
    p.client_id,
    p.currency,
    p.bill_address,
    count(i.id) AS invoice_count,
    COALESCE(sum(i.amount), (0)::numeric) AS total_invoiced,
    COALESCE(sum(i.paid_amount), (0)::numeric) AS total_collected,
    COALESCE(sum((i.pending_amount + i.outstanding_amount)), (0)::numeric) AS total_pending
   FROM (public.projects p
     LEFT JOIN public.invoice_summary i ON ((i.project_id = p.id)))
  GROUP BY p.id, p.name, p.client_id, p.currency, p.bill_address;


create or replace view "public"."client_stats" as  SELECT c.id AS client_id,
    c.name,
    c.email,
    count(DISTINCT p.id) AS project_count,
    count(i.id) AS invoice_count,
    COALESCE(sum(i.amount_usd), (0)::numeric) AS total_invoiced_usd
   FROM ((public.clients c
     LEFT JOIN public.projects p ON ((p.client_id = c.id)))
     LEFT JOIN public.invoice_summary i ON ((i.project_id = p.id)))
  GROUP BY c.id, c.name, c.email;


grant delete on table "public"."credit_applications" to "anon";

grant insert on table "public"."credit_applications" to "anon";

grant references on table "public"."credit_applications" to "anon";

grant select on table "public"."credit_applications" to "anon";

grant trigger on table "public"."credit_applications" to "anon";

grant truncate on table "public"."credit_applications" to "anon";

grant update on table "public"."credit_applications" to "anon";

grant delete on table "public"."credit_applications" to "authenticated";

grant insert on table "public"."credit_applications" to "authenticated";

grant references on table "public"."credit_applications" to "authenticated";

grant select on table "public"."credit_applications" to "authenticated";

grant trigger on table "public"."credit_applications" to "authenticated";

grant truncate on table "public"."credit_applications" to "authenticated";

grant update on table "public"."credit_applications" to "authenticated";

grant delete on table "public"."credit_applications" to "service_role";

grant insert on table "public"."credit_applications" to "service_role";

grant references on table "public"."credit_applications" to "service_role";

grant select on table "public"."credit_applications" to "service_role";

grant trigger on table "public"."credit_applications" to "service_role";

grant truncate on table "public"."credit_applications" to "service_role";

grant update on table "public"."credit_applications" to "service_role";

grant delete on table "public"."project_credits" to "anon";

grant insert on table "public"."project_credits" to "anon";

grant references on table "public"."project_credits" to "anon";

grant select on table "public"."project_credits" to "anon";

grant trigger on table "public"."project_credits" to "anon";

grant truncate on table "public"."project_credits" to "anon";

grant update on table "public"."project_credits" to "anon";

grant delete on table "public"."project_credits" to "authenticated";

grant insert on table "public"."project_credits" to "authenticated";

grant references on table "public"."project_credits" to "authenticated";

grant select on table "public"."project_credits" to "authenticated";

grant trigger on table "public"."project_credits" to "authenticated";

grant truncate on table "public"."project_credits" to "authenticated";

grant update on table "public"."project_credits" to "authenticated";

grant delete on table "public"."project_credits" to "service_role";

grant insert on table "public"."project_credits" to "service_role";

grant references on table "public"."project_credits" to "service_role";

grant select on table "public"."project_credits" to "service_role";

grant trigger on table "public"."project_credits" to "service_role";

grant truncate on table "public"."project_credits" to "service_role";

grant update on table "public"."project_credits" to "service_role";


  create policy "Admin and owner can insert credit applications"
  on "public"."credit_applications"
  as permissive
  for insert
  to authenticated
with check (((public.get_user_role(auth.uid()) = 'admin'::text) OR (EXISTS ( SELECT 1
   FROM public.invoices i
  WHERE ((i.id = credit_applications.invoice_id) AND public.is_project_owner(i.project_id))))));



  create policy "Admin and owner can see credit applications"
  on "public"."credit_applications"
  as permissive
  for select
  to authenticated
using (((public.get_user_role(auth.uid()) = 'admin'::text) OR (EXISTS ( SELECT 1
   FROM public.invoices i
  WHERE ((i.id = credit_applications.invoice_id) AND public.is_project_owner(i.project_id))))));



  create policy "Admin and owner can insert payment"
  on "public"."payments"
  as permissive
  for insert
  to public
with check (((public.get_user_role(auth.uid()) = 'admin'::text) OR public.is_project_owner(project_id)));



  create policy "Admin and owner can insert project credit"
  on "public"."project_credits"
  as permissive
  for insert
  to authenticated
with check (((public.get_user_role(auth.uid()) = 'admin'::text) OR (EXISTS ( SELECT 1
   FROM public.payments p
  WHERE ((p.id = project_credits.payment_id) AND public.is_project_owner(p.project_id))))));



  create policy "Admin and owner can see project credits"
  on "public"."project_credits"
  as permissive
  for select
  to authenticated
using (((public.get_user_role(auth.uid()) = 'admin'::text) OR (EXISTS ( SELECT 1
   FROM public.payments p
  WHERE ((p.id = project_credits.payment_id) AND public.is_project_owner(p.project_id))))));



