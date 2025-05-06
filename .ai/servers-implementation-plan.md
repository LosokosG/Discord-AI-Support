# API Endpoint Implementation Plan: GET /servers

## 1. Przegląd punktu końcowego

GET `/servers` zwraca paginowaną listę serwerów (guildów), nad którymi uwierzytelniony użytkownik ma prawa administratora.

## 2. Szczegóły żądania

- Metoda HTTP: GET
- Ścieżka: `/servers`
- Nagłówki:
  - `Authorization: Bearer <jwt>`
- Parametry zapytania:
  - `page` (number) – numer strony, domyślnie `1`.
  - `pageSize` (number) – liczba rekordów na stronę, domyślnie `20`, max `100`.
  - `q` (string) – opcjonalny filtr po nazwie serwera (partial match).
- Body: brak.

## 3. Wykorzystywane typy

- DTO zwracany: `ServerList` (alias `PaginatedResponse<Server>`).
- Typ elementu listy: `Server` (z `src/types.ts`).
- Kontekst uwierzytelnionego użytkownika: `User` dostępny w `context.locals`.

## 4. Szczegóły odpowiedzi

- 200 OK – struktura:
  ```json
  {
    "data": [
      {
        "id": "123456789",
        "name": "Acme Guild",
        "iconUrl": "https://...",
        "active": true,
        "config": {
          /* JSON: enabled, language, systemPrompt, … */
        }
      }
    ],
    "page": 1,
    "pageSize": 20,
    "total": 37
  }
  ```
- 401 Unauthorized – brak lub nieważny token.
- 400 Bad Request – nieprawidłowe parametry query.
- 500 Internal Server Error – nieoczekiwany błąd serwera.

## 5. Przepływ danych

1. **Autoryzacja** – Supabase Auth weryfikuje JWT i udostępnia `locals.supabase`; RLS na tabeli `servers` gwarantuje widoczność tylko dozwolonych rekordów.
2. **Parsowanie i walidacja** – odczyt `page`, `pageSize`, `q` i walidacja pustych lub niepoprawnych wartości (`zod` lub ręcznie).
3. **Serwis** (`src/lib/services/servers.ts`):
   - `listServers({ page, pageSize, q }, supabaseClient)`:
     - `.from('servers').select('*', { count: 'exact' })`
     - `.ilike('name', `%${q}%`)` jeśli `q` jest obecne.
     - `.range((page-1)*pageSize, page*pageSize - 1)`
4. **Mapowanie odpowiedzi** – `data` i `count` → `ServerList`.
5. **Odpowiedź** – `return new Response(JSON.stringify({...}), { status: 200 })`.

## 6. Względy bezpieczeństwa

- Wymagane `Authorization` z ważnym JWT.
- RLS w Supabase wymusza selekcję tylko uprawnionych rekordów.
- Ograniczenie liczby zapytań (rate limiting): 60 req/min na użytkownika.

## 7. Obsługa błędów

- 401 – brak lub niepoprawny token.
- 400 – nieprawidłowe parametry (np. `page` < 1 lub `pageSize` > 100).
- 500 – błąd komunikacji z Supabase lub wewnętrzny wyjątek.
- Wszystkie błędy logować przez centralny logger.

## 8. Rozważania dotyczące wydajności

- Indeks na `servers.id` i RLS.
- Użycie paginacji i ograniczenie `pageSize`.
- Kompresja gzip (Astro automatycznie).

## 9. Kroki wdrożenia

1. Utworzyć plik `src/pages/api/servers/index.ts` i zadeklarować `export const GET` oraz `export const prerender = false`.
2. Dodać walidację parametrów query (`zod` lub manualnie) na początku handlera.
3. Wydzielić logikę do funkcji `listServers` w `src/lib/services/servers.ts`.
4. Obsłużyć błędy Supabase i mapować je na odpowiednie kody.
5. Napisać testy jednostkowe (mock Supabase) i integracyjne (end-to-end).
6. Uzupełnić dokumentację OpenAPI (np. `zod-to-openapi`).
7. Przeprowadzić code review i merge.

---

# API Endpoint Implementation Plan: POST /servers

## 1. Przegląd punktu końcowego

POST `/servers` rejestruje nowy serwer (guild) w systemie oraz ustawia jego wstępną konfigurację.

## 2. Szczegóły żądania

- Metoda HTTP: POST
- Ścieżka: `/servers`
- Nagłówki:
  - `Authorization: Bearer <jwt>`
  - `Content-Type: application/json`
- Body (JSON):
  ```json
  {
    "id": "123456789", // Discord guild ID (BIGINT jako string)
    "name": "Acme Guild", // nazwa serwera
    "iconUrl": "https://...", // opcjonalnie
    "config": {
      /* JSONB initial config */
    } // opcjonalnie
  }
  ```

## 3. Wykorzystywane typy

- Command: `CreateServerCommand` (z `src/types.ts`).
- DTO: `Server` (z `src/types.ts`).

## 4. Szczegóły odpowiedzi

- 201 Created – zwraca obiekt `Server`:
  ```json
  {
    "id": "123456789",
    "name": "Acme Guild",
    "iconUrl": "https://...",
    "active": true,
    "config": {
      /* JSONB */
    }
  }
  ```
- 400 Bad Request – nieprawidłowa treść żądania (szczegóły walidacji).
- 401 Unauthorized – brak/niepoprawny token.
- 409 Conflict – serwer o danym `id` już istnieje.
- 500 Internal Server Error – nieoczekiwany błąd.

## 5. Przepływ danych

1. **Autoryzacja** – Supabase Auth w `locals` weryfikuje JWT.
2. **Walidacja** – `zod`:
   - `id`: `z.string().regex(/^\d+$/)`.
   - `name`: `z.string().min(1)`.
   - `iconUrl`: `z.string().url().optional()`.
   - `config`: `z.record(z.any()).optional()`.
3. **Serwis** (`src/lib/services/servers.ts`):
   - `getServerById(id)` → jeśli istnieje, throw `ConflictError`.
   - `insertServer(command)` → wstawienie do `servers`.
4. **Odpowiedź** – zwrócić nowo utworzony rekord ze statusem 201.

## 6. Względy bezpieczeństwa

- Weryfikacja JWT i RLS (uprawnienia do insert).
- Walidacja danych wejściowych (`zod`).
- Constraint unikalności `servers.id` w DB.

## 7. Obsługa błędów

- 400 – błędy walidacji Zod (zwrócić `details`).
- 401 – brak/niepoprawny token.
- 409 – duplikacja `id` (mapować błąd DB lub ręcznie sprawdzać przed insert).
- 500 – nieoczekiwane wyjątki (logi).

## 8. Rozważania dotyczące wydajności

- Pojedyncze wstawienie małej wagi.
- Możliwość transakcji, jeśli w przyszłości rozszerzymy logikę (np. shard assignment).

## 9. Kroki wdrożenia

1. W `src/pages/api/servers/index.ts` dodać `export const POST` i `export const prerender = false`.
2. Zdefiniować `CreateServerSchema` (Zod) i parsować `await request.json()`.
3. Wydzielić logikę do `createServer` w `src/lib/services/servers.ts`.
4. Obsłużyć przyciski błędów: walidacja, conflict, supabase.
5. Napisać testy (unit i integration).
6. Uzupełnić dokumentację OpenAPI (zod-to-openapi).
7. Code review, merge, deploy.

# API Endpoint Implementation Plan: GET /servers/{id}

## 1. Przegląd punktu końcowego

GET `/servers/{id}` zwraca szczegółowe informacje o pojedynczym serwerze (guild) wraz z metadanymi i konfiguracją.

## 2. Szczegóły żądania

- Metoda HTTP: GET
- Ścieżka: `/servers/{id}`
- Nagłówki:
  - `Authorization: Bearer <jwt>`
- Parametry ścieżki:
  - `id` (string) – Discord guild ID (BIGINT jako string).
- Body: brak.

## 3. Wykorzystywane typy

- DTO zwracany: `ServerDetail` (z `src/types.ts`).
- Parametry ścieżki: `string`.

## 4. Szczegóły odpowiedzi

- 200 OK – obiekt `ServerDetail`:
  ```json
  {
    "id": "123456789",
    "name": "Acme Guild",
    "iconUrl": "https://...",
    "active": true,
    "config": {
      /* ... */
    },
    "createdAt": "2024-...",
    "updatedAt": "2024-...",
    "planId": "..."
  }
  ```
- 401 Unauthorized – brak/niepoprawny token.
- 403 Forbidden – brak uprawnień (RLS).
- 404 Not Found – serwer o podanym `id` nie istnieje lub brak dostępu.
- 500 Internal Server Error – nieoczekiwany błąd.

## 5. Przepływ danych

1. **Autoryzacja** – Supabase Auth weryfikacja JWT, `locals.supabase`.
2. **Walidacja** – `zod`:
   - `id`: `z.string().regex(/^\d+$/)`.
3. **Serwis** (`src/lib/services/servers.ts`):
   - `getServerDetail(id, supabaseClient)`:
     - `.from('servers').select('*').eq('id', id).single()`
   - Jeśli brak wyniku → `NotFoundError`.
4. **Mapowanie** – wynik → `ServerDetail`.
5. **Odpowiedź** – `Response(..., { status: 200 })`.

## 6. Względy bezpieczeństwa

- RLS w Supabase zapewnia, że tylko administratorzy widzą rekord.
- Token musi być ważny i nie wygasły.

## 7. Obsługa błędów

- 401, 403, 404, 500 – odpowiednie kody i komunikaty.
- Logowanie błędów w centralnym loggerze.

## 8. Rozważania wydajności

- Zapytanie po kluczu głównym (indeks).
- Ewentualne cache na poziomie CDN lub warstwy aplikacji.

## 9. Kroki wdrożenia

1. Utworzyć lub otworzyć `src/pages/api/servers/[id].ts`.
2. Zadeklarować `export const GET` i `export const prerender = false`.
3. Dodać walidację `id` oraz fetch w serwisie.
4. Mapować odpowiedzi i obsłużyć wyjątki.
5. Napisać testy jednostkowe i integracyjne.
6. Zaktualizować specyfikację OpenAPI.

# API Endpoint Implementation Plan: PATCH /servers/{id}

## 1. Przegląd punktu końcowego

PATCH `/servers/{id}` umożliwia aktualizację pól: `name`, `iconUrl`, `config`, `active` dla istniejącego serwera.

## 2. Szczegóły żądania

- Metoda HTTP: PATCH
- Ścieżka: `/servers/{id}`
- Nagłówki:
  - `Authorization: Bearer <jwt>`
  - `Content-Type: application/json`
- Parametry ścieżki:
  - `id` (string) – Discord guild ID.
- Body:
  ```json
  {
    "name"?: "Nowa nazwa guild",
    "iconUrl"?: "https://...",
    "config"?: { /* JSONB */ },
    "active"?: true|false
  }
  ```

## 3. Wykorzystywane typy

- Command: `UpdateServerCommand` (z `src/types.ts`).
- DTO: `Server`.

## 4. Szczegóły odpowiedzi

- 200 OK – zaktualizowany obiekt `Server`.
- 400 Bad Request – błędy walidacji.
- 401 Unauthorized – brak/niepoprawny token.
- 403 Forbidden – brak uprawnień.
- 404 Not Found – serwer nie istnieje.
- 500 Internal Server Error.

## 5. Przepływ danych

1. **Autoryzacja** – weryfikacja JWT i RLS update policy.
2. **Walidacja** – `zod` schema dla ciała i `id`.
3. **Serwis** (`src/lib/services/servers.ts`):
   - `updateServer(id, command, supabaseClient)`:
     - `.from('servers').update(command).eq('id', id).select().single()`
   - Jeśli brak wyniku → `NotFoundError`.
4. **Triggery** – DB wyśle `NOTIFY` przy zmianie `config`.
5. **Odpowiedź** – zwrócić `Response(..., { status: 200 })`.

## 6. Względy bezpieczeństwa

- RLS update policy.
- Walidacja danych.

## 7. Obsługa błędów

- 400, 401, 403, 404, 500.
- Logować szczegóły w loggerze.

## 8. Rozważania wydajności

- Zmiana pojedynczego rekordu.

## 9. Kroki wdrożenia

1. W `src/pages/api/servers/[id].ts` dodać sekcję `export const PATCH`.
2. Zaimplementować walidację Zod.
3. Wywołać `updateServer` ze `supabaseClient`.
4. Obsłużyć błędy i statusy.
5. Testy i dokumentacja.

# API Endpoint Implementation Plan: DELETE /servers/{id}

## 1. Przegląd punktu końcowego

DELETE `/servers/{id}` dezaktywuje serwer, ustawiając `active` na `false` (soft delete).

## 2. Szczegóły żądania

- Metoda HTTP: DELETE
- Ścieżka: `/servers/{id}`
- Nagłówki:
  - `Authorization: Bearer <jwt>`
- Parametry ścieżki:
  - `id` (string) – Discord guild ID.
- Body: brak.

## 3. Wykorzystywane typy

- Command: `UpdateServerCommand` (tylko `active: false`).

## 4. Szczegóły odpowiedzi

- 204 No Content – pomyślna dezaktywacja.
- 401 Unauthorized.
- 403 Forbidden.
- 404 Not Found.
- 500 Internal Server Error.

## 5. Przepływ danych

1. **Autoryzacja** i RLS.
2. **Walidacja** `id`.
3. **Serwis**: `deactivateServer(id, supabaseClient)`:
   - `.from('servers').update({ active: false }).eq('id', id).single()`
   - Jeśli brak wyniku → `NotFoundError`.
4. **Odpowiedź** – zwrócić `Response(null, { status: 204 })`.

## 6. Względy bezpieczeństwa

- RLS update policy.

## 7. Obsługa błędów

- 401, 403, 404, 500.

## 8. Rozważania wydajności

- Jedna operacja update.

## 9. Kroki wdrożenia

1. W `src/pages/api/servers/[id].ts` dopisać `export const DELETE`.
2. Walidacja i serwis.
3. Testy jednostkowe i integracyjne.
4. Aktualizacja dokumentacji.
