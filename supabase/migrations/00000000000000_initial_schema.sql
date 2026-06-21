


SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;


CREATE SCHEMA IF NOT EXISTS "public";


ALTER SCHEMA "public" OWNER TO "pg_database_owner";


COMMENT ON SCHEMA "public" IS 'standard public schema';



CREATE OR REPLACE FUNCTION "public"."get_user_role"("user_id" "uuid") RETURNS "text"
    LANGUAGE "sql" SECURITY DEFINER
    AS $$
    select role from public.profiles where id = user_id;
$$;


ALTER FUNCTION "public"."get_user_role"("user_id" "uuid") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."handle_new_user"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$
begin
    insert into public.profiles (id, email, full_name, language, role)
    values (
        new.id,
        new.email,
        coalesce(new.raw_user_meta_data->>'full_name', ''),
        coalesce(new.raw_user_meta_data->>'language', 'en'),
        'client'
    );
    return new;
end;
$$;


ALTER FUNCTION "public"."handle_new_user"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."is_project_owner"("project_id" "uuid") RETURNS boolean
    LANGUAGE "sql" SECURITY DEFINER
    AS $$
  select exists (
    select 1 
    from projects p
    join clients c on c.id = p.client_id
    where p.id = project_id
    and c.profile_id = auth.uid()
  );
$$;


ALTER FUNCTION "public"."is_project_owner"("project_id" "uuid") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."rls_auto_enable"() RETURNS "event_trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'pg_catalog'
    AS $$
DECLARE
  cmd record;
BEGIN
  FOR cmd IN
    SELECT *
    FROM pg_event_trigger_ddl_commands()
    WHERE command_tag IN ('CREATE TABLE', 'CREATE TABLE AS', 'SELECT INTO')
      AND object_type IN ('table','partitioned table')
  LOOP
     IF cmd.schema_name IS NOT NULL AND cmd.schema_name IN ('public') AND cmd.schema_name NOT IN ('pg_catalog','information_schema') AND cmd.schema_name NOT LIKE 'pg_toast%' AND cmd.schema_name NOT LIKE 'pg_temp%' THEN
      BEGIN
        EXECUTE format('alter table if exists %s enable row level security', cmd.object_identity);
        RAISE LOG 'rls_auto_enable: enabled RLS on %', cmd.object_identity;
      EXCEPTION
        WHEN OTHERS THEN
          RAISE LOG 'rls_auto_enable: failed to enable RLS on %', cmd.object_identity;
      END;
     ELSE
        RAISE LOG 'rls_auto_enable: skip % (either system schema or not in enforced list: %.)', cmd.object_identity, cmd.schema_name;
     END IF;
  END LOOP;
END;
$$;


ALTER FUNCTION "public"."rls_auto_enable"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."sync_role_to_metadata"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$
BEGIN
    UPDATE auth.users
    SET raw_app_meta_data = raw_app_meta_data || jsonb_build_object('role', NEW.role)
    WHERE id = NEW.id;
    RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."sync_role_to_metadata"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."validate_payment_invoice"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
declare
    payment_project uuid;
    invoice_project uuid;

    payment_currency text;
    invoice_currency text;
begin
    select project_id, currency
    into payment_project, payment_currency
    from public.payments
    where id = new.payment_id;

    select project_id, currency
    into invoice_project, invoice_currency
    from public.invoices
    where id = new.invoice_id;

    if payment_project <> invoice_project then
        raise exception
            'Payment and invoice must belong to the same project';
    end if;

    if payment_currency <> invoice_currency then
        raise exception
            'Payment and invoice must use the same currency';
    end if;

    if payment_project is null then
      raise exception 'Payment not found';
    end if;

    if invoice_project is null then
      raise exception 'Invoice not found';
    end if;

    return new;
end;
$$;


ALTER FUNCTION "public"."validate_payment_invoice"() OWNER TO "postgres";

SET default_tablespace = '';

SET default_table_access_method = "heap";


CREATE TABLE IF NOT EXISTS "public"."clients" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "profile_id" "uuid",
    "name" "text" NOT NULL,
    "email" "text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."clients" OWNER TO "postgres";


CREATE OR REPLACE VIEW "public"."invoice_summary" AS
SELECT
    NULL::"uuid" AS "id",
    NULL::"text" AS "invoice_number",
    NULL::"uuid" AS "project_id",
    NULL::numeric(14,2) AS "amount",
    NULL::"text" AS "currency",
    NULL::"date" AS "due_date",
    NULL::"text" AS "pdf_path",
    NULL::"jsonb" AS "metadata",
    NULL::timestamp with time zone AS "created_at",
    NULL::"text" AS "notes",
    NULL::numeric AS "exchange_rate_to_usd",
    NULL::numeric AS "amount_usd",
    NULL::"text" AS "computed_status",
    NULL::numeric AS "paid_amount",
    NULL::numeric AS "pending_amount",
    NULL::numeric AS "outstanding_amount";


ALTER VIEW "public"."invoice_summary" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."projects" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "client_id" "uuid" NOT NULL,
    "name" "text" NOT NULL,
    "currency" "text" DEFAULT 'USD'::"text" NOT NULL,
    "bill_address" "text",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."projects" OWNER TO "postgres";


CREATE OR REPLACE VIEW "public"."client_stats" WITH ("security_invoker"='on') AS
 SELECT "c"."id" AS "client_id",
    "c"."name",
    "c"."email",
    "count"(DISTINCT "p"."id") AS "project_count",
    "count"("i"."id") AS "invoice_count",
    COALESCE("sum"("i"."amount_usd"), (0)::numeric) AS "total_invoiced_usd"
   FROM (("public"."clients" "c"
     LEFT JOIN "public"."projects" "p" ON (("p"."client_id" = "c"."id")))
     LEFT JOIN "public"."invoice_summary" "i" ON (("i"."project_id" = "p"."id")))
  GROUP BY "c"."id", "c"."name", "c"."email";


ALTER VIEW "public"."client_stats" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."invoices" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "invoice_number" "text" NOT NULL,
    "project_id" "uuid" NOT NULL,
    "amount" numeric(14,2) NOT NULL,
    "currency" "text" DEFAULT 'USD'::"text" NOT NULL,
    "due_date" "date",
    "pdf_path" "text",
    "metadata" "jsonb",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "notes" "text",
    "exchange_rate_to_usd" numeric NOT NULL,
    "amount_usd" numeric NOT NULL
);


ALTER TABLE "public"."invoices" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."payment_invoices" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "payment_id" "uuid" NOT NULL,
    "invoice_id" "uuid" NOT NULL,
    "amount_applied" numeric(14,2) NOT NULL,
    "amount_applied_usd" numeric NOT NULL
);


ALTER TABLE "public"."payment_invoices" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."payments" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "payment_number" "text" NOT NULL,
    "project_id" "uuid" NOT NULL,
    "amount" numeric(14,2) NOT NULL,
    "currency" "text" DEFAULT 'USD'::"text" NOT NULL,
    "payment_method" "text",
    "receipt_pdf_path" "text",
    "notes" "text",
    "status" "text" DEFAULT 'pending'::"text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "exchange_rate_to_usd" numeric NOT NULL,
    "amount_usd" numeric NOT NULL,
    CONSTRAINT "payments_status_check" CHECK (("status" = ANY (ARRAY['pending'::"text", 'approved'::"text", 'rejected'::"text"])))
);


ALTER TABLE "public"."payments" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."profiles" (
    "id" "uuid" NOT NULL,
    "full_name" "text",
    "email" "text",
    "role" "text" DEFAULT 'client'::"text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "language" "text" DEFAULT 'en'::"text" NOT NULL,
    CONSTRAINT "profiles_role_check" CHECK (("role" = ANY (ARRAY['admin'::"text", 'client'::"text"])))
);


ALTER TABLE "public"."profiles" OWNER TO "postgres";


CREATE OR REPLACE VIEW "public"."project_stats" WITH ("security_invoker"='on') AS
 SELECT "p"."id" AS "project_id",
    "p"."name",
    "p"."client_id",
    "p"."currency",
    "p"."bill_address",
    "count"("i"."id") AS "invoice_count",
    COALESCE("sum"("i"."amount"), (0)::numeric) AS "total_invoiced",
    COALESCE("sum"("i"."paid_amount"), (0)::numeric) AS "total_collected",
    COALESCE("sum"(("i"."pending_amount" + "i"."outstanding_amount")), (0)::numeric) AS "total_pending"
   FROM ("public"."projects" "p"
     LEFT JOIN "public"."invoice_summary" "i" ON (("i"."project_id" = "p"."id")))
  GROUP BY "p"."id", "p"."name", "p"."client_id", "p"."currency", "p"."bill_address";


ALTER VIEW "public"."project_stats" OWNER TO "postgres";


ALTER TABLE ONLY "public"."clients"
    ADD CONSTRAINT "clients_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."invoices"
    ADD CONSTRAINT "invoices_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."invoices"
    ADD CONSTRAINT "invoices_project_id_invoice_number_key" UNIQUE ("project_id", "invoice_number");



ALTER TABLE ONLY "public"."payment_invoices"
    ADD CONSTRAINT "payment_invoices_payment_id_invoice_id_key" UNIQUE ("payment_id", "invoice_id");



ALTER TABLE ONLY "public"."payment_invoices"
    ADD CONSTRAINT "payment_invoices_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."payments"
    ADD CONSTRAINT "payments_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."payments"
    ADD CONSTRAINT "payments_project_id_payment_number_key" UNIQUE ("project_id", "payment_number");



ALTER TABLE ONLY "public"."profiles"
    ADD CONSTRAINT "profiles_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."projects"
    ADD CONSTRAINT "projects_pkey" PRIMARY KEY ("id");



CREATE INDEX "invoices_project_id_idx" ON "public"."invoices" USING "btree" ("project_id");



CREATE INDEX "payment_invoices_invoice_id_idx" ON "public"."payment_invoices" USING "btree" ("invoice_id");



CREATE INDEX "payment_invoices_payment_id_idx" ON "public"."payment_invoices" USING "btree" ("payment_id");



CREATE INDEX "payments_project_id_idx" ON "public"."payments" USING "btree" ("project_id");



CREATE INDEX "payments_status_idx" ON "public"."payments" USING "btree" ("status");



CREATE INDEX "projects_client_id_idx" ON "public"."projects" USING "btree" ("client_id");



CREATE OR REPLACE VIEW "public"."invoice_summary" WITH ("security_invoker"='on') AS
 SELECT "i"."id",
    "i"."invoice_number",
    "i"."project_id",
    "i"."amount",
    "i"."currency",
    "i"."due_date",
    "i"."pdf_path",
    "i"."metadata",
    "i"."created_at",
    "i"."notes",
    "i"."exchange_rate_to_usd",
    "i"."amount_usd",
        CASE
            WHEN (COALESCE("sum"("pi"."amount_applied") FILTER (WHERE ("p"."status" = 'approved'::"text")), (0)::numeric) >= "i"."amount") THEN 'paid'::"text"
            WHEN (COALESCE("sum"("pi"."amount_applied") FILTER (WHERE ("p"."status" = 'pending'::"text")), (0)::numeric) > (0)::numeric) THEN 'processing'::"text"
            ELSE 'unpaid'::"text"
        END AS "computed_status",
    COALESCE("sum"("pi"."amount_applied") FILTER (WHERE ("p"."status" = 'approved'::"text")), (0)::numeric) AS "paid_amount",
    COALESCE("sum"("pi"."amount_applied") FILTER (WHERE ("p"."status" = 'pending'::"text")), (0)::numeric) AS "pending_amount",
    GREATEST(("i"."amount" - COALESCE("sum"("pi"."amount_applied") FILTER (WHERE ("p"."status" = ANY (ARRAY['approved'::"text", 'pending'::"text"]))), (0)::numeric)), (0)::numeric) AS "outstanding_amount"
   FROM (("public"."invoices" "i"
     LEFT JOIN "public"."payment_invoices" "pi" ON (("pi"."invoice_id" = "i"."id")))
     LEFT JOIN "public"."payments" "p" ON (("p"."id" = "pi"."payment_id")))
  GROUP BY "i"."id";



CREATE OR REPLACE TRIGGER "on_profile_role_change" AFTER INSERT OR UPDATE OF "role" ON "public"."profiles" FOR EACH ROW EXECUTE FUNCTION "public"."sync_role_to_metadata"();



CREATE OR REPLACE TRIGGER "trg_validate_payment_invoice" BEFORE INSERT OR UPDATE ON "public"."payment_invoices" FOR EACH ROW EXECUTE FUNCTION "public"."validate_payment_invoice"();



ALTER TABLE ONLY "public"."clients"
    ADD CONSTRAINT "clients_profile_id_fkey" FOREIGN KEY ("profile_id") REFERENCES "public"."profiles"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."invoices"
    ADD CONSTRAINT "invoices_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."payment_invoices"
    ADD CONSTRAINT "payment_invoices_invoice_id_fkey" FOREIGN KEY ("invoice_id") REFERENCES "public"."invoices"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."payment_invoices"
    ADD CONSTRAINT "payment_invoices_payment_id_fkey" FOREIGN KEY ("payment_id") REFERENCES "public"."payments"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."payments"
    ADD CONSTRAINT "payments_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."profiles"
    ADD CONSTRAINT "profiles_id_fkey" FOREIGN KEY ("id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."projects"
    ADD CONSTRAINT "projects_client_id_fkey" FOREIGN KEY ("client_id") REFERENCES "public"."clients"("id") ON DELETE CASCADE;



CREATE POLICY "Admin and owner can insert invoices" ON "public"."payments" FOR INSERT WITH CHECK ((("public"."get_user_role"("auth"."uid"()) = 'admin'::"text") OR "public"."is_project_owner"("project_id")));



CREATE POLICY "Admin can insert invoices" ON "public"."invoices" FOR INSERT TO "authenticated" WITH CHECK (("public"."get_user_role"("auth"."uid"()) = 'admin'::"text"));



CREATE POLICY "Admin can manage clients" ON "public"."clients" USING (("public"."get_user_role"("auth"."uid"()) = 'admin'::"text"));



CREATE POLICY "Admin can manage projects" ON "public"."projects" USING (("public"."get_user_role"("auth"."uid"()) = 'admin'::"text"));



CREATE POLICY "Admin can view all profiles" ON "public"."profiles" FOR SELECT USING (("public"."get_user_role"("auth"."uid"()) = 'admin'::"text"));



CREATE POLICY "Admins or owners can see projects" ON "public"."projects" FOR SELECT USING (((EXISTS ( SELECT 1
   FROM "public"."profiles" "p"
  WHERE (("p"."id" = "auth"."uid"()) AND ("p"."role" = 'admin'::"text")))) OR (EXISTS ( SELECT 1
   FROM "public"."clients" "c"
  WHERE (("c"."id" = "projects"."client_id") AND ("c"."profile_id" = "auth"."uid"()))))));



CREATE POLICY "Users can see tehir own data" ON "public"."clients" FOR SELECT USING (("profile_id" = "auth"."uid"()));



CREATE POLICY "Users can view own profile" ON "public"."profiles" FOR SELECT USING (("auth"."uid"() = "id"));



CREATE POLICY "admin and owner can see" ON "public"."invoices" FOR SELECT USING ((("public"."get_user_role"("auth"."uid"()) = 'admin'::"text") OR "public"."is_project_owner"("project_id")));



CREATE POLICY "admin and owner can see" ON "public"."payments" FOR SELECT TO "authenticated" USING ((("public"."get_user_role"("auth"."uid"()) = 'admin'::"text") OR "public"."is_project_owner"("project_id")));



CREATE POLICY "admin can update" ON "public"."payments" FOR UPDATE USING (("public"."get_user_role"("auth"."uid"()) = 'admin'::"text")) WITH CHECK (("public"."get_user_role"("auth"."uid"()) = 'admin'::"text"));



ALTER TABLE "public"."clients" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."invoices" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."payment_invoices" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "payment_invoices_insert" ON "public"."payment_invoices" FOR INSERT TO "authenticated" WITH CHECK ((EXISTS ( SELECT 1
   FROM "public"."payments" "p"
  WHERE (("p"."id" = "payment_invoices"."payment_id") AND "public"."is_project_owner"("p"."project_id")))));



ALTER TABLE "public"."payments" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."profiles" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."projects" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "users can view payment_invoices" ON "public"."payment_invoices" FOR SELECT TO "authenticated" USING (("payment_id" IN ( SELECT "payments"."id"
   FROM "public"."payments"
  WHERE (("public"."get_user_role"("auth"."uid"()) = 'admin'::"text") OR "public"."is_project_owner"("payments"."project_id")))));



GRANT USAGE ON SCHEMA "public" TO "postgres";
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";



GRANT ALL ON FUNCTION "public"."get_user_role"("user_id" "uuid") TO "anon";
GRANT ALL ON FUNCTION "public"."get_user_role"("user_id" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_user_role"("user_id" "uuid") TO "service_role";



GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "anon";
GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "service_role";



GRANT ALL ON FUNCTION "public"."is_project_owner"("project_id" "uuid") TO "anon";
GRANT ALL ON FUNCTION "public"."is_project_owner"("project_id" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."is_project_owner"("project_id" "uuid") TO "service_role";



GRANT ALL ON FUNCTION "public"."rls_auto_enable"() TO "anon";
GRANT ALL ON FUNCTION "public"."rls_auto_enable"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."rls_auto_enable"() TO "service_role";



GRANT ALL ON FUNCTION "public"."sync_role_to_metadata"() TO "anon";
GRANT ALL ON FUNCTION "public"."sync_role_to_metadata"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."sync_role_to_metadata"() TO "service_role";



GRANT ALL ON FUNCTION "public"."validate_payment_invoice"() TO "anon";
GRANT ALL ON FUNCTION "public"."validate_payment_invoice"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."validate_payment_invoice"() TO "service_role";



GRANT ALL ON TABLE "public"."clients" TO "anon";
GRANT ALL ON TABLE "public"."clients" TO "authenticated";
GRANT ALL ON TABLE "public"."clients" TO "service_role";



GRANT ALL ON TABLE "public"."invoice_summary" TO "anon";
GRANT ALL ON TABLE "public"."invoice_summary" TO "authenticated";
GRANT ALL ON TABLE "public"."invoice_summary" TO "service_role";



GRANT ALL ON TABLE "public"."projects" TO "anon";
GRANT ALL ON TABLE "public"."projects" TO "authenticated";
GRANT ALL ON TABLE "public"."projects" TO "service_role";



GRANT ALL ON TABLE "public"."client_stats" TO "anon";
GRANT ALL ON TABLE "public"."client_stats" TO "authenticated";
GRANT ALL ON TABLE "public"."client_stats" TO "service_role";



GRANT ALL ON TABLE "public"."invoices" TO "anon";
GRANT ALL ON TABLE "public"."invoices" TO "authenticated";
GRANT ALL ON TABLE "public"."invoices" TO "service_role";



GRANT ALL ON TABLE "public"."payment_invoices" TO "anon";
GRANT ALL ON TABLE "public"."payment_invoices" TO "authenticated";
GRANT ALL ON TABLE "public"."payment_invoices" TO "service_role";



GRANT ALL ON TABLE "public"."payments" TO "anon";
GRANT ALL ON TABLE "public"."payments" TO "authenticated";
GRANT ALL ON TABLE "public"."payments" TO "service_role";



GRANT ALL ON TABLE "public"."profiles" TO "anon";
GRANT ALL ON TABLE "public"."profiles" TO "authenticated";
GRANT ALL ON TABLE "public"."profiles" TO "service_role";



GRANT ALL ON TABLE "public"."project_stats" TO "anon";
GRANT ALL ON TABLE "public"."project_stats" TO "authenticated";
GRANT ALL ON TABLE "public"."project_stats" TO "service_role";



ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "service_role";







