# Discord AI Support Bot - UI Architecture Planning Summary

## Decyzje

1. UI będzie obsługiwać tylko rolę Administratora, wykorzystując istniejące uprawnienia z Discord.
2. MVP skupi się wyłącznie na konfiguracji serwera i zarządzaniu dokumentami wiedzy.
3. Zarządzanie administratorami serwera będzie obsługiwane przez DiscordJS, nie przez UI.
4. Wszystkie pola konfiguracyjne serwera będą edytowalne, używając nazw z bazy danych (np. "support_role_id").
5. Endpointy aktywacji/deaktywacji/odświeżenia konfiguracji będą dostępne jako przyciski w interfejsie.
6. Zarządzanie dokumentami będzie obsługiwać wszystkie operacje CRUD, włącznie z możliwością bezpośredniego wklejania tekstu.
7. Wyszukiwanie i filtrowanie dokumentów nie będzie zaimplementowane w MVP, ale ważna jest możliwość przeglądania zawartości plików.
8. Lista serwerów będzie zawierać nazwę, ikonę, status i stan aktywności.
9. Zmiany w konfiguracji powinny być natychmiastowe, z prostą implementacją.
10. Interfejs będzie projektowany głównie dla komputerów, z podstawową responsywnością na tablety i smartfony przy użyciu wariantów Tailwind.
11. UI będzie spełniać standardy dostępności WCAG AA.
12. Podstawowe mechanizmy obsługi błędów i powiadomień tylko tam, gdzie absolutnie konieczne.
13. Autentykacja JWT zostanie zaimplementowana później, nie w MVP.
14. Zarządzanie stanem aplikacji przy użyciu React hooks i Context API, z możliwością późniejszego dodania Zustand.
15. Brak buforowania w MVP.
16. Układ strony będzie zawierał sidebar do nawigacji po ustawieniach serwera i topbar z informacjami ogólnymi.
17. Komunikacja między dashboardem a botem będzie odbywać się przez bazę danych.
18. W ramach ścieżki `/dashboard` zostanie zaimplementowany centralny widok nawigacyjny z możliwością szybkiego powrotu z podstron.

## Rekomendacje

1. Użycie `shadcn/ui` + Tailwind CSS do budowy spójnych komponentów UI (formularze, tabele, przyciski, toasty).
2. Zdefiniowanie routingu z React Router DOM dla głównych ścieżek: `/servers`, `/servers/:id`, `/servers/:id/documents`, `/servers/:id/settings`.
3. Użycie React Hooks + Context API do zarządzania stanem aplikacji.
4. Wdrożenie prostych stanów ładowania (spinner/Skeleton) dla dłuższych wywołań API.
5. Implementacja podstawowego Error Boundary dla obsługi krytycznych błędów.
6. Layout responsywny z sidebarem (desktop) i drawerem (mobile) oraz topbarem z informacjami o serwerze i użytkowniku.
7. Użycie breakpointów Tailwind (`sm:`, `md:`, `lg:`) do podstawowej responsywności.
8. Utworzenie typowanego klienta API (fetch + Zod/schema) dla głównych endpointów.
9. Implementacja prostego widoku listy dokumentów z możliwością przewijania, bez paginacji i filtrowania.
10. Użycie modalnych okien dialogowych dla operacji na dokumentach (upload, edycja, usuwanie, reindeksacja).
11. Implementacja toastów/alertów do komunikatów o sukcesie i błędach HTTP.
12. Zapewnienie podstawowej dostępności zgodnej z WCAG AA.
13. Dodanie guard clauses i modalnych potwierdzeń dla operacji krytycznych.
14. Wdrożenie prostej logiki ponawiania dla tymczasowych błędów sieci i fallback UI dla nieautoryzowanego dostępu.
15. Mapowanie pól konfiguracyjnych z API do odpowiednich komponentów UI (np. przełączniki, pola wyboru, pola tekstowe).
16. Dodanie centralnego dashboardu (`/dashboard`) z linkami do ustawień i dokumentów oraz breadcrumb/linkiem powrotu.

## Szczegółowe podsumowanie planowania architektury UI

### Ogólne założenia

UI dla MVP będzie skoncentrowane na administratorach serwerów Discord, którzy potrzebują prostego, intuicyjnego interfejsu do konfiguracji bota i zarządzania bazą wiedzy. Interfejs ma być przede wszystkim optymalny dla komputerów stacjonarnych, z podstawową obsługą urządzeń mobilnych.

### Kluczowe widoki i przepływy użytkownika

#### 1. Lista serwerów

- Widok wszystkich serwerów, którymi zarządza zalogowany użytkownik
- Serwery, którymi administrator może zarządzać mają pełne kolory, pozostałe są przyciemnione i monochromatyczne
- Każdy serwer wyświetla nazwę, ikonę, status online/offline i stan aktywności
- Kliknięcie w serwer przenosi do widoku konfiguracji tego serwera

#### 2. Konfiguracja serwera

- Główny panel z najważniejszymi ustawieniami (włączenie/wyłączenie bota, język, instrukcje dla AI)
- Przyciski do aktywacji/deaktywacji bota i odświeżenia konfiguracji
- Formularz do konfiguracji wszystkich parametrów bota (channels, support_role_id, limity wiadomości)
- Możliwość edycji systemprompt dla modelu AI
- Mapowanie pól konfiguracyjnych na odpowiednie komponenty UI:
  - enabled → przełącznik (switch/toggle)
  - language → dropdown z listą języków
  - systemPrompt → textarea z formatowaniem markdown
  - channels → multi-select z nazwami kanałów
  - support_role_id → dropdown z rolami (pokazujący nazwy ról)
  - maxMessagesPerUser → pole numeryczne z min/max
  - maxTextLength → pole numeryczne z min/max

#### 3. Zarządzanie dokumentami

- Lista dokumentów z możliwością podglądu zawartości
- Formularz do uploadu nowych dokumentów (.txt, .md, .pdf)
- Pole tekstowe do bezpośredniego wklejania zawartości (jako dokument .txt)
- Modalne okna do edycji, usuwania i reindeksacji dokumentów
- Podgląd zawartości dokumentów

#### 0. Dashboard (centralny widok nawigacyjny)

- Dostępny pod `/dashboard` jako główny punkt wejścia do aplikacji
- Zawiera sidebar z linkami do głównych modułów (Ustawienia, Dokumenty) oraz topbar z nazwą projektu
- W MVP linki przyjmują statyczny lub konfigurowalny `serverId`; po dodaniu listy serwerów będą generowane dynamicznie
- Każda podstrona (Settings, Documents) posiada widoczny link "Powrót do Dashboard"
- Sidebar zamienia się w drawer na urządzeniach mobilnych

### Strategia integracji z API i zarządzania stanem

#### Integracja z API

- Typowany klient API z fetch + Zod dla walidacji typów
- Bezpośrednie mapowanie endpointów API do operacji UI
- Obsługa głównych endpointów:
  - GET/POST/DELETE/PATCH dla serwerów i dokumentów
  - Zarządzanie konfiguracją serwera
  - Aktywacja/deaktywacja/odświeżanie konfiguracji
- Podstawowa obsługa błędów HTTP

#### Komunikacja dashboard-bot

- Bot i dashboard komunikują się przez bazę danych, bez bezpośredniego połączenia
- Dashboard zapisuje konfigurację w bazie danych przez API
- Bot regularnie odpytuje bazę lub wykorzystuje mechanizm powiadomień (NOTIFY w PostgreSQL)
- Bot aktualizuje swoją konfigurację po wykryciu zmian

#### Zarządzanie stanem

- Wykorzystanie React hooks (useState, useEffect, useReducer) oraz Context API
- Brak zaawansowanego buforowania czy reakcji na zmiany w czasie rzeczywistym
- Osobne konteksty dla głównych zasobów (serwery, dokumenty, konfiguracja)
- Proste mechanizmy odświeżania danych po operacjach modyfikacji

### Responsywność, dostępność i bezpieczeństwo

#### Responsywność

- Układ oparty na Tailwind CSS z wykorzystaniem wariantów breakpointów (sm:, md:, lg:)
- Sidebar dla nawigacji na desktopie, drawer na urządzeniach mobilnych
- Topbar zawierający nazwę i ikonę wybranego serwera oraz dane zalogowanego użytkownika

#### Dostępność (WCAG AA)

- Semantyczne znaczniki HTML i prawidłowe etykiety formularzy
- Odpowiedni kontrast kolorów zgodny z WCAG AA
- Pełna obsługa nawigacji klawiaturą
- Komunikaty o błędach i stanach dostępne dla technologii asystujących

#### Bezpieczeństwo

- JWT autentykacja będzie zaimplementowana w późniejszym etapie, nie w MVP
- Podstawowe zabezpieczenia UI przed nieautoryzowanym dostępem
- Guard clauses i modalne potwierdzenia dla operacji krytycznych

### Technologia i komponenty

- React z React Router DOM do nawigacji
- Tailwind CSS do stylowania
- shadcn/ui dla komponentów interfejsu
- React hooks i Context API do zarządzania stanem
- Proste powiadomienia (toasty) i okna modalne w kluczowych miejscach
