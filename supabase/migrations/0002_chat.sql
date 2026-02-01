-- Conversations Table
create table conversations (
  id uuid default uuid_generate_v4() primary key,
  chatbot_id uuid references chatbots on delete cascade not null,
  visitor_id text, -- optional tracking
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Messages Table
create table messages (
  id uuid default uuid_generate_v4() primary key,
  conversation_id uuid references conversations on delete cascade not null,
  role text not null check (role in ('user', 'assistant', 'system')),
  content text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS
alter table conversations enable row level security;
alter table messages enable row level security;

-- OWNER POLICIES (Dashboard access)
create policy "Owners can view own chatbot conversations"
  on conversations for select
  using (
    chatbot_id in (
      select id from chatbots where org_id in (
        select org_id from profiles where id = auth.uid()
      )
    )
  );

create policy "Owners can view own conversation messages"
  on messages for select
  using (
    conversation_id in (
      select id from conversations where chatbot_id in (
        select id from chatbots where org_id in (
          select org_id from profiles where id = auth.uid()
        )
      )
    )
  );
