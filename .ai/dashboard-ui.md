# Dokumentacja Interfejsu Użytkownika - Dashboard Bota Discord AI Support

## Wprowadzenie

Niniejszy dokument szczegółowo opisuje interfejs użytkownika (UI) dashboardu administracyjnego dla bota Discord AI Support. Celem jest dostarczenie kompleksowego przewodnika wizualnego i funkcjonalnego, który umożliwi odtworzenie wyglądu i działania interfejsu zgodnie z założeniami projektu opisanymi w PRD oraz aktualną implementacją.

Dokumentacja skupia się na aspektach wizualnych, układzie, interakcjach, responsywności oraz wykorzystanych komponentach, pomijając szczegóły implementacyjne kodu. 

## 1. Ogólny układ i struktura dashboardu

Interfejs dashboardu został zaprojektowany z myślą o przejrzystości i łatwości nawigacji, inspirowany układem znanym z aplikacji Discord. Na większych ekranach (desktop) dominuje układ dwukolumnowy:

1.  **Boczny pasek nawigacyjny (Sidebar):**
    *   Umieszczony po lewej stronie ekranu, o stałej szerokości (72px).
    *   Widoczny tylko na ekranach o szerokości `md` (medium) i większych.
    *   Zawiera pionowo ułożone elementy:
        *   **Logo aplikacji:** Ikona bota w stylizowanym kwadracie na górze.
        *   **Separator:** Linia oddzielająca logo od listy serwerów.
        *   **Lista serwerów:** Ikony reprezentujące dostępne serwery. Wybrany serwer jest wizualnie wyróżniony. Każda ikona serwera posiada wskaźnik statusu (online/offline) w prawym dolnym rogu.
        *   **Separator:** Linia oddzielająca listę serwerów od ikony użytkownika.
        *   **Ikona użytkownika:** Umieszczona na samym dole paska.
    *   Służy do przełączania kontekstu pomiędzy zarządzanymi serwerami Discord. Kliknięcie ikony serwera powoduje załadowanie jego konfiguracji i danych w głównej części interfejsu.

2.  **Główny obszar treści (Main Content Area):**
    *   Zajmuje pozostałą część ekranu na prawo od sidebara.
    *   Składa się z dwóch głównych części:
        *   **Górny pasek (Topbar):** Wyświetlany na całej szerokości obszaru treści. Zawiera:
            *   Nagłówek aplikacji z ikoną bota, nazwą "Discord AI Support" i podtytułem.
            *   Wskaźnik aktualnie wybranego serwera po prawej stronie (ikona + nazwa).
            *   Poniżej nagłówka znajduje się poziomy pasek zakładek (Tabs) służący do nawigacji w ramach wybranego serwera. Dostępne zakładki to: "Knowledge Base", "System Prompt", "Configuration". Aktywna zakładka jest wizualnie wyróżniona.
        *   **Obszar zawartości (Content Area):** Poniżej górnego paska. Wyświetla zawartość odpowiadającą aktualnie wybranej zakładce (np. listę dokumentów bazy wiedzy, formularz ustawień serwera).
        *   Jeśli żaden serwer nie jest wybrany (stan początkowy), w obszarze zawartości wyświetlany jest komunikat zachęcający do wybrania serwera z bocznego paska.

Nawigacja w aplikacji opiera się głównie na stanie: wybór serwera w sidebarze aktualizuje globalny kontekst, a wybór zakładki w topbarze przełącza widoczną treść w głównym obszarze. Obecna implementacja nie wykorzystuje routingu opartego na adresach URL do przełączania widoków w obrębie jednego serwera. 

## 2. Wykorzystane kolory, czcionki i inne elementy stylistyczne

Dashboard utrzymany jest w nowoczesnym, minimalistycznym stylu, silnie inspirowanym estetyką aplikacji Discord. Kluczowe elementy stylistyczne obejmują:

*   **Motyw wizualny:** Domyślnie stosowany jest ciemny motyw (Dark Mode), zapewniający wysoki kontrast i komfort użytkowania, szczególnie w warunkach słabego oświetlenia. Jasny motyw jest również zdefiniowany, ale ciemny jest preferowany i domyślny.

*   **Paleta kolorów:**
    *   **Tła:** Dominują ciemne odcienie szarości, zgodne z paletą Discord (np. tło główne `~#313338`, tło kart/komponentów `~#2B2D31`, sidebar `~#1E1F22`). Zmienne CSS (`--background`, `--card`, itp.) oraz niestandardowe kolory Tailwind (`bg-discord-gray-XXX`) definiują te odcienie.
    *   **Akcenty:** Charakterystyczny dla Discord kolor "Blurple" (`~#5865F2`) oraz jego jaśniejsze warianty są używane do wyróżniania aktywnych elementów nawigacyjnych (ikony serwerów, zakładki), przycisków akcji, linków oraz w gradientach.
    *   **Tekst:** Podstawowy tekst jest w kolorze jasnoszarym lub białym (`~#EDEEF0`, `--foreground`), zapewniając dobrą czytelność na ciemnym tle.
    *   **Statusy:** Wykorzystywane są standardowe kolory do sygnalizacji statusu: zielony (`~#23A55A`, `discord-green`) dla stanu "online" i czerwony (`~#F23F43`, `discord-red`) dla "offline".
    *   **Obramowania i Pola:** Używane są subtelne, ciemne obramowania (`--border`) i tła dla pól formularzy (`--input`), dopasowane do ciemnego motywu.

*   **Typografia:**
    *   **Krój pisma:** Podstawowym krojem jest "gg sans", znany z interfejsu Discord, co wzmacnia spójność wizualną. Zdefiniowano również standardowe czcionki systemowe jako alternatywę (fallback).
    *   **Rozmiary i Wagi:** Hierarchia informacji jest budowana za pomocą różnych rozmiarów i wag czcionki, zgodnie z definicjami klas Tailwind oraz stylami bazowymi w `index.css`. Nagłówki są pogrubione (`font-medium`) i mają zmniejszony tracking (`tracking-tight`).

*   **Elementy graficzne i styl:**
    *   **Ikony:** Spójny zestaw ikon z biblioteki `lucide-react` jest używany w całym interfejsie do reprezentowania akcji, obiektów i sekcji.
    *   **Zaokrąglenia:** Większość elementów interaktywnych (przyciski, karty, pola input) posiada zaokrąglone rogi (standardowo `0.5rem`, ale używane są też większe promienie np. dla ikon serwerów `rounded-[24px]`, `rounded-2xl`), co nadaje interfejsowi miękki, nowoczesny wygląd.
    *   **Cienie:** Subtelne cienie są stosowane do niektórych elementów (np. przyciski w sidebarze, aktywne zakładki), aby dodać im głębi i wyróżnić je na tle.
    *   **Gradienty:** Liniowe i radialne gradienty (głównie w odcieniach "Blurple") są używane do wzmocnienia wizualnego efektu aktywnych/wyróżnionych elementów.
    *   **Separatory:** Delikatne linie oddzielają sekcje w sidebarze i potencjalnie w innych miejscach interfejsu, pomagając w organizacji treści.
    *   **Animacje:** Zastosowano subtelne animacje dla poprawy doświadczenia użytkownika: delikatne pulsowanie/unoszenie się (`animate-float`, `animate-glow`) dla aktywnych/wyróżnionych elementów oraz płynne przejścia/pojawianie się treści (`animate-in fade-in-50`, `transition-all`). 

## 3. Interakcje użytkownika

Interfejs dashboardu oferuje szereg interakcji, które mają na celu ułatwienie nawigacji i obsługi, zapewniając jednocześnie czytelny feedback dla użytkownika.

*   **Efekty najechania kursorem (Hover):**
    *   **Ikony serwerów (Sidebar):** Przy najechaniu kursorem, ikona serwera subtelnie zmienia kształt (z mocniej zaokrąglonego na mniej), tło wypełnia się gradientem "Blurple", a wokół pojawia się cień. Zapewnia to wyraźną wizualną wskazówkę interaktywności.
    *   **Logo i ikona użytkownika (Sidebar):** Podobne efekty wizualne jak dla ikon serwerów (zmiana zaokrąglenia, tła, cień).
    *   **Zakładki (Tabs):** Przy najechaniu, zakładki delikatnie zmieniają swoje tło lub kolor tekstu, sygnalizując możliwość kliknięcia.
    *   **Przyciski i inne elementy:** Standardowe komponenty (`Button`, linki, pola formularzy) reagują na najechanie kursorem standardowymi zmianami wyglądu (np. zmiana koloru tła, podkreślenie tekstu), zgodnie z konwencjami `shadcn/ui`.
    *   **Zalecenie:** Dla ikon w sidebarze (serwery, logo, użytkownik) zalecane jest dodanie etykiet narzędziowych (tooltips) pojawiających się przy najechaniu, aby wyświetlić pełną nazwę serwera lub opis akcji.

*   **Akcje po kliknięciu (Click):**
    *   **Ikony serwerów:** Kliknięcie wybiera dany serwer jako aktywny kontekst. Ikona zostaje trwale wyróżniona (gradient "Blurple", cień, animacja), aktualizowany jest wskaźnik w górnym pasku, a główny obszar treści ładuje dane i ustawienia dla tego serwera.
    *   **Zakładki:** Kliknięcie aktywuje wybraną zakładkę, co jest sygnalizowane wyraźną zmianą stylu (gradient "Blurple", cień). Powoduje to dynamiczną zmianę zawartości wyświetlanej w głównym obszarze, często z subtelną animacją przejścia (fade-in).
    *   **Przyciski:** Kliknięcie inicjuje określoną akcję, np. zapisanie zmian w formularzu, otwarcie okna modalnego do dodania dokumentu, usunięcie elementu. Stan przycisku może się zmienić, np. wskazując ładowanie (spinner) podczas operacji asynchronicznej.

*   **Wizualizacja stanu (State Visualization):**
    *   **Aktywny/Wybrany element:** Zarówno aktywnie wybrany serwer w sidebarze, jak i aktywna zakładka w topbarze są trwale i wyraźnie wyróżnione wizualnie (gradient, cień, animacje), aby użytkownik zawsze wiedział, w którym kontekście się znajduje.
    *   **Informacja zwrotna (Feedback):**
        *   **Powiadomienia (Toasts):** Krótkotrwałe komunikaty (np. "Zmiany zapisano pomyślnie", "Wystąpił błąd") pojawiają się na górze ekranu (centralnie), informując użytkownika o wyniku wykonanej operacji. Wykorzystywany jest system powiadomień `sonner`.
        *   **Stany ładowania:** W miejscach, gdzie dane są pobierane lub przetwarzane, mogą pojawiać się wskaźniki ładowania (np. komponenty `Skeleton` zastępujące treść lub ikony typu spinner), informując użytkownika o trwającym procesie.
        *   **Walidacja formularzy:** Błędy wprowadzania danych w formularzach są sygnalizowane wizualnie, np. przez zmianę koloru obramowania pola i wyświetlenie komunikatu o błędzie bezpośrednio przy danym polu. 

## 4. Responsywność i zachowanie na różnych rozmiarach ekranu

Interfejs został zaprojektowany z myślą o użytkownikach korzystających głównie z komputerów stacjonarnych (desktop), jednak zastosowano podstawowe mechanizmy responsywności w celu zapewnienia użyteczności na mniejszych ekranach, takich jak tablety.

*   **Duże ekrany (Desktop - breakpoint `md` i większe):**
    *   Wyświetlany jest pełny, dwukolumnowy układ z widocznym bocznym paskiem nawigacyjnym (sidebar) o stałej szerokości oraz głównym obszarem treści.
    *   Wszystkie elementy interfejsu są w pełni widoczne i dostępne.

*   **Małe ekrany (Tablety/Mobile - poniżej breakpointu `md`):**
    *   **Ukryty Sidebar:** Boczny pasek nawigacyjny (sidebar) służący do wyboru serwera jest domyślnie ukryty.
    *   **Ograniczenie:** W obecnej implementacji **brakuje alternatywnego mechanizmu nawigacji między serwerami** na małych ekranach (np. wysuwanego menu typu "drawer" lub menu hamburgerowego). Oznacza to, że **funkcjonalność przełączania serwerów jest niedostępna na urządzeniach poniżej szerokości `md`**. Użytkownik widzi tylko ostatnio wybrany serwer lub ekran powitalny.
    *   **Główny obszar treści:** Zajmuje całą dostępną szerokość ekranu.
    *   **Górny pasek (Topbar) i Zakładki (Tabs):** Pozostają widoczne i funkcjonalne. Układ zakładek (`grid grid-cols-3`) powinien stosunkowo dobrze adaptować się do mniejszych szerokości, ale na bardzo wąskich ekranach mogą pojawić się problemy z przepełnieniem tekstu w etykietach zakładek.
    *   **Zawartość zakładek:** Elementy wewnątrz poszczególnych zakładek (np. tabele, formularze) powinny być zaprojektowane tak, aby adaptowały się do mniejszej szerokości (np. poprzez zawijanie tekstu, układ jednokolumnowy, potencjalne przewijanie horizontalne dla szerokich tabel).

*   **Technika:** Responsywność jest osiągana głównie za pomocą responsywnych modyfikatorów (prefixów) w klasach Tailwind CSS (np. `hidden`, `md:flex`), które warunkowo stosują style w zależności od szerokości ekranu. 

## 5. Wykorzystane komponenty shadcn/ui

Interfejs użytkownika dashboardu został zbudowany w oparciu o bibliotekę komponentów `shadcn/ui`, co zapewnia spójność wizualną, dostępność oraz przyspiesza proces tworzenia UI. Poniżej znajduje się lista zidentyfikowanych lub prawdopodobnie wykorzystywanych komponentów `shadcn/ui` (lub powiązanych, jak `Sonner`) w projekcie:

*   `Accordion`
*   `Alert` / `Alert Dialog`
*   `Avatar`
*   `Badge`
*   `Button`
*   `Card` (Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter)
*   `Checkbox`
*   `Dialog`
*   `Dropdown Menu`
*   `Form` (do budowy formularzy, prawdopodobnie w połączeniu z `react-hook-form`)
*   `Input`
*   `Label`
*   `Scroll Area`
*   `Select` (Select, SelectTrigger, SelectContent, SelectItem, etc.)
*   `Separator`
*   `Sheet` (potencjalnie dla przyszłej nawigacji mobilnej)
*   `Skeleton` (do sygnalizacji ładowania)
*   `Sonner` (technicznie osobna biblioteka, ale używana do powiadomień Toast)
*   `Switch`
*   `Table` (Table, TableHeader, TableRow, TableCell, TableBody, etc.)
*   `Tabs` (Tabs, TabsList, TabsTrigger, TabsContent)
*   `Textarea`
*   `Toast` / `Toaster` (zintegrowane z `Sonner`)
*   `Tooltip` (zalecane, choć niekoniecznie już zaimplementowane wszędzie)

Wykorzystanie tych predefiniowanych komponentów gwarantuje jednolity wygląd i zachowanie elementów takich jak przyciski, pola formularzy, karty, okna dialogowe, tabele i inne w całej aplikacji. 

## 6. Stylizacja, padding i pozycjonowanie elementów

Stylizacja, definiowanie odstępów (padding, marginesy) oraz rozmieszczanie elementów na stronie opierają się w głównej mierze na frameworku Tailwind CSS. Pozwala to na szybkie i spójne tworzenie interfejsu bezpośrednio w kodzie komponentów.

*   **Podstawowe narzędzie:** Tailwind CSS jest wykorzystywany jako podstawowe narzędzie do stylizacji. Klasy użytkowe (utility classes) są aplikowane bezpośrednio do elementów JSX.

*   **Odstępy (Padding i Marginesy):**
    *   Stosowana jest standardowa skala odstępów Tailwind (np. `p-4`, `m-2`, `gap-4`), co zapewnia wizualną spójność w całym interfejsie.
    *   Odstępy są konsekwentnie stosowane zarówno wewnątrz komponentów (np. padding przycisków, kart), jak i pomiędzy nimi (np. odstępy między ikonami w sidebarze, elementami w topbarze, polami formularza).
    *   Przykładowo, sidebar używa `p-3` i `gap-2`, nagłówek w topbarze `px-6 py-4` i `gap-4`, a zakładki `px-6 pb-2`.

*   **Układ i Pozycjonowanie:**
    *   Główne struktury layoutu (np. podział na sidebar i treść główną, struktura topbara) są realizowane przy użyciu Flexbox (`display: flex` i powiązane właściwości jak `flex-direction`, `justify-content`, `align-items`). Klasy takie jak `flex`, `flex-col`, `flex-1`, `items-center`, `justify-between` są powszechnie stosowane.
    *   Sidebar wykorzystuje `flex-col` do pionowego ułożenia elementów, a `mt-auto` do wypchnięcia ikony użytkownika na dół.
    *   Lista zakładek w topbarze wykorzystuje Grid (`display: grid` z `grid-cols-3`), aby równomiernie rozłożyć elementy na dostępnej szerokości.
    *   Pozycjonowanie absolutne (`position: absolute`) jest używane sporadycznie, np. do umieszczenia wskaźnika statusu online/offline na ikonie serwera w sidebarze (`absolute bottom-0 right-0`).

*   **Rozmiary elementów:**
    *   Szerokość i wysokość elementów są definiowane za pomocą klas Tailwind (np. `w-full`, `h-12`, `w-[72px]`, `min-h-screen`).
    *   Klasa `flex-1` jest często używana, aby element rozciągnął się i wypełnił dostępną przestrzeń w kontenerze Flexbox (np. główny obszar treści).

*   **Niestandardowe style CSS:**
    *   Bezpośrednie użycie niestandardowego CSS jest ograniczone do minimum. Głównie znajduje się w pliku `src/index.css`, gdzie definiowane są globalne style bazowe (np. dla `body`, `h1-h6`), zmienne CSS dla kolorów `shadcn/ui` oraz importy warstw Tailwind.
    *   Do warunkowego łączenia klas Tailwind (np. w zależności od stanu komponentu) wykorzystywana jest funkcja pomocnicza `cn` (z `src/lib/utils.ts`). 

## 7. Kluczowe Aspekty

Podczas odtwarzania interfejsu użytkownika dashboardu, należy zwrócić szczególną uwagę na następujące kluczowe aspekty, aby zachować jego zamierzony wygląd i funkcjonalność:

1.  **Wierność układowi inspirowanemu Discordem:** Zachowanie charakterystycznej struktury z wąskim, pionowym sidebarem ikonowym po lewej stronie (na desktopie) i głównym obszarem treści po prawej jest fundamentalne dla spójności z oczekiwaniami użytkowników.

2.  **Konsekwencja stylistyczna "Dark Mode":** Ścisłe przestrzeganie zdefiniowanej palety kolorów (ciemne szarości, akcenty "Blurple"), typografii (czcionka "gg sans"), zaokrągleń i subtelnych cieni/gradientów jest kluczowe dla zachowania profesjonalnego i spójnego wyglądu w ciemnym motywie.

3.  **Logika nawigacji opartej na stanie:** Poprawne zaimplementowanie mechanizmu wyboru aktywnego serwera za pomocą sidebara (aktualizacja kontekstu) oraz przełączania widoków ("Knowledge Base", "System Prompt", "Configuration") za pomocą komponentu zakładek (Tabs) w głównym obszarze treści.

4.  **Obsługa responsywności (i jej ograniczeń):** Zrozumienie, że boczny sidebar znika na ekranach mniejszych niż breakpoint `md` i że w obecnej implementacji **brakuje dedykowanej nawigacji mobilnej do przełączania serwerów**. Należy albo odtworzyć to ograniczenie, albo świadomie zaprojektować i wdrożyć rozwiązanie mobilne (np. Drawer).

5.  **Intensywne wykorzystanie `shadcn/ui` i Tailwind CSS:** Cały interfejs jest zbudowany w oparciu o te technologie. Zrozumienie ich konwencji (komponenty `shadcn/ui`, klasy utility Tailwind) jest niezbędne do efektywnego i poprawnego odtworzenia stylizacji, układu i zachowania poszczególnych elementów UI. 