alter table "public"."profiles" add column "settings" jsonb not null default '{}'::jsonb;

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.update_profile_setting(p_profile_id uuid, p_path text[], p_value jsonb)
 RETURNS void
 LANGUAGE plpgsql
AS $function$
declare
    v_settings jsonb;
    i int;
begin
    select coalesce(settings, '{}'::jsonb) into v_settings
    from profiles
    where id = p_profile_id;

    -- Aseguramos cada nivel intermedio del path (todos menos el último,
    -- que es la hoja que realmente queremos escribir)
    for i in 1 .. array_length(p_path, 1) - 1 loop
        if v_settings #> p_path[1:i] is null then
            v_settings := jsonb_set(v_settings, p_path[1:i], '{}'::jsonb, true);
        end if;
    end loop;

    -- Ahora sí, escribimos la hoja final
    v_settings := jsonb_set(v_settings, p_path, p_value, true);

    update profiles
    set settings = v_settings
    where id = p_profile_id;
end;
$function$
;


