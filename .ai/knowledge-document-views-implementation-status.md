# Status implementacji widoku dokumentów wiedzy

## Zrealizowane kroki

- Przeanalizowano stronę `src/pages/servers/[id]/knowledge/[docId]/edit.astro` do edycji dokumentów.
- Sprawdzono komponent `src/components/knowledge/DocumentForm.tsx` używany do tworzenia i edycji dokumentów.
- Zlokalizowano i przeanalizowano stronę `src/pages/servers/[id]/knowledge/new.astro` do tworzenia nowych dokumentów.
- Przeanalizowano stronę `src/pages/servers/[id]/knowledge/[docId].astro` do przeglądania konkretnego dokumentu.
- Sprawdzono współdzielone typy w `src/types/knowledge.ts`.
- Zidentyfikowano i naprawiono błędy lintera w plikach:
  - `src/pages/servers/[id]/knowledge/[docId]/edit.astro`
  - `src/pages/servers/[id]/knowledge/[docId].astro`
- Utworzono endpoint `src/pages/servers/[id]/knowledge/[docId]/reindex.ts` do reindeksowania dokumentów.
- Zaktualizowano format dokumentów, dodając odpowiednie separatory frontmatter `---` w plikach Astro.
- Naprawiono obsługę HTML content w widoku dokumentów, używając `<div set:html={...}>` zamiast `Fragment`.
- Poprawiono wywołania API w `src/pages/api/servers/[id]/documents/index.ts`:
  - Zaktualizowano import z `listDocuments` na `getDocumentsByServerId`
  - Poprawiono obsługę typów dla parametrów zapytania
- Zaktualizowano implementację `createDocument` w `src/lib/services/documents.ts` o dodatkowe parametry.
- Dostosowano wywołania funkcji w `src/pages/servers/[id]/knowledge/new.astro` do nowej sygnatury.
- Dodano obsługę wartości null dla klienta Supabase w `src/components/knowledge/DocumentList.tsx`.

## Kolejne kroki

- Ujednolicić wygląd interfejsu użytkownika, stosując komponenty shadcn/ui i style Tailwind podobne do tych w `src/pages/servers/[id]/settings.astro`.
- Przeprowadzić kompleksowe testy funkcjonalności:
  - Testowanie wyświetlania różnych typów dokumentów (PDF, Markdown, TXT)
  - Weryfikacja działania formularza tworzenia i edycji dokumentów
  - Testowanie funkcjonalności reindeksowania (używając przycisku "Reindex")
  - Sprawdzenie działania listy dokumentów i filtrowania
- Dodać obsługę błędów i komunikaty informacyjne dla użytkownika.
