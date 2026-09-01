set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.get_global_cards_metrics(p_start timestamp without time zone, p_end timestamp without time zone, p_prev_start timestamp without time zone, p_prev_end timestamp without time zone)
 RETURNS TABLE(invoiced numeric, payed numeric, total_invoices bigint, prev_invoiced numeric, prev_payed numeric, prev_total_invoices bigint)
 LANGUAGE sql
AS $function$
  select
    coalesce(
      sum(amount_usd) filter (
        where created_at >= p_start
          and created_at < p_end
      ),
      0
    ) as invoiced,

    coalesce(
      sum(paid_amount * exchange_rate_to_usd) filter (
        where created_at >= p_start
          and created_at < p_end
      ),
      0
    ) as payed,

    count(*) filter (
      where created_at >= p_start
        and created_at < p_end
    ) as total_invoices,

    coalesce(
      sum(amount_usd) filter (
        where created_at >= p_prev_start
          and created_at < p_prev_end
      ),
      0
    ) as prev_invoiced,

    coalesce(
      sum(paid_amount * exchange_rate_to_usd) filter (
        where created_at >= p_prev_start
          and created_at < p_prev_end
      ),
      0
    ) as prev_payed,

    count(*) filter (
      where created_at >= p_prev_start
        and created_at < p_prev_end
    ) as prev_total_invoices

  from public.invoice_summary
  where created_at >= p_prev_start
    and created_at < p_end;
$function$
;

CREATE OR REPLACE FUNCTION public.get_global_charts_metrics(p_start timestamp without time zone, p_end timestamp without time zone, p_granularity text)
 RETURNS json
 LANGUAGE sql
AS $function$
  select json_build_object(

    'by_client',
    (
      select coalesce(
        json_agg(
          json_build_object(
            'client_id', client_id,
            'client_name', client_name,
            'invoiced', invoiced,
            'paid', paid
          )
          order by invoiced desc
        ),
        '[]'::json
      )
      from (
        select
          c.id as client_id,
          c.name as client_name,
          coalesce(sum(s.amount_usd), 0) as invoiced,
          coalesce(
            sum(s.paid_amount * s.exchange_rate_to_usd),
            0
          ) as paid
        from public.invoice_summary s
        join public.projects pr
          on pr.id = s.project_id
        join public.clients c
          on c.id = pr.client_id
        where s.created_at >= p_start
          and s.created_at < p_end
        group by c.id, c.name
      ) clients
    ),

    'timeline',
    (
      with buckets as (
        select generate_series(
          date_trunc(p_granularity, p_start),
          date_trunc(
            p_granularity,
            p_end - interval '1 second'
          ),
          case
            when p_granularity = 'week'
              then interval '1 week'
            else interval '1 month'
          end
        ) as bucket
      ),

      agg as (
        select
          date_trunc(
            p_granularity,
            s.created_at
          ) as bucket,

          coalesce(
            sum(s.amount_usd),
            0
          ) as invoiced,

          coalesce(
            sum(
              s.paid_amount * s.exchange_rate_to_usd
            ),
            0
          ) as paid

        from public.invoice_summary s

        join public.projects pr
          on pr.id = s.project_id

        join public.clients c
          on c.id = pr.client_id

        where s.created_at >= p_start
          and s.created_at < p_end

        group by 1
      ),

      filled as (
        select
          b.bucket,
          coalesce(a.invoiced, 0) as invoiced,
          coalesce(a.paid, 0) as paid
        from buckets b
        left join agg a
          on a.bucket = b.bucket
      ),

      cumulative as (
        select
          bucket,
          sum(invoiced) over (
            order by bucket
          ) as invoiced,
          sum(paid) over (
            order by bucket
          ) as paid
        from filled
      )

      select coalesce(
        json_agg(
          json_build_object(
            'bucket', bucket,
            'invoiced', invoiced,
            'paid', paid
          )
          order by bucket
        ),
        '[]'::json
      )
      from cumulative
    )

  );
$function$
;


