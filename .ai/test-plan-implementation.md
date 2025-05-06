<analiza_projektu>

1.  **Przegląd kodu źródłowego i identyfikacja kluczowych komponentów**

    - **Rdzeń Bota Discord:**
      - `src/discord-bot/index.js`: Zarządzanie shardingiem, uruchamianie shardów.
      - `src/discord-bot/bot.js`: Główna logika klienta Discord, ładowanie eventów, komend, przycisków, obsługa zdarzeń `guildCreate`/`guildDelete`.
      - `src/discord-bot/events/`: Moduły obsługujące zdarzenia Discord (np. `messageCreate`, `interactionCreate`).
      - `src/discord-bot/commands/`: Definicje i logika komend slash (np. `/ask`, `/config`).
      - `src/discord-bot/buttons/`: Logika obsługi przycisków (np. `getHumanAssistance.js`).
      - `src/discord-bot/services/api.js`: Serwis do komunikacji z backendem API (Supabase).
    - **Integracja z AI (OpenRouter):**
      - Logika zawarta w `README.md` opisująca `OpenRouterService` (zakładamy, że plik istnieje np. `src/lib/openrouter/index.ts` lub podobnie): Kluczowy dla interakcji z modelami AI, obsługi błędów, szacowania kosztów.
      - `src/discord-bot/utils/aiSummaryGenerator.js`: Generowanie podsumowań konwersacji.
    - **Panel Administracyjny (Frontend):**
      - `src/components/ServerSettingsForm.tsx`: Formularz konfiguracji serwera, walidacja (Zod), interakcja z API.
      - `src/components/ServerSettingsView.tsx`: Widok zarządzania ustawieniami serwera, pobieranie i wysyłanie danych.
      - `src/components/dashboard/`: Komponenty layoutu panelu (Sidebar, Topbar, Drawer).
      - `src/components/knowledge/`: Komponenty do zarządzania bazą wiedzy (listy, formularze, widoki dokumentów).
      - `src/components/auth/`: Komponenty związane z autentykacją (LoginButton, UserMenu, AuthGuard, ServerSelector).
      - `src/layouts/DashboardLayout.astro`: Główny layout panelu administracyjnego.
      - `src/pages/dashboard/`: Strony panelu administracyjnego.
    - **Backend API (Astro Endpoints / Supabase):**
      - `src/pages/api/auth/`: Endpointy logowania, wylogowywania, pobierania danych użytkownika (`me`).
      - `src/pages/api/servers/`: Endpointy do zarządzania serwerami (listowanie, pobieranie szczegółów, aktualizacja, aktywacja/dezaktywacja).
      - `src/pages/api/documents/` (wnioskowane na podstawie logiki zarządzania wiedzą): Endpointy CRUD dla dokumentów bazy wiedzy.
      - `src/middleware/index.ts` (wspomniany w `.windsurfrules`, prawdopodobnie `src/middleware.ts` lub `src/middleware/auth.ts`): Obsługa sesji, autentykacji, autoryzacji.
    - **Baza Danych (Supabase):**
      - `src/db/database.types.ts`: Typy generowane przez Supabase, definiujące schemat bazy.
      - `src/db/supabase.client.ts` & `src/db/supabase.server.ts`: Klienci Supabase dla frontendu i backendu.
      - `mock-user-policy.sql`: Definicje RLS dla testowania.
    - **Typy i Konfiguracja:**
      - `src/types.ts`: Globalne DTO i modele poleceń.
      - `astro.config.mjs`, `tailwind.config.js`, `tsconfig.json`: Główne pliki konfiguracyjne projektu.
      - `.env` (plik szablonowy w `README.md`): Zmienne środowiskowe.

2.  **Analiza stosu technologicznego i jego wpływ na strategię testowania**

    - **React 19 / Astro 5 (Frontend):**
      - Wpływ: Konieczność testowania komponentów React (np. Vitest/RTL, Jest/RTL) oraz stron Astro (np. Playwright, Cypress). Testowanie interaktywności, stanu (Zustand), routingu (React Router / Astro routing) i renderowania po stronie serwera/klienta.
    - **TypeScript 5:**
      - Wpływ: Ułatwia pisanie testów dzięki statycznemu typowaniu. Testy typów (np. przez `tsc --noEmit`). Mniej błędów związanych z typami w runtime.
    - **Tailwind CSS 4 / Shadcn/ui:**
      - Wpływ: Testowanie wizualne (np. Chromatic, Percy, Playwright visual comparisons) w celu zapewnienia poprawności stylów i responsywności. Testowanie dostępności komponentów UI.
    - **Supabase (PostgreSQL, Auth, BaaS SDK):**
      - Wpływ: Testy integracyjne dla operacji na bazie danych przez SDK. Testowanie polityk RLS. Testowanie przepływu autentykacji. Konieczność posiadania instancji testowej Supabase lub mockowania SDK.
    - **DiscordJS:**
      - Wpływ: Testowanie interakcji bota (komendy, eventy, przyciski) w izolacji (mockowanie Discord API) oraz integracyjnie na dedykowanym serwerze testowym Discord. Testowanie logiki shardingu.
    - **Openrouter.ai:**
      - Wpływ: Testowanie serwisu klienckiego (`OpenRouterService`). Mockowanie API OpenRouter dla testów jednostkowych i integracyjnych. Testy kontraktowe. Testowanie obsługi błędów i logiki ponawiania.
    - **GitHub Actions (CI/CD):**
      - Wpływ: Automatyzacja wszystkich poziomów testów (jednostkowe, integracyjne, E2E, linting) w pipeline CI.
    - **DigitalOcean (Docker):**
      - Wpływ: Testowanie budowania obrazu Docker. Smoke testy po deploymentcie na środowisko stagingowe. Testowanie konfiguracji środowiskowej w kontenerze.
    - **Zod (Walidacja):**
      - Wpływ: Testowanie logiki walidacji (schematów Zod) dla formularzy i danych API.

3.  **Określenie plików priorytetowych wymagających szczególnej uwagi podczas testowania**

    - `src/discord-bot/bot.js` i `src/discord-bot/index.js`: Rdzeń funkcjonalności bota i sharding. Błędy tutaj są krytyczne.
    - Logika interakcji z AI (zakładany `src/lib/openrouter/index.ts` i `src/discord-bot/utils/aiSummaryGenerator.js`): Kluczowa dla głównej wartości produktu.
    - `src/components/ServerSettingsForm.tsx` i `src/components/ServerSettingsView.tsx`: Główne interfejsy dla administratorów serwerów. Błędy w konfiguracji mogą uniemożliwić działanie bota.
    - Endpointy API w `src/pages/api/` (szczególnie `auth/` i `servers/`): Bezpieczeństwo, integralność danych i podstawowe operacje.
    - `src/middleware/index.ts` (lub odpowiednik): Krytyczny dla bezpieczeństwa i zarządzania sesją.
    - Pliki związane z zarządzaniem bazą wiedzy (np. `src/components/knowledge/DiscordKnowledgeList.tsx`, `DocumentForm.tsx`, `KnowledgeView.tsx` oraz powiązane API): Bezpośrednio wpływają na zdolność bota do odpowiadania na pytania.
    - `src/types.ts`: Zapewnia spójność danych. Zmiany wymagają dokładnych testów regresji.
    - `src/db/supabase.server.ts` i `src/db/supabase.client.ts`: Prawidłowa interakcja z Supabase jest fundamentalna.

4.  **Ocena struktury repozytorium i jego wpływu na organizację testów**
    - **Zalety:**
      - Wyraźny podział na frontend (`src/components`, `src/pages`, `src/layouts`), backend (`src/pages/api`, `src/middleware`), logikę bota (`src/discord-bot`) i biblioteki (`src/lib`) ułatwia testowanie modułowe i izolowane.
      - Komponentowa architektura UI (Shadcn/ui, React) sprzyja testowaniu poszczególnych komponentów.
      - Centralizacja typów (`src/types.ts`) pomaga w utrzymaniu spójności, co może ułatwić tworzenie danych testowych i mocków.
    - **Potencjalne wyzwania testowe:**
      - **Testy E2E:** Wymagają złożonej konfiguracji obejmującej działający serwer Discord, instancję Supabase (potencjalnie z danymi testowymi) oraz mock lub rzeczywisty dostęp do OpenRouter.
      - **Testowanie Shardingu:** Efektywne przetestowanie mechanizmu sharding może być trudne bez dostępu do dużej liczby serwerów lub zaawansowanych narzędzi symulacyjnych.
      - **Zarządzanie Zależnościami Zewnętrznymi:** Utrzymanie aktualności mocków dla Discord API, Supabase SDK i OpenRouter API w miarę ich ewolucji.
      - **Spójność Danych Testowych:** Zapewnienie spójnych danych testowych na różnych poziomach (UI, API, Baza Danych) może być wyzwaniem.
      - **Integracja Frontend-Backend-Bot:** Testowanie pełnego przepływu danych i interakcji między tymi trzema głównymi częściami systemu.
      - **Testowanie Konfiguracji Środowiskowej:** `Docker` i `DigitalOcean` wprowadzają dodatkową warstwę konfiguracji, którą należy przetestować.

</analiza_projektu>

# Plan Testów: Discord AI Support Bot

## 1. Wprowadzenie

### 1.1. Cel planu testów

Celem niniejszego planu testów jest zdefiniowanie strategii, zakresu, zasobów i harmonogramu działań testowych dla projektu Discord AI Support Bot. Plan ma na celu zapewnienie, że dostarczone oprogramowanie spełnia wymagania funkcjonalne i niefunkcjonalne, jest stabilne, niezawodne i gotowe do wdrożenia produkcyjnego, począwszy od wersji MVP (Minimum Viable Product).

### 1.2. Zakres testów

Testy obejmą następujące kluczowe obszary funkcjonalne i niefunkcjonalne projektu, zgodnie z definicją MVP:

- **Funkcjonalność Bota Discord:**
  - Automatyczne odpowiedzi AI na podstawie bazy wiedzy.
  - Obsługa komend slash (np. `/ask`, `/config`).
  - Kontekstowe konwersacje w wątkach.
  - System przekierowywania zgłoszeń do ludzi (przycisk "Forward to a human").
  - Zapisywanie transkryptów konwersacji w bazie danych.
  - Mechanizm automatycznych odpowiedzi w skonfigurowanych kanałach/kategoriach.
  - Wiadomości powitalne w nowych wątkach/kanałach.
  - Pamięć kontekstu konwersacji.
- **Panel Administracyjny (MVP):**
  - Uwierzytelnianie administratorów przez Discord OAuth.
  - Podstawowa konfiguracja serwera (włączanie/wyłączanie bota, ustawienia języka, promptu systemowego, kanałów, roli wsparcia, limitów).
  - (MVP nie obejmuje zaawansowanych funkcji dashboardu, wizualizacji, statystyk).
- **Integracja z AI (OpenRouter.ai):**
  - Komunikacja z różnymi modelami AI.
  - Obsługa błędów API OpenRouter.
  - Szacowanie kosztów (podstawowa weryfikacja).
- **Backend i Baza Danych (Supabase):**
  - Poprawność operacji CRUD na danych (konfiguracje serwerów, transkrypty, dokumenty bazy wiedzy).
  - Uwierzytelnianie i autoryzacja.
  - Integralność danych.
  - Polityki RLS (Row Level Security).
- **Skalowalność:**
  - Podstawowe testy działania architektury shardingowej (zdolność do obsługi wielu serwerów).
- **Ogólne Aspekty Niefunkcjonalne:**
  - Użyteczność podstawowego panelu administracyjnego.
  - Podstawowe bezpieczeństwo API i aplikacji.
  - Poprawność instalacji i konfiguracji lokalnej oraz na serwerze docelowym (Docker).

**Poza zakresem testów MVP (zgodnie z `README.md`):**

- Zaawansowane funkcje panelu administracyjnego (wizualizacje, rozbudowane statystyki).
- Integracje z platformami innymi niż Discord.
- Zaawansowane kategoryzowanie/tagowanie bazy wiedzy.
- Zaawansowane analizy użytkowania.
- System kolejkowania dla zespołu wsparcia.
- Różne poziomy dostępu w panelu.
- Implementacja monetyzacji.
- Zaawansowany interfejs zarządzania shardami.

## 2. Strategia testowania

Strategia testowania będzie wielopoziomowa, obejmująca różne typy testów w celu zapewnienia kompleksowej weryfikacji jakości.

### 2.1. Typy testów do przeprowadzenia

- **Testy Statyczne:**
  - Przeglądy kodu (Code Reviews).
  - Analiza statyczna kodu przy użyciu ESLint i Prettier (zgodnie z konfiguracją w `eslint.config.js` i `package.json`).
  - Weryfikacja typów TypeScript (`tsc --noEmit`).
- **Testy Jednostkowe (Unit Tests):**
  - **Cel:** Weryfikacja poprawności działania poszczególnych, izolowanych modułów/funkcji/komponentów.
  - **Zakres:** Funkcje pomocnicze, logika komponentów React (np. walidacja formularzy, logika UI), logika serwisów (np. `OpenRouterService`), pojedyncze moduły bota (np. parsery komend).
  - **Narzędzia:** Vitest lub Jest z React Testing Library (RTL).
- **Testy Integracyjne (Integration Tests):**
  - **Cel:** Weryfikacja poprawnej współpracy między modułami i serwisami.
  - **Zakres:**
    - Interakcja komponentów frontendowych z API backendu.
    - Integracja API backendu z bazą danych Supabase (weryfikacja operacji CRUD, RLS).
    - Integracja logiki bota z serwisem AI (OpenRouter) oraz z bazą danych (zapis transkryptów, odczyt konfiguracji).
    - Testowanie middleware (np. autentykacja, obsługa sesji).
  - **Narzędzia:** Vitest/Jest, Supertest (dla API), mockowanie zewnętrznych zależności (Discord API, OpenRouter API).
- **Testy End-to-End (E2E Tests):**
  - **Cel:** Weryfikacja kompletnych przepływów użytkownika przez system, symulując rzeczywiste scenariusze.
  - **Zakres:**
    - **Panel Administracyjny:** Logowanie przez Discord, nawigacja, konfiguracja serwera, (potencjalnie) przeglądanie podstawowych informacji.
    - **Bot Discord:** Pełny cykl zapytania od użytkownika, przez odpowiedź AI, aż po ewentualne przekierowanie do człowieka, na testowym serwerze Discord.
  - **Narzędzia:** Playwright lub Cypress dla panelu administracyjnego. Dedykowane skrypty testowe (np. w Node.js z DiscordJS) do automatyzacji interakcji z botem na serwerze testowym.
- **Testy Akceptacyjne Użytkownika (UAT):**
  - **Cel:** Potwierdzenie przez klienta/interesariuszy, że system spełnia ich oczekiwania i potrzeby biznesowe.
  - **Zakres:** Kluczowe scenariusze użytkownika zdefiniowane we współpracy z Product Ownerem.
  - **Przeprowadzane:** Na środowisku stagingowym.
- **Testy Manualne (Exploratory & Usability):**
  - **Cel:** Odkrywanie nieprzewidzianych błędów, ocena użyteczności i ogólnego doświadczenia użytkownika (UX).
  - **Zakres:** Panel administracyjny (szczególnie `ServerSettingsForm`), interakcje z botem.
- **Testy Bezpieczeństwa (ograniczone dla MVP):**
  - **Cel:** Identyfikacja podstawowych podatności.
  - **Zakres:** Weryfikacja endpointów API pod kątem OWASP Top 10 (np. XSS, SQLi - choć Supabase pomaga to mitygować), poprawność konfiguracji RLS w Supabase, bezpieczeństwo sesji i tokenów.
  - **Narzędzia:** Manualne przeglądy, podstawowe skanery (np. ZAP w trybie pasywnym).
- **Testy Wydajności (ograniczone dla MVP):**
  - **Cel:** Ocena responsywności systemu pod typowym obciążeniem.
  - **Zakres:** Czas odpowiedzi API, czas odpowiedzi bota.
  - **Narzędzia:** k6, Apache JMeter (dla API).

### 2.2. Priorytety testowania

1.  **Krytyczne (Must Test):**
    - Podstawowa funkcjonalność bota: odpowiadanie na komendę `/ask`, automatyczne odpowiedzi w skonfigurowanych kanałach, zapis transkryptów, system przekierowania do człowieka.
    - Integracja z OpenRouter: poprawne wysyłanie zapytań i odbieranie odpowiedzi od modeli AI.
    - Autentykacja w panelu administracyjnym (Discord OAuth).
    - Podstawowa konfiguracja serwera przez panel administracyjny (np. włączanie/wyłączanie bota, zmiana systemowego promptu).
    - Integralność danych (zapis i odczyt konfiguracji, transkryptów).
2.  **Wysokie (Should Test):**
    - Obsługa komend `/config` bota.
    - Pamięć kontekstu konwersacji.
    - Walidacja formularzy w panelu administracyjnym.
    - Obsługa błędów (zarówno po stronie bota, jak i panelu).
    - Podstawowe testy bezpieczeństwa API.
    - Poprawność działania RLS w Supabase.
3.  **Średnie (Could Test):**
    - Użyteczność panelu administracyjnego.
    - Responsywność UI panelu.
    - Testy E2E dla mniej krytycznych ścieżek.
    - Szacowanie kosztów przez `OpenRouterService`.
4.  **Niskie (Won't Test for MVP, or if time permits):**
    - Zaawansowane testy wydajności i skalowalności shardingu.
    - Pełne testy bezpieczeństwa (np. testy penetracyjne).
    - Testy lokalizacji (jeśli bot obsługuje wiele języków w odpowiedziach AI - na razie skupienie na "en" i "pl" w `ServerSettingsForm`).

## 3. Środowisko testowe

### 3.1. Wymagania sprzętowe i programowe

- **Lokalne środowisko deweloperskie/testowe:**
  - Komputer z systemem operacyjnym Windows, macOS lub Linux.
  - Node.js (wersja zgodna z `.nvmrc`, tj. 22.14.0).
  - npm.
  - Przeglądarka internetowa (Chrome, Firefox).
  - Edytor kodu (np. VS Code).
  - Docker Desktop (opcjonalnie, do uruchomienia lokalnej instancji Supabase lub innych zależności).
- **Serwer CI (np. GitHub Actions runner):**
  - Zgodny z wymaganiami do budowania projektu i uruchamiania testów (Node.js, Docker).
- **Środowisko Stagingowe (np. DigitalOcean):**
  - Infrastruktura zdolna do uruchomienia aplikacji w kontenerze Docker.
  - Dostęp do instancji Supabase (dedykowanej dla stagingu).
  - Dostęp do Internetu dla komunikacji z Discord API i OpenRouter API.

### 3.2. Konfiguracja środowiska

- **Dostęp do API:**
  - Klucz API dla OpenRouter.ai (dedykowany dla testów, z ustawionymi limitami).
  - Token bota Discord oraz Client ID/Secret dla aplikacji Discord (dedykowane dla środowiska testowego).
  - Klucze Supabase (URL i anon key) dla instancji testowej/stagingowej.
- **Serwer Discord:**
  - Dedykowany serwer Discord do testów manualnych i automatycznych E2E bota.
  - Konta użytkowników Discord z różnymi uprawnieniami (administrator serwera, zwykły użytkownik).
- **Baza Danych Supabase:**
  - Osobna instancja Supabase dla środowiska testowego/stagingowego.
  - Możliwość resetowania danych do stanu początkowego.
  - Zastosowane migracje schematu (zgodne z produkcją).
  - Skonfigurowane RLS (zgodnie z `mock-user-policy.sql` dla celów testowych).
- **Zmienne Środowiskowe:**
  - Poprawnie skonfigurowane pliki `.env` (lub ich odpowiedniki w systemach CI/Staging) dla każdego środowiska.

## 4. Przypadki testowe

Poniżej przedstawiono zarys głównych przypadków testowych dla kluczowych funkcjonalności. Szczegółowe przypadki testowe będą tworzone i zarządzane w dedykowanym narzędziu (np. TestRail, Xray, lub w dokumentach Markdown w repozytorium).

### 4.1. Funkcjonalność Bota Discord

- **TC-BOT-001:** Użytkownik zadaje pytanie za pomocą komendy `/ask <pytanie>`.
  - Oczekiwany wynik: Bot odpowiada na pytanie, wykorzystując bazę wiedzy i AI. Transkrypt rozmowy jest zapisywany.
- **TC-BOT-002:** Użytkownik wysyła wiadomość w kanale skonfigurowanym do automatycznych odpowiedzi.
  - Oczekiwany wynik: Bot automatycznie odpowiada na wiadomość.
- **TC-BOT-003:** Bot utrzymuje kontekst w konwersacji prowadzonej w wątku.
  - Oczekiwany wynik: Odpowiedzi bota uwzględniają poprzednie wiadomości w tym samym wątku.
- **TC-BOT-004:** Użytkownik klika przycisk "Forward to a human".
  - Oczekiwany wynik: Bot informuje o przekazaniu sprawy, oznacza konwersację jako wymagającą interwencji człowieka, (opcjonalnie) powiadamia rolę wsparcia.
- **TC-BOT-005:** Konfiguracja automatycznych odpowiedzi za pomocą `/config auto_respond channel:<kanał/kategoria> enabled:<true/false>`.
  - Oczekiwany wynik: Bot poprawnie włącza/wyłącza automatyczne odpowiedzi dla wskazanego kanału/kategorii.
- **TC-BOT-006:** Wyświetlanie listy skonfigurowanych kanałów za pomocą `/config list`.
  - Oczekiwany wynik: Bot wyświetla poprawną listę kanałów z włączonymi automatycznymi odpowiedziami.
- **TC-BOT-007:** Bot wysyła wiadomość powitalną w nowo utworzonym wątku w skonfigurowanym kanale.
  - Oczekiwany wynik: Użytkownicy otrzymują instrukcje dotyczące interakcji z botem.
- **TC-BOT-008:** Pamięć konwersacji wygasa po 24 godzinach nieaktywności.
  - Oczekiwany wynik: Nowa konwersacja po 24h nieaktywności nie pamięta poprzedniego kontekstu.

### 4.2. Panel Administracyjny

- **TC-ADM-001:** Użytkownik loguje się do panelu za pomocą Discord OAuth.
  - Oczekiwany wynik: Użytkownik zostaje poprawnie uwierzytelniony i przekierowany do panelu.
- **TC-ADM-002:** Użytkownik wylogowuje się z panelu.
  - Oczekiwany wynik: Sesja użytkownika zostaje zakończona, użytkownik jest przekierowywany na stronę logowania lub główną.
- **TC-ADM-003:** Niezalogowany użytkownik próbuje uzyskać dostęp do chronionej strony panelu.
  - Oczekiwany wynik: Użytkownik jest przekierowywany na stronę logowania.
- **TC-ADM-004:** Administrator serwera modyfikuje ustawienia serwera (np. włącza bota, zmienia język, system prompt, kanały, rolę wsparcia, limity) w `ServerSettingsForm`.
  - Oczekiwany wynik: Zmiany są poprawnie zapisywane w bazie danych i odzwierciedlane w działaniu bota. Formularz wyświetla aktualne dane.
- **TC-ADM-005:** Walidacja danych wejściowych w formularzu `ServerSettingsForm` (np. limity liczbowe, wymagane pola).
  - Oczekiwany wynik: Komunikaty o błędach są wyświetlane dla niepoprawnych danych. Formularz nie pozwala na zapis niepoprawnych danych.
- **TC-ADM-006:** (Jeśli dotyczy MVP) Wyświetlanie transkryptów konwersacji.
  - Oczekiwany wynik: Administrator może przeglądać zapisane transkrypty.
- **TC-ADM-007:** Aktywacja/Dezaktywacja bota dla serwera z poziomu `ServerSettingsHeader`.
  - Oczekiwany wynik: Status bota (aktywny/nieaktywny) jest poprawnie aktualizowany.

### 4.3. Integracja z AI (OpenRouter)

- **TC-AI-001:** Bot poprawnie komunikuje się z wybranym modelem AI przez OpenRouter.
  - Oczekiwany wynik: Odpowiedzi są generowane zgodnie z oczekiwaniami dla danego modelu.
- **TC-AI-002:** System poprawnie obsługuje błędy API OpenRouter (np. przekroczenie limitu, błąd autentykacji, niedostępność modelu).
  - Oczekiwany wynik: Użytkownik otrzymuje stosowny komunikat, system loguje błąd, ewentualnie próbuje ponowić zapytanie (retry logic).
- **TC-AI-003:** (Jeśli dotyczy) Weryfikacja działania logiki wyboru modelu AI (jeśli jest dynamiczna).
- **TC-AI-004:** Podstawowa weryfikacja funkcji szacowania kosztów w `OpenRouterService`.
  - Oczekiwany wynik: Szacunki są zbliżone do rzeczywistych kosztów dla testowych zapytań.

### 4.4. Backend i Baza Danych (Supabase)

- **TC-DB-001:** Poprawny zapis i odczyt konfiguracji serwera.
- **TC-DB-002:** Poprawny zapis transkryptów konwersacji, w tym informacje o kanale, użytkowniku, statusie.
- **TC-DB-003:** (Jeśli dotyczy MVP) Poprawny zapis i odczyt dokumentów bazy wiedzy.
- **TC-DB-004:** Testowanie polityk RLS: administrator serwera może modyfikować tylko konfigurację swoich serwerów.
- **TC-DB-005:** Testowanie funkcji `mock-user-policy.sql` dla ułatwienia testowania RLS.

### 4.5. Sharding

- **TC-SHD-001:** Bot jest online i odpowiada na komendy na wielu serwerach przypisanych do różnych shardów (symulacja lub rzeczywiste serwery testowe).
- **TC-SHD-002:** W przypadku restartu jednego sharda, inne shardy kontynuują pracę.

## 5. Dane testowe

### 5.1. Opis wymaganych danych testowych

- **Baza Wiedzy:**
  - Zestaw plików tekstowych (`.txt`) i Markdown (`.md`) zawierających różnorodne informacje (FAQ, opisy problemów, instrukcje).
  - Przynajmniej 5-10 dokumentów o różnej długości i złożoności.
  - Dokumenty w języku polskim i angielskim (do testowania konfiguracji języka bota).
- **Konta Użytkowników Discord:**
  - Co najmniej 2 konta: jedno z uprawnieniami administratora na serwerze testowym, jedno jako zwykły użytkownik.
- **Serwery Discord:**
  - Co najmniej 1-2 dedykowane serwery Discord do celów testowych.
  - Na serwerach: różne kanały tekstowe, kategorie, wątki.
  - Zainstalowany i skonfigurowany testowy bot.
- **Konfiguracje Serwera Bota:**
  - Różne warianty konfiguracji (np. bot włączony/wyłączony, różne języki, różne systemowe prompty, różne zestawy aktywnych kanałów, zdefiniowana/niezdefiniowana rola wsparcia, różne limity).
- **Dane API:**
  - Poprawne i niepoprawne klucze API dla OpenRouter (do testowania obsługi błędów).
  - Dane logowania Discord dla testów OAuth.
- **Zapytania Użytkowników:**
  - Lista przykładowych zapytań:
    - Proste, na które odpowiedź jest wprost w bazie wiedzy.
    - Złożone, wymagające syntezy informacji z kilku źródeł lub rozumowania przez AI.
    - Niejasne, wieloznaczne.
    - Poza zakresem bazy wiedzy.
    - W różnych językach (jeśli dotyczy).
    - Pytania kontynuujące poprzednią rozmowę (do testowania kontekstu).

### 5.2. Metody generowania lub pozyskiwania danych

- **Baza Wiedzy:** Tworzona manualnie, mogą być to fragmenty rzeczywistej dokumentacji lub specjalnie przygotowane teksty.
- **Konta Discord i Serwery:** Tworzone manualnie.
- **Konfiguracje Serwera:** Ustawiane manualnie przez panel administracyjny lub bezpośrednio w bazie danych (dla specyficznych scenariuszy testowych).
- **Dane API:** Uzyskiwane z odpowiednich serwisów (Discord Developer Portal, OpenRouter.ai).
- **Zapytania Użytkowników:** Tworzone manualnie, inspirowane potencjalnymi rzeczywistymi zapytaniami.

## 6. Harmonogram testów

Harmonogram jest szacunkowy i może ulec zmianie w zależności od postępów deweloperskich i dostępności zasobów. Zakłada się iteracyjne podejście, z testowaniem prowadzonym równolegle do developmentu.

- **Faza 1: Testowanie Rdzenia Bota i Integracji AI (MVP)**
  - **Czas trwania:** 2-3 tygodnie (równolegle z developmentem tych funkcji)
  - **Kamienie milowe:**
    - Zakończenie testów jednostkowych dla kluczowych modułów bota i `OpenRouterService`.
    - Zakończenie testów integracyjnych dla komend `/ask`, `/config` oraz interakcji z AI i bazą danych.
    - Podstawowe testy E2E dla przepływu "pytanie-odpowiedź-forward".
- **Faza 2: Testowanie Panelu Administracyjnego (MVP) i Autentykacji**
  - **Czas trwania:** 2 tygodnie (równolegle z developmentem panelu)
  - **Kamienie milowe:**
    - Zakończenie testów komponentów React dla formularzy i widoków panelu.
    - Zakończenie testów API dla autentykacji i konfiguracji serwera.
    - Testy E2E dla logowania i podstawowej konfiguracji serwera.
- **Faza 3: Testy Systemowe i Akceptacyjne (MVP)**
  - **Czas trwania:** 1-2 tygodnie
  - **Kamienie milowe:**
    - Wykonanie pełnego cyklu testów regresji.
    - Przeprowadzenie testów eksploracyjnych i użyteczności.
    - Przygotowanie środowiska i przeprowadzenie UAT.
    - Weryfikacja kryteriów akceptacji MVP.
- **Testowanie Ciągłe:**
  - Testy jednostkowe i integracyjne uruchamiane automatycznie w CI po każdym pushu.
  - Regularne testy regresji przed każdym wydaniem.

## 7. Role i odpowiedzialności

- **Inżynier QA (Test Lead):**
  - Opracowanie i aktualizacja planu testów.
  - Projektowanie i dokumentowanie przypadków testowych.
  - Wykonywanie testów manualnych i automatycznych.
  - Automatyzacja testów (E2E, integracyjne).
  - Raportowanie i śledzenie błędów.
  - Koordynacja działań testowych.
  - Przygotowanie raportów z testów.
- **Deweloperzy:**
  - Pisanie testów jednostkowych dla swojego kodu.
  - Udział w przeglądach kodu.
  - Naprawa zgłoszonych błędów.
  - Wsparcie Inżyniera QA w diagnozowaniu problemów i konfiguracji środowisk.
- **Product Owner / Project Manager:**
  - Definiowanie kryteriów akceptacji.
  - Udział w UAT.
  - Priorytetyzacja naprawy błędów.
  - Akceptacja wyników testów.

## 8. Kryteria akceptacji

### 8.1. Kryteria wejścia (Rozpoczęcie Testów)

- Plan testów zaakceptowany.
- Środowisko testowe skonfigurowane i dostępne.
- Wymagane dane testowe przygotowane.
- Funkcjonalności przewidziane do testowania w danej fazie są zaimplementowane i wdrożone na środowisko testowe.
- Podstawowe testy dymne (smoke tests) zakończone sukcesem.

### 8.2. Kryteria wyjścia (Zakończenie Testów MVP)

- Co najmniej 80% pokrycia kodu testami jednostkowymi dla kluczowych modułów backendu i bota.
- Co najmniej 70% pokrycia kodu testami jednostkowymi/komponentów dla kluczowych części frontendu.
- Wszystkie zdefiniowane przypadki testowe dla funkcjonalności krytycznych i o wysokim priorytecie zostały wykonane i zakończone sukcesem.
- Brak nierozwiązanych błędów o statusie krytycznym (Blocker, Critical).
- Liczba błędów o statusie wysokim (Major) nie przekracza ustalonego progu (np. 0-2, do decyzji zespołu).
- Testy Akceptacyjne Użytkownika (UAT) zakończone sukcesem i podpisane przez Product Ownera.
- Dokumentacja testowa (wyniki testów, lista znanych błędów) jest kompletna i zaakceptowana.
- Oprogramowanie jest stabilne i działa zgodnie z oczekiwaniami na środowisku stagingowym przez określony czas (np. 48h bez krytycznych incydentów).

## 9. Raportowanie i śledzenie błędów

- **Narzędzie:** GitHub Issues będzie używane do zgłaszania i śledzenia błędów. Etykiety (labels) będą stosowane do kategoryzacji (np. `bug`, `enhancement`, `critical`, `major`, `ui`, `bot`, `api`).
- **Szablon Zgłoszenia Błędu:**
  - **Tytuł:** Krótki, zwięzły opis problemu.
  - **Kroki do Reprodukcji:** Szczegółowa lista kroków prowadzących do wystąpienia błędu.
  - **Oczekiwany Wynik:** Co powinno się wydarzyć.
  - **Rzeczywisty Wynik:** Co faktycznie się wydarzyło.
  - **Środowisko:** Wersja aplikacji, przeglądarka/system, środowisko (dev, staging).
  - **Priorytet/Waga:** (np. Krytyczny, Wysoki, Średni, Niski) - określający wpływ błędu na system i pilność naprawy.
  - **Załączniki:** Zrzuty ekranu, nagrania wideo, logi.
- **Cykl Życia Błędu:**
  1.  **New/Open:** Nowo zgłoszony błąd.
  2.  **In Review/To Do:** Błąd potwierdzony, czeka na przypisanie lub jest analizowany.
  3.  **In Progress:** Deweloper pracuje nad naprawą błędu.
  4.  **Resolved/Ready for Test:** Błąd naprawiony, czeka na weryfikację przez QA.
  5.  **In Test:** QA weryfikuje poprawkę.
  6.  **Closed:** Błąd poprawnie naprawiony i zweryfikowany.
  7.  **Reopened:** Poprawka nie zadziałała lub wprowadziła regresję, błąd wraca do dewelopera.
  8.  **Won't Fix/As Designed:** Błąd nie zostanie naprawiony (np. niski priorytet, działa zgodnie z projektem).
- **Raporty z Testów:**
  - Regularne raporty o postępach testów (np. tygodniowe).
  - Końcowy raport z testów podsumowujący wykonane działania, wyniki, pokrycie, listę otwartych błędów i rekomendację dotyczącą wdrożenia.

## 10. Ryzyka i plany awaryjne

| Ryzyko                                                                 | Prawdopodobieństwo | Wpływ  | Plan Awaryjny / Mitygacja                                                                                                                                      |
| :--------------------------------------------------------------------- | :----------------- | :----- | :------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Zależność od zewnętrznych API (Discord, OpenRouter)**                | Średnie            | Wysoki | Implementacja solidnej obsługi błędów, logiki ponawiania (retry). Użycie mocków dla testów jednostkowych i integracyjnych. Monitorowanie statusu API.          |
| **Zmiany w API zewnętrznych serwisów**                                 | Niskie             | Wysoki | Regularne przeglądanie dokumentacji API dostawców. Testy kontraktowe. Szybka adaptacja kodu i testów w przypadku zmian.                                        |
| **Złożoność konfiguracji i testowania shardingu**                      | Średnie            | Średni | Testowanie na mniejszą skalę (kilka serwerów testowych). Intensywne monitorowanie na środowisku stagingowym. Stopniowe wdrażanie na produkcję (jeśli możliwe). |
| **Problemy z dostępnością/stabilnością środowiska testowego Supabase** | Średnie            | Średni | Wykorzystanie lokalnych instancji Supabase (Docker) do testów deweloperskich i CI. Plan B dla dostawcy chmurowego Supabase.                                    |
| **Ograniczone zasoby (czas, ludzie) na przeprowadzenie testów**        | Średnie            | Średni | Ścisła priorytetyzacja testów (risk-based testing). Skupienie się na krytycznych funkcjonalnościach MVP. Automatyzacja kluczowych scenariuszy.                 |
| **Trudności w automatyzacji testów E2E dla bota Discord**              | Średnie            | Średni | Rozpoczęcie od prostszych skryptów, stopniowe rozbudowywanie. W razie potrzeby, większy nacisk na testy manualne i eksploracyjne dla tych obszarów.            |
| **Niska jakość danych w bazie wiedzy wpływająca na odpowiedzi AI**     | Średnie            | Średni | Zapewnienie zestawu reprezentatywnych i poprawnych danych testowych dla bazy wiedzy. Testowanie z różnymi typami zapytań, w tym niejednoznacznymi.             |
| **Niezgodność konfiguracji między środowiskami (dev, staging, prod)**  | Średnie            | Średni | Użycie Infrastructure as Code (np. Docker Compose dla lokalnego Supabase). Standaryzacja zarządzania zmiennymi środowiskowymi. Regularne audyty konfiguracji.  |
| **Wykrycie krytycznych błędów bezpieczeństwa tuż przed wydaniem**      | Niskie             | Wysoki | Przeprowadzanie podstawowych testów bezpieczeństwa na wczesnym etapie. W przypadku wykrycia, odroczenie wydania do czasu naprawy.                              |
