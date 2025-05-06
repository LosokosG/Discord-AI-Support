# Status implementacji widoku Discord UI Theme

## Zrealizowane kroki

- Utworzono plik `src/styles/theme.css` zawierający paletę kolorów Discord, niestandardowe animacje, style paska przewijania i definicje czcionki `gg sans`.
- Utworzono plik konfiguracyjny `tailwind.config.js` rozszerzający motyw Tailwind o kolory Discord, niestandardową czcionkę `gg sans` oraz animacje (`fadeIn`, `glow`, `float`).
- Zaktualizowano `src/styles/global.css`, aby importował `theme.css`, definiował zmienne CSS dla motywu `shadcn/ui` i domyślnie wymuszał ciemny motyw (`dark`).
- Zaktualizowano główny layout `src/layouts/DashboardLayout.astro`, stosując klasy Tailwind oparte na motywie Discord dla tła, tekstu, obramowań i stylizacji zakładek (tabs).
- Utworzono nowy komponent listy wiedzy `src/components/knowledge/DiscordKnowledgeList.tsx`, stylizowany zgodnie ze zrzutem ekranu interfejsu Discord (nagłówek, pasek wyszukiwania, elementy dokumentów z ikonami, efekty hover, przyciski akcji).
- Zaktualizowano stronę `src/pages/dashboard/servers/[id]/knowledge.astro`, aby używała nowego komponentu `DiscordKnowledgeList` oraz przekazywała odpowiednie dane do layoutu w celu stylizacji nagłówka i zakładek.
- Utworzono katalog `public/fonts` na pliki czcionki `gg sans`.

## Kolejne kroki

- Dodać pliki czcionki `gg sans` (regular, medium, semibold, bold) w formacie `.woff2` do katalogu `public/fonts`.
- Zastosować spójnie motyw wizualny Discord we wszystkich pozostałych widokach i komponentach dashboardu (np. Ustawienia Serwera, Prompt Systemowy, strona główna serwera, widok tworzenia/edycji dokumentu, komponenty `Topbar`, `Sidebar`, `Drawer`).
- Dopracować szczegóły stylizacji dla konkretnych komponentów `shadcn/ui` (przyciski, pola input, karty, alerty, itp.), aby w pełni odpowiadały wyglądowi Discorda.
- Przetestować responsywność i upewnić się, że motyw działa poprawnie na różnych rozmiarach ekranu.
- (Opcjonalnie) Zaimplementować przełącznik motywów, jeśli w przyszłości wymagane będzie wsparcie dla jasnego motywu.
