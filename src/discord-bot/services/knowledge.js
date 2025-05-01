import apiService from "./api.js";

// Dla ESLint
/* global console */

class KnowledgeService {
  constructor() {
    this.cache = new Map(); // Simple in-memory cache
    this.cacheTTL = 5 * 60 * 1000; // 5 minutes in milliseconds
  }

  /**
   * Clear the cache for a specific server
   * @param {string} serverId - Discord server ID
   */
  clearCache(serverId) {
    this.cache.delete(serverId);
  }

  /**
   * Get all knowledge documents for a server
   * @param {string} serverId - Discord server ID
   * @param {boolean} useCache - Whether to use cached data if available
   * @returns {Promise<Array>} - Array of knowledge documents
   */
  async getKnowledgeDocuments(serverId, useCache = true) {
    // Check cache first
    const cacheKey = `docs_${serverId}`;
    if (useCache && this.cache.has(cacheKey)) {
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
   * @returns {Promise<Object>} - Document with content
   */
  async getDocumentContent(serverId, documentId) {
    const cacheKey = `doc_${serverId}_${documentId}`;

    if (this.cache.has(cacheKey)) {
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
   * @param {number} limit - Maximum number of documents to return
   * @returns {Promise<Array>} - Array of relevant documents
   */
  async findRelevantDocuments(serverId, query, limit = 3) {
    try {
      const documents = await this.getKnowledgeDocuments(serverId);

      if (!documents || documents.length === 0) {
        return [];
      }

      // Simple relevance search based on title
      // In a real implementation, this should be replaced with proper semantic search
      const queryTerms = query.toLowerCase().split(/\s+/);

      const scoredDocs = documents.map((doc) => {
        const titleTerms = doc.title.toLowerCase().split(/\s+/);

        // Simple score based on term overlap
        const matchCount = queryTerms.filter((term) =>
          titleTerms.some((titleTerm) => titleTerm.includes(term) || term.includes(titleTerm))
        ).length;

        const score = matchCount / queryTerms.length;

        return {
          document: doc,
          score,
        };
      });

      // Sort by score and take top matches
      const relevantDocs = scoredDocs
        .filter((doc) => doc.score > 0)
        .sort((a, b) => b.score - a.score)
        .slice(0, limit);

      // Include scores in the returned documents
      return relevantDocs.map((item) => ({
        ...item.document,
        score: item.score,
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
   * @returns {Promise<string>} - Context for AI model
   */
  async prepareContextForQuery(serverId, query) {
    try {
      const relevantDocs = await this.findRelevantDocuments(serverId, query);

      if (!relevantDocs || relevantDocs.length === 0) {
        return "";
      }

      // Fetch full content for each relevant document
      const docsWithContent = await Promise.all(
        relevantDocs.map(async (doc) => {
          const fullDoc = await this.getDocumentContent(serverId, doc.id);
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
