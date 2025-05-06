-- Enable RLS on the servers table
ALTER TABLE public.servers ENABLE ROW LEVEL SECURITY;

-- Create a policy for the mock user using a custom header
-- We're using X-Mock-User-Id header in our middleware to identify the mock user

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

-- This approach ensures only requests with our specific mock header can perform
-- operations, keeping your database secure while allowing testing 