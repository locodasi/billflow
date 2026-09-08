drop function if exists "public"."get_project_charts_metrics"(p_project_id uuid, p_start timestamp with time zone, p_end timestamp with time zone, p_granularity text);

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.get_credit_metrics(p_project_id uuid, p_start timestamp with time zone, p_end timestamp with time zone, p_value_type text DEFAULT 'amount'::text)
 RETURNS TABLE(credit_id bigint, created_at timestamp with time zone, generated numeric, applied numeric)
 LANGUAGE sql
 STABLE
AS $function$
  WITH period_credits AS (
    SELECT
      pc.id,
      pc.created_at,
      CASE
        WHEN p_value_type = 'usd'
          THEN pc.amount -- ajustar cuando definamos amount_usd
        ELSE pc.amount
      END AS generated
    FROM project_credits pc
    JOIN payments p
      ON p.id = pc.payment_id
    WHERE p.project_id = p_project_id
      AND p.status = 'approved'
      AND pc.created_at >= p_start
      AND pc.created_at < p_end
  ),

  applied_credits AS (
    SELECT
      ca.credit_id,
      SUM(
        CASE
          WHEN p_value_type = 'usd'
            THEN ca.amount_applied_usd
          ELSE ca.amount_applied
        END
      ) AS applied
    FROM credit_applications ca
    JOIN payments p
      ON p.id = ca.payment_id
    JOIN period_credits pc
      ON pc.id = ca.credit_id
    WHERE p.project_id = p_project_id
      AND p.status = 'approved'
    GROUP BY ca.credit_id
  )

  SELECT
    pc.id AS credit_id,
    pc.created_at,
    pc.generated,
    COALESCE(ac.applied, 0) AS applied
  FROM period_credits pc
  LEFT JOIN applied_credits ac
    ON ac.credit_id = pc.id;
$function$
;

CREATE OR REPLACE FUNCTION public.get_cards_metrics(p_project_id uuid, p_start timestamp with time zone, p_end timestamp with time zone, p_prev_start timestamp with time zone, p_prev_end timestamp with time zone)
 RETURNS TABLE(invoiced numeric, payed numeric, total_invoices bigint, prev_invoiced numeric, prev_payed numeric, prev_total_invoices bigint)
 LANGUAGE sql
 STABLE
AS $function$WITH invoice_metrics AS (
    SELECT
        COALESCE(SUM(amount) FILTER (
            WHERE created_at >= p_start
              AND created_at < p_end
        ), 0) AS invoiced,

        COALESCE(SUM(amount) FILTER (
            WHERE created_at >= p_prev_start
              AND created_at < p_prev_end
        ), 0) AS prev_invoiced,

        COUNT(*) FILTER (
            WHERE created_at >= p_start
              AND created_at < p_end
        ) AS total_invoices,

        COUNT(*) FILTER (
            WHERE created_at >= p_prev_start
              AND created_at < p_prev_end
        ) AS prev_total_invoices

    FROM invoices
    WHERE project_id = p_project_id
      AND created_at >= p_prev_start
      AND created_at < p_end
),

payment_metrics AS (
    SELECT
        COALESCE(SUM(amount) FILTER (
            WHERE created_at >= p_start
              AND created_at < p_end
        ), 0) AS paid,

        COALESCE(SUM(amount) FILTER (
            WHERE created_at >= p_prev_start
              AND created_at < p_prev_end
        ), 0) AS prev_paid

    FROM payments
    WHERE project_id = p_project_id
      AND created_at >= p_prev_start
      AND created_at < p_end
      and status = 'approved'
)

SELECT
    invoice_metrics.invoiced,
    payment_metrics.paid,
    invoice_metrics.total_invoices,
    invoice_metrics.prev_invoiced,
    payment_metrics.prev_paid,
    invoice_metrics.prev_total_invoices
FROM invoice_metrics, payment_metrics;$function$
;

CREATE OR REPLACE FUNCTION public.get_global_cards_metrics(p_start timestamp without time zone, p_end timestamp without time zone, p_prev_start timestamp without time zone, p_prev_end timestamp without time zone)
 RETURNS TABLE(invoiced numeric, payed numeric, total_invoices bigint, prev_invoiced numeric, prev_payed numeric, prev_total_invoices bigint)
 LANGUAGE sql
AS $function$WITH invoice_metrics AS (
    SELECT
        COALESCE(SUM(amount_usd) FILTER (
            WHERE created_at >= p_start
              AND created_at < p_end
        ), 0) AS invoiced,

        COALESCE(SUM(amount_usd) FILTER (
            WHERE created_at >= p_prev_start
              AND created_at < p_prev_end
        ), 0) AS prev_invoiced,

        COUNT(*) FILTER (
            WHERE created_at >= p_start
              AND created_at < p_end
        ) AS total_invoices,

        COUNT(*) FILTER (
            WHERE created_at >= p_prev_start
              AND created_at < p_prev_end
        ) AS prev_total_invoices

    FROM invoices
    WHERE created_at >= p_prev_start
      AND created_at < p_end
),

payment_metrics AS (
    SELECT
        COALESCE(SUM(amount_usd) FILTER (
            WHERE created_at >= p_start
              AND created_at < p_end
        ), 0) AS paid,

        COALESCE(SUM(amount_usd) FILTER (
            WHERE created_at >= p_prev_start
              AND created_at < p_prev_end
        ), 0) AS prev_paid

    FROM payments
    WHERE created_at >= p_prev_start
      AND created_at < p_end
      and status = 'approved'
)

SELECT
    invoice_metrics.invoiced,
    payment_metrics.paid,
    invoice_metrics.total_invoices,
    invoice_metrics.prev_invoiced,
    payment_metrics.prev_paid,
    invoice_metrics.prev_total_invoices
FROM invoice_metrics, payment_metrics;$function$
;

CREATE OR REPLACE FUNCTION public.get_global_charts_metrics(p_start timestamp without time zone, p_end timestamp without time zone, p_granularity text)
 RETURNS json
 LANGUAGE sql
AS $function$WITH

  /* =========================================================
     BARRAS — POR CLIENTE
     ========================================================= */

  invoice_by_client AS (
    SELECT
      p.client_id,
      c.name AS client_name,
      SUM(i.amount_usd) AS invoiced

    FROM public.invoices i

    INNER JOIN public.projects p
      ON p.id = i.project_id

    INNER JOIN public.clients c
      ON c.id = p.client_id

    WHERE i.created_at >= p_start
      AND i.created_at < p_end

    GROUP BY
      p.client_id,
      c.name
  ),

  payment_by_client AS (
    SELECT
      p.client_id,
      c.name AS client_name,
      SUM(pay.amount_usd) AS paid

    FROM public.payments pay

    INNER JOIN public.projects p
      ON p.id = pay.project_id

    INNER JOIN public.clients c
      ON c.id = p.client_id

    WHERE pay.created_at >= p_start
      AND pay.created_at < p_end
      AND pay.status = 'approved'

    GROUP BY
      p.client_id,
      c.name
  ),

  client_metrics AS (
    SELECT
      COALESCE(i.client_id, p.client_id) AS client_id,
      COALESCE(i.client_name, p.client_name) AS client_name,
      COALESCE(i.invoiced, 0) AS invoiced,
      COALESCE(p.paid, 0) AS paid

    FROM invoice_by_client i

    FULL OUTER JOIN payment_by_client p
      ON p.client_id = i.client_id
  ),

  /* =========================================================
     LINEA — POR BUCKET
     ========================================================= */

  buckets AS (
    SELECT generate_series(
      date_trunc(p_granularity, p_start),
      date_trunc(
        p_granularity,
        p_end - interval '1 second'
      ),
      CASE
        WHEN p_granularity = 'week'
          THEN interval '1 week'
        ELSE interval '1 month'
      END
    ) AS bucket
  ),

  invoice_timeline AS (
    SELECT
      date_trunc(p_granularity, created_at) AS bucket,
      SUM(amount_usd) AS invoiced

    FROM public.invoices

    WHERE created_at >= p_start
      AND created_at < p_end

    GROUP BY 1
  ),

  payment_timeline AS (
    SELECT
      date_trunc(p_granularity, created_at) AS bucket,
      SUM(amount_usd) AS paid

    FROM public.payments

    WHERE created_at >= p_start
      AND created_at < p_end
      AND status = 'approved'

    GROUP BY 1
  ),

  timeline_metrics AS (
    SELECT
        bucket,
        invoiced,
        paid,

        SUM(invoiced) OVER (
            ORDER BY bucket
            ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW
        ) AS invoiced_cumulative,

        SUM(paid) OVER (
            ORDER BY bucket
            ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW
        ) AS paid_cumulative

    FROM (
        SELECT
            b.bucket,

            COALESCE(i.invoiced, 0) AS invoiced,
            COALESCE(p.paid, 0) AS paid

        FROM buckets b

        LEFT JOIN invoice_timeline i
            ON i.bucket = b.bucket

        LEFT JOIN payment_timeline p
            ON p.bucket = b.bucket
    ) events
)

  /* =========================================================
     RESULTADO
     ========================================================= */

  SELECT json_build_object(
    'by_client',
    (
        SELECT COALESCE(
            json_agg(
                json_build_object(
                    'client_id', client_id,
                    'client_name', client_name,
                    'invoiced', invoiced,
                    'paid', paid
                )
                ORDER BY client_name
            ),
            '[]'::json
        )
        FROM client_metrics
    ),

    'timeline',
    (
        SELECT COALESCE(
            json_agg(
                json_build_object(
                    'bucket', bucket,
                    'invoiced', invoiced,
                    'paid', paid,
                    'invoiced_cumulative', invoiced_cumulative,
                    'paid_cumulative', paid_cumulative
                )
                ORDER BY bucket
            ),
            '[]'::json
        )
        FROM timeline_metrics
    )
);$function$
;

CREATE OR REPLACE FUNCTION public.get_project_charts_metrics(p_project_id uuid, p_start timestamp with time zone, p_end timestamp with time zone, p_granularity text)
 RETURNS TABLE(bucket text, invoiced numeric, invoiced_cumulative numeric, paid numeric, paid_cumulative numeric)
 LANGUAGE sql
 STABLE
AS $function$
  WITH buckets AS (
    SELECT generate_series(
      date_trunc(p_granularity, p_start),
      date_trunc(
        p_granularity,
        p_end - interval '1 second'
      ),
      CASE
        WHEN p_granularity = 'week'
          THEN interval '1 week'
        WHEN p_granularity = 'month'
          THEN interval '1 month'
        ELSE interval '1 month'
      END
    ) AS bucket
  ),

  invoice_agg AS (
    SELECT
      date_trunc(p_granularity, created_at) AS bucket,
      SUM(amount) AS invoiced
    FROM public.invoices
    WHERE project_id = p_project_id
      AND created_at >= p_start
      AND created_at < p_end
    GROUP BY 1
  ),

  payment_agg AS (
    SELECT
      date_trunc(p_granularity, created_at) AS bucket,
      SUM(amount) AS paid
    FROM public.payments
    WHERE project_id = p_project_id
      AND status = 'approved'
      AND created_at >= p_start
      AND created_at < p_end
    GROUP BY 1
  ),

  events AS (
    SELECT
      b.bucket,
      COALESCE(i.invoiced, 0) AS invoiced,
      COALESCE(p.paid, 0) AS paid
    FROM buckets b

    LEFT JOIN invoice_agg i
      ON i.bucket = b.bucket

    LEFT JOIN payment_agg p
      ON p.bucket = b.bucket
  )

  SELECT
    bucket::text,

    invoiced,

    SUM(invoiced) OVER (
      ORDER BY bucket
      ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW
    ) AS invoiced_cumulative,

    paid,

    SUM(paid) OVER (
      ORDER BY bucket
      ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW
    ) AS paid_cumulative

  FROM events

  ORDER BY bucket;
$function$
;


