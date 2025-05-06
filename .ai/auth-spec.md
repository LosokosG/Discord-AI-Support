# Specyfikacja Techniczna: System Autentykacji Discord OAuth z Supabase

## 1. ARCHITEKTURA INTERFEJSU UŻYTKOWNIKA

### 1.1 Nowe strony i rozszerzenia istniejących

#### 1.1.1 Strona główna (Landing Page) - `/src/pages/index.astro`

- **Funkcjonalność**: Strona publiczna zawierająca opis produktu, główne funkcje i przycisk logowania przez Discord
- **Zmiany**: Zastąpienie obecnego przekierowania do dashboardu na stronę informacyjną z przyciskiem logowania
- **Komponenty**:
  - Hero section z opisem produktu
  - Sekcja prezentująca główne funkcje
  - CTA (Call to Action) z przyciskiem "Zaloguj przez Discord"
  - Footer z informacjami prawnymi

#### 1.1.2 Strona logowania - `/src/pages/login.astro`

- **Funkcjonalność**: Dedykowana strona logowania z przyciskiem OAuth Discord
- **Komponenty**:
  - Formularz logowania (komponenty React) z przyciskiem "Zaloguj przez Discord"
  - Obsługa komunikatów o błędach
  - Link do strony głównej

#### 1.1.3 Strona wyboru serwera - `/src/pages/servers/select.astro`

- **Funkcjonalność**: Strona wyświetlana po zalogowaniu, umożliwiająca wybór serwera Discord do zarządzania
- **Komponenty**:
  - Lista serwerów (komponent React) pobierana dynamicznie z API Discord przez Discord.js, gdzie użytkownik ma uprawnienia
  - Filtrowanie serwerów, na których bot jest już zainstalowany
  - Przycisk wylogowania
  - Przekierowanie do dashboardu po wyborze serwera

### 1.2 Rozszerzenia istniejących layoutów

#### 1.2.1 Rozszerzenie głównego layoutu - `/src/layouts/Layout.astro`

- **Zmiany**: Rozszerzenie o kontekst autentykacji i odpowiednie przekierowania
- **Nowe funkcje**:
  - Dodanie kontekstu sesji użytkownika dostępnego dla wszystkich stron
  - Dodanie mechanizmu weryfikacji sesji

#### 1.2.2 Rozszerzenie layoutu dashboardu - `/src/layouts/DashboardLayout.astro`

- **Zmiany**: Dodanie weryfikacji autentykacji przed renderowaniem
- **Nowe funkcje**:
  - Weryfikacja uprawnienia użytkownika do danego serwera przy użyciu Discord.js
  - Wyświetlanie aktualnych informacji o zalogowanym użytkowniku pobieranych z Discord API
  - Przycisk wylogowania w menu użytkownika
  - Przekierowanie niezalogowanych użytkowników do strony logowania

### 1.3 Nowe komponenty React

#### 1.3.1 LoginButton.tsx - `/src/components/auth/LoginButton.tsx`

- Przycisk inicjujący proces logowania przez Discord OAuth
- Obsługa stanu ładowania podczas logowania
- Kierowanie użytkownika do odpowiedniej ścieżki po zalogowaniu (z funkcją callback)

#### 1.3.2 ServerSelector.tsx - `/src/components/auth/ServerSelector.tsx`

- Lista serwerów Discord, na których:
  - Bot jest już zainstalowany
  - Użytkownik ma uprawnienia administratora lub jest właścicielem
- Funkcja wyboru serwera z przekierowaniem do dashboardu
- Podstawowa wizualizacja dostępności serwerów:
  - Serwery bez uprawnień administratora wyświetlane jako przyciemnione
  - Serwery z uprawnieniami administratora wyświetlane normalnie
  - Prosty tooltip informujący o braku uprawnień (bez zaawansowanych animacji)
- Blokowanie interakcji dla serwerów bez uprawnień administratora:
  - Dezaktywacja przycisku wyboru serwera
  - Krótka informacja o konieczności posiadania uprawnień administratora

#### 1.3.3 UserMenu.tsx - `/src/components/auth/UserMenu.tsx`

- Menu użytkownika wyświetlające awatar Discord, nazwę użytkownika
- Opcje: przełączanie serwerów, wylogowanie
- Status sesji

#### 1.3.4 AuthGuard.tsx - `/src/components/auth/AuthGuard.tsx`

- HOC (Higher-Order Component) zapewniający ochronę komponentów wymagających autentykacji
- Weryfikacja uprawnień użytkownika do danego komponentu/strony
- Przekierowanie do strony logowania w przypadku braku autentykacji

### 1.4 Walidacja i obsługa błędów

#### 1.4.1 Walidacja sesji

- Sprawdzanie ważności sesji przy każdym żądaniu chronionej strony
- Automatyczne odświeżanie tokenu sesji w tle
- Wylogowanie użytkownika po przekroczeniu czasu sesji z odpowiednim komunikatem

#### 1.4.2 Komunikaty błędów

- Wyświetlanie komunikatów błędów logowania w formacie toast/alert
- Obsługa błędów OAuth:
  - Odmowa dostępu przez użytkownika
  - Błędy połączenia z Discord API
  - Błędy autoryzacji (brak wymaganych uprawnień)
  - Wygaśnięcie sesji

#### 1.4.3 Obsługa scenariuszy edge-case

- Utrata uprawnień administratora na serwerze Discord
- Usunięcie bota z serwera Discord
- Utrata połączenia z bazą danych podczas procesu autentykacji

## 2. LOGIKA BACKENDOWA

### 2.1 Struktura endpointów API

#### 2.1.1 Endpoint inicjacji logowania - `/src/pages/api/auth/login.ts`

- **Metoda**: GET
- **Funkcjonalność**: Inicjuje proces OAuth generując URL do Discord z odpowiednimi parametrami
- **Parametry**: `redirect_uri` (opcjonalny) - gdzie przekierować po udanym logowaniu
- **Wymagane zakresy OAuth**:
  - `identify` - podstawowe informacje o użytkowniku
  - `guilds` - lista serwerów użytkownika
  - `email` - adres email użytkownika
- **Response**: URL do autoryzacji Discord z wymaganymi parametrami

#### 2.1.2 Endpoint callback OAuth - `/src/pages/api/auth/callback.ts`

- **Metoda**: GET
- **Funkcjonalność**: Obsługa odpowiedzi z Discord OAuth, weryfikacja, utworzenie sesji
- **Parametry**: `code`, `state` (przekazane przez Discord)
- **Response**: Przekierowanie do dashboardu lub strony wyboru serwera

#### 2.1.3 Endpoint wylogowania - `/src/pages/api/auth/logout.ts`

- **Metoda**: POST
- **Funkcjonalność**: Zakończenie sesji użytkownika i wyczyszczenie cookies
- **Response**: Status 200 i przekierowanie do strony głównej

#### 2.1.4 Endpoint informacji o użytkowniku - `/src/pages/api/auth/me.ts`

- **Metoda**: GET
- **Funkcjonalność**: Zwrócenie informacji o aktualnie zalogowanym użytkowniku
- **Implementacja**:
  - Weryfikacja sesji i pobranie aktualnych danych przez Discord.js
  - Łączenie danych z Discord API z danymi z Supabase
- **Response**: Aktualne dane użytkownika z Discord lub 401 gdy niezalogowany

#### 2.1.5 Endpoint listy serwerów - `/src/pages/api/servers/list.ts`

- **Metoda**: GET
- **Funkcjonalność**: Pobieranie aktualnej listy serwerów Discord przy użyciu Discord.js
- **Implementacja**:
  - Wykorzystanie Discord.js do pobrania listy serwerów
  - Dynamiczne sprawdzenie, na których serwerach znajduje się bot
  - Filtrowanie serwerów, do których użytkownik ma uprawnienia administratora
- **Response**: Aktualna lista serwerów z oznaczeniem, gdzie bot jest zainstalowany

### 2.2 Modele danych

#### 2.2.1 Model użytkownika - `/src/db/schema/users.ts`

- Pole `discord_id` - ID użytkownika Discord
- Pole `discord_username` - Nazwa użytkownika Discord
- Pole `avatar_url` - URL do awatara użytkownika
- Pole `last_login` - Data ostatniego logowania

### 2.3 Mechanizm walidacji danych

#### 2.3.1 Walidacja parametrów OAuth

- Weryfikacja poprawności i bezpieczeństwa parametrów OAuth
- Walidacja tokenu state dla zabezpieczenia przed CSRF
- Weryfikacja zakresu uprawnień przyznanych przez użytkownika

#### 2.3.2 Walidacja uprawnień użytkownika

- Weryfikacja uprawnień administratora na serwerach Discord przez Discord.js
- Weryfikacja, czy bot jest zainstalowany na serwerze

### 2.4 Obsługa wyjątków

#### 2.4.1 Obsługa błędów OAuth

- Przechwytywanie i rejestrowanie błędów z API Discord
- Formatowanie błędów w użyteczny dla użytkownika format

#### 2.4.2 Obsługa problemów z bazą danych

- Przechwytywanie i rejestrowanie błędów połączenia z Supabase oraz API

### 2.5 Renderowanie server-side

#### 2.5.1 Aktualizacja renderowania stron chronionych

- Implementacja sprawdzania sesji przed renderowaniem w middleware
- Użycie danych sesji w szablonach Astro
- Dodanie kontekstu autentykacji do komponentów React przekazywanych z komponentów Astro

## 3. SYSTEM AUTENTYKACJI

### 3.1 Wykorzystanie Supabase Auth z Discord OAuth i Discord.js

#### 3.1.1 Inicjalizacja Supabase Auth - `/src/lib/services/auth.ts`

- Konfiguracja klienta Supabase Auth z obsługą Discord OAuth
- Metody pomocnicze do zarządzania sesją
- Przechowywanie tokenu Discord do API calls

#### 3.1.2 Middleware autentykacji - `/src/middleware/auth.ts`

- Weryfikacja sesji przy każdym żądaniu
- Przekazywanie kontekstu autentykacji do wszystkich stron
- Automatyczne przekierowanie niezalogowanych użytkowników z chronionych stron
- Zapisywanie żądanego URL w sesji dla przekierowania po zalogowaniu

#### 3.1.3 Kontekst autentykacji - `/src/lib/contexts/AuthContext.tsx`

- Dostarczanie informacji o statusie autentykacji do komponentów React
- Metody do zarządzania sesją (wylogowanie, odświeżanie)
- Przechowywanie podstawowych informacji o użytkowniku

### 3.2 Proces logowania

#### 3.2.1 Inicjacja logowania

- Utworzenie URL OAuth Discord z odpowiednimi parametrami
- Przekierowanie do strony autoryzacji Discord
- Zabezpieczenie przed CSRF przez token state

#### 3.2.2 Obsługa callback

- Weryfikacja zwróconego kodu autoryzacji
- Wymiana kodu na token dostępu
- Pobranie danych użytkownika z API Discord
- Utworzenie lub aktualizacja rekordu użytkownika w Supabase
- Utworzenie sesji użytkownika

#### 3.2.3 Utrzymanie sesji

- Automatyczne odświeżanie tokenów w tle
- Przechowywanie sesji w cookies zgodnie z praktykami Astro
- Zabezpieczenie cookies (HttpOnly, Secure)

### 3.3 Zarządzanie uprawnieniami

#### 3.3.1 Weryfikacja uprawnień administratora

- Prosta weryfikacja, czy użytkownik ma uprawnienie administratora na serwerze Discord
- Sprawdzenie, czy bot jest zainstalowany na serwerze
- Filtrowanie listy serwerów tylko do tych, które spełniają oba warunki

#### 3.3.2 Autoryzacja dostępu do zasobów

- Sprawdzanie uprawnień na poziomie serwera przed wyświetleniem danych
- Ograniczenie dostępu do zasobów zgodnie z uprawnieniami
- Przekierowanie użytkownika do wyboru serwera, jeśli próbuje uzyskać dostęp do serwera bez uprawnień

## 4. WNIOSKI I ZALECENIA

### 4.1 Refaktoryzacja istniejącego kodu

- Usunięcie tymczasowego mock użytkownika z middleware
- Aktualizacja obecnych routingów dla współpracy z systemem autentykacji
- Dodanie weryfikacji uprawnień do istniejących operacji

### 4.2 Bezpieczeństwo

- Wykorzystanie zmiennych środowiskowych dla kluczy i sekretów
- Implementacja mechanizmów zabezpieczających przed CSRF i XSS
- Ograniczenie dostępu do API przez odpowiednie nagłówki CORS
- Konfiguracja RLS (Row Level Security) w Supabase

### 4.3 Wydajność

- Zoptymalizowanie liczby zapytań do Discord API
- Cachowanie informacji o serwerach i uprawnieniach
- Wykorzystanie Server-Sent Events do aktualizacji statusu autentykacji

### 4.4 Kompatybilność z istniejącym kodem

- Zachowanie obecnej struktury katalogów w projekcie
- Wykorzystanie istniejących komponentów UI z shadcn/ui
- Utrzymanie spójności z istniejącymi konwencjami stylowania (Tailwind)

## 5. KONFIGURACJA APLIKACJI DISCORD

### 5.1 Tworzenie i konfiguracja aplikacji w Discord Developer Portal

#### 5.1.1 Utworzenie aplikacji Discord

- Przejście do [Discord Developer Portal](https://discord.com/developers/applications)
- Kliknięcie przycisku "New Application" i podanie nazwy aplikacji
- Zapisanie Client ID oraz Client Secret, które będą potrzebne do konfiguracji Supabase Auth

#### 5.1.2 Konfiguracja OAuth2

- W sekcji OAuth2 dodanie URL callback dla Supabase Auth:
  - Format URL: `https://<project-ref>.supabase.co/auth/v1/callback`
  - Dodanie również URL dla lokalnego środowiska deweloperskiego: `http://localhost:3000/api/auth/callback`
- Wybór wymaganych zakresów (scopes) OAuth2:
  - `identify` - umożliwia dostęp do podstawowych informacji o użytkowniku
  - `guilds` - umożliwia dostęp do listy serwerów użytkownika
  - `email` - umożliwia dostęp do adresu email użytkownika (opcjonalnie)

#### 5.1.3 Testowanie konfiguracji

- Sprawdzenie poprawności działania logowania przez Discord
- Weryfikacja, czy callback URL działa poprawnie
- Sprawdzenie, czy aplikacja otrzymuje wymagane zakresy uprawnień
