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
    status text not null default 'pending' check (status in ('pending', 'paid', 'overdue')),
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