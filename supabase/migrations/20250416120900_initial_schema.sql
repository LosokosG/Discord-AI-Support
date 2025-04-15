-- Migration: initial_schema
-- Description: Creates the initial database schema for the Discord AI Support Bot
-- Created at: 2025-04-16 12:09:00 UTC

-- Functions
-- Function for automatically updating the updated_at timestamp
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Function to notify the bot about server config changes
create or replace function public.notify_server_config_changed()
returns trigger as $$
begin
  perform pg_notify('server_config_changed', json_build_object(
    'server_id', new.id,
    'config', new.config
  )::text);
  return new;
end;
$$ language plpgsql;

-- Tables

-- Users table - connects Discord users to auth system
create table public.users (
    id uuid primary key references auth.users(id),
    discord_id text not null unique,
    discord_username text not null,
    avatar_url text,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

-- Enable RLS on users table
alter table public.users enable row level security;

-- RLS policies for users table
create policy users_select_own_policy on public.users
  for select
  using (id = auth.uid());

create policy users_update_own_policy on public.users
  for update
  using (id = auth.uid());

-- Track changes to updated_at
create trigger set_users_updated_at
before update on public.users
for each row
execute function public.set_updated_at();

-- Billing plans table
create table public.billing_plans (
    id uuid primary key default gen_random_uuid(),
    name text not null unique,
    description text,
    price decimal(10, 2) not null,
    currency text not null default 'USD',
    interval text not null check (interval in ('monthly', 'yearly')),
    features jsonb not null default '{}',
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

-- Enable RLS on billing_plans table
alter table public.billing_plans enable row level security;

-- RLS policies for billing_plans table
create policy billing_plans_select_public on public.billing_plans
  for select
  using (true);

-- Track changes to updated_at
create trigger set_billing_plans_updated_at
before update on public.billing_plans
for each row
execute function public.set_updated_at();

-- Servers table - stores Discord server information and configuration
create table public.servers (
    id bigint primary key, -- Discord server ID
    name text not null,
    icon_url text,
    config jsonb not null default '{
        "enabled": false,
        "language": "en",
        "system_prompt": "You are a helpful AI assistant for this Discord server.",
        "channels": [],
        "support_role_id": null,
        "max_messages_per_user": 10,
        "max_text_length": 2000
    }',
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now(),
    active boolean not null default true,
    plan_id uuid references public.billing_plans(id)
);

-- Enable RLS on servers table
alter table public.servers enable row level security;

-- Track changes to updated_at
create trigger set_servers_updated_at
before update on public.servers
for each row
execute function public.set_updated_at();

-- Notify bot of config changes
create trigger notify_server_config_changed
after update of config on public.servers
for each row
when (old.config is distinct from new.config)
execute function public.notify_server_config_changed();

-- Server admins table - links users to servers they can manage
create table public.server_admins (
    server_id bigint references public.servers(id) on delete cascade,
    user_id uuid references public.users(id) on delete cascade,
    created_at timestamptz not null default now(),
    primary key (server_id, user_id)
);

-- Enable RLS on server_admins table
alter table public.server_admins enable row level security;

-- RLS policies for server_admins table
create policy server_admins_select_own on public.server_admins
  for select
  using (user_id = auth.uid());

-- RLS policies for servers table
-- Allow users to see only servers they are admins for
create policy server_select_policy on public.servers
    for select
    using (id in (select server_id from public.server_admins where user_id = auth.uid()));

-- Allow admins to update only servers they are admins for
create policy server_update_policy on public.servers
    for update
    using (id in (select server_id from public.server_admins where user_id = auth.uid()));

-- Knowledge documents table - stores knowledge base documents for servers
create table public.knowledge_documents (
    id uuid primary key default gen_random_uuid(),
    server_id bigint not null references public.servers(id) on delete cascade,
    title text not null,
    content text not null,
    content_vector tsvector generated always as (to_tsvector('english', content)) stored,
    file_type text not null check (file_type in ('txt', 'md', 'pdf')),
    storage_path text,
    created_by uuid references public.users(id),
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

-- Enable RLS on knowledge_documents table
alter table public.knowledge_documents enable row level security;

-- Track changes to updated_at
create trigger set_knowledge_documents_updated_at
before update on public.knowledge_documents
for each row
execute function public.set_updated_at();

-- Create index for full-text search
create index knowledge_documents_content_vector_idx on public.knowledge_documents using gin (content_vector);
create index knowledge_documents_server_id_idx on public.knowledge_documents (server_id);

-- RLS policies for knowledge_documents table
-- Allow users to see only knowledge documents for servers they are admins for
create policy knowledge_document_select_policy on public.knowledge_documents
    for select
    using (server_id in (select server_id from public.server_admins where user_id = auth.uid()));

-- Allow admins to insert knowledge documents only for servers they are admins for
create policy knowledge_document_insert_policy on public.knowledge_documents
    for insert
    with check (server_id in (select server_id from public.server_admins where user_id = auth.uid()));

-- Allow admins to update knowledge documents only for servers they are admins for
create policy knowledge_document_update_policy on public.knowledge_documents
    for update
    using (server_id in (select server_id from public.server_admins where user_id = auth.uid()));

-- Allow admins to delete knowledge documents only for servers they are admins for
create policy knowledge_document_delete_policy on public.knowledge_documents
    for delete
    using (server_id in (select server_id from public.server_admins where user_id = auth.uid()));

-- Conversations table - stores chat history with the bot
create table public.conversations (
    id uuid not null default gen_random_uuid(),
    server_id bigint not null references public.servers(id) on delete cascade,
    channel_id text not null,
    thread_id text,
    user_id text not null, -- Discord user ID
    username text not null,
    transcript jsonb not null, -- Stores complete conversation history
    status text not null check (status in ('active', 'completed', 'forwarded')) default 'active',
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now(),
    completed_at timestamptz,
    primary key (id, server_id)
) partition by list (server_id);

-- Enable RLS on conversations table
alter table public.conversations enable row level security;

-- Track changes to updated_at
create trigger set_conversations_updated_at
before update on public.conversations
for each row
execute function public.set_updated_at();

-- Create indexes
create index conversations_server_id_idx on public.conversations (server_id);
create index conversations_status_idx on public.conversations (status);
create index conversations_created_at_idx on public.conversations (created_at);

-- RLS policies for conversations table
-- Allow users to see only conversations for servers they are admins for
create policy conversation_select_policy on public.conversations
    for select
    using (server_id in (select server_id from public.server_admins where user_id = auth.uid()));

-- Forwarded tickets table - tracks support tickets forwarded to human agents
create table public.forwarded_tickets (
    id uuid primary key default gen_random_uuid(),
    conversation_id uuid not null,
    server_id bigint not null references public.servers(id) on delete cascade,
    assigned_to text, -- Discord user ID of support member
    forwarded_at timestamptz not null default now(),
    status text not null check (status in ('pending', 'assigned', 'resolved')) default 'pending',
    resolved_at timestamptz,
    resolution_notes text,
    -- Add foreign key constraint referencing both columns of conversations primary key
    foreign key (conversation_id, server_id) references public.conversations(id, server_id) on delete cascade
);

-- Enable RLS on forwarded_tickets table
alter table public.forwarded_tickets enable row level security;

-- Create indexes
create index forwarded_tickets_conversation_id_idx on public.forwarded_tickets (conversation_id);
create index forwarded_tickets_server_id_idx on public.forwarded_tickets (server_id);
create index forwarded_tickets_status_idx on public.forwarded_tickets (status);

-- RLS policies for forwarded_tickets table
-- Allow users to see only forwarded tickets for servers they are admins for
create policy forwarded_ticket_select_policy on public.forwarded_tickets
    for select
    using (server_id in (select server_id from public.server_admins where user_id = auth.uid()));

-- Allow admins to update forwarded tickets only for servers they are admins for
create policy forwarded_ticket_update_policy on public.forwarded_tickets
    for update
    using (server_id in (select server_id from public.server_admins where user_id = auth.uid()));

-- Shards table - manages bot sharding for scalability
create table public.shards (
    id integer primary key,
    status text not null check (status in ('online', 'offline', 'starting', 'stopping')) default 'offline',
    server_count integer not null default 0,
    last_heartbeat timestamptz,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

-- Enable RLS on shards table
alter table public.shards enable row level security;

-- Track changes to updated_at
create trigger set_shards_updated_at
before update on public.shards
for each row
execute function public.set_updated_at();

-- RLS policies for shards table (admin only)
create policy shards_select_admin on public.shards
  for select
  using (auth.uid() in (select id from public.users));

-- Server shards table - maps servers to shards
create table public.server_shards (
    server_id bigint primary key references public.servers(id) on delete cascade,
    shard_id integer not null references public.shards(id) on delete cascade,
    assigned_at timestamptz not null default now()
);

-- Enable RLS on server_shards table
alter table public.server_shards enable row level security;

-- Create index
create index server_shards_shard_id_idx on public.server_shards (shard_id);

-- RLS policies for server_shards table
create policy server_shards_select_admin on public.server_shards
  for select
  using (server_id in (select server_id from public.server_admins where user_id = auth.uid()));

-- Subscriptions table - tracks server subscriptions to billing plans
create table public.subscriptions (
    id uuid primary key default gen_random_uuid(),
    server_id bigint not null references public.servers(id) on delete cascade,
    plan_id uuid not null references public.billing_plans(id),
    status text not null check (status in ('active', 'canceled', 'past_due', 'trialing')),
    current_period_start timestamptz not null,
    current_period_end timestamptz not null,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now(),
    canceled_at timestamptz,
    unique (server_id)
);

-- Enable RLS on subscriptions table
alter table public.subscriptions enable row level security;

-- Track changes to updated_at
create trigger set_subscriptions_updated_at
before update on public.subscriptions
for each row
execute function public.set_updated_at();

-- Create index
create index subscriptions_status_idx on public.subscriptions (status);

-- RLS policies for subscriptions table
create policy subscriptions_select_admin on public.subscriptions
  for select
  using (server_id in (select server_id from public.server_admins where user_id = auth.uid()));

-- Invoices table - tracks billing invoices for server subscriptions
create table public.invoices (
    id uuid primary key default gen_random_uuid(),
    subscription_id uuid not null references public.subscriptions(id) on delete cascade,
    server_id bigint not null references public.servers(id) on delete cascade,
    amount decimal(10, 2) not null,
    currency text not null default 'USD',
    status text not null check (status in ('draft', 'open', 'paid', 'uncollectible', 'void')),
    invoice_date timestamptz not null,
    due_date timestamptz not null,
    paid_at timestamptz,
    payment_processor_id text,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

-- Enable RLS on invoices table
alter table public.invoices enable row level security;

-- Track changes to updated_at
create trigger set_invoices_updated_at
before update on public.invoices
for each row
execute function public.set_updated_at();

-- Create indexes
create index invoices_subscription_id_idx on public.invoices (subscription_id);
create index invoices_server_id_idx on public.invoices (server_id);
create index invoices_status_idx on public.invoices (status);

-- RLS policies for invoices table
create policy invoices_select_admin on public.invoices
  for select
  using (server_id in (select server_id from public.server_admins where user_id = auth.uid()));

-- Analytics table - stores daily usage statistics for servers
create table public.analytics (
    id uuid primary key default gen_random_uuid(),
    server_id bigint not null references public.servers(id) on delete cascade,
    date date not null,
    total_queries integer not null default 0,
    resolved_queries integer not null default 0,
    forwarded_tickets integer not null default 0,
    average_response_time decimal(10, 2),
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now(),
    unique (server_id, date)
);

-- Enable RLS on analytics table
alter table public.analytics enable row level security;

-- Track changes to updated_at
create trigger set_analytics_updated_at
before update on public.analytics
for each row
execute function public.set_updated_at();

-- Create indexes
create index analytics_server_id_idx on public.analytics (server_id);
create index analytics_date_idx on public.analytics (date);

-- RLS policies for analytics table
create policy analytics_select_admin on public.analytics
  for select
  using (server_id in (select server_id from public.server_admins where user_id = auth.uid()));

-- Example of partition creation for conversations table
-- This is commented out as it would typically be created on-demand when a new server is added
/*
create table public.conversations_server_12345678 partition of public.conversations
    for values in (12345678);
*/

-- Comment explaining partition strategy
comment on table public.conversations is 'The conversations table is partitioned by server_id to improve query performance. New partitions should be created for each server when needed.'; 