-- Migration: convert_server_id_to_text
-- Description: Changes the server_id and related foreign keys from bigint to text to better handle Discord IDs
-- Created at: 2024-09-10 15:30:00 UTC

-- ========================================================================================
-- Metadata:
-- Purpose: Convert server_id columns from bigint to text to avoid precision issues with 
--          Discord snowflake IDs, which can exceed JavaScript's safe integer limit.
-- Affected tables: servers, analytics, conversations, forwarded_tickets, invoices, 
--                 knowledge_documents, server_admins, server_shards, subscriptions
-- Author: Database Admin
-- ========================================================================================

-- Add transaction to ensure all operations succeed or fail together
begin;

-- ========================================================================================
-- Step 1: Drop foreign key constraints that reference the servers.id column
-- This needs to be done before changing the column type
-- ========================================================================================

-- Disable the trigger that notifies server config changes during migration
alter table public.servers disable trigger notify_server_config_changed;

-- Drop foreign keys from all tables that reference servers.id
comment on table public.analytics is 'Temporarily dropping FK constraints for server_id migration to text type';
alter table public.analytics drop constraint if exists analytics_server_id_fkey;

comment on table public.conversations is 'Temporarily dropping FK constraints for server_id migration to text type';
alter table public.conversations drop constraint if exists conversations_server_id_fkey;

comment on table public.forwarded_tickets is 'Temporarily dropping FK constraints for server_id migration to text type';
alter table public.forwarded_tickets drop constraint if exists forwarded_tickets_server_id_fkey;

comment on table public.invoices is 'Temporarily dropping FK constraints for server_id migration to text type';
alter table public.invoices drop constraint if exists invoices_server_id_fkey;

comment on table public.knowledge_documents is 'Temporarily dropping FK constraints for server_id migration to text type';
alter table public.knowledge_documents drop constraint if exists knowledge_documents_server_id_fkey;

comment on table public.server_admins is 'Temporarily dropping FK constraints for server_id migration to text type';
alter table public.server_admins drop constraint if exists server_admins_server_id_fkey;

comment on table public.server_shards is 'Temporarily dropping FK constraints for server_id migration to text type';
alter table public.server_shards drop constraint if exists server_shards_server_id_fkey;

comment on table public.subscriptions is 'Temporarily dropping FK constraints for server_id migration to text type';
alter table public.subscriptions drop constraint if exists subscriptions_server_id_fkey;

-- ========================================================================================
-- Step 2: Alter the column types from bigint to text
-- ========================================================================================

-- First, convert the primary key column in servers table
comment on table public.servers is 'Converting primary key id from bigint to text to support Discord snowflake IDs';
alter table public.servers alter column id type text using id::text;

-- Next, convert all foreign key columns in related tables
comment on table public.analytics is 'Converting server_id from bigint to text';
alter table public.analytics alter column server_id type text using server_id::text;

comment on table public.conversations is 'Converting server_id from bigint to text';
alter table public.conversations alter column server_id type text using server_id::text;

comment on table public.forwarded_tickets is 'Converting server_id from bigint to text';
alter table public.forwarded_tickets alter column server_id type text using server_id::text;

comment on table public.invoices is 'Converting server_id from bigint to text';
alter table public.invoices alter column server_id type text using server_id::text;

comment on table public.knowledge_documents is 'Converting server_id from bigint to text';
alter table public.knowledge_documents alter column server_id type text using server_id::text;

comment on table public.server_admins is 'Converting server_id from bigint to text';
alter table public.server_admins alter column server_id type text using server_id::text;

comment on table public.server_shards is 'Converting server_id from bigint to text';
alter table public.server_shards alter column server_id type text using server_id::text;

comment on table public.subscriptions is 'Converting server_id from bigint to text';
alter table public.subscriptions alter column server_id type text using server_id::text;

-- ========================================================================================
-- Step 3: Recreate the foreign key constraints with the new text type
-- ========================================================================================

comment on table public.analytics is 'Recreating foreign key constraint with text type';
alter table public.analytics 
  add constraint analytics_server_id_fkey 
  foreign key (server_id) 
  references public.servers(id) on delete cascade;

comment on table public.conversations is 'Recreating foreign key constraint with text type';
alter table public.conversations 
  add constraint conversations_server_id_fkey 
  foreign key (server_id) 
  references public.servers(id) on delete cascade;

comment on table public.forwarded_tickets is 'Recreating foreign key constraint with text type';
alter table public.forwarded_tickets 
  add constraint forwarded_tickets_server_id_fkey 
  foreign key (server_id) 
  references public.servers(id) on delete cascade;

comment on table public.invoices is 'Recreating foreign key constraint with text type';
alter table public.invoices 
  add constraint invoices_server_id_fkey 
  foreign key (server_id) 
  references public.servers(id) on delete cascade;

comment on table public.knowledge_documents is 'Recreating foreign key constraint with text type';
alter table public.knowledge_documents 
  add constraint knowledge_documents_server_id_fkey 
  foreign key (server_id) 
  references public.servers(id) on delete cascade;

comment on table public.server_admins is 'Recreating foreign key constraint with text type';
alter table public.server_admins 
  add constraint server_admins_server_id_fkey 
  foreign key (server_id) 
  references public.servers(id) on delete cascade;

comment on table public.server_shards is 'Recreating foreign key constraint with text type';
alter table public.server_shards 
  add constraint server_shards_server_id_fkey 
  foreign key (server_id) 
  references public.servers(id) on delete cascade;

comment on table public.subscriptions is 'Recreating foreign key constraint with text type';
alter table public.subscriptions 
  add constraint subscriptions_server_id_fkey 
  foreign key (server_id) 
  references public.servers(id) on delete cascade;

-- Re-enable the trigger that notifies server config changes
alter table public.servers enable trigger notify_server_config_changed;

-- Add explanation about the change
comment on table public.servers is 'Stores Discord server information and configuration. Server ID is stored as text to handle Discord snowflake IDs which exceed JavaScript safe integer limits.';

-- Update the comments on foreign key columns to indicate they are now text type
comment on column public.analytics.server_id is 'Discord server ID (text) - references servers.id';
comment on column public.conversations.server_id is 'Discord server ID (text) - references servers.id';
comment on column public.forwarded_tickets.server_id is 'Discord server ID (text) - references servers.id';
comment on column public.invoices.server_id is 'Discord server ID (text) - references servers.id';
comment on column public.knowledge_documents.server_id is 'Discord server ID (text) - references servers.id';
comment on column public.server_admins.server_id is 'Discord server ID (text) - references servers.id';
comment on column public.server_shards.server_id is 'Discord server ID (text) - references servers.id';
comment on column public.subscriptions.server_id is 'Discord server ID (text) - references servers.id';

-- Commit the transaction
commit;
