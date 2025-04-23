# REST API Plan

## Overview

This API plan focuses exclusively on endpoints that require custom implementation beyond what is automatically provided by Supabase and DiscordJS. Most standard CRUD operations are already handled by Supabase's auto-generated REST API, while Discord interactions are managed through DiscordJS.

## 1. Resources

The main resources are already defined in database tables and managed by Supabase:
- Users
- Servers
- Server Admins
- Knowledge Documents
- Conversations
- Forwarded Tickets
- Shards
- Server Shards
- Billing Plans
- Subscriptions
- Invoices
- Analytics

## 2. Custom API Endpoints

### 2.1 Knowledge Base Document Import

- **Method**: POST
- **Path**: `/api/knowledge-documents/import`
- **Description**: Processes and imports documents into the knowledge base
- **Request Body**: multipart/form-data with file upload
- **Response**:
  ```json
  {
    "documentId": "uuid-of-document",
    "title": "Imported Document Title",
    "status": "success",
    "processingDetails": {
      "wordCount": 2500,
      "fileType": "pdf",
      "extractedSections": 15
    }
  }
  ```
- **Success Codes**: 201 Created
- **Error Codes**: 400 Bad Request, 413 Payload Too Large, 415 Unsupported Media Type, 500 Internal Server Error

## 3. Authentication and Authorization

Authentication and authorization are handled by Supabase:
- Discord OAuth integration for user authentication
- Row Level Security (RLS) policies for data access control
- JWT tokens for API authorization

## 4. Validation and Business Logic

### 4.1 Knowledge Document Import
- Validates file type (txt, md, pdf only)
- Enforces file size limits
- Extracts and processes text content
- Creates appropriate vector embeddings for search
- Updates document metadata

## 5. Implementation Notes

### 5.1 Technologies Used
- Astro API routes for implementing these endpoints
- Supabase for data storage and basic CRUD operations
- OpenRouter.ai for AI processing (directly accessed from the Discord bot)
- DiscordJS for bot interactions

### 5.2 When to Use These Custom Endpoints

The Knowledge Base Document Import endpoint is necessary because:
1. It requires complex file processing (especially for PDFs)
2. It needs to extract and process text content
3. It creates vector embeddings for efficient searching
4. These operations exceed what can be easily done with Supabase alone

### 5.3 Direct API Usage

For AI processing, the Discord bot will directly utilize the OpenRouter.ai API rather than going through a custom intermediate endpoint. This approach:
1. Reduces architectural complexity
2. Eliminates an unnecessary network hop
3. Simplifies the implementation
4. Makes the bot more responsive

### 5.4 Supabase Usage

All other functionality is handled through Supabase's:
1. Auto-generated REST API for CRUD operations
2. PostgreSQL triggers for real-time updates (like config changes)
3. Row Level Security policies for access control
4. Authentication system for Discord OAuth
