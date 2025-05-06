# Plan implementacji widoku Dashboard

## 1. Przegląd

Dashboard stanowi centralny interfejs dla administratorów serwerów Discord do zarządzania konfiguracją bota AI Support oraz jego bazą wiedzy. Zgodnie z Product Requirements Document (PRD) i dostarczonym projektem UI, widok ten zapewnia nawigację pomiędzy głównymi modułami aplikacji: stroną główną dashboardu, ustawieniami serwera (`Settings`) oraz zarządzaniem bazą wiedzy (`Knowledge`). W wersji Minimum Viable Product (MVP), dashboard będzie operował na statycznym identyfikatorze serwera (`serverId`) pobieranym ze zmiennych środowiskowych, z planem na dynamiczne przełączanie serwerów w przyszłych iteracjach. Layout składa się z górnego paska (`Topbar`), bocznego paska nawigacyjnego (`Sidebar`) na desktopie (zastępowanego wysuwanym panelem `Drawer` na mobile) oraz głównego obszaru treści, gdzie renderowane są poszczególne widoki modułów.

## 2. Routing widoku

Widok Dashboard i jego podstrony będą dostępne pod następującymi ścieżkami, wykorzystując routing oparty na plikach Astro:

- `/dashboard`: Główna strona powitalna dashboardu (`src/pages/dashboard/index.astro`).
- `/dashboard/settings`: Widok konfiguracji serwera (`src/pages/dashboard/settings.astro`).
- `/dashboard/knowledge`: Widok zarządzania bazą wiedzy (`src/pages/dashboard/knowledge.astro`).

W MVP, `serverId` używany w linkach i wywołaniach API będzie stałą wartością (np. z `import.meta.env.STATIC_SERVER_ID`).

## 3. Struktura komponentów

Hierarchia komponentów dla widoku Dashboard:

```
DashboardLayout.astro (`src/layouts/DashboardLayout.astro`)
├── Topbar.tsx (`src/components/dashboard/Topbar.tsx`)
│   └── (Mobile Menu Button - Shadcn Button + Lucide Icon)
├── Sidebar.tsx (`src/components/dashboard/Sidebar.tsx`) (Desktop)
│   └── NavItem.tsx (`src/components/dashboard/NavItem.tsx`) [*]
├── Drawer.tsx (`src/components/dashboard/Drawer.tsx`) (Mobile - uses Shadcn Sheet)
│   └── NavItem.tsx (`src/components/dashboard/NavItem.tsx`) [*]
└── <slot /> (Main Content Area - Astro default slot)
    ├── DashboardHome.astro (`src/pages/dashboard/index.astro`)
    │   └── ModuleCard.tsx (`src/components/dashboard/ModuleCard.tsx`) [*]
    ├── SettingsPage.astro (`src/pages/dashboard/settings.astro`)
    │   ├── BackLink.tsx (`src/components/dashboard/BackLink.tsx`)
    │   └── ServerSettingsView.tsx (`src/components/dashboard/ServerSettingsView.tsx`)
    │       └── (Shadcn Form, Input, Select, Switch, Textarea, etc.)
    └── KnowledgePage.astro (`src/pages/dashboard/knowledge.astro`)
        ├── BackLink.tsx (`src/components/dashboard/BackLink.tsx`)
        └── KnowledgeView.tsx (`src/components/dashboard/KnowledgeView.tsx`)
            ├── (Shadcn Table, TableRow, TableCell, etc.)
            ├── (Shadcn Button for Delete)
            └── (Shadcn Dialog for Upload + Form components)

```

[*] oznacza komponent używany wielokrotnie.

## 4. Szczegóły komponentów

### 4.1 `DashboardLayout.astro`

- **Opis komponentu**: Główny layout dla wszystkich stron w sekcji `/dashboard`. Definiuje strukturę z `Topbar`, `Sidebar`/`Drawer` i obszarem na zawartość strony (`<slot />`). Zarządza stanem widoczności mobilnego `Drawer` za pomocą hooka `useSidebar`.
- **Główne elementy**: Komponenty `Topbar`, `Sidebar`, `Drawer`, `<slot />`. Wykorzystuje Tailwind CSS do responsywnego ukrywania/pokazywania `Sidebar`/`Drawer`.
- **Obsługiwane zdarzenia**: Brak bezpośrednich (przekazuje `toggle`, `close` do `Topbar` i `Drawer`).
- **Obsługiwana walidacja**: Brak.
- **Typy**: `Props` interfejs z `title` i opcjonalnym `activeTab` (dla podświetlenia w `Sidebar`/`Drawer`).
- **Propsy**:
  ```typescript
  interface Props {
    title: string; // Tytuł strony (dla <title> HTML)
    activeTab?: "settings" | "knowledge"; // ID aktywnej zakładki/modułu
  }
  ```

### 4.2 `Topbar.tsx`

- **Opis komponentu**: Górny pasek aplikacji. Zawiera logo, tytuł aplikacji oraz przycisk do otwierania mobilnego `Drawer`. Renderowany jako React component (`client:load` w Astro).
- **Główne elementy**: Logo (SVG lub `<img>`), Tytuł (`<h1>`), `Button` (Shadcn) z ikoną Menu (`lucide-react`) widoczny tylko na mobile (`md:hidden`).
- **Obsługiwane zdarzenia**: `onClick` na przycisku Menu (wywołuje `onToggle`).
- **Obsługiwana walidacja**: Brak.
- **Typy**: Brak specyficznych.
- **Propsy**:
  ```typescript
  interface TopbarProps {
    onToggle: () => void; // Funkcja do przełączania Drawer
  }
  ```

### 4.3 `Sidebar.tsx`

- **Opis komponentu**: Boczny panel nawigacyjny widoczny na desktopie (`hidden md:block`). Wyświetla listę linków do modułów (Settings, Knowledge). Renderowany jako React component (`client:load`).
- **Główne elementy**: Lista komponentów `NavItem` generowana na podstawie `items`. Używa Tailwind do stylizacji.
- **Obsługiwane zdarzenia**: Nawigacja odbywa się przez kliknięcie `NavItem`.
- **Obsługiwana walidacja**: Brak.
- **Typy**: `NavItemType` (zdefiniowany w sekcji 5).
- **Propsy**:
  ```typescript
  interface SidebarProps {
    items: NavItemType[];
    activeItemId?: string; // ID aktywnego elementu do podświetlenia
    serverId: string; // Do konstruowania pełnych URL w NavItem
  }
  ```

### 4.4 `Drawer.tsx`

- **Opis komponentu**: Mobilny panel nawigacyjny (wysuwany z boku). Używa komponentu `Sheet` z Shadcn/ui. Wyświetla te same `NavItem` co `Sidebar`. Renderowany jako React component (`client:load`).
- **Główne elementy**: `Sheet` (Shadcn), lista `NavItem`.
- **Obsługiwane zdarzenia**: Kliknięcie `NavItem` (nawiguje i zamyka drawer), kliknięcie overlay (`SheetOverlay`) lub przycisku zamknij (`SheetClose`) zamyka drawer (obsługiwane przez `onOpenChange` z `Sheet`).
- **Obsługiwana walidacja**: Brak.
- **Typy**: `NavItemType`.
- **Propsy**:
  ```typescript
  interface DrawerProps {
    items: NavItemType[];
    activeItemId?: string;
    isOpen: boolean; // Kontroluje widoczność Sheet
    onClose: () => void; // Funkcja do zamknięcia Drawer
    serverId: string;
  }
  ```

### 4.5 `NavItem.tsx`

- **Opis komponentu**: Pojedynczy element nawigacyjny w `Sidebar`/`Drawer`. Zawiera ikonę i nazwę modułu, opakowane w link (`<a>`). Podświetlany, jeśli jest aktywny.
- **Główne elementy**: `<a>` tag (href konstruowany z `item.href` i `serverId`), ikona (`item.icon`), nazwa (`item.name`). Używa `clsx` lub `cn` do warunkowego dodawania klas `active`.
- **Obsługiwane zdarzenia**: `onClick` (standardowa nawigacja linku).
- **Obsługiwana walidacja**: Brak.
- **Typy**: `NavItemType`.
- **Propsy**:
  ```typescript
  interface NavItemProps {
    item: NavItemType;
    isActive: boolean; // Czy ten element jest aktywny
    serverId: string; // Potrzebny do dynamicznego tworzenia href
  }
  ```

### 4.6 `DashboardHome.astro`

- **Opis komponentu**: Strona główna dashboardu (`/dashboard`). Wyświetla karty prowadzące do głównych modułów aplikacji.
- **Główne elementy**: Tytuł strony, siatka (grid) komponentów `ModuleCard`.
- **Obsługiwane zdarzenia**: Nawigacja przez kliknięcie `ModuleCard`.
- **Obsługiwana walidacja**: Brak.
- **Typy**: `ModuleCardType`.
- **Propsy**: Brak (dane `modules` i `serverId` mogą być zdefiniowane statycznie w skrypcie strony lub pobrane z env).

### 4.7 `ModuleCard.tsx`

- **Opis komponentu**: Karta reprezentująca moduł aplikacji (np. Ustawienia). Używa `Card` z Shadcn/ui. Cała karta jest linkiem. Renderowany jako React component (`client:load`).
- **Główne elementy**: `Card` (Shadcn) opakowany w `<a>`, `CardHeader` z `CardTitle` (tytuł modułu) i ikoną, `CardContent` z `CardDescription`.
- **Obsługiwane zdarzenia**: `onClick` (standardowa nawigacja linku).
- **Obsługiwana walidacja**: Brak.
- **Typy**: `ModuleCardType`.
- **Propsy**:
  ```typescript
  interface ModuleCardProps {
    module: ModuleCardType;
    serverId: string; // Do konstruowania pełnego URL
  }
  ```

### 4.8 `SettingsPage.astro`

- **Opis komponentu**: Strona widoku ustawień serwera (`/dashboard/settings`). Osadza komponent `ServerSettingsView` w `DashboardLayout`.
- **Główne elementy**: `DashboardLayout`, `BackLink`, `ServerSettingsView`. Pobiera `serverId` ze zmiennej środowiskowej i przekazuje do `ServerSettingsView`.
- **Obsługiwane zdarzenia**: Brak (delegowane do `ServerSettingsView`).
- **Obsługiwana walidacja**: Brak (delegowane).
- **Typy**: Brak specyficznych dla strony.
- **Propsy**: Brak (pobiera `serverId` z env).

### 4.9 `KnowledgePage.astro`

- **Opis komponentu**: Strona widoku zarządzania bazą wiedzy (`/dashboard/knowledge`). Osadza komponent `KnowledgeView` w `DashboardLayout`.
- **Główne elementy**: `DashboardLayout`, `BackLink`, `KnowledgeView`. Pobiera `serverId` ze zmiennej środowiskowej i przekazuje do `KnowledgeView`.
- **Obsługiwane zdarzenia**: Brak (delegowane do `KnowledgeView`).
- **Obsługiwana walidacja**: Brak (delegowane).
- **Typy**: Brak specyficznych dla strony.
- **Propsy**: Brak (pobiera `serverId` z env).

### 4.10 `BackLink.tsx`

- **Opis komponentu**: Link powrotny do strony głównej dashboardu (`/dashboard`). Używa `Button` z Shadcn z `variant="link"` i ikoną strzałki. Renderowany jako React component (`client:load`).
- **Główne elementy**: `<a>` tag, `Button` (Shadcn), Ikona `ArrowLeft` (`lucide-react`), Tekst (label).
- **Obsługiwane zdarzenia**: `onClick` (standardowa nawigacja).
- **Obsługiwana walidacja**: Brak.
- **Typy**: Brak.
- **Propsy**:
  ```typescript
  interface BackLinkProps {
    href?: string; // Domyślnie '/dashboard'
    label?: string; // Domyślnie 'Powrót do Dashboard'
    className?: string;
  }
  ```

### 4.11 `ServerSettingsView.tsx`

- **Opis komponentu**: Główny komponent formularza do edycji ustawień serwera. Pobiera aktualne ustawienia z API (`GET /servers/{id}`), pozwala na ich modyfikację i zapisuje zmiany (`PATCH /servers/{id}`). Używa komponentów formularza Shadcn i `react-hook-form`.
- **Główne elementy**: `Form` (Shadcn/`react-hook-form`), `FormField`, `Input`, `Textarea`, `Select`, `Switch`, `Button` (Save). Sekcje dla: General (Active status, Language), AI Config (System Prompt), Channel/Role Config (Inputy na ID kanałów/roli - MVP), Limits (Max Response, Rate Limit). Wskaźniki ładowania (`Skeleton`) i błędu (`Alert`).
- **Obsługiwane zdarzenia**: Zmiany wartości w polach formularza, Submit formularza.
- **Obsługiwana walidacja**:
  - Użycie `zod` i `react-hook-form` resolver do walidacji `ServerSettingsFormViewModel`.
  - Wymagane pola: `systemPrompt`, `language`.
  - Walidacja formatu ID dla ról/kanałów (jeśli to inputy tekstowe - np. regex `^\d+$`).
  - Walidacja numeryczna dla limitów (np. `min: 1`).
- **Typy**: `ServerDetail` (z API), `ServerSettingsFormViewModel` (lokalny stan formularza), `UpdateServerCommand` (do wysłania API).
- **Propsy**:
  ```typescript
  interface ServerSettingsViewProps {
    serverId: string;
  }
  ```

### 4.12 `KnowledgeView.tsx`

- **Opis komponentu**: Komponent do zarządzania dokumentami bazy wiedzy. Wyświetla tabelę dokumentów (`Table` Shadcn) pobranych z API (`GET /servers/{id}/documents`) z paginacją. Umożliwia dodanie nowego dokumentu przez `Dialog` (Shadcn) i usunięcie istniejącego.
- **Główne elementy**: `Button` (Upload New), `Table` (Shadcn) z kolumnami: Title, Type, Created At, Actions (Delete Button). Komponent paginacji (np. niestandardowy lub biblioteka). `Dialog` (Shadcn) z formularzem do uploadu (Input Title, Input File). `AlertDialog` (Shadcn) do potwierdzenia usunięcia. Wskaźniki ładowania (`Skeleton`) i błędu (`Alert`). Filtry/wyszukiwanie (Input `q`, Select `fileType`).
- **Obsługiwane zdarzenia**: Kliknięcie "Upload New" (otwiera Dialog), Submit formularza uploadu, Kliknięcie "Delete" (otwiera AlertDialog), Potwierdzenie usunięcia, Zmiana strony w paginacji, Zmiana filtrów/wyszukiwania.
- **Obsługiwana walidacja**:
  - W formularzu uploadu: wymagany tytuł, wymagany plik.
  - Walidacja typu pliku (`.txt`, `.md`, `.pdf`) po stronie klienta przed wysłaniem.
  - Walidacja rozmiaru pliku (< 10MB) po stronie klienta przed wysłaniem.
- **Typy**: `DocumentList`, `KnowledgeDocument` (z API), `KnowledgeViewState` (lokalny stan komponentu), `UploadDocumentCommand` (dla wariantu JSON, multipart wymaga `FormData`).
- **Propsy**:
  ```typescript
  interface KnowledgeViewProps {
    serverId: string;
  }
  ```

## 5. Typy

### 5.1 Typy DTO (z `src/types.ts`)

- `ServerDetail`: Odpowiedź z `GET /servers/{id}`.
- `UpdateServerCommand`: Ciało żądania dla `PATCH /servers/{id}`.
- `KnowledgeDocument`: Element listy dokumentów.
- `DocumentList`: Odpowiedź z `GET /servers/{id}/documents`.
- `ErrorResponse`: Standardowy format błędu API.

### 5.2 Typy Nawigacyjne i Kart (ViewModel)

- **`NavItemType`**:
  ```typescript
  interface NavItemType {
    id: string; // np. 'settings', 'knowledge'
    name: string; // Wyświetlana nazwa np. "Ustawienia", "Baza Wiedzy"
    href: string; // Ścieżka docelowa np. '/dashboard/settings'
    icon?: React.ComponentType<{ className?: string }>; // Ikona Lucide
  }
  ```
- **`ModuleCardType`**:
  ```typescript
  interface ModuleCardType {
    id: string; // np. 'settings', 'knowledge'
    title: string; // Tytuł karty
    description: string; // Opis karty
    href: string; // Wzorzec URL np. '/dashboard/{serverId}/settings'
    icon?: React.ComponentType<{ className?: string }>; // Ikona Lucide
    color?: string; // Opcjonalny kolor akcentu karty
  }
  ```

### 5.3 Lokalne Typy Stanu (ViewModel)

- **`ServerSettingsFormViewModel`**:
  ```typescript
  // Mapuje pola z ServerDetail.config i ServerDetail.active na potrzeby formularza
  interface ServerSettingsFormViewModel {
    isBotActive: boolean; // Mapowane z ServerDetail.active
    language: string; // Mapowane z ServerDetail.config.language
    systemPrompt: string; // Mapowane z ServerDetail.config.systemPrompt
    // Pola dla ID kanałów/roli - w MVP mogą być stringami z ID oddzielonymi przecinkami lub newline
    enabledChannelsStr: string; // Do zmapowania na/z config.channels (string[])
    supportPingRoleStr: string; // Do zmapowania na/z config.pingRole (string)
    // Limity
    maxResponseLength: number; // Mapowane z ServerDetail.config.limits.maxResponseLength
    rateLimitPerUser: number; // Mapowane z ServerDetail.config.limits.rateLimitPerUser
  }
  ```
  _Uwaga: Mapowanie `enabledChannelsStr` i `supportPingRoleStr` na/z `config` wymaga logiki konwersji._
- **`KnowledgeViewState`**:
  ```typescript
  interface KnowledgeViewState {
    documents: KnowledgeDocument[]; // Lista dokumentów na bieżącej stronie
    isLoading: boolean; // Czy trwa ładowanie danych z API
    error: ErrorResponse | null; // Ostatni błąd API
    pagination: {
      currentPage: number;
      pageSize: number;
      totalDocuments: number;
    };
    isUploadDialogOpen: boolean; // Czy dialog uploadu jest otwarty
    uploadFormData: {
      // Stan formularza w dialogu uploadu
      file: File | null;
      title: string;
      isUploading: boolean;
      uploadError: string | null;
    };
    isDeleteDialogOpen: boolean; // Czy dialog potwierdzenia usunięcia jest otwarty
    documentToDelete: KnowledgeDocument | null; // Dokument wybrany do usunięcia
    // Stan filtrów i wyszukiwania
    searchQuery: string;
    selectedFileType: "txt" | "md" | "pdf" | null;
  }
  ```

## 6. Zarządzanie stanem

- **Stan globalny (Zustand/Context API/Nanostores):**
  - W MVP nie jest ściśle wymagany, ponieważ `serverId` jest statyczny.
  - Post-MVP: Konieczny do przechowywania `selectedServerId` i ewentualnie `currentUser`. Zustand jest opcją z tech stacku.
- **Stan lokalny komponentów:**

  - **`DashboardLayout.astro`**: Zarządza stanem `isOpen` dla mobilnego `Drawer` za pomocą hooka `useSidebar`.

    ```typescript
    // Hook do zarządzania stanem sidebara (zaproponowany w UI spec)
    // src/hooks/useSidebar.ts
    import { useState, useEffect } from "react";

    const useSidebar = () => {
      const [isOpen, setIsOpen] = useState(false);

      const toggleSidebar = () => setIsOpen(!isOpen);
      const openSidebar = () => setIsOpen(true);
      const closeSidebar = () => setIsOpen(false);

      useEffect(() => {
        // Zamykanie na resize (opcjonalne, Sheet z Shadcn może to robić)
        const handleResize = () => {
          if (window.innerWidth >= 768) {
            // md breakpoint Tailwind
            setIsOpen(false);
          }
        };
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
      }, []);

      // Dodatkowa logika: zamykanie przy zmianie ścieżki (jeśli używamy React Router wewnątrz)
      // useEffect(() => { closeSidebar(); }, [location.pathname]); // Wymaga dostępu do location

      return { isOpen, toggleSidebar, openSidebar, closeSidebar };
    };
    ```

  - **`ServerSettingsView.tsx`**: Używa `useState` do zarządzania stanem ładowania (`isLoading`), błędów (`error`) oraz `react-hook-form` do zarządzania stanem formularza (`ServerSettingsFormViewModel`).
  - **`KnowledgeView.tsx`**: Używa `useState` lub `useReducer` do zarządzania złożonym stanem `KnowledgeViewState` (lista dokumentów, paginacja, stan dialogów, ładowanie, błędy, filtry).

## 7. Integracja API

Integracja z API REST będzie realizowana za pomocą standardowej funkcji `fetch` lub biblioteki typu `axios`/`ky` opakowanej w dedykowane funkcje serwisowe.

- **Autentykacja**: Zakładając, że middleware Astro obsługuje przepływ OAuth i ustawia bezpieczne ciasteczko z JWT, frontendowe wywołania `fetch` nie muszą bezpośrednio zarządzać tokenem (przeglądarka wyśle ciasteczko). Jeśli token jest przechowywany inaczej (np. localStorage - mniej bezpieczne), `fetch` musi dodawać nagłówek `Authorization: Bearer <token>`.
- **`ServerSettingsView.tsx`**:
  - Przy montowaniu komponentu: Wywołanie `GET /servers/{serverId}`.
    - Żądanie: Brak ciała. Nagłówek `Authorization`.
    - Odpowiedź: `ServerDetail` (200 OK) lub `ErrorResponse` (401, 403, 404, 500).
    - Akcja: Wypełnienie formularza danymi. Obsługa stanu ładowania/błędu.
  - Przy zapisie (submit): Wywołanie `PATCH /servers/{serverId}`.
    - Żądanie: Ciało `UpdateServerCommand` (zbudowane z `ServerSettingsFormViewModel`). Nagłówek `Authorization`, `Content-Type: application/json`.
    - Odpowiedź: `Server` (200 OK) lub `ErrorResponse` (400, 401, 403, 404, 500).
    - Akcja: Wyświetlenie powiadomienia (Toast) o sukcesie/błędzie. Aktualizacja stanu formularza (np. `isDirty`).
- **`KnowledgeView.tsx`**:

  - Przy montowaniu i zmianie paginacji/filtrów: Wywołanie `GET /servers/{serverId}/documents` z parametrami `page`, `pageSize`, `q`, `fileType`.
    - Żądanie: Brak ciała. Nagłówek `Authorization`.
    - Odpowiedź: `DocumentList` (200 OK) lub `ErrorResponse`.
    - Akcja: Aktualizacja stanu `KnowledgeViewState` (dokumenty, paginacja, isLoading, error).
  - Przy uploadzie pliku: Wywołanie `POST /servers/{serverId}/documents`.
    - Żądanie: Ciało `FormData` z polami `file` (plik) i `title` (string). Nagłówek `Authorization`. Przeglądarka sama ustawi `Content-Type: multipart/form-data`.
    - Odpowiedź: `KnowledgeDocument` (201 Created) lub `ErrorResponse`.
    - Akcja: Zamknięcie dialogu, wyświetlenie powiadomienia, odświeżenie listy dokumentów. Obsługa stanu ładowania/błędu w dialogu.
  - Przy usuwaniu dokumentu: Wywołanie `DELETE /servers/{serverId}/documents/{docId}`.
    - Żądanie: Brak ciała. Nagłówek `Authorization`.
    - Odpowiedź: Status 204 No Content lub `ErrorResponse`.
    - Akcja: Zamknięcie dialogu potwierdzenia, wyświetlenie powiadomienia, odświeżenie listy dokumentów.

- **Funkcje pomocnicze API**: Zalecane jest stworzenie funkcji wrapperów dla `fetch` w `src/lib/apiClient.ts`, które będą automatycznie dodawać nagłówki, obsługiwać podstawowe błędy i parsować JSON.

## 8. Interakcje użytkownika

1.  **Nawigacja między modułami**: Kliknięcie elementu w `Sidebar` (desktop) lub `Drawer` (mobile) przenosi użytkownika do odpowiedniej strony (`/dashboard/settings` lub `/dashboard/knowledge`). Aktywny link jest wizualnie wyróżniony.
2.  **Nawigacja na stronie głównej**: Kliknięcie `ModuleCard` na `/dashboard` przenosi do odpowiedniego modułu.
3.  **Powrót**: Kliknięcie `BackLink` na podstronach (`settings`, `knowledge`) przenosi użytkownika z powrotem do `/dashboard`.
4.  **Otwieranie/Zamykanie Menu Mobilnego**: Kliknięcie przycisku hamburgera w `Topbar` na mobile otwiera `Drawer`. Kliknięcie poza `Drawer` lub na element nawigacyjny wewnątrz zamyka `Drawer`.
5.  **Formularz Ustawień**:
    - Użytkownik modyfikuje pola formularza.
    - Przycisk "Zapisz" jest aktywny tylko, jeśli formularz jest poprawny i zaszły zmiany (`isDirty` z `react-hook-form`).
    - Kliknięcie "Zapisz" inicjuje wywołanie API (`PATCH`), pokazuje stan ładowania na przycisku, a po zakończeniu wyświetla Toast z wynikiem. Błędy walidacji są pokazywane przy polach.
6.  **Zarządzanie Bazą Wiedzy**:
    - Kliknięcie "Dodaj Dokument" otwiera `Dialog` uploadu.
    - Wypełnienie formularza uploadu, wybranie pliku. Walidacja typu/rozmiaru pliku odbywa się po wybraniu.
    - Kliknięcie "Upload" w dialogu inicjuje wysyłanie (`POST`), pokazuje stan ładowania, a po zakończeniu zamyka dialog i odświeża listę, pokazując Toast.
    - Kliknięcie ikony "Usuń" przy dokumencie otwiera `AlertDialog` potwierdzający.
    - Kliknięcie "Potwierdź Usunięcie" inicjuje wywołanie API (`DELETE`), a po zakończeniu zamyka dialog i odświeża listę, pokazując Toast.
    - Zmiana strony w paginacji lub zmiana filtrów/wyszukiwania inicjuje ponowne pobranie listy dokumentów (`GET`).

## 9. Warunki i walidacja

- **Dostęp**: Widok `/dashboard` i podstrony powinny być dostępne tylko dla zalogowanych użytkowników (obsługa przez middleware Astro sprawdzający sesję/token). Dalsza autoryzacja na poziomie API (RLS).
- **Walidacja Formularzy (po stronie klienta)**:
  - **`ServerSettingsView`**: Walidacja za pomocą `zod` i `react-hook-form` zgodnie ze schematem `ServerSettingsFormViewModel`. Komunikaty o błędach wyświetlane przy polach. Przycisk zapisu nieaktywny przy błędach.
  - **`KnowledgeView` (Upload Dialog)**: Wymagany tytuł i plik. Sprawdzenie typu pliku (akceptowane rozszerzenia: `.txt`, `.md`, `.pdf`) i rozmiaru (< 10MB) przy wyborze pliku. Komunikaty o błędach w dialogu. Przycisk uploadu nieaktywny przy błędach.
- **Stan przycisków**: Przyciski akcji (Zapisz, Upload, Potwierdź Usunięcie) powinny mieć stan `disabled` podczas trwania operacji API, aby zapobiec wielokrotnym kliknięciom.

## 10. Obsługa błędów

1.  **Błędy API**:
    - Wszystkie wywołania `fetch` opakowane w `try...catch`.
    - Sprawdzanie `response.ok`. Jeśli `false`, próba sparsowania `ErrorResponse` z ciała odpowiedzi.
    - Wyświetlanie użytkownikowi komunikatu błędu za pomocą komponentu `Toast` (`sonner`). Jeśli `ErrorResponse.error.details` zawiera informacje o polach, można je dodatkowo uwypuklić w formularzu (choć zazwyczaj walidacja 400 powinna być łapana przez walidację klienta).
    - Obsługa specyficznych kodów: 401/403 (problem z sesją/uprawnieniami - może wymagać przekierowania do logowania lub pokazania komunikatu o braku dostępu), 404 (zasób nie znaleziony), 409 (konflikt), 429 (rate limit), 500 (błąd serwera).
    - Pełny obiekt błędu logowany do konsoli deweloperskiej lub systemu monitorowania błędów.
2.  **Błędy sieciowe**: `catch` bloku `fetch` powinien obsłużyć brak połączenia i wyświetlić odpowiedni Toast.
3.  **Błędy walidacji po stronie klienta**: Obsługiwane przez `react-hook-form` (dla ustawień) lub ręcznie (dla uploadu plików), z komunikatami przy polach lub w obrębie dialogu.
4.  **Stany pustki/ładowania**:
    - `KnowledgeView`: Wyświetlanie komunikatu "Brak dokumentów" jeśli lista jest pusta. Wyświetlanie komponentów `Skeleton` (Shadcn) podczas ładowania danych tabeli.
    - `ServerSettingsView`: Wyświetlanie `Skeleton` dla pól formularza podczas początkowego ładowania danych.

## 11. Kroki implementacji

1.  **Konfiguracja Projektu**: Upewnić się, że Astro jest skonfigurowane do użycia Reacta (`@astrojs/react`) i Tailwind CSS (`@astrojs/tailwind`). Zainstalować potrzebne biblioteki: `shadcn-ui` (z wymaganymi komponentami), `lucide-react`, `react-hook-form`, `@hookform/resolvers` (dla zod), `zod`, `zustand` (opcjonalnie), `sonner`. Skonfigurować `shadcn-ui` CLI.
2.  **Utworzenie Struktury Katalogów i Plików**: Stworzyć pliki `.astro` i `.tsx` zgodnie ze strukturą komponentów w sekcji 3, w odpowiednich katalogach (`src/layouts`, `src/pages/dashboard`, `src/components/dashboard`, `src/hooks`).
3.  **Implementacja `DashboardLayout.astro`**: Stworzyć bazowy layout, zintegrować hook `useSidebar`, dodać komponenty `Topbar`, `Sidebar`, `Drawer` i `<slot />`. Zastosować responsywne klasy Tailwind.
4.  **Implementacja Komponentów Nawigacyjnych**: Zaimplementować `Topbar.tsx`, `Sidebar.tsx`, `Drawer.tsx` (używając `Sheet` z Shadcn), `NavItem.tsx`. Przekazać potrzebne propsy (items, activeItemId, serverId, callbacks). Zdefiniować `NavItemType` i `ModuleCardType`.
5.  **Implementacja Strony Głównej (`DashboardHome.astro`)**: Stworzyć stronę `/dashboard`, użyć `DashboardLayout`, wyświetlić siatkę `ModuleCard.tsx`. Zdefiniować dane dla kart statycznie lub w skrypcie strony.
6.  **Implementacja `BackLink.tsx`**: Stworzyć reużywalny komponent linku powrotnego.
7.  **Implementacja Strony Ustawień (`SettingsPage.astro` i `ServerSettingsView.tsx`)**:
    - Stworzyć `SettingsPage.astro` używając `DashboardLayout` i `BackLink`.
    - Stworzyć `ServerSettingsView.tsx`. Zaimplementować pobieranie danych (`GET /servers/{serverId}`). Zbudować formularz używając `react-hook-form`, `zod` i komponentów Shadcn. Zaimplementować logikę zapisu (`PATCH /servers/{serverId}`). Dodać obsługę stanu ładowania i błędów. Zdefiniować `ServerSettingsFormViewModel`.
8.  **Implementacja Strony Bazy Wiedzy (`KnowledgePage.astro` i `KnowledgeView.tsx`)**:
    - Stworzyć `KnowledgePage.astro` używając `DashboardLayout` i `BackLink`.
    - Stworzyć `KnowledgeView.tsx`. Zaimplementować pobieranie listy dokumentów (`GET /servers/{serverId}/documents`) z obsługą paginacji i filtrów. Wyświetlić dane w `Table` Shadcn. Zaimplementować `Dialog` do uploadu plików (z walidacją klienta i wysyłką `multipart/form-data` via `POST`). Zaimplementować usuwanie dokumentów (`DELETE`) z `AlertDialog` potwierdzającym. Dodać obsługę stanów (ładowanie, błędy, pusta lista, dialogi). Zdefiniować `KnowledgeViewState`.
9.  **Obsługa Statycznego `serverId`**: Zdecydować o sposobie dostarczenia statycznego `serverId` do komponentów (np. `import.meta.env.STATIC_SERVER_ID` w plikach `.astro` i przekazanie jako prop do komponentów `.tsx`).
10. **Styling**: Dopracować wygląd komponentów używając Tailwind CSS i możliwości konfiguracyjnych Shadcn/ui, aby pasował do projektu UI. Zastosować ciemny motyw domyślnie.
11. **Testowanie**: Przetestować przepływy użytkownika, responsywność, obsługę błędów i poprawność działania formularzy oraz interakcji z API.
12. **Refaktoryzacja i Optymalizacja**: Poprawić kod, wydzielić reużywalne fragmenty, zoptymalizować zapytania API i renderowanie.
