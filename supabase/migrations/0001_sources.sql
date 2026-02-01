-- Knowledge Base Sources Table
create table knowledge_base_sources (
  id uuid default uuid_generate_v4() primary key,
  chatbot_id uuid references chatbots on delete cascade not null,
  type text not null check (type in ('file', 'url')),
  content_uri text, -- Gemini URI
  source_url text, -- Original filename or URL
  status text default 'pending', -- pending, indexed, failed
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS
alter table knowledge_base_sources enable row level security;

create policy "Users can view own chatbot sources"
  on knowledge_base_sources for select
  using (
    chatbot_id in (
      select id from chatbots where org_id in (
        select org_id from profiles where id = auth.uid()
      )
    )
  );

create policy "Users can insert own chatbot sources"
  on knowledge_base_sources for insert
  with check (
    chatbot_id in (
      select id from chatbots where org_id in (
        select org_id from profiles where id = auth.uid()
      )
    )
  );

create policy "Users can delete own chatbot sources"
  on knowledge_base_sources for delete
  using (
    chatbot_id in (
      select id from chatbots where org_id in (
        select org_id from profiles where id = auth.uid()
      )
    )
  );
