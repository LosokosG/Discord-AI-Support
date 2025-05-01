import type { Server, ServerList, ServerDetail, DocumentList, ErrorResponse } from "@/types";

/**
 * API Client for frontend usage
 * Provides methods to fetch data from the API
 */
class ApiClient {
  private baseUrl: string;

  constructor() {
    this.baseUrl = import.meta.env.PUBLIC_API_URL || "/api";
  }

  /**
   * Gets the full URL including base URL and origin
   */
  private getFullUrl(path: string): string {
    // For server-side rendering, we need to use an absolute URL
    if (typeof window === "undefined") {
      // For SSR, use the Astro site URL environment variable
      const siteUrl = import.meta.env.SITE || "http://localhost:4321";
      // Ensure baseUrl has a leading slash but no trailing slash
      const base = this.baseUrl.startsWith("/") ? this.baseUrl : `/${this.baseUrl}`;
      return `${siteUrl}${base}${path.startsWith("/") ? path : `/${path}`}`;
    }
    // For client-side, relative URLs work fine
    return `${this.baseUrl}${path.startsWith("/") ? path : `/${path}`}`;
  }

  /**
   * Handles API response and error parsing
   */
  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      let errorData: ErrorResponse;
      try {
        errorData = await response.json();
      } catch {
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }

      throw new Error(errorData.error.message || `API Error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Fetches a list of servers
   */
  async getServers(page = 1, pageSize = 10, query?: string): Promise<ServerList> {
    const params = new URLSearchParams();
    params.append("page", page.toString());
    params.append("pageSize", pageSize.toString());

    if (query) {
      params.append("q", query);
    }

    console.log("Fetching servers from URL:", this.getFullUrl(`servers?${params.toString()}`));
    const response = await fetch(this.getFullUrl(`servers?${params.toString()}`));
    return this.handleResponse<ServerList>(response);
  }

  /**
   * Fetches a single server by ID
   */
  async getServer(id: string): Promise<ServerDetail> {
    const response = await fetch(this.getFullUrl(`servers/${id}`));
    return this.handleResponse<ServerDetail>(response);
  }

  /**
   * Fetches documents for a server
   */
  async getDocuments(serverId: string, page = 1, pageSize = 10): Promise<DocumentList> {
    const params = new URLSearchParams();
    params.append("page", page.toString());
    params.append("pageSize", pageSize.toString());

    const response = await fetch(this.getFullUrl(`servers/${serverId}/documents?${params.toString()}`));
    return this.handleResponse<DocumentList>(response);
  }

  /**
   * Updates server settings
   */
  async updateServer(
    id: string,
    data: { name?: string; active?: boolean; config?: Record<string, unknown> }
  ): Promise<Server> {
    const response = await fetch(this.getFullUrl(`servers/${id}`), {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    return this.handleResponse<Server>(response);
  }
}

// Export a singleton instance
export const apiClient = new ApiClient();
