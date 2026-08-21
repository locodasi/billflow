set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.get_cards_metrics(p_project_id uuid, p_start timestamp with time zone, p_end timestamp with time zone, p_prev_start timestamp with time zone, p_prev_end timestamp with time zone)
 RETURNS TABLE(invoiced numeric, payed numeric, total_invoices bigint, prev_invoiced numeric, prev_payed numeric, prev_total_invoices bigint)
 LANGUAGE sql
 STABLE
AS $function$
  select
    coalesce(sum(amount) filter (where created_at >= p_start and created_at < p_end), 0) as invoiced,
    coalesce(sum(paid_amount) filter (where created_at >= p_start and created_at < p_end), 0) as payed,
    count(*) filter (where created_at >= p_start and created_at < p_end) as total_invoices,
    coalesce(sum(amount) filter (where created_at >= p_prev_start and created_at < p_prev_end), 0) as prev_invoiced,
    coalesce(sum(paid_amount) filter (where created_at >= p_prev_start and created_at < p_prev_end), 0) as prev_payed,
    count(*) filter (where created_at >= p_prev_start and created_at < p_prev_end) as prev_total_invoices
  from invoice_summary
  where project_id = p_project_id
    and created_at >= p_prev_start
    and created_at < p_end;
$function$
;

CREATE OR REPLACE FUNCTION public.get_project_charts_metrics(p_project_id uuid, p_start timestamp with time zone, p_end timestamp with time zone, p_granularity text)
 RETURNS TABLE(bucket timestamp with time zone, invoiced numeric, paid numeric, pending numeric, outstanding numeric, invoiced_cumulative numeric, paid_cumulative numeric)
 LANGUAGE sql
 STABLE
 SET "TimeZone" TO 'UTC'
AS $function$
  
  with buckets as (
    select generate_series(
      date_trunc(p_granularity, p_start),
      date_trunc(p_granularity, p_end - interval '1 second'),
      case p_granularity when 'week' then interval '1 week' else interval '1 month' end
    ) as bucket
  ),
  agg as (
    select
      date_trunc(p_granularity, created_at) as bucket,
      sum(amount)              as invoiced,
      sum(paid_amount)         as paid,
      sum(pending_amount)      as pending,
      sum(outstanding_amount)  as outstanding
    from invoice_summary
    where project_id = p_project_id
      and created_at >= p_start
      and created_at < p_end
    group by 1
  ),
  filled as (
    select
      b.bucket,
      coalesce(a.invoiced, 0)    as invoiced,
      coalesce(a.paid, 0)        as paid,
      coalesce(a.pending, 0)     as pending,
      coalesce(a.outstanding, 0) as outstanding
    from buckets b
    left join agg a on a.bucket = b.bucket
  )
  select
    bucket,
    invoiced,
    paid,
    pending,
    outstanding,
    sum(invoiced) over (order by bucket) as invoiced_cumulative,
    sum(paid)     over (order by bucket) as paid_cumulative
  from filled
  order by bucket;

$function$
;


