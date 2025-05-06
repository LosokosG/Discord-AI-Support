# API Endpoint Implementation Plan: Knowledge Documents API

## 1. Przegląd punktu końcowego

API Knowledge Documents umożliwia zarządzanie bazą wiedzy dla serwerów Discord. Pozwala na dodawanie, pobieranie, aktualizowanie i usuwanie dokumentów, które są wykorzystywane przez bota AI do odpowiadania na pytania użytkowników. Dokumenty mogą być przesyłane jako pliki lub treść tekstowa i są indeksowane w celu efektywnego wyszukiwania.

## 2. Szczegóły żądania

### GET `/servers/{id}/documents`

- Metoda HTTP: GET
- Parametry ścieżki:
  - `id` (string) - ID serwera Discord
- Parametry zapytania:
  - `page` (number) - numer strony, domyślnie `1`
  - `pageSize` (number) - elementów na stronę, domyślnie `20`, max `100`
  - `q` (string, opcjonalnie) - fraza wyszukiwania
  - `fileType` (string, opcjonalnie) - filtr typu pliku (`txt`, `md`, `pdf`)
- Nagłówki:
  - `Authorization: Bearer <jwt>`

### POST `/servers/{id}/documents`

- Metoda HTTP: POST
- Parametry ścieżki:
  - `id` (string) - ID serwera Discord
- Nagłówki:
  - `Authorization: Bearer <jwt>`
  - `Content-Type: multipart/form-data` lub `application/json`
- Body:
  - Multipart: `file` (plik do przesłania) + `title` (string)
  - JSON:
    ```json
    {
      "title": "string",
      "content": "string",
      "fileType": "string" // md, txt, pdf
    }
    ```

### GET `/servers/{id}/documents/{docId}`

- Metoda HTTP: GET
- Parametry ścieżki:
  - `id` (string) - ID serwera Discord
  - `docId` (string) - UUID dokumentu
- Nagłówki:
  - `Authorization: Bearer <jwt>`

### PATCH `/servers/{id}/documents/{docId}`

- Metoda HTTP: PATCH
- Parametry ścieżki:
  - `id` (string) - ID serwera Discord
  - `docId` (string) - UUID dokumentu
- Nagłówki:
  - `Authorization: Bearer <jwt>`
  - `Content-Type: application/json`
- Body:
  ```json
  {
    "title": "string", // opcjonalnie
    "content": "string" // opcjonalnie
  }
  ```

### DELETE `/servers/{id}/documents/{docId}`

- Metoda HTTP: DELETE
- Parametry ścieżki:
  - `id` (string) - ID serwera Discord
  - `docId` (string) - UUID dokumentu
- Nagłówki:
  - `Authorization: Bearer <jwt>`

### POST `/servers/{id}/documents/{docId}/reindex`

- Metoda HTTP: POST
- Parametry ścieżki:
  - `id` (string) - ID serwera Discord
  - `docId` (string) - UUID dokumentu
- Nagłówki:
  - `Authorization: Bearer <jwt>`

## 3. Wykorzystywane typy

- DTO zwracany: `KnowledgeDocument` i `DocumentList` (z `src/types.ts`)
- Command Models:
  - `UploadDocumentCommand` - dla POST
  - `UpdateDocumentCommand` - dla PATCH
- Źródłowa tabela DB: `knowledge_documents`

## 4. Szczegóły odpowiedzi

### GET `/servers/{id}/documents`

- 200 OK:
  ```json
  {
    "data": [
      {
        "id": "uuid",
        "title": "Getting Started",
        "fileType": "md",
        "createdAt": "2024-05-31T12:00:00Z",
        "updatedAt": "2024-05-31T12:01:00Z"
      }
    ],
    "page": 1,
    "pageSize": 20,
    "total": 37
  }
  ```
- 401 Unauthorized - brak/niepoprawny token
- 403 Forbidden - brak uprawnień do serwera
- 500 Internal Server Error

### POST `/servers/{id}/documents`

- 201 Created:
  ```json
  {
    "id": "uuid",
    "title": "Getting Started",
    "fileType": "md",
    "createdAt": "2024-05-31T12:00:00Z",
    "updatedAt": "2024-05-31T12:00:00Z"
  }
  ```
- 400 Bad Request - nieprawidłowe dane wejściowe
- 401 Unauthorized - brak/niepoprawny token
- 403 Forbidden - brak uprawnień do serwera
- 413 Payload Too Large - przekroczony limit rozmiaru pliku (10MB)
- 415 Unsupported Media Type - nieprawidłowy typ pliku
- 500 Internal Server Error

### GET `/servers/{id}/documents/{docId}`

- 200 OK:
  ```json
  {
    "id": "uuid",
    "title": "Getting Started",
    "fileType": "md",
    "content": "# Getting Started\n\nThis is a guide...",
    "createdAt": "2024-05-31T12:00:00Z",
    "updatedAt": "2024-05-31T12:01:00Z"
  }
  ```
- 401 Unauthorized - brak/niepoprawny token
- 403 Forbidden - brak uprawnień do serwera
- 404 Not Found - dokument nie istnieje
- 500 Internal Server Error

### PATCH `/servers/{id}/documents/{docId}`

- 200 OK:
  ```json
  {
    "id": "uuid",
    "title": "Updated Title",
    "fileType": "md",
    "createdAt": "2024-05-31T12:00:00Z",
    "updatedAt": "2024-05-31T12:30:00Z"
  }
  ```
- 400 Bad Request - nieprawidłowe dane wejściowe
- 401 Unauthorized - brak/niepoprawny token
- 403 Forbidden - brak uprawnień do serwera
- 404 Not Found - dokument nie istnieje
- 500 Internal Server Error

### DELETE `/servers/{id}/documents/{docId}`

- 204 No Content - pomyślne usunięcie
- 401 Unauthorized - brak/niepoprawny token
- 403 Forbidden - brak uprawnień do serwera
- 404 Not Found - dokument nie istnieje
- 500 Internal Server Error

### POST `/servers/{id}/documents/{docId}/reindex`

- 200 OK:
  ```json
  {
    "id": "uuid",
    "status": "reindexing"
  }
  ```
- 401 Unauthorized - brak/niepoprawny token
- 403 Forbidden - brak uprawnień do serwera
- 404 Not Found - dokument nie istnieje
- 500 Internal Server Error

## 5. Przepływ danych

### 1. Wspólne dla wszystkich endpointów

- **Autentykacja**: Supabase Auth weryfikuje JWT i udostępnia `locals.supabase`
- **Walidacja parametrów**: Wykorzystanie `zod` do walidacji parametrów ścieżki/zapytania/body

### 2. GET `/servers/{id}/documents`

1. Walidacja parametrów ścieżki i query
2. Wywołanie serwisu `documentsService.listDocuments`

   ```typescript
   async function listDocuments({ serverId, page, pageSize, q, fileType }, supabaseClient) {
     let query = supabaseClient
       .from("knowledge_documents")
       .select("id, title, file_type, created_at, updated_at", { count: "exact" })
       .eq("server_id", serverId)
       .range((page - 1) * pageSize, page * pageSize - 1);

     if (q) {
       query = query.textSearch("content_vector", q);
     }

     if (fileType) {
       query = query.eq("file_type", fileType);
     }

     const { data, count, error } = await query;

     if (error) throw error;

     return {
       data: mapToKnowledgeDocuments(data),
       page,
       pageSize,
       total: count || 0,
     };
   }
   ```

3. Mapowanie wyników DB na DTO i zwrot odpowiedzi

### 3. POST `/servers/{id}/documents`

1. Walidacja parametrów ścieżki
2. Wykrycie typu zawartości (multipart vs. JSON)
3. Walidacja body
4. Dla multipart: przetworzenie pliku i ekstrakcja tekstu (dla PDF)
5. Wywołanie serwisu `documentsService.createDocument`

   ```typescript
   async function createDocument(serverId, data, createdBy, supabaseClient) {
     // Dla uploads plików PDF - obsługa storage
     let storagePath = null;
     if (data.fileType === "pdf" && data.file) {
       const filePath = `documents/${serverId}/${uuidv4()}.pdf`;
       const { error: uploadError } = await supabaseClient.storage.from("documents").upload(filePath, data.file);

       if (uploadError) throw uploadError;
       storagePath = filePath;
     }

     const { data: document, error } = await supabaseClient
       .from("knowledge_documents")
       .insert({
         server_id: serverId,
         title: data.title,
         content: data.content,
         file_type: data.fileType,
         storage_path: storagePath,
         created_by: createdBy,
       })
       .select()
       .single();

     if (error) throw error;

     return mapToKnowledgeDocument(document);
   }
   ```

6. Zwrot nowo utworzonego dokumentu

### 4. GET `/servers/{id}/documents/{docId}`

1. Walidacja parametrów ścieżki
2. Wywołanie serwisu `documentsService.getDocumentById`

   ```typescript
   async function getDocumentById(serverId, docId, supabaseClient) {
     const { data, error } = await supabaseClient
       .from("knowledge_documents")
       .select("*")
       .eq("server_id", serverId)
       .eq("id", docId)
       .single();

     if (error) {
       if (error.code === "PGRST116") throw new NotFoundError("Document not found");
       throw error;
     }

     // Dla PDF, dołącz URL dla pobrania
     let documentWithContent = { ...data };
     if (data.storage_path) {
       const { data: signedURL } = await supabaseClient.storage
         .from("documents")
         .createSignedUrl(data.storage_path, 3600); // 1 godzina

       documentWithContent.downloadUrl = signedURL;
     }

     return mapToKnowledgeDocumentWithContent(documentWithContent);
   }
   ```

3. Zwrot dokumentu lub błędu 404

### 5. PATCH `/servers/{id}/documents/{docId}`

1. Walidacja parametrów ścieżki i body
2. Wywołanie serwisu `documentsService.updateDocument`

   ```typescript
   async function updateDocument(serverId, docId, data, supabaseClient) {
     const { data: document, error } = await supabaseClient
       .from("knowledge_documents")
       .update({
         title: data.title,
         content: data.content,
       })
       .eq("server_id", serverId)
       .eq("id", docId)
       .select()
       .single();

     if (error) {
       if (error.code === "PGRST116") throw new NotFoundError("Document not found");
       throw error;
     }

     return mapToKnowledgeDocument(document);
   }
   ```

3. Zwrot zaktualizowanego dokumentu

### 6. DELETE `/servers/{id}/documents/{docId}`

1. Walidacja parametrów ścieżki
2. Wywołanie serwisu `documentsService.deleteDocument`

   ```typescript
   async function deleteDocument(serverId, docId, supabaseClient) {
     // Pobranie informacji o dokumencie
     const { data: document, error: fetchError } = await supabaseClient
       .from("knowledge_documents")
       .select("storage_path")
       .eq("server_id", serverId)
       .eq("id", docId)
       .single();

     if (fetchError) {
       if (fetchError.code === "PGRST116") throw new NotFoundError("Document not found");
       throw fetchError;
     }

     // Usunięcie pliku ze storage (jeśli istnieje)
     if (document.storage_path) {
       await supabaseClient.storage.from("documents").remove([document.storage_path]);
     }

     // Usunięcie rekordu
     const { error } = await supabaseClient
       .from("knowledge_documents")
       .delete()
       .eq("server_id", serverId)
       .eq("id", docId);

     if (error) throw error;
   }
   ```

3. Zwrot statusu 204 No Content

### 7. POST `/servers/{id}/documents/{docId}/reindex`

1. Walidacja parametrów ścieżki
2. Wywołanie serwisu `documentsService.reindexDocument`

   ```typescript
   async function reindexDocument(serverId, docId, supabaseClient) {
     // Sprawdzenie czy dokument istnieje
     const { data, error } = await supabaseClient
       .from("knowledge_documents")
       .select("id")
       .eq("server_id", serverId)
       .eq("id", docId)
       .single();

     if (error) {
       if (error.code === "PGRST116") throw new NotFoundError("Document not found");
       throw error;
     }

     // Wywołanie funkcji NOTIFY w PostgreSQL do triggerowania reindeksacji
     await supabaseClient.rpc("notify_document_reindex", {
       doc_id: docId,
       server_id: serverId,
     });

     return { id: docId, status: "reindexing" };
   }
   ```

3. Zwrot statusu 200 OK z informacją o rozpoczęciu reindeksacji

## 6. Względy bezpieczeństwa

1. **Autentykacja**:
   - Wymagany ważny JWT token dla wszystkich operacji
   - Supabase Auth weryfikuje tokeny
2. **Autoryzacja**:
   - Row Level Security (RLS) w Supabase zapewnia, że użytkownicy mogą uzyskać dostęp tylko do dokumentów z serwerów, których są administratorami
   - Policies zdefiniowane w schemacie bazy danych (`knowledge_document_*_policy`)
3. **Walidacja danych wejściowych**:
   - Wszystkie parametry ścieżki, zapytania i dane body są walidowane przez Zod
   - Tylko dozwolone typy plików (`txt`, `md`, `pdf`) są akceptowane
4. **Kontrola wielkości plików**:
   - Limit rozmiaru plików: 10MB
5. **Rate Limiting**:
   - Maksymalnie 60 żądań/minutę na użytkownika
6. **CORS**:
   - Polityka CORS ogranicza dostęp tylko do zaufanych domen

## 7. Obsługa błędów

1. **Kody błędów**:
   - 400 Bad Request: Nieprawidłowe dane wejściowe, nieprawidłowy format
   - 401 Unauthorized: Brak lub nieprawidłowy token JWT
   - 403 Forbidden: Brak uprawnień administratora serwera
   - 404 Not Found: Serwer lub dokument nie istnieje
   - 413 Payload Too Large: Przekroczony limit rozmiaru pliku
   - 415 Unsupported Media Type: Nieprawidłowy typ pliku
   - 429 Too Many Requests: Przekroczenie limitu żądań
   - 500 Internal Server Error: Nieoczekiwany błąd serwera
2. **Struktura odpowiedzi błędu**:
   ```json
   {
     "error": {
       "code": 400,
       "message": "Validation failed",
       "details": [{ "field": "title", "message": "Title is required" }]
     }
   }
   ```
3. **Logowanie błędów**:
   - Wszystkie błędy logowane z poziomem ważności, kodem i danymi kontekstowymi
   - Wrażliwe dane użytkownika są usuwane przed logowaniem

## 8. Rozważania dotyczące wydajności

1. **Indeksowanie**:
   - Wykorzystanie `tsvector` w PostgreSQL dla efektywnego wyszukiwania pełnotekstowego
   - Optymalizacja indeksów: `knowledge_documents_content_vector_idx` i `knowledge_documents_server_id_idx`
2. **Paginacja**:
   - Wszystkie endpointy list wykorzystują paginację (domyślnie 20, max 100)
3. **Supabase Storage**:
   - Pliki PDF przechowywane w Supabase Storage
   - Podpisane URL dla pobrania z ograniczonym czasem ważności (1 godzina)
4. **Cachowanie**:
   - Dodanie odpowiednich nagłówków cache dla odpowiedzi GET
   - Opcjonalnie implementacja ETag dla GET `/servers/{id}/documents/{docId}`
5. **Kompresja**:
   - Wykorzystanie kompresji gzip dla odpowiedzi API

## 9. Kroki wdrożenia

### 1. Przygotowanie usługi `DocumentService`

1. Utworzyć plik `src/lib/services/documents.ts`
2. Zaimplementować funkcje servisowe:
   - `listDocuments`
   - `getDocumentById`
   - `createDocument`
   - `updateDocument`
   - `deleteDocument`
   - `reindexDocument`

### 2. Implementacja endpointu GET `/servers/{id}/documents`

1. Utworzyć plik `src/pages/api/servers/[id]/documents/index.ts`
2. Dodać `export const prerender = false`
3. Zaimplementować handler `export const GET`:
   - Walidacja parametrów ścieżki i zapytania
   - Wywołanie `documentsService.listDocuments`
   - Formatowanie odpowiedzi

### 3. Implementacja endpointu POST `/servers/{id}/documents`

1. W pliku `src/pages/api/servers/[id]/documents/index.ts`:
2. Zaimplementować handler `export const POST`:
   - Wykrycie typu zawartości (multipart vs. JSON)
   - Walidacja ciała żądania
   - Przetwarzanie plików (dla multipart)
   - Wywołanie `documentsService.createDocument`
   - Zwrot odpowiedzi 201 Created

### 4. Implementacja endpointu GET `/servers/{id}/documents/{docId}`

1. Utworzyć plik `src/pages/api/servers/[id]/documents/[docId].ts`
2. Dodać `export const prerender = false`
3. Zaimplementować handler `export const GET`:
   - Walidacja parametrów ścieżki
   - Wywołanie `documentsService.getDocumentById`
   - Formatowanie odpowiedzi

### 5. Implementacja endpointu PATCH `/servers/{id}/documents/{docId}`

1. W pliku `src/pages/api/servers/[id]/documents/[docId].ts`:
2. Zaimplementować handler `export const PATCH`:
   - Walidacja parametrów ścieżki i body
   - Wywołanie `documentsService.updateDocument`
   - Formatowanie odpowiedzi

### 6. Implementacja endpointu DELETE `/servers/{id}/documents/{docId}`

1. W pliku `src/pages/api/servers/[id]/documents/[docId].ts`:
2. Zaimplementować handler `export const DELETE`:
   - Walidacja parametrów ścieżki
   - Wywołanie `documentsService.deleteDocument`
   - Zwrot statusu 204 No Content

### 7. Implementacja endpointu POST `/servers/{id}/documents/{docId}/reindex`

1. Utworzyć plik `src/pages/api/servers/[id]/documents/[docId]/reindex.ts`
2. Dodać `export const prerender = false`
3. Zaimplementować handler `export const POST`:
   - Walidacja parametrów ścieżki
   - Wywołanie `documentsService.reindexDocument`
   - Formatowanie odpowiedzi

### 8. Utworzenie schematów walidacji Zod

1. Utworzyć pliki z schematami Zod dla walidacji wszystkich zapytań:
   - `DocumentQuerySchema` dla parametrów zapytania
   - `UploadDocumentSchema` dla ciała żądania POST
   - `UpdateDocumentSchema` dla ciała żądania PATCH

### 9. Dodanie funkcji pomocniczej do obsługi multipart/form-data

1. Implementacja parseMultipartFormData do obsługi przesyłania plików

### 10. Dodanie funkcji RPC w PostgreSQL

1. Utworzyć funkcję `notify_document_reindex` w Supabase SQL Editor:
   ```sql
   CREATE OR REPLACE FUNCTION public.notify_document_reindex(doc_id uuid, server_id bigint)
   RETURNS void AS $$
   BEGIN
     PERFORM pg_notify('document_reindex', json_build_object(
       'document_id', doc_id,
       'server_id', server_id
     )::text);
   END;
   $$ LANGUAGE plpgsql;
   ```

### 11. Testowanie

1. Napisać testy jednostkowe dla DocumentService
2. Napisać testy integracyjne dla endpoints
3. Przetestować wydajność i obsługę błędów

### 12. Aktualizacja dokumentacji OpenAPI

1. Dodać adnotacje Zod dla generowania OpenAPI
2. Zaktualizować specyfikację API
