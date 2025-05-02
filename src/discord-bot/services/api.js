/* eslint-disable no-console */
import dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";
import knowledgeService from "./knowledge.js";

// Dla ESLint
/* global process, console */

// Load environment variables
dotenv.config();

// Initialize Supabase client
const supabaseUrl = process.env.PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.PUBLIC_SUPABASE_ANON_KEY;

// Format zgodny z istniejącymi implementacjami
class ApiService {
  constructor() {
    if (!supabaseUrl || !supabaseKey) {
      console.warn("Supabase credentials missing! API calls will fail!");
    }

    this.supabase = createClient(supabaseUrl, supabaseKey);
    this.cache = new Map(); // Simple in-memory cache
    this.cacheTTL = 30 * 1000; // 30 seconds in milliseconds
  }

  /**
   * Clear the cache for a specific key or all cache
   * @param {string} key - Cache key to clear, or null to clear all
   */
  clearCache(key = null) {
    if (key) {
      this.cache.delete(key);
      console.log(`[ApiService] Cleared cache for key: ${key}`);
    } else {
      const count = this.cache.size;
      this.cache.clear();
      console.log(`[ApiService] Cleared entire cache (${count} entries)`);
    }
  }

  /**
   * Convert BigInt to string for serialization
   * @param {*} value - Value to convert
   * @returns {*} - Converted value
   */
  safeSerialize(value) {
    if (typeof value === "bigint") {
      return value.toString();
    }

    if (typeof value === "object" && value !== null) {
      if (Array.isArray(value)) {
        return value.map((item) => this.safeSerialize(item));
      }

      const result = {};
      for (const key in value) {
        result[key] = this.safeSerialize(value[key]);
      }
      return result;
    }

    return value;
  }

  /**
   * Check if a server exists in the database
   * @param {string} serverId - Discord server ID
   * @returns {Promise<boolean>} - Whether the server exists
   */
  async serverExists(serverId) {
    try {
      const serverIdStr = typeof serverId === "bigint" ? serverId.toString() : serverId;
      const { data, error } = await this.supabase.from("servers").select("id").eq("id", serverIdStr).maybeSingle();

      if (error) {
        console.error(`Error checking if server ${serverId} exists:`, error);
        return false;
      }

      return !!data;
    } catch (error) {
      console.error(`Error checking if server ${serverId} exists:`, error);
      return false;
    }
  }

  /**
   * Create a partition for the conversations table for a specific server
   * @param {string} serverId - Discord server ID
   * @returns {Promise<boolean>} - Success status
   */
  async createConversationsPartition(serverId) {
    try {
      const serverIdStr = typeof serverId === "bigint" ? serverId.toString() : serverId;

      console.log(`Creating conversations partition for server ${serverIdStr}`);

      // Create partition using raw SQL
      const { error } = await this.supabase.rpc("create_conversations_partition", {
        server_id_param: serverIdStr,
      });

      if (error) {
        // Check if error is about partition already existing
        if (error.message.includes("already exists")) {
          console.log(`Partition for server ${serverIdStr} already exists`);
          return true;
        }
        throw error;
      }

      console.log(`Successfully created partition for server ${serverIdStr}`);
      return true;
    } catch (error) {
      console.error(`Error creating partition for server ${serverId}:`, error);
      return false;
    }
  }

  /**
   * Register a new server in the database
   * @param {Object} serverData - Server data
   * @param {string} serverData.id - Discord server ID
   * @param {string} serverData.name - Server name
   * @param {string} serverData.iconUrl - Server icon URL
   * @param {Object} serverData.config - Server configuration
   * @returns {Promise<Object>} - Created server
   */
  async registerServer(serverData) {
    if (!serverData.id) {
      throw new Error("Server ID is required");
    }

    console.log(`Registering server ${serverData.id} (${serverData.name || "Unknown"}) in database`);

    // Convert ID to string if it's a BigInt
    const serverIdStr = typeof serverData.id === "bigint" ? serverData.id.toString() : serverData.id;

    // Format zgodny z serwerem - używa snake_case dla nazw pól
    const payload = {
      id: serverIdStr,
      name: serverData.name || `Server ${serverData.id}`,
      icon_url: serverData.iconUrl || null,
      active: true,
      config: serverData.config || {
        enabled: true,
        language: "en",
        systemPrompt: "You are a helpful assistant for the Discord server.",
      },
    };

    // Ensure all values are serializable
    const safePayload = this.safeSerialize(payload);

    const { data, error } = await this.supabase.from("servers").insert(safePayload).select().single();

    if (error) {
      // Check if it's a unique constraint violation (server already exists)
      if (error.code === "23505") {
        const existingServer = await this.getServerConfig(serverData.id);
        return existingServer;
      }
      console.error(`Error registering server ${serverData.id}:`, error);
      throw error;
    }

    // Create conversations partition for this server
    try {
      await this.createConversationsPartition(serverIdStr);
    } catch (partitionError) {
      console.error(`Error creating conversations partition for server ${serverIdStr}:`, partitionError);
      // Don't throw here, continue with server registration
    }

    // Create default knowledge document for the server
    try {
      await this.createDefaultKnowledgeDocument(serverIdStr);
    } catch (docError) {
      console.error(`Error creating default knowledge document for server ${serverIdStr}:`, docError);
      // Don't throw here, we want the server registration to succeed even if doc creation fails
    }

    // Format with camelCase for internal use
    return {
      id: data.id,
      name: data.name,
      iconUrl: data.icon_url,
      active: data.active,
      config: data.config,
    };
  }

  /**
   * Create default knowledge document for a server
   * @param {string} serverId - Discord server ID
   * @returns {Promise<Object>} - Created document
   */
  async createDefaultKnowledgeDocument(serverId) {
    console.log(`Creating default knowledge document for server ${serverId}`);

    const defaultDocument = {
      server_id: serverId,
      title: "Welcome to AI Support Bot",
      content: `# Welcome to AI Support Bot

This is your first knowledge document. You can add more documents to help the bot answer questions about your server.

## How to use knowledge base

1. Create documents with information about your server, rules, FAQs, etc.
2. The bot will use this information to provide more accurate answers to questions.
3. You can organize your knowledge in multiple documents.

## Tips

- Be specific and clear in your documents
- Update documents regularly
- Use markdown formatting for better organization

Feel free to edit or delete this document.`,
      file_type: "md",
      storage_path: null,
    };

    const { data, error } = await this.supabase.from("knowledge_documents").insert(defaultDocument).select().single();

    if (error) {
      console.error(`Error creating default knowledge document:`, error);
      throw error;
    }

    return {
      id: data.id,
      title: data.title,
      fileType: data.file_type,
      serverId: data.server_id,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    };
  }

  /**
   * Ensure server exists in database, register if needed
   * @param {Object} guild - Discord.js Guild object
   * @returns {Promise<Object>} - Server data
   */
  async ensureServerExists(guild) {
    try {
      const exists = await this.serverExists(guild.id);

      if (!exists) {
        // Server doesn't exist, register it
        // The default knowledge document will be created in registerServer method
        return await this.registerServer({
          id: guild.id,
          name: guild.name,
          iconUrl: guild.iconURL({ dynamic: true }),
        });
      }

      // Server exists, check if it has a default knowledge document
      const serverConfig = await this.getServerConfig(guild.id);

      // Get knowledge documents for this server
      const { data: documents } = await this.supabase
        .from("knowledge_documents")
        .select("id")
        .eq("server_id", typeof guild.id === "bigint" ? guild.id.toString() : guild.id)
        .limit(1);

      // If no documents exist, create a default one
      if (!documents || documents.length === 0) {
        try {
          await this.createDefaultKnowledgeDocument(typeof guild.id === "bigint" ? guild.id.toString() : guild.id);
        } catch (docError) {
          console.error(`Error creating default knowledge document for existing server ${guild.id}:`, docError);
          // Don't throw, we want to return the server config anyway
        }
      }

      return serverConfig;
    } catch (error) {
      console.error(`Error ensuring server ${guild.id} exists:`, error);
      throw error;
    }
  }

  /**
   * Get server configuration by server ID
   * @param {string} serverId - Discord server ID
   * @param {boolean} forceRefresh - Whether to force a cache refresh
   * @returns {Promise<Object>} - Server configuration
   */
  async getServerConfig(serverId, forceRefresh = false) {
    try {
      const serverIdStr = typeof serverId === "bigint" ? serverId.toString() : serverId;
      const cacheKey = `server_config_${serverIdStr}`;

      // Check cache first, unless forcing refresh
      if (!forceRefresh && this.cache.has(cacheKey)) {
        const cachedData = this.cache.get(cacheKey);
        if (cachedData.expiry > Date.now()) {
          return cachedData.data;
        }
        // Cache expired, remove it
        this.cache.delete(cacheKey);
      }

      const { data, error } = await this.supabase.from("servers").select("*").eq("id", serverIdStr).single();

      if (error) {
        throw error;
      }

      // Format with camelCase for internal use
      const serverConfig = {
        id: data.id,
        name: data.name,
        iconUrl: data.icon_url,
        active: data.active,
        config: data.config,
      };

      // Store in cache
      this.cache.set(cacheKey, {
        data: serverConfig,
        expiry: Date.now() + this.cacheTTL,
      });

      return serverConfig;
    } catch (error) {
      console.error(`Error getting server config for ${serverId}:`, error);
      throw error;
    }
  }

  /**
   * Get knowledge documents for a server
   * @param {string} serverId - Discord server ID
   * @param {Object} options - Query parameters
   * @returns {Promise<Object>} - Paginated list of documents
   */
  async getKnowledgeDocuments(serverId, options = {}) {
    try {
      const serverIdStr = typeof serverId === "bigint" ? serverId.toString() : serverId;
      const page = options.page || 1;
      const pageSize = options.pageSize || 50;

      // Calculate range for pagination
      const from = (page - 1) * pageSize;
      const to = page * pageSize - 1;

      // Build query
      let query = this.supabase
        .from("knowledge_documents")
        .select("*", { count: "exact" })
        .eq("server_id", serverIdStr)
        .range(from, to);

      // Add filters if specified
      if (options.q) {
        query = query.ilike("title", `%${options.q}%`);
      }

      if (options.fileType) {
        query = query.eq("file_type", options.fileType);
      }

      const { data, error, count } = await query;

      if (error) {
        throw error;
      }

      // Format response with camelCase
      const documents = data.map((doc) => ({
        id: doc.id,
        title: doc.title,
        fileType: doc.file_type,
        serverId: doc.server_id,
        createdAt: doc.created_at,
        updatedAt: doc.updated_at,
        content: doc.content,
      }));

      return {
        data: documents,
        page,
        pageSize,
        total: count || 0,
      };
    } catch (error) {
      console.error(`Error getting knowledge documents for server ${serverId}:`, error);
      throw error;
    }
  }

  /**
   * Get a specific knowledge document
   * @param {string} serverId - Discord server ID
   * @param {string} documentId - Document ID
   * @returns {Promise<Object>} - Document with content
   */
  async getKnowledgeDocument(serverId, documentId) {
    try {
      const serverIdStr = typeof serverId === "bigint" ? serverId.toString() : serverId;

      const { data, error } = await this.supabase
        .from("knowledge_documents")
        .select("*")
        .eq("server_id", serverIdStr)
        .eq("id", documentId)
        .single();

      if (error) {
        throw error;
      }

      // Format response with camelCase
      return {
        id: data.id,
        title: data.title,
        fileType: data.file_type,
        serverId: data.server_id,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
        content: data.content,
      };
    } catch (error) {
      console.error(`Error fetching document ${documentId} for server ${serverId}:`, error);
      throw error;
    }
  }

  /**
   * Create or update a conversation
   * @param {string} serverId - Discord server ID
   * @param {Object} conversation - Conversation data
   * @returns {Promise<Object>} - Created/updated conversation
   */
  async saveConversation(serverId, conversation) {
    try {
      const serverIdStr = typeof serverId === "bigint" ? serverId.toString() : serverId;

      // First check if the server exists and create it if it doesn't
      const serverExists = await this.serverExists(serverIdStr);
      if (!serverExists) {
        console.log(`Server ${serverIdStr} doesn't exist in database, registering it first`);
        await this.registerServer({
          id: serverIdStr,
          name: conversation.serverName || `Server ${serverIdStr}`,
        });
      }

      // Format data for DB (snake_case) and use transcript for message content
      const transcript = [
        { role: "user", content: conversation.question },
        { role: "assistant", content: conversation.answer },
      ];

      const payload = {
        server_id: serverIdStr,
        user_id: conversation.userId,
        channel_id: conversation.channelId || "unknown",
        username: conversation.username || "User",
        transcript: transcript,
        status: conversation.status || "completed",
      };

      // Add any optional fields if provided
      if (conversation.threadId) {
        payload.thread_id = conversation.threadId;
      }

      // Store relevant documents in metadata or as part of the transcript
      if (conversation.hasKnowledgeContext && conversation.relevantDocuments) {
        // Store as special system message to keep the format consistent
        transcript.unshift({
          role: "system",
          content: "Relevant knowledge documents: " + JSON.stringify(conversation.relevantDocuments),
        });
      }

      // Ensure all values are serializable
      const safePayload = this.safeSerialize(payload);

      try {
        const { data, error } = await this.supabase.from("conversations").insert(safePayload).select().single();

        if (error) {
          throw error;
        }

        // Format response with camelCase
        return {
          id: data.id,
          serverId: data.server_id,
          userId: data.user_id,
          channelId: data.channel_id,
          threadId: data.thread_id,
          transcript: data.transcript,
          status: data.status,
          createdAt: data.created_at,
          updatedAt: data.updated_at,
        };
      } catch (error) {
        // Check if error is related to missing partition
        if (
          error.code === "23514" &&
          error.message.includes('no partition of relation "conversations" found for row')
        ) {
          console.log(`No partition found for server ${serverIdStr}, attempting to create one...`);

          // Try to create the partition
          const partitionCreated = await this.createConversationsPartition(serverIdStr);

          if (partitionCreated) {
            console.log(`Partition created, retrying insert for server ${serverIdStr}`);
            // Retry the insert
            const { data, error: retryError } = await this.supabase
              .from("conversations")
              .insert(safePayload)
              .select()
              .single();

            if (retryError) {
              throw retryError;
            }

            // Format response with camelCase
            return {
              id: data.id,
              serverId: data.server_id,
              userId: data.user_id,
              channelId: data.channel_id,
              threadId: data.thread_id,
              transcript: data.transcript,
              status: data.status,
              createdAt: data.created_at,
              updatedAt: data.updated_at,
            };
          } else {
            throw new Error(`Failed to create partition for server ${serverIdStr}`);
          }
        } else {
          // Unknown error, just throw it
          throw error;
        }
      }
    } catch (error) {
      console.error(`Error saving conversation for server ${serverId}:`, error);
      throw error;
    }
  }

  /**
   * Forward a conversation to human support
   * @param {string} serverId - Discord server ID
   * @param {string} conversationId - Conversation ID
   * @param {Object} ticketData - Additional ticket data
   * @returns {Promise<Object>} - Created ticket
   */
  async forwardConversation(serverId, conversationId, ticketData = {}) {
    try {
      const serverIdStr = typeof serverId === "bigint" ? serverId.toString() : serverId;

      // Format data for DB (snake_case)
      const payload = {
        server_id: serverIdStr,
        conversation_id: conversationId,
        status: "pending",
        resolution_notes: ticketData.notes,
        user_id: ticketData.user_id,
        ai_summary: ticketData.aiSummary || null,
      };

      // Ensure all values are serializable
      const safePayload = this.safeSerialize(payload);

      const { data, error } = await this.supabase.from("forwarded_tickets").insert(safePayload).select().single();

      if (error) {
        throw error;
      }

      // Update conversation status to forwarded
      try {
        const { error: updateError } = await this.supabase
          .from("conversations")
          .update({ status: "forwarded" })
          .eq("id", conversationId);

        if (updateError) {
          console.error(`Error updating conversation status to 'forwarded':`, updateError);
        } else {
          console.log(`Successfully updated conversation ${conversationId} status to 'forwarded'`);
        }
      } catch (updateError) {
        console.error(`Exception when updating conversation status to 'forwarded':`, updateError);
        // Continue even if this update fails
      }

      // Format response with camelCase
      return {
        id: data.id,
        serverId: data.server_id,
        conversationId: data.conversation_id,
        status: data.status,
        resolutionNotes: data.resolution_notes,
        assignedTo: data.assigned_to,
        userId: data.user_id,
        aiSummary: data.ai_summary,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
      };
    } catch (error) {
      console.error(`Error forwarding conversation ${conversationId} for server ${serverId}:`, error);
      throw error;
    }
  }

  /**
   * Invalidate cache for a server
   * @param {string} serverId - Discord server ID
   */
  invalidateServerCache(serverId) {
    const serverIdStr = typeof serverId === "bigint" ? serverId.toString() : serverId;
    // Clear server config cache
    this.clearCache(`server_config_${serverIdStr}`);

    // Also notify knowledge service to clear its cache for this server
    if (knowledgeService) {
      knowledgeService.clearCache(serverIdStr);
    } else {
      console.warn(`[ApiService] Could not access knowledge service to clear cache for server ${serverIdStr}`);
    }

    console.log(`[ApiService] Invalidated all cache for server ${serverIdStr}`);
  }

  /**
   * Activate the bot for a server
   * @param {string} serverId - Discord server ID
   * @returns {Promise<Object>} - Updated server config
   */
  async activateBot(serverId) {
    try {
      const serverIdStr = typeof serverId === "bigint" ? serverId.toString() : serverId;

      // Get current config
      const { data: currentServer } = await this.supabase
        .from("servers")
        .select("config")
        .eq("id", serverIdStr)
        .single();

      // Update config with enabled=true
      const updatedConfig = {
        ...currentServer.config,
        enabled: true,
      };

      const { data, error } = await this.supabase
        .from("servers")
        .update({ config: updatedConfig })
        .eq("id", serverIdStr)
        .select()
        .single();

      if (error) {
        throw error;
      }

      // Invalidate cache after config change
      this.invalidateServerCache(serverId);

      // Format response with camelCase
      return {
        id: data.id,
        name: data.name,
        iconUrl: data.icon_url,
        active: data.active,
        config: data.config,
      };
    } catch (error) {
      console.error(`Error activating bot for server ${serverId}:`, error);
      throw error;
    }
  }

  /**
   * Deactivate the bot for a server
   * @param {string} serverId - Discord server ID
   * @returns {Promise<Object>} - Updated server config
   */
  async deactivateBot(serverId) {
    try {
      const serverIdStr = typeof serverId === "bigint" ? serverId.toString() : serverId;

      // Get current config
      const { data: currentServer } = await this.supabase
        .from("servers")
        .select("config")
        .eq("id", serverIdStr)
        .single();

      // Update config with enabled=false
      const updatedConfig = {
        ...currentServer.config,
        enabled: false,
      };

      const { data, error } = await this.supabase
        .from("servers")
        .update({ config: updatedConfig })
        .eq("id", serverIdStr)
        .select()
        .single();

      if (error) {
        throw error;
      }

      // Invalidate cache after config change
      this.invalidateServerCache(serverId);

      // Format response with camelCase
      return {
        id: data.id,
        name: data.name,
        iconUrl: data.icon_url,
        active: data.active,
        config: data.config,
      };
    } catch (error) {
      console.error(`Error deactivating bot for server ${serverId}:`, error);
      throw error;
    }
  }

  /**
   * Create a new knowledge document
   * @param {string} serverId - Discord server ID
   * @param {Object} documentData - Document data
   * @returns {Promise<Object>} - Created document
   */
  async createKnowledgeDocument(serverId, documentData) {
    try {
      const serverIdStr = typeof serverId === "bigint" ? serverId.toString() : serverId;

      const payload = {
        server_id: serverIdStr,
        title: documentData.title || "Untitled Document",
        content: documentData.content || "",
        file_type: documentData.fileType || "md",
        storage_path: documentData.storagePath || null,
      };

      const { data, error } = await this.supabase.from("knowledge_documents").insert(payload).select().single();

      if (error) {
        throw error;
      }

      // Invalidate cache for this server to ensure latest documents are fetched
      this.invalidateServerCache(serverId);

      return {
        id: data.id,
        title: data.title,
        content: data.content,
        fileType: data.file_type,
        serverId: data.server_id,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
      };
    } catch (error) {
      console.error(`Error creating knowledge document for server ${serverId}:`, error);
      throw error;
    }
  }

  /**
   * Update a knowledge document
   * @param {string} serverId - Discord server ID
   * @param {string} documentId - Document ID
   * @param {Object} documentData - Document data to update
   * @returns {Promise<Object>} - Updated document
   */
  async updateKnowledgeDocument(serverId, documentId, documentData) {
    try {
      const serverIdStr = typeof serverId === "bigint" ? serverId.toString() : serverId;

      // Build update payload with only provided fields
      const payload = {};
      if (documentData.title !== undefined) payload.title = documentData.title;
      if (documentData.content !== undefined) payload.content = documentData.content;
      if (documentData.fileType !== undefined) payload.file_type = documentData.fileType;
      if (documentData.storagePath !== undefined) payload.storage_path = documentData.storagePath;

      const { data, error } = await this.supabase
        .from("knowledge_documents")
        .update(payload)
        .eq("id", documentId)
        .eq("server_id", serverIdStr)
        .select()
        .single();

      if (error) {
        throw error;
      }

      // Invalidate cache for this server
      this.invalidateServerCache(serverId);

      return {
        id: data.id,
        title: data.title,
        content: data.content,
        fileType: data.file_type,
        serverId: data.server_id,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
      };
    } catch (error) {
      console.error(`Error updating knowledge document ${documentId} for server ${serverId}:`, error);
      throw error;
    }
  }

  /**
   * Delete a knowledge document
   * @param {string} serverId - Discord server ID
   * @param {string} documentId - Document ID
   * @returns {Promise<boolean>} - Success status
   */
  async deleteKnowledgeDocument(serverId, documentId) {
    try {
      const serverIdStr = typeof serverId === "bigint" ? serverId.toString() : serverId;

      const { error } = await this.supabase
        .from("knowledge_documents")
        .delete()
        .eq("id", documentId)
        .eq("server_id", serverIdStr);

      if (error) {
        throw error;
      }

      // Invalidate cache for this server
      this.invalidateServerCache(serverId);

      return true;
    } catch (error) {
      console.error(`Error deleting knowledge document ${documentId} for server ${serverId}:`, error);
      throw error;
    }
  }

  /**
   * Update server configuration
   * @param {string} serverId - Discord server ID
   * @param {Object} configData - Configuration data
   * @returns {Promise<Object>} - Updated server configuration
   */
  async updateServerConfig(serverId, configData) {
    try {
      const serverIdStr = typeof serverId === "bigint" ? serverId.toString() : serverId;

      // Get current server data
      const { data: currentServer } = await this.supabase
        .from("servers")
        .select("config")
        .eq("id", serverIdStr)
        .single();

      if (!currentServer) {
        throw new Error(`Server ${serverId} not found`);
      }

      // Merge existing config with new data
      const updatedConfig = {
        ...currentServer.config,
        ...configData,
      };

      const { data, error } = await this.supabase
        .from("servers")
        .update({ config: updatedConfig })
        .eq("id", serverIdStr)
        .select()
        .single();

      if (error) {
        throw error;
      }

      // Invalidate cache for this server
      this.invalidateServerCache(serverId);

      return {
        id: data.id,
        name: data.name,
        iconUrl: data.icon_url,
        active: data.active,
        config: data.config,
      };
    } catch (error) {
      console.error(`Error updating config for server ${serverId}:`, error);
      throw error;
    }
  }

  /**
   * Get active conversation for a user in a specific channel
   * @param {string} serverId - Discord server ID
   * @param {string} channelId - Discord channel ID
   * @param {string} userId - Discord user ID
   * @param {string} threadId - Optional Discord thread ID
   * @returns {Promise<Object|null>} - Conversation object or null if not found
   */
  async getActiveConversation(serverId, channelId, userId, threadId = null) {
    try {
      const serverIdStr = typeof serverId === "bigint" ? serverId.toString() : serverId;

      // Build query
      let query = this.supabase
        .from("conversations")
        .select("*")
        .eq("server_id", serverIdStr)
        .eq("user_id", userId)
        .eq("status", "active");

      // Add channel ID condition
      query = query.eq("channel_id", channelId);

      // Add thread ID condition if provided
      if (threadId) {
        query = query.eq("thread_id", threadId);
      } else {
        query = query.is("thread_id", null);
      }

      // Get the most recent conversation if multiple exist
      query = query.order("updated_at", { ascending: false }).limit(1);

      const { data, error } = await query;

      if (error) {
        throw error;
      }

      // Return the first conversation or null if none found
      return data && data.length > 0 ? data[0] : null;
    } catch (error) {
      console.error(`Error getting active conversation for user ${userId} in channel ${channelId}:`, error);
      return null;
    }
  }

  /**
   * Create a new conversation
   * @param {string} serverId - Discord server ID
   * @param {string} channelId - Discord channel ID
   * @param {string} userId - Discord user ID
   * @param {string} username - Discord username
   * @param {Object} initialMessage - Initial message object {role, content}
   * @param {string} threadId - Optional Discord thread ID
   * @returns {Promise<Object>} - New conversation object
   */
  async createConversation(serverId, channelId, userId, username, initialMessage, threadId = null) {
    try {
      const serverIdStr = typeof serverId === "bigint" ? serverId.toString() : serverId;

      // First check if the server exists and create it if it doesn't
      const serverExists = await this.serverExists(serverIdStr);
      if (!serverExists) {
        console.log(`Server ${serverIdStr} doesn't exist in database, registering it first`);
        await this.registerServer({
          id: serverIdStr,
          name: `Server ${serverIdStr}`,
        });
      }

      // Initialize transcript with system prompt and user's initial message
      const transcript = [initialMessage];

      const { data, error } = await this.supabase
        .from("conversations")
        .insert({
          server_id: serverIdStr,
          channel_id: channelId,
          thread_id: threadId,
          user_id: userId,
          username: username,
          transcript: transcript,
          status: "active",
        })
        .select()
        .single();

      if (error) {
        throw error;
      }

      return data;
    } catch (error) {
      console.error(`Error creating conversation for user ${userId} in channel ${channelId}:`, error);
      throw error;
    }
  }

  /**
   * Update an existing conversation with new messages
   * @param {string} conversationId - Conversation UUID
   * @param {string} serverId - Discord server ID
   * @param {Object} newMessages - Array of message objects to add to transcript
   * @returns {Promise<Object>} - Updated conversation object
   */
  async updateConversation(conversationId, serverId, newMessages) {
    try {
      const serverIdStr = typeof serverId === "bigint" ? serverId.toString() : serverId;

      // First get the current conversation to append to transcript
      const { data: currentConversation, error: fetchError } = await this.supabase
        .from("conversations")
        .select("transcript")
        .eq("id", conversationId)
        .eq("server_id", serverIdStr)
        .single();

      if (fetchError) {
        throw fetchError;
      }

      // Append new messages to the transcript
      const updatedTranscript = [...currentConversation.transcript, ...newMessages];

      // Update the conversation
      const { data, error } = await this.supabase
        .from("conversations")
        .update({
          transcript: updatedTranscript,
          updated_at: new Date().toISOString(),
        })
        .eq("id", conversationId)
        .eq("server_id", serverIdStr)
        .select()
        .single();

      if (error) {
        throw error;
      }

      return data;
    } catch (error) {
      console.error(`Error updating conversation ${conversationId}:`, error);
      throw error;
    }
  }

  /**
   * Complete a conversation (mark as inactive)
   * @param {string} conversationId - Conversation UUID
   * @param {string} serverId - Discord server ID
   * @returns {Promise<Object>} - Updated conversation object
   */
  async completeConversation(conversationId, serverId) {
    try {
      const serverIdStr = typeof serverId === "bigint" ? serverId.toString() : serverId;

      const { data, error } = await this.supabase
        .from("conversations")
        .update({
          status: "completed",
          completed_at: new Date().toISOString(),
        })
        .eq("id", conversationId)
        .eq("server_id", serverIdStr)
        .select()
        .single();

      if (error) {
        throw error;
      }

      return data;
    } catch (error) {
      console.error(`Error completing conversation ${conversationId}:`, error);
      throw error;
    }
  }

  /**
   * Clean up old conversations (called periodically)
   * @param {number} maxAgeHours - Maximum age of conversations in hours
   * @returns {Promise<number>} - Number of conversations completed
   */
  async cleanupOldConversations(maxAgeHours = 24) {
    try {
      // Calculate cutoff time
      const cutoffTime = new Date();
      cutoffTime.setHours(cutoffTime.getHours() - maxAgeHours);

      // Find active conversations older than cutoff time
      const { data, error } = await this.supabase
        .from("conversations")
        .update({
          status: "completed",
          completed_at: new Date().toISOString(),
        })
        .eq("status", "active")
        .lt("updated_at", cutoffTime.toISOString())
        .select("id");

      if (error) {
        throw error;
      }

      return data ? data.length : 0;
    } catch (error) {
      console.error(`Error cleaning up old conversations:`, error);
      return 0;
    }
  }

  /**
   * Find all conversations for a user in a specific channel regardless of status
   * Use for debugging purposes
   * @param {string} serverId - Discord server ID
   * @param {string} channelId - Discord channel ID
   * @param {string} userId - Discord user ID
   * @param {string} threadId - Optional Discord thread ID
   * @returns {Promise<Array>} - Array of conversation objects
   */
  async findAllUserConversations(serverId, channelId, userId, threadId = null) {
    try {
      const serverIdStr = typeof serverId === "bigint" ? serverId.toString() : serverId;

      // Build query
      let query = this.supabase.from("conversations").select("*").eq("server_id", serverIdStr).eq("user_id", userId);

      // Add channel ID condition
      query = query.eq("channel_id", channelId);

      // Add thread ID condition if provided
      if (threadId) {
        query = query.eq("thread_id", threadId);
      }

      // Get recent conversations first
      query = query.order("updated_at", { ascending: false }).limit(10);

      const { data, error } = await query;

      if (error) {
        throw error;
      }

      return data || [];
    } catch (error) {
      console.error(`Error finding user conversations for user ${userId} in channel ${channelId}:`, error);
      return [];
    }
  }

  /**
   * Reactivate a conversation by ID (change status to active)
   * @param {string} conversationId - Conversation UUID
   * @returns {Promise<Object|null>} - Updated conversation or null if error
   */
  async reactivateConversation(conversationId) {
    try {
      console.log(`[ApiService] Attempting to reactivate conversation ${conversationId}`);

      // Update the conversation status to active
      const { data, error } = await this.supabase
        .from("conversations")
        .update({
          status: "active",
          updated_at: new Date().toISOString(),
        })
        .eq("id", conversationId)
        .select()
        .single();

      if (error) {
        console.error(`[ApiService] Error reactivating conversation ${conversationId}:`, error);
        throw error;
      }

      console.log(`[ApiService] Successfully reactivated conversation ${conversationId}`);
      return data;
    } catch (error) {
      console.error(`[ApiService] Exception reactivating conversation ${conversationId}:`, error);
      return null;
    }
  }

  /**
   * Find the most recent conversation for a user and activate it if needed
   * @param {string} serverId - Discord server ID
   * @param {string} channelId - Discord channel ID
   * @param {string} userId - Discord user ID
   * @param {string} threadId - Optional Discord thread ID
   * @param {number} maxAgeHours - Maximum age of conversations to reactivate in hours
   * @returns {Promise<Object|null>} - Found or reactivated conversation, or null if none found
   */
  async findOrActivateRecentConversation(serverId, channelId, userId, threadId = null, maxAgeHours = 24) {
    try {
      const serverIdStr = typeof serverId === "bigint" ? serverId.toString() : serverId;

      // Calculate cutoff time for reactivation
      const cutoffTime = new Date();
      cutoffTime.setHours(cutoffTime.getHours() - maxAgeHours);
      const cutoffISOString = cutoffTime.toISOString();

      // First check if there's an active conversation
      const activeConversation = await this.getActiveConversation(serverId, channelId, userId, threadId);
      if (activeConversation) {
        console.log(`[ApiService] Found already active conversation ${activeConversation.id}`);
        return activeConversation;
      }

      // If no active conversation, find the most recent one regardless of status
      console.log(`[ApiService] No active conversation found, looking for recent conversations`);

      // Build query for recent conversations
      let query = this.supabase
        .from("conversations")
        .select("*")
        .eq("server_id", serverIdStr)
        .eq("user_id", userId)
        .eq("channel_id", channelId);

      // Add thread ID condition if provided
      if (threadId) {
        query = query.eq("thread_id", threadId);
      } else {
        query = query.is("thread_id", null);
      }

      // Only consider relatively recent conversations
      query = query.gte("updated_at", cutoffISOString);

      // Get the most recent conversation
      query = query.order("updated_at", { ascending: false }).limit(1);

      const { data, error } = await query;

      if (error) {
        throw error;
      }

      // If no recent conversation found
      if (!data || data.length === 0) {
        console.log(`[ApiService] No recent conversations found for user ${userId} in channel ${channelId}`);
        return null;
      }

      const recentConversation = data[0];

      // If the conversation is not active, reactivate it
      if (recentConversation.status !== "active") {
        console.log(
          `[ApiService] Found recent conversation ${recentConversation.id} with status "${recentConversation.status}", reactivating it`
        );

        // Use the new reactivateConversation method
        const updatedConversation = await this.reactivateConversation(recentConversation.id);

        if (!updatedConversation) {
          throw new Error(`Failed to reactivate conversation ${recentConversation.id}`);
        }

        return updatedConversation;
      }

      return recentConversation;
    } catch (error) {
      console.error(
        `[ApiService] Error finding or activating conversation for user ${userId} in channel ${channelId}:`,
        error
      );
      return null;
    }
  }

  /**
   * Resolve a forwarded ticket
   * @param {string} ticketId - Ticket UUID
   * @param {Object} updateData - Data to update
   * @returns {Promise<Object>} - Updated ticket
   */
  async resolveForwardedTicket(ticketId, updateData = {}) {
    try {
      // Format data for DB (snake_case)
      const payload = {};

      if (updateData.resolutionNotes) {
        payload.resolution_notes = updateData.resolutionNotes;
      }

      if (updateData.assignedTo) {
        payload.assigned_to = updateData.assignedTo;
      }

      // Always set status to resolved and resolved_at to now
      payload.status = "resolved";
      payload.resolved_at = new Date().toISOString();

      // Ensure all values are serializable
      const safePayload = this.safeSerialize(payload);

      const { data, error } = await this.supabase
        .from("forwarded_tickets")
        .update(safePayload)
        .eq("id", ticketId)
        .select()
        .single();

      if (error) {
        throw error;
      }

      // Format response with camelCase
      return {
        id: data.id,
        serverId: data.server_id,
        conversationId: data.conversation_id,
        status: data.status,
        resolutionNotes: data.resolution_notes,
        assignedTo: data.assigned_to,
        userId: data.user_id,
        aiSummary: data.ai_summary,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
        resolvedAt: data.resolved_at,
      };
    } catch (error) {
      console.error(`Error resolving forwarded ticket ${ticketId}:`, error);
      throw error;
    }
  }

  /**
   * Get a forwarded ticket by conversation ID
   * @param {string} conversationId - Conversation UUID
   * @returns {Promise<Object|null>} - Forwarded ticket or null if not found
   */
  async getForwardedTicketByConversationId(conversationId) {
    try {
      const { data, error } = await this.supabase
        .from("forwarded_tickets")
        .select("*")
        .eq("conversation_id", conversationId)
        .maybeSingle();

      if (error) {
        throw error;
      }

      if (!data) {
        return null;
      }

      // Format response with camelCase
      return {
        id: data.id,
        serverId: data.server_id,
        conversationId: data.conversation_id,
        status: data.status,
        resolutionNotes: data.resolution_notes,
        assignedTo: data.assigned_to,
        userId: data.user_id,
        aiSummary: data.ai_summary,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
        resolvedAt: data.resolved_at,
      };
    } catch (error) {
      console.error(`Error getting forwarded ticket for conversation ${conversationId}:`, error);
      return null;
    }
  }
}

// Singleton instance
const apiService = new ApiService();

// Export as ESM default
export default apiService;
