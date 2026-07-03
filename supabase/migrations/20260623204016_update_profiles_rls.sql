drop extension if exists "pg_net";


  create policy "Users can update their own profile"
  on "public"."profiles"
  as permissi
  for update
  to authenticated
using ((auth.uid() = id))
with check ((auth.uid() = id));