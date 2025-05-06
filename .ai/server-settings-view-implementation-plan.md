# Plan implementacji widoku: Ustawienia Serwera

## 1. Przegląd

Widok "Ustawienia Serwera" pozwala administratorom serwera Discord konfigurować parametry bota AI Support dla wybranego serwera. Obejmuje to włączanie/wyłączanie bota, ustawianie języka, definiowanie instrukcji dla AI, wybór kanałów do monitorowania, określanie roli wsparcia oraz konfigurację limitów wiadomości. Zmiany są zapisywane poprzez API i odzwierciedlane w zachowaniu bota.

## 2. Routing widoku

Widok powinien być dostępny pod ścieżką: `/servers/:id/settings`, gdzie `:id` to identyfikator (Discord Guild ID) serwera.

## 3. Struktura komponentów

```
ServerSettingsView
├── ServerSettingsHeader (Nazwa serwera, ikona, przyciski akcji)
├── ServerSettingsForm (Formularz z polami konfiguracyjnymi)
│   ├── Switch (enabled)
│   ├── Select (language)
│   ├── Textarea (systemPrompt)
│   ├── MultiSelect (channels)
│   ├── Select (support_role_id)
│   ├── InputNumber (maxMessagesPerUser)
│   ├── InputNumber (maxTextLength)
│   └── Button (Zapisz)
└── Toaster (Do wyświetlania powiadomień o sukcesie/błędzie)
```

## 4. Szczegóły komponentów

### `ServerSettingsView`

- **Opis komponentu:** Główny kontener widoku ustawień serwera. Odpowiada za pobranie danych serwera, zarządzanie stanem formularza i komunikację z API.
- **Główne elementy:** Komponenty `ServerSettingsHeader` i `ServerSettingsForm`.
- **Obsługiwane interakcje:** Ładowanie danych przy montowaniu, obsługa zapisu formularza.
- **Obsługiwana walidacja:** Brak bezpośredniej walidacji, delegowana do `ServerSettingsForm`.
- **Typy:** `ServerDetail`, `ServerSettingsViewModel`.
- **Propsy:** Brak (pobiera `id` serwera z parametrów ścieżki).

### `ServerSettingsHeader`

- **Opis komponentu:** Wyświetla nazwę i ikonę serwera oraz przyciski akcji (Aktywuj/Deaktywuj, Odśwież konfigurację).
- **Główne elementy:** `div`, `img` (ikona), `h2` (nazwa), `Button` (shadcn/ui).
- **Obsługiwane interakcje:** Kliknięcie przycisków Aktywuj/Deaktywuj/Odśwież.
- **Obsługiwana walidacja:** Brak.
- **Typy:** `ServerDetail`.
- **Propsy:**
  - `server: ServerDetail` - Aktualne dane serwera.
  - `onActivate: () => Promise<void>` - Funkcja wywoływana po kliknięciu "Aktywuj".
  - `onDeactivate: () => Promise<void>` - Funkcja wywoływana po kliknięciu "Deaktywuj".
  - `onRefresh: () => Promise<void>` - Funkcja wywoływana po kliknięciu "Odśwież".
  - `isLoading: boolean` - Flaga wskazująca na trwającą operację API.

### `ServerSettingsForm`

- **Opis komponentu:** Formularz zawierający wszystkie pola konfiguracyjne bota dla danego serwera. Odpowiada za walidację wprowadzonych danych i obsługę zapisu.
- **Główne elementy:** `form` (React Hook Form), `Switch`, `Select`, `Textarea`, `Input`, `Button` (wszystkie z shadcn/ui). Potencjalnie własny komponent `MultiSelect` lub wykorzystanie biblioteki zewnętrznej.
- **Obsługiwane interakcje:** Edycja pól formularza, Submit formularza.
- **Obsługiwana walidacja:**
  - `language`: Wymagane, musi być jednym z obsługiwanych kodów językowych (np. 'en', 'pl').
  - `systemPrompt`: Opcjonalne, tekst.
  - `channels`: Opcjonalne, lista stringów (ID kanałów Discord).
  - `support_role_id`: Opcjonalne, string (ID roli Discord).
  - `maxMessagesPerUser`: Wymagane, liczba całkowita, `min: 1`, `max: 100`.
  - `maxTextLength`: Wymagane, liczba całkowita, `min: 100`, `max: 4000`.
- **Typy:** `ServerSettingsViewModel`, `UpdateServerCommand`.
- **Propsy:**
  - `initialData: ServerSettingsViewModel` - Początkowe wartości formularza.
  - `onSubmit: (data: UpdateServerCommand) => Promise<void>` - Funkcja wywoływana po pomyślnym zwalidowaniu i wysłaniu formularza.
  - `isLoading: boolean` - Flaga wskazująca na trwające wysyłanie formularza.
  - `availableChannels: { id: string, name: string }[]` - Lista dostępnych kanałów na serwerze.
  - `availableRoles: { id: string, name: string }[]` - Lista dostępnych ról na serwerze.

## 5. Typy

- **`ServerDetail` (DTO):** Zdefiniowany w `src/types.ts`. Używany do odbioru danych z API (`GET /servers/{id}`).
  ```typescript
  export type ServerDetail = Camelize<
    Pick<ServerRow, "id" | "name" | "active" | "config" | "icon_url" | "created_at" | "updated_at" | "plan_id">
  >;
  // Gdzie ServerRow["config"] to:
  // {
  //   enabled: boolean;
  //   language: string;
  //   systemPrompt: string;
  //   channels: string[];
  //   support_role_id: string;
  //   maxMessagesPerUser: number;
  //   maxTextLength: number;
  // } | null
  ```
- **`UpdateServerCommand` (Command Model):** Zdefiniowany w `src/types.ts`. Używany jako payload dla `PATCH /servers/{id}`.
  ```typescript
  export interface UpdateServerCommand {
    name?: ServerRow["name"];
    iconUrl?: ServerRow["icon_url"];
    config?: ServerRow["config"];
    active?: ServerRow["active"];
  }
  ```
- **`ServerSettingsViewModel` (ViewModel):** Nowy typ, reprezentujący dane formularza. Jest to spłaszczona i przetworzona wersja `ServerDetail.config`.
  ```typescript
  interface ServerSettingsViewModel {
    enabled: boolean;
    language: string; // np. 'en', 'pl'
    systemPrompt: string;
    channels: string[]; // Tablica ID kanałów Discord
    supportRoleId: string; // ID roli Discord
    maxMessagesPerUser: number;
    maxTextLength: number;
  }
  ```
  _Cel:_ Ułatwienie bindowania danych do formularza i zarządzania stanem lokalnym widoku. Mapowanie odbywa się w `ServerSettingsView` po pobraniu `ServerDetail`. `enabled` pochodzi z `ServerDetail.active`.

## 6. Zarządzanie stanem

- **Stan lokalny (`useState`):**
  - `serverData: ServerDetail | null` - Przechowuje dane serwera pobrane z API.
  - `viewModel: ServerSettingsViewModel | null` - Przechowuje aktualne wartości formularza, inicjalizowane na podstawie `serverData`.
  - `isLoading: boolean` - Wskazuje na trwające operacje API (ładowanie, zapis, aktywacja/deaktywacja).
  - `error: string | null` - Przechowuje komunikaty błędów API.
  - `availableChannels: { id: string, name: string }[]` - Lista kanałów (do pobrania z Discord API lub innego źródła).
  - `availableRoles: { id: string, name: string }[]` - Lista ról (do pobrania z Discord API lub innego źródła).
- **React Hook Form:** Do zarządzania stanem formularza `ServerSettingsForm`, walidacji i obsługi submittowania.
- **Custom Hook:** Prawdopodobnie nie jest potrzebny dla samego widoku ustawień, chyba że logika pobierania danych serwera i list kanałów/ról stanie się skomplikowana i będzie reużywana. Prosty `useEffect` do pobierania danych w `ServerSettingsView` powinien wystarczyć na początek.
- **Zustand/Context API:** Może być użyty do globalnego zarządzania stanem (np. informacji o zalogowanym użytkowniku, listy serwerów), ale stan samego formularza ustawień jest lokalny dla widoku.

## 7. Integracja API

- **Pobieranie danych serwera:**
  - Endpoint: `GET /servers/{id}`
  - Akcja: Wywołanie przy montowaniu komponentu `ServerSettingsView`.
  - Typ odpowiedzi: `ServerDetail`
- **Zapisywanie zmian:**
  - Endpoint: `PATCH /servers/{id}`
  - Akcja: Wywołanie po wysłaniu formularza `ServerSettingsForm`.
  - Typ żądania (payload): `UpdateServerCommand` (zawierający tylko pole `config` z zaktualizowanymi wartościami z `ServerSettingsViewModel`).
  - Typ odpowiedzi: `Server` (zaktualizowane dane serwera).
- **Aktywacja bota:**
  - Endpoint: `POST /servers/{id}/activate`
  - Akcja: Wywołanie po kliknięciu przycisku "Aktywuj" w `ServerSettingsHeader`.
  - Typ odpowiedzi: Prawdopodobnie 204 No Content lub zaktualizowany `Server`.
- **Deaktywacja bota:**
  - Endpoint: `POST /servers/{id}/deactivate`
  - Akcja: Wywołanie po kliknięciu przycisku "Deaktywuj" w `ServerSettingsHeader`.
  - Typ odpowiedzi: Prawdopodobnie 204 No Content lub zaktualizowany `Server`.
- **Odświeżenie konfiguracji:**
  - Endpoint: `POST /servers/{id}/refresh-config`
  - Akcja: Wywołanie po kliknięciu przycisku "Odśwież" w `ServerSettingsHeader`.
  - Typ odpowiedzi: Prawdopodobnie 204 No Content.
- **Biblioteka do zapytań:** `fetch` API lub biblioteka typu `axios` / `react-query` (jeśli używana w projekcie). Należy stworzyć typowany klient API (zgodnie z rekomendacją z `ui-plan.md`).

## 8. Interakcje użytkownika

- **Ładowanie widoku:** Po wejściu na ścieżkę `/servers/:id/settings`, wyświetlany jest stan ładowania (np. spinner, skeleton), pobierane są dane serwera (`GET /servers/{id}`) oraz listy kanałów i ról. Po załadowaniu, formularz jest wypełniany danymi.
- **Edycja pól:** Użytkownik może modyfikować wartości w formularzu. Zmiany są widoczne natychmiast w interfejsie.
- **Zapis zmian:** Kliknięcie przycisku "Zapisz" uruchamia walidację formularza. Jeśli walidacja przejdzie pomyślnie, wysyłane jest żądanie `PATCH /servers/{id}` z nową konfiguracją. W trakcie zapisu przycisk jest nieaktywny, wyświetlany jest wskaźnik ładowania. Po sukcesie wyświetlany jest toast z potwierdzeniem. W razie błędu, wyświetlany jest toast z błędem.
- **Aktywacja/Deaktywacja:** Kliknięcie przycisku "Aktywuj" lub "Deaktywuj" wysyła odpowiednie żądanie (`POST /servers/{id}/activate` lub `deactivate`). Przycisk jest nieaktywny w trakcie operacji. Po sukcesie status serwera (`active` w `ServerDetail`) jest aktualizowany, a przyciski odzwierciedlają nowy stan. Wyświetlany jest toast.
- **Odświeżenie konfiguracji:** Kliknięcie przycisku "Odśwież" wysyła żądanie `POST /servers/{id}/refresh-config`. Wyświetlany jest toast potwierdzający wysłanie żądania.

## 9. Warunki i walidacja

- **Formularz (`ServerSettingsForm`):**
  - `language`: Pole wymagane. Musi być wybrane z listy dostępnych języków. Wpływa na `disabled` przycisku "Zapisz".
  - `maxMessagesPerUser`: Pole wymagane. Musi być liczbą całkowitą w zakresie [1, 100]. Wpływa na `disabled` przycisku "Zapisz". Komunikat błędu wyświetlany pod polem.
  - `maxTextLength`: Pole wymagane. Musi być liczbą całkowitą w zakresie [100, 4000]. Wpływa na `disabled` przycisku "Zapisz". Komunikat błędu wyświetlany pod polem.
  - Pozostałe pola (`systemPrompt`, `channels`, `supportRoleId`) są opcjonalne, ale ich wartości muszą być poprawnymi stringami lub tablicami stringów.
- **Przyciski akcji (`ServerSettingsHeader`):**
  - Przyciski "Aktywuj", "Deaktywuj", "Odśwież", "Zapisz" są nieaktywne (`disabled`) podczas trwania jakiejkolwiek operacji API (`isLoading === true`).
  - Przycisk "Aktywuj" jest widoczny/aktywny tylko gdy `serverData.active === false`.
  - Przycisk "Deaktywuj" jest widoczny/aktywny tylko gdy `serverData.active === true`.

## 10. Obsługa błędów

- **Błędy API:**
  - **401 Unauthorized / 403 Forbidden:** Przekierowanie na stronę logowania lub wyświetlenie komunikatu o braku uprawnień. Użycie Error Boundary na wyższym poziomie aplikacji.
  - **404 Not Found (dla `GET /servers/{id}`):** Wyświetlenie dedykowanego komunikatu "Nie znaleziono serwera" lub przekierowanie na listę serwerów.
  - **400 Bad Request (dla `PATCH`):** Błędy walidacji po stronie serwera – wyświetlić globalny komunikat błędu nad formularzem lub zmapować błędy na konkretne pola (jeśli API zwraca `details` w `ErrorResponse`).
  - **500 Internal Server Error:** Wyświetlenie ogólnego komunikatu błędu ("Wystąpił nieoczekiwany błąd serwera") za pomocą toasta. Zalogowanie błędu po stronie klienta.
  - **Błędy sieciowe:** Wyświetlenie toasta z informacją o problemie z połączeniem.
- **Wyświetlanie błędów:** Użycie komponentu `Toaster` (z shadcn/ui) do wyświetlania powiadomień o błędach i sukcesach operacji API. Błędy walidacji formularza wyświetlane bezpośrednio pod odpowiednimi polami.
- **Stan ładowania:** Użycie komponentów typu `Spinner` lub `Skeleton` podczas ładowania danych początkowych i trwania operacji API.

## 11. Kroki implementacji

1.  **Utworzenie plików komponentów:** Stworzyć pliki dla `ServerSettingsView`, `ServerSettingsHeader`, `ServerSettingsForm` w katalogu `src/components/`.
2.  **Implementacja routingu:** Dodać nową ścieżkę `/servers/:id/settings` w systemie routingu (np. React Router DOM), która będzie renderować `ServerSettingsView`.
3.  **Implementacja `ServerSettingsView`:**
    - Dodać logikę pobierania `id` serwera z parametrów ścieżki.
    - Zaimplementować `useEffect` do pobierania danych serwera (`GET /servers/{id}`) przy montowaniu.
    - Dodać obsługę stanu ładowania i błędów pobierania danych.
    - Zaimplementować mapowanie `ServerDetail` na `ServerSettingsViewModel`.
    - Przekazać dane i callbacki do komponentów `ServerSettingsHeader` i `ServerSettingsForm`.
    - Zaimplementować funkcje obsługujące akcje (aktywacja, deaktywacja, odświeżenie, zapis) wywołujące odpowiednie endpointy API.
4.  **Implementacja `ServerSettingsHeader`:**
    - Stworzyć layout z nazwą, ikoną i przyciskami.
    - Podpiąć przekazane propsy `server`, `isLoading` oraz funkcje `onActivate`, `onDeactivate`, `onRefresh` do odpowiednich elementów i zdarzeń `onClick`.
    - Dodać logikę warunkowego wyświetlania/blokowania przycisków na podstawie `server.active` i `isLoading`.
5.  **Implementacja `ServerSettingsForm`:**
    - Skonfigurować `react-hook-form` z `ServerSettingsViewModel` jako domyślnymi wartościami.
    - Zdefiniować schemat walidacji (np. używając Zod) dla pól formularza zgodnie z sekcją "Warunki i walidacja".
    - Zaimplementować layout formularza używając komponentów z `shadcn/ui` (`Switch`, `Select`, `Textarea`, `Input`, `Button`).
    - Dla pól `channels` i `support_role_id` użyć komponentu `Select` lub `MultiSelect`, wypełniając opcje danymi z propsów `availableChannels` i `availableRoles`.
    - Podpiąć `onSubmit` z `react-hook-form` do propsa `onSubmit`, transformując dane formularza (`ServerSettingsViewModel`) na format `UpdateServerCommand` (opakowując je w pole `config`).
    - Wyświetlać komunikaty błędów walidacji przy polach.
    - Zablokować przycisk "Zapisz" gdy `isLoading` jest `true` lub formularz jest nieprawidłowy.
6.  **Pobieranie list kanałów i ról:** Zaimplementować logikę pobierania list dostępnych kanałów i ról dla danego serwera (prawdopodobnie przez dedykowane endpointy API lub bezpośrednio z Discord API, jeśli jest taka możliwość i uprawnienia). Przechować je w stanie `ServerSettingsView` i przekazać do `ServerSettingsForm`.
7.  **Implementacja powiadomień:** Dodać komponent `Toaster` na głównym poziomie aplikacji (lub w `ServerSettingsView`) i wywoływać `toast()` z odpowiednimi komunikatami po zakończeniu operacji API (sukces/błąd).
8.  **Stylowanie:** Dopracować wygląd widoku zgodnie z resztą aplikacji, wykorzystując Tailwind CSS i `shadcn/ui`.
9.  **Testowanie:** Napisać testy jednostkowe dla logiki mapowania i walidacji oraz testy integracyjne/end-to-end dla całego przepływu użytkownika.
10. **Code Review:** Przegląd kodu pod kątem zgodności z wymaganiami, standardami i najlepszymi praktykami.
