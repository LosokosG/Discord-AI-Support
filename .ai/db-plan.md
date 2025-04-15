# Discord AI Support Bot Database Schema

## Tables

### 1. users
```sql
CREATE TABLE public.users (
    id UUID PRIMARY KEY REFERENCES auth.users(id),
    discord_id TEXT NOT NULL UNIQUE,
    discord_username TEXT NOT NULL,
    avatar_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Track changes to updated_at
CREATE TRIGGER set_users_updated_at
BEFORE UPDATE ON public.users
FOR EACH ROW
EXECUTE FUNCTION public.set_updated_at();
```

### 2. servers
```sql
CREATE TABLE public.servers (
    id BIGINT PRIMARY KEY, -- Discord server ID
    name TEXT NOT NULL,
    icon_url TEXT,
    config JSONB NOT NULL DEFAULT '{
        "enabled": false,
        "language": "en",
        "system_prompt": "You are a helpful AI assistant for this Discord server.",
        "channels": [],
        "support_role_id": null,
        "max_messages_per_user": 10,
        "max_text_length": 2000
    }',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    active BOOLEAN NOT NULL DEFAULT true,
    plan_id UUID REFERENCES public.billing_plans(id)
);

-- Track changes to updated_at
CREATE TRIGGER set_servers_updated_at
BEFORE UPDATE ON public.servers
FOR EACH ROW
EXECUTE FUNCTION public.set_updated_at();

-- Notify bot of config changes
CREATE TRIGGER notify_server_config_changed
AFTER UPDATE OF config ON public.servers
FOR EACH ROW
WHEN (OLD.config IS DISTINCT FROM NEW.config)
EXECUTE FUNCTION public.notify_server_config_changed();
```

### 3. server_admins
```sql
CREATE TABLE public.server_admins (
    server_id BIGINT REFERENCES public.servers(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    PRIMARY KEY (server_id, user_id)
);
```

### 4. knowledge_documents
```sql
CREATE TABLE public.knowledge_documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    server_id BIGINT NOT NULL REFERENCES public.servers(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    content_vector tsvector GENERATED ALWAYS AS (to_tsvector('english', content)) STORED,
    file_type TEXT NOT NULL CHECK (file_type IN ('txt', 'md', 'pdf')),
    storage_path TEXT,
    created_by UUID REFERENCES public.users(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Track changes to updated_at
CREATE TRIGGER set_knowledge_documents_updated_at
BEFORE UPDATE ON public.knowledge_documents
FOR EACH ROW
EXECUTE FUNCTION public.set_updated_at();

-- Create index for full-text search
CREATE INDEX knowledge_documents_content_vector_idx ON public.knowledge_documents USING GIN (content_vector);
CREATE INDEX knowledge_documents_server_id_idx ON public.knowledge_documents (server_id);
```

### 5. conversations
```sql
CREATE TABLE public.conversations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    server_id BIGINT NOT NULL REFERENCES public.servers(id) ON DELETE CASCADE,
    channel_id TEXT NOT NULL,
    thread_id TEXT,
    user_id TEXT NOT NULL, -- Discord user ID
    username TEXT NOT NULL,
    transcript JSONB NOT NULL, -- Stores complete conversation history
    status TEXT NOT NULL CHECK (status IN ('active', 'completed', 'forwarded')) DEFAULT 'active',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    completed_at TIMESTAMPTZ
) PARTITION BY LIST (server_id);

-- Track changes to updated_at
CREATE TRIGGER set_conversations_updated_at
BEFORE UPDATE ON public.conversations
FOR EACH ROW
EXECUTE FUNCTION public.set_updated_at();

-- Create indexes
CREATE INDEX conversations_server_id_idx ON public.conversations (server_id);
CREATE INDEX conversations_status_idx ON public.conversations (status);
CREATE INDEX conversations_created_at_idx ON public.conversations (created_at);
```

### 6. forwarded_tickets
```sql
CREATE TABLE public.forwarded_tickets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id UUID NOT NULL REFERENCES public.conversations(id) ON DELETE CASCADE,
    server_id BIGINT NOT NULL REFERENCES public.servers(id) ON DELETE CASCADE,
    assigned_to TEXT, -- Discord user ID of support member
    forwarded_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    status TEXT NOT NULL CHECK (status IN ('pending', 'assigned', 'resolved')) DEFAULT 'pending',
    resolved_at TIMESTAMPTZ,
    resolution_notes TEXT
);

-- Create indexes
CREATE INDEX forwarded_tickets_conversation_id_idx ON public.forwarded_tickets (conversation_id);
CREATE INDEX forwarded_tickets_server_id_idx ON public.forwarded_tickets (server_id);
CREATE INDEX forwarded_tickets_status_idx ON public.forwarded_tickets (status);
```

### 7. shards
```sql
CREATE TABLE public.shards (
    id INTEGER PRIMARY KEY,
    status TEXT NOT NULL CHECK (status IN ('online', 'offline', 'starting', 'stopping')) DEFAULT 'offline',
    server_count INTEGER NOT NULL DEFAULT 0,
    last_heartbeat TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Track changes to updated_at
CREATE TRIGGER set_shards_updated_at
BEFORE UPDATE ON public.shards
FOR EACH ROW
EXECUTE FUNCTION public.set_updated_at();
```

### 8. server_shards
```sql
CREATE TABLE public.server_shards (
    server_id BIGINT PRIMARY KEY REFERENCES public.servers(id) ON DELETE CASCADE,
    shard_id INTEGER NOT NULL REFERENCES public.shards(id) ON DELETE CASCADE,
    assigned_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create index
CREATE INDEX server_shards_shard_id_idx ON public.server_shards (shard_id);
```

### 9. billing_plans
```sql
CREATE TABLE public.billing_plans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    currency TEXT NOT NULL DEFAULT 'USD',
    interval TEXT NOT NULL CHECK (interval IN ('monthly', 'yearly')),
    features JSONB NOT NULL DEFAULT '{}',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Track changes to updated_at
CREATE TRIGGER set_billing_plans_updated_at
BEFORE UPDATE ON public.billing_plans
FOR EACH ROW
EXECUTE FUNCTION public.set_updated_at();
```

### 10. subscriptions
```sql
CREATE TABLE public.subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    server_id BIGINT NOT NULL REFERENCES public.servers(id) ON DELETE CASCADE,
    plan_id UUID NOT NULL REFERENCES public.billing_plans(id),
    status TEXT NOT NULL CHECK (status IN ('active', 'canceled', 'past_due', 'trialing')),
    current_period_start TIMESTAMPTZ NOT NULL,
    current_period_end TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    canceled_at TIMESTAMPTZ,
    UNIQUE (server_id)
);

-- Track changes to updated_at
CREATE TRIGGER set_subscriptions_updated_at
BEFORE UPDATE ON public.subscriptions
FOR EACH ROW
EXECUTE FUNCTION public.set_updated_at();

-- Create index
CREATE INDEX subscriptions_status_idx ON public.subscriptions (status);
```

### 11. invoices
```sql
CREATE TABLE public.invoices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    subscription_id UUID NOT NULL REFERENCES public.subscriptions(id) ON DELETE CASCADE,
    server_id BIGINT NOT NULL REFERENCES public.servers(id) ON DELETE CASCADE,
    amount DECIMAL(10, 2) NOT NULL,
    currency TEXT NOT NULL DEFAULT 'USD',
    status TEXT NOT NULL CHECK (status IN ('draft', 'open', 'paid', 'uncollectible', 'void')),
    invoice_date TIMESTAMPTZ NOT NULL,
    due_date TIMESTAMPTZ NOT NULL,
    paid_at TIMESTAMPTZ,
    payment_processor_id TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Track changes to updated_at
CREATE TRIGGER set_invoices_updated_at
BEFORE UPDATE ON public.invoices
FOR EACH ROW
EXECUTE FUNCTION public.set_updated_at();

-- Create indexes
CREATE INDEX invoices_subscription_id_idx ON public.invoices (subscription_id);
CREATE INDEX invoices_server_id_idx ON public.invoices (server_id);
CREATE INDEX invoices_status_idx ON public.invoices (status);
```

### 12. analytics
```sql
CREATE TABLE public.analytics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    server_id BIGINT NOT NULL REFERENCES public.servers(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    total_queries INTEGER NOT NULL DEFAULT 0,
    resolved_queries INTEGER NOT NULL DEFAULT 0,
    forwarded_tickets INTEGER NOT NULL DEFAULT 0,
    average_response_time DECIMAL(10, 2),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE (server_id, date)
);

-- Track changes to updated_at
CREATE TRIGGER set_analytics_updated_at
BEFORE UPDATE ON public.analytics
FOR EACH ROW
EXECUTE FUNCTION public.set_updated_at();

-- Create indexes
CREATE INDEX analytics_server_id_idx ON public.analytics (server_id);
CREATE INDEX analytics_date_idx ON public.analytics (date);
```

## Functions and Triggers

### 1. set_updated_at Function
```sql
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;
```

### 2. notify_server_config_changed Function
```sql
CREATE OR REPLACE FUNCTION public.notify_server_config_changed()
RETURNS TRIGGER AS $$
BEGIN
    PERFORM pg_notify('server_config_changed', json_build_object(
        'server_id', NEW.id,
        'config', NEW.config
    )::text);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;
```

## Row Level Security (RLS) Policies

### 1. servers Table RLS
```sql
-- Enable RLS on servers table
ALTER TABLE public.servers ENABLE ROW LEVEL SECURITY;

-- Allow users to see only servers they are admins for
CREATE POLICY server_select_policy ON public.servers
    FOR SELECT
    USING (id IN (SELECT server_id FROM public.server_admins WHERE user_id = auth.uid()));

-- Allow admins to update only servers they are admins for
CREATE POLICY server_update_policy ON public.servers
    FOR UPDATE
    USING (id IN (SELECT server_id FROM public.server_admins WHERE user_id = auth.uid()));
```

### 2. knowledge_documents Table RLS
```sql
-- Enable RLS on knowledge_documents table
ALTER TABLE public.knowledge_documents ENABLE ROW LEVEL SECURITY;

-- Allow users to see only knowledge documents for servers they are admins for
CREATE POLICY knowledge_document_select_policy ON public.knowledge_documents
    FOR SELECT
    USING (server_id IN (SELECT server_id FROM public.server_admins WHERE user_id = auth.uid()));

-- Allow admins to insert knowledge documents only for servers they are admins for
CREATE POLICY knowledge_document_insert_policy ON public.knowledge_documents
    FOR INSERT
    WITH CHECK (server_id IN (SELECT server_id FROM public.server_admins WHERE user_id = auth.uid()));

-- Allow admins to update knowledge documents only for servers they are admins for
CREATE POLICY knowledge_document_update_policy ON public.knowledge_documents
    FOR UPDATE
    USING (server_id IN (SELECT server_id FROM public.server_admins WHERE user_id = auth.uid()));

-- Allow admins to delete knowledge documents only for servers they are admins for
CREATE POLICY knowledge_document_delete_policy ON public.knowledge_documents
    FOR DELETE
    USING (server_id IN (SELECT server_id FROM public.server_admins WHERE user_id = auth.uid()));
```

### 3. conversations Table RLS
```sql
-- Enable RLS on conversations table
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;

-- Allow users to see only conversations for servers they are admins for
CREATE POLICY conversation_select_policy ON public.conversations
    FOR SELECT
    USING (server_id IN (SELECT server_id FROM public.server_admins WHERE user_id = auth.uid()));
```

### 4. forwarded_tickets Table RLS
```sql
-- Enable RLS on forwarded_tickets table
ALTER TABLE public.forwarded_tickets ENABLE ROW LEVEL SECURITY;

-- Allow users to see only forwarded tickets for servers they are admins for
CREATE POLICY forwarded_ticket_select_policy ON public.forwarded_tickets
    FOR SELECT
    USING (server_id IN (SELECT server_id FROM public.server_admins WHERE user_id = auth.uid()));

-- Allow admins to update forwarded tickets only for servers they are admins for
CREATE POLICY forwarded_ticket_update_policy ON public.forwarded_tickets
    FOR UPDATE
    USING (server_id IN (SELECT server_id FROM public.server_admins WHERE user_id = auth.uid()));
```

## Partitioning Strategy for Conversations Table

The conversations table is partitioned by server_id to improve query performance and manage large datasets efficiently. For each server, a separate partition can be created when needed:

```sql
-- Example of creating a partition for a specific server
CREATE TABLE public.conversations_server_12345678 PARTITION OF public.conversations
    FOR VALUES IN (12345678);
```


## Additional Notes

1. **Supabase Integration**:
   - The schema is designed to work seamlessly with Supabase's authentication system and RLS features.
   - The users table references auth.users for Discord OAuth integration.

2. **Scalability Considerations**:
   - The sharding system allows dynamic allocation of servers to shards.
   - Conversations are partitioned by server_id to improve query performance for large datasets.

3. **Knowledge Base Optimization**:
   - Full-text search is implemented using PostgreSQL's built-in tsvector type.
   - Knowledge documents store their content directly in the database with content_vector for efficient searching.

4. **Analytics**:
   - The analytics table stores aggregated daily statistics rather than raw event data.
   - This approach balances analytical needs with database efficiency.

5. **Billing System**:
   - The schema includes comprehensive billing tables to support subscription-based pricing models.
   - Invoices track payment history and status.

6. **Realtime Updates**:
   - PostgreSQL NOTIFY/LISTEN mechanism is used to inform the bot of configuration changes in real-time.