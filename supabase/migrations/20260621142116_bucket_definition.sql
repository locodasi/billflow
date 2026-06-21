insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('documents', 'documents', false, null, null)
on conflict (id) do nothing;

CREATE POLICY "Admins or owners can see and insert objects flreew_0" ON storage.objects AS PERMISSIVE FOR SELECT TO authenticated USING ((bucket_id = 'documents'::text));
CREATE POLICY "Admins or owners can see and insert objects flreew_1" ON storage.objects AS PERMISSIVE FOR INSERT TO authenticated WITH CHECK ((bucket_id = 'documents'::text));