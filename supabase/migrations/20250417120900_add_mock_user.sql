-- Migration: add_mock_user
-- Description: Creates a mock user for testing and adds necessary RLS policies
-- Created at: 2025-04-17 12:09:00 UTC

-- ========================================================================================
-- Metadata:
-- Purpose: Create a mock user for development and testing purposes
--          This allows our bot to authenticate as a test user
--          Also implements RLS policies that accept a special header for authentication
-- ========================================================================================

-- Start transaction
BEGIN;

-- Create a mock user in the auth.users table if it doesn't exist yet
INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data)
VALUES 
  ('00000000-0000-0000-0000-000000000000', 'test@example.com', 
   '$2a$10$aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa', -- Dummy hashed password, not actually used 
   CURRENT_TIMESTAMP, 
   '{"provider": "email", "providers": ["email"]}',
   '{"name": "Test User"}')
ON CONFLICT (id) DO NOTHING;

-- Create a corresponding entry in public.users
INSERT INTO public.users (id, discord_id, discord_username, avatar_url)
VALUES 
  ('00000000-0000-0000-0000-000000000000', 'test-user-id', 'Test User#0000', NULL)
ON CONFLICT (id) DO NOTHING;

-- ========================================================================================
-- Enable RLS and add policies for the mock user
-- ========================================================================================

-- Policy for inserting servers - using mock user ID from header
CREATE POLICY "mock_test_user_insert_servers"
ON public.servers
FOR INSERT
TO authenticated
WITH CHECK (
  current_setting('request.headers')::json->>'x-mock-user-id' = 'test-user-id'
);

-- Policy for selecting servers - using mock user ID from header
CREATE POLICY "mock_test_user_select_servers"
ON public.servers
FOR SELECT
TO authenticated
USING (
  current_setting('request.headers')::json->>'x-mock-user-id' = 'test-user-id'
);

-- Policy for updating servers - using mock user ID from header
CREATE POLICY "mock_test_user_update_servers"
ON public.servers
FOR UPDATE
TO authenticated
USING (
  current_setting('request.headers')::json->>'x-mock-user-id' = 'test-user-id'
);

-- Policy for deleting servers - using mock user ID from header
CREATE POLICY "mock_test_user_delete_servers"
ON public.servers
FOR DELETE
TO authenticated
USING (
  current_setting('request.headers')::json->>'x-mock-user-id' = 'test-user-id'
);

-- ========================================================================================
-- Add a special service role policy that allows the API to insert/update
-- servers when authenticated as service_role
-- ========================================================================================

-- Policy for service role to manage servers
CREATE POLICY "service_role_manage_servers"
ON public.servers
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- Also add the mock user as an admin for all servers
CREATE OR REPLACE FUNCTION add_mock_user_as_admin()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.server_admins (server_id, user_id)
  VALUES (NEW.id, '00000000-0000-0000-0000-000000000000')
  ON CONFLICT DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically add mock user as admin when a new server is created
CREATE TRIGGER add_mock_user_admin_trigger
AFTER INSERT ON public.servers
FOR EACH ROW
EXECUTE FUNCTION add_mock_user_as_admin();

-- Commit all changes
COMMIT; 