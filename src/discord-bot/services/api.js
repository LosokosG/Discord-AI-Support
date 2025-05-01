import dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";

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
   * Ensure server exists in database, register if needed
   * @param {Object} guild - Discord.js Guild object
   * @returns {Promise<Object>} - Server data
   */
  async ensureServerExists(guild) {
    try {
      const exists = await this.serverExists(guild.id);

      if (!exists) {
        return await this.registerServer({
          id: guild.id,
          name: guild.name,
          iconUrl: guild.iconURL({ dynamic: true }),
        });
      }

      return await this.getServerConfig(guild.id);
    } catch (error) {
      console.error(`Error ensuring server ${guild.id} exists:`, error);
      throw error;
    }
  }

  /**
   * Get server configuration by server ID
   * @param {string} serverId - Discord server ID
   * @returns {Promise<Object>} - Server configuration
   */
  async getServerConfig(serverId) {
    try {
      const serverIdStr = typeof serverId === "bigint" ? serverId.toString() : serverId;
      const { data, error } = await this.supabase.from("servers").select("*").eq("id", serverIdStr).single();

      if (error) {
        throw error;
      }

      // Format with camelCase for internal use
      return {
        id: data.id,
        name: data.name,
        iconUrl: data.icon_url,
        active: data.active,
        config: data.config,
      };
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

      // Format data for DB (snake_case)
      const payload = {
        server_id: serverIdStr,
        user_id: conversation.userId,
        question: conversation.question,
        answer: conversation.answer,
        has_knowledge_context: conversation.hasKnowledgeContext,
        relevant_documents: conversation.relevantDocuments,
        status: conversation.status,
      };

      // Ensure all values are serializable
      const safePayload = this.safeSerialize(payload);

      const { data, error } = await this.supabase.from("conversations").insert(safePayload).select().single();

      if (error) {
        throw error;
      }

      // Format response with camelCase
      return {
        id: data.id,
        serverId: data.server_id,
        userId: data.user_id,
        question: data.question,
        answer: data.answer,
        hasKnowledgeContext: data.has_knowledge_context,
        relevantDocuments: data.relevant_documents,
        status: data.status,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
      };
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
        notes: ticketData.notes,
        priority: ticketData.priority || "normal",
      };

      // Ensure all values are serializable
      const safePayload = this.safeSerialize(payload);

      const { data, error } = await this.supabase.from("forwarded_tickets").insert(safePayload).select().single();

      if (error) {
        throw error;
      }

      // Update conversation status to forwarded
      await this.supabase.from("conversations").update({ status: "forwarded" }).eq("id", conversationId);

      // Format response with camelCase
      return {
        id: data.id,
        serverId: data.server_id,
        conversationId: data.conversation_id,
        status: data.status,
        notes: data.notes,
        priority: data.priority,
        assignedTo: data.assigned_to,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
      };
    } catch (error) {
      console.error(`Error forwarding conversation ${conversationId} for server ${serverId}:`, error);
      throw error;
    }
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
}

// Singleton instance
const apiService = new ApiService();

// Export as ESM default
export default apiService;
