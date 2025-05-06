/* eslint-disable no-console */
import apiService from "./api.js";

// Dla ESLint
/* global console */

class KnowledgeService {
  constructor() {
    this.cache = new Map(); // Simple in-memory cache
    this.cacheTTL = 1 * 60 * 1000; // 1 minute in milliseconds (reduced from 5 minutes)
  }

  /**
   * Clear the cache for a specific server
   * @param {string} serverId - Discord server ID
   */
  clearCache(serverId) {
    if (serverId) {
      // Clear cache for specific server
      const serverCacheKeys = [];

      // Find all keys related to this server
      for (const key of this.cache.keys()) {
        if (key.includes(serverId)) {
          serverCacheKeys.push(key);
        }
      }

      // Delete all found keys
      serverCacheKeys.forEach((key) => this.cache.delete(key));
      console.log(`[KnowledgeService] Cleared cache for server ${serverId} (${serverCacheKeys.length} entries)`);
    } else {
      // Clear all cache
      const count = this.cache.size;
      this.cache.clear();
      console.log(`[KnowledgeService] Cleared entire cache (${count} entries)`);
    }
  }

  /**
   * Get all knowledge documents for a server
   * @param {string} serverId - Discord server ID
   * @param {boolean} useCache - Whether to use cached data if available
   * @param {boolean} forceRefresh - Whether to force a cache refresh
   * @returns {Promise<Array>} - Array of knowledge documents
   */
  async getKnowledgeDocuments(serverId, useCache = true, forceRefresh = false) {
    // Check cache first, unless forcing refresh
    const cacheKey = `docs_${serverId}`;
    if (useCache && !forceRefresh && this.cache.has(cacheKey)) {
      const cachedData = this.cache.get(cacheKey);
      if (cachedData.expiry > Date.now()) {
        return cachedData.data;
      }
      // Cache expired, remove it
      this.cache.delete(cacheKey);
    }

    try {
      // Fetch all documents (paginated)
      let allDocuments = [];
      let page = 1;
      const pageSize = 50;
      let hasMorePages = true;

      while (hasMorePages) {
        const response = await apiService.getKnowledgeDocuments(serverId, {
          page,
          pageSize,
        });

        if (response && response.data && response.data.length > 0) {
          allDocuments = [...allDocuments, ...response.data];

          // Check if there are more pages
          hasMorePages = response.data.length === pageSize && response.total > page * pageSize;
          page++;
        } else {
          hasMorePages = false;
        }
      }

      // Store in cache
      this.cache.set(cacheKey, {
        data: allDocuments,
        expiry: Date.now() + this.cacheTTL,
      });

      return allDocuments;
    } catch (error) {
      console.error(`Error fetching knowledge documents for server ${serverId}:`, error);
      return [];
    }
  }

  /**
   * Get document content for a specific document
   * @param {string} serverId - Discord server ID
   * @param {string} documentId - Document ID
   * @param {boolean} forceRefresh - Whether to force a cache refresh
   * @returns {Promise<Object>} - Document with content
   */
  async getDocumentContent(serverId, documentId, forceRefresh = false) {
    const cacheKey = `doc_${serverId}_${documentId}`;

    if (!forceRefresh && this.cache.has(cacheKey)) {
      const cachedData = this.cache.get(cacheKey);
      if (cachedData.expiry > Date.now()) {
        return cachedData.data;
      }
      this.cache.delete(cacheKey);
    }

    try {
      const document = await apiService.getKnowledgeDocument(serverId, documentId);

      // Store in cache
      this.cache.set(cacheKey, {
        data: document,
        expiry: Date.now() + this.cacheTTL,
      });

      return document;
    } catch (error) {
      console.error(`Error fetching document content for ${documentId}:`, error);
      return null;
    }
  }

  /**
   * Find relevant documents for a query
   * This is a simple implementation that can be enhanced with more sophisticated
   * search/matching algorithms (like vector similarity) in the future
   *
   * @param {string} serverId - Discord server ID
   * @param {string} query - User query
   * @param {boolean} forceRefresh - Whether to force a cache refresh
   * @returns {Promise<Array>} - Array of relevant documents
   */
  async findRelevantDocuments(serverId, query, forceRefresh = false) {
    try {
      // Get all documents for the server
      const documents = await this.getKnowledgeDocuments(serverId, true, forceRefresh);

      if (!documents || documents.length === 0) {
        return [];
      }

      // Return all documents for the server instead of filtering
      // We still include a default score of 1.0 to maintain compatibility
      return documents.map((doc) => ({
        ...doc,
        score: 1.0,
      }));
    } catch (error) {
      console.error(`Error finding relevant documents for query "${query}":`, error);
      return [];
    }
  }

  /**
   * Prepare context for AI model based on user query
   * @param {string} serverId - Discord server ID
   * @param {string} query - User query
   * @param {boolean} forceRefresh - Whether to force a cache refresh
   * @returns {Promise<string>} - Context for AI model
   */
  async prepareContextForQuery(serverId, query, forceRefresh = false) {
    try {
      const relevantDocs = await this.findRelevantDocuments(serverId, query, forceRefresh);

      if (!relevantDocs || relevantDocs.length === 0) {
        return "";
      }

      // Fetch full content for each relevant document
      const docsWithContent = await Promise.all(
        relevantDocs.map(async (doc) => {
          const fullDoc = await this.getDocumentContent(serverId, doc.id, forceRefresh);
          return fullDoc;
        })
      );

      // Filter out null results and format as context
      const validDocs = docsWithContent.filter((doc) => doc !== null);

      if (validDocs.length === 0) {
        return "";
      }

      // Format documents as context
      const formattedContext = validDocs
        .map((doc) => {
          return `--- Document: ${doc.title} ---\n${doc.content}\n`;
        })
        .join("\n\n");

      return formattedContext;
    } catch (error) {
      console.error(`Error preparing context for query "${query}":`, error);
      return "";
    }
  }
}

// Singleton instance
const knowledgeService = new KnowledgeService();

// Export as ESM default
export default knowledgeService;
