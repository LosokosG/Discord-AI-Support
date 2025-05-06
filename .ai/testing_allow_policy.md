# Testing Policy for Supabase Development

This document outlines how to set up permissive Row-Level Security (RLS) policies for local development and testing. These policies allow all operations on specified tables while in testing/development mode.

## Important Security Warning

⚠️ **NEVER USE THESE POLICIES IN PRODUCTION** ⚠️

These policies are intentionally permissive to facilitate development. For production, implement proper user-specific policies based on authentication.

## Mock User Setup

The mock user is already configured in the middleware with ID `test-user-id`. The middleware handles injecting this user into the request context.

## Database Policies for Testing

Copy this SQL block and execute it in the Supabase SQL Editor to apply permissive policies for testing:

```sql
-- Enable RLS on tables (if not already enabled)
ALTER TABLE public.servers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.server_admins ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.knowledge_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.forwarded_tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;

-- Clear any existing policies for these tables
DROP POLICY IF EXISTS "allow_all_for_testing_servers" ON public.servers;
DROP POLICY IF EXISTS "allow_all_for_testing_server_admins" ON public.server_admins;
DROP POLICY IF EXISTS "allow_all_for_testing_knowledge_documents" ON public.knowledge_documents;
DROP POLICY IF EXISTS "allow_all_for_testing_conversations" ON public.conversations;
DROP POLICY IF EXISTS "allow_all_for_testing_forwarded_tickets" ON public.forwarded_tickets;
DROP POLICY IF EXISTS "allow_all_for_testing_subscriptions" ON public.subscriptions;
DROP POLICY IF EXISTS "allow_all_for_testing_invoices" ON public.invoices;

-- Create permissive policies for each table

-- Servers table
CREATE POLICY "allow_all_for_testing_servers"
ON public.servers
FOR ALL
USING (true)
WITH CHECK (true);

-- Server admins table
CREATE POLICY "allow_all_for_testing_server_admins"
ON public.server_admins
FOR ALL
USING (true)
WITH CHECK (true);

-- Knowledge documents table
CREATE POLICY "allow_all_for_testing_knowledge_documents"
ON public.knowledge_documents
FOR ALL
USING (true)
WITH CHECK (true);

-- Conversations table
CREATE POLICY "allow_all_for_testing_conversations"
ON public.conversations
FOR ALL
USING (true)
WITH CHECK (true);

-- Forwarded tickets table
CREATE POLICY "allow_all_for_testing_forwarded_tickets"
ON public.forwarded_tickets
FOR ALL
USING (true)
WITH CHECK (true);

-- Subscriptions table
CREATE POLICY "allow_all_for_testing_subscriptions"
ON public.subscriptions
FOR ALL
USING (true)
WITH CHECK (true);

-- Invoices table
CREATE POLICY "allow_all_for_testing_invoices"
ON public.invoices
FOR ALL
USING (true)
WITH CHECK (true);
```

## Reverting for Production

When moving to production, execute this SQL to remove all testing policies:

```sql
DROP POLICY IF EXISTS "allow_all_for_testing_servers" ON public.servers;
DROP POLICY IF EXISTS "allow_all_for_testing_server_admins" ON public.server_admins;
DROP POLICY IF EXISTS "allow_all_for_testing_knowledge_documents" ON public.knowledge_documents;
DROP POLICY IF EXISTS "allow_all_for_testing_conversations" ON public.conversations;
DROP POLICY IF EXISTS "allow_all_for_testing_forwarded_tickets" ON public.forwarded_tickets;
DROP POLICY IF EXISTS "allow_all_for_testing_subscriptions" ON public.subscriptions;
DROP POLICY IF EXISTS "allow_all_for_testing_invoices" ON public.invoices;
```

Then implement proper user-specific policies based on your authentication system.
