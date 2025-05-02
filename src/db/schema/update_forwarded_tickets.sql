-- Add user_id column to forwarded_tickets table if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'forwarded_tickets' 
        AND column_name = 'user_id'
    ) THEN
        ALTER TABLE public.forwarded_tickets ADD COLUMN user_id text NULL;
        
        -- Add an optional comment explaining the column
        COMMENT ON COLUMN public.forwarded_tickets.user_id IS 'Discord user ID of the user who initiated the conversation';
    ELSE
        RAISE NOTICE 'Column user_id already exists in forwarded_tickets table';
    END IF;
END
$$; 