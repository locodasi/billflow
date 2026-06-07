-- PROFILES (extiende auth.users de Supabase)
create table public.profiles (
    id uuid primary key references auth.users(id) on delete cascade,
    full_name text,
    email text,
    role text not null default 'client' check (role in ('admin', 'client')),
    language text not null default 'en',
    created_at timestamptz not null default now()
);

-- CLIENTS
create table public.clients (
    id uuid primary key default gen_random_uuid(),
    profile_id uuid references public.profiles(id) on delete set null,
    name text not null,
    email text not null,
    created_at timestamptz not null default now()
);

-- PROJECTS
create table public.projects (
    id uuid primary key default gen_random_uuid(),
    client_id uuid not null references public.clients(id) on delete cascade,
    name text not null,
    currency text not null default 'USD',
    bill_address text,
    created_at timestamptz not null default now()
);

-- INVOICES
create table public.invoices (
    id uuid primary key default gen_random_uuid(),
    invoice_number text not null,
    project_id uuid not null references public.projects(id) on delete cascade,
    amount numeric(14, 2) not null,
    currency text not null default 'USD',
    status text not null default 'unpaid' check (status in ('pending', 'paid', 'unpaid')),
    issue_date date not null default current_date,
    due_date date,
    pdf_path text,
    notes text,
    metadata jsonb,
    created_at timestamptz not null default now(),

    unique(project_id, invoice_number)
);

-- PAYMENTS
create table public.payments (
    id uuid primary key default gen_random_uuid(),
    payment_number text not null,
    project_id uuid not null references public.projects(id) on delete cascade,
    amount numeric(14, 2) not null,
    currency text not null default 'USD',
    payment_date date not null default current_date,
    payment_method text,
    receipt_pdf_path text,
    notes text,
    status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
    created_at timestamptz not null default now(),

    unique(project_id, payment_number)
);

-- PAYMENT_INVOICES (relación muchos a muchos)
create table public.payment_invoices (
    id uuid primary key default gen_random_uuid(),
    payment_id uuid not null references public.payments(id) on delete cascade,
    invoice_id uuid not null references public.invoices(id) on delete cascade,
    amount_applied numeric(14, 2) not null,
    unique(payment_id, invoice_id)
);

-- ÍNDICES
create index on public.projects(client_id);
create index on public.invoices(project_id);
create index on public.invoices(status);
create index on public.payments(project_id);
create index on public.payments(status);
create index on public.payment_invoices(payment_id);
create index on public.payment_invoices(invoice_id);


-- Función que se ejecuta cuando se crea un usuario
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
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

-- Trigger que llama a la función al crear un usuario
create or replace trigger on_auth_user_created
    after insert on auth.users
    for each row
    execute function public.handle_new_user();


-- Primero activás RLS en la tabla
alter table public.profiles enable row level security;

-- Policy para que cada usuario solo vea su propio perfil
create policy "Users can view own profile"
on public.profiles
for select
using (auth.uid() = id);

-- La reemplazás usando security definer para evitar la recursión
create or replace function public.get_user_role(user_id uuid)
returns text
language sql
security definer
as $$
    select role from public.profiles where id = user_id;
$$;

create or replace function public.is_project_owner(project_id uuid)
returns boolean
language sql
security definer
as $$
  select exists (
    select 1 
    from projects p
    join clients c on c.id = p.client_id
    where p.id = project_id
    and c.profile_id = auth.uid()
  );
$$;

-- Policy de admin sin recursión
create policy "Admin can view all profiles"
on public.profiles
for select
using (
    public.get_user_role(auth.uid()) = 'admin'
);

-- Clients: solo el admin puede ver, crear, editar
create policy "Admin can manage clients"
on public.clients
for all
using (
    public.get_user_role(auth.uid()) = 'admin'
);

-- Projects: solo el admin puede ver, crear, editar
create policy "Admin can manage projects"
on public.projects
for all
using (
    public.get_user_role(auth.uid()) = 'admin'
);

-- Stats por cliente (para /clients)
create or replace view client_stats as
select
    c.id as client_id,
    c.name,
    c.email,
    count(distinct p.id) as project_count,
    coalesce(sum(i.amount), 0) as total_invoiced,
    coalesce(sum(case when i.status = 'paid' then i.amount else 0 end), 0) as total_paid,
    coalesce(sum(case when i.status = 'pending' then i.amount else 0 end), 0) as total_pending
from clients c
left join projects p on p.client_id = c.id
left join invoices i on i.project_id = p.id
group by c.id, c.name, c.email;

-- Stats por proyecto (para /clients/[clientId])
create or replace view project_stats as
select
    p.id as project_id,
    p.name,
    p.client_id,
    p.currency,
    p.bill_address,
    coalesce(sum(i.amount), 0) as total_invoiced,
    coalesce(sum(case when i.status = 'paid' then i.amount else 0 end), 0) as total_paid,
    coalesce(sum(case when i.status = 'pending' then i.amount else 0 end), 0) as total_pending,
    count(i.id) as invoice_count
from projects p
left join invoices i on i.project_id = p.id
group by p.id, p.name, p.client_id, p.currency, p.bill_address;

alter view client_stats set (security_invoker = on);
alter view project_stats set (security_invoker = on);

create policy "Admins can insert storage objects" on storage.objects for insert to authenticated
with
  check (
    bucket_id = 'documents'
    and (
      exists (
        select
          1
        from
          profiles p
        where
          p.id = auth.uid ()
          and p.role = 'admin'
      )
      or exists (
        select
          1
        from
          projects p
        where
          p.id::text = split_part(name, '/', 1)
          and p.client_id = auth.uid ()
      )
    )
  );

  create policy "Admins or owners can see storage objects"
on storage.objects
for select
to authenticated
using (
  bucket_id = 'documents'
  and (
    exists (
      select 1
      from profiles p
      where p.id = auth.uid()
      and p.role = 'admin'
    )
    or exists (
      select 1
      from projects p
      join clients c on c.id = p.client_id
      where p.id::text = split_part(storage.objects.name, '/', 1)
      and c.profile_id = auth.uid()
    )
  )
);