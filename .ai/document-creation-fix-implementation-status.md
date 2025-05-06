# Status implementacji widoku Tworzenie dokumentów

## Zrealizowane kroki

- Zweryfikowano kod strony `new.astro` pod kątem potencjalnych błędów przy tworzeniu dokumentów.
- Przeanalizowano logikę serwisu `documents.ts`, w szczególności funkcję `createDocument`.
- Sprawdzono schemat bazy danych i użycie pola `created_by`.
- Zbadano komponenty React: `DocumentView`, `DocumentForm` i `DocumentCreateView`.
- Sprawdzono implementację pobierania użytkownika (`auth.getUser`) oraz middleware (`index.ts`).
- Zidentyfikowano problem z niezgodnością ID użytkownika w `new.astro` (użycie `auth.getUser` zamiast mock usera z middleware).
- Poprawiono logikę w `new.astro`, aby używała ID użytkownika z `Astro.locals`.
- Naprawiono błędy TypeScript wynikające z poprawki przez dodanie odpowiednich definicji typów (`MockUser`).
- Zdiagnozowano błąd "Bucket not found" podczas próby dodania pliku PDF, wynikający z braku odpowiedniego bucketa w Supabase Storage.
- Usunięto opcję dodawania plików PDF z formularza (`DocumentForm.tsx`), upraszczając proces.
- Usunięto logikę walidacji i obsługi plików PDF po stronie serwera (`new.astro`).
- Usunięto obsługę przesyłania plików z funkcji `createDocument` w `documents.ts`.
- Zaktualizowano typ `UploadDocumentCommand` w `src/types.ts`, usuwając pola związane z plikami i czyniąc pole `content` wymaganym.
- Usunięto logikę wyświetlania PDF w komponencie `DocumentView.tsx`.
- Naprawiono błędy lintera dotyczące nieużywanych zmiennych (`isLoading`, `handleReindex`) w `DocumentView.tsx`.

## Kolejne kroki

- Dokładne przetestowanie uproszczonego przepływu tworzenia dokumentów (tylko MD i TXT).
- W przyszłości: implementacja rzeczywistego systemu uwierzytelniania zamiast polegania na mock użytkowniku.
- Rozważenie dodania dedykowanej biblioteki do renderowania Markdown w podglądzie i widoku dokumentu zamiast `dangerouslySetInnerHTML`.
- Przywrócenie lub ponowne rozważenie funkcjonalności reindeksowania dokumentów (`reindexDocument`).
