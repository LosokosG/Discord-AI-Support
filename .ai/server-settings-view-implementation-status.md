# Status implementacji widoku Ustawienia Serwera

## Zrealizowane kroki

1.  **Utworzenie plików komponentów:** Stworzono pliki dla `ServerSettingsView.tsx`, `ServerSettingsHeader.tsx`, `ServerSettingsForm.tsx` w katalogu `src/components/`.
2.  **Implementacja routingu:** Dodano ścieżkę `/servers/:id/settings` w `src/pages/servers/[id]/settings.astro`, która renderuje `ServerSettingsView`. Poprawiono import layoutu na `Layout.astro`.
3.  **Implementacja `ServerSettingsView`:**
    - Dodano logikę pobierania `id` serwera.
    - Zaimplementowano `useEffect` do pobierania danych serwera (`GET /api/servers/{id}`).
    - Dodano obsługę stanu ładowania i błędów.
    - Zaimplementowano mapowanie `ServerDetail` na `ServerSettingsViewModel` (w tym poprawki typowania `config`).
    - Dodano funkcje obsługujące akcje (zapis, aktywacja, deaktywacja, odświeżenie) wywołujące odpowiednie endpointy API.
    - Naprawiono ścieżki importu.
4.  **Implementacja `ServerSettingsHeader`:** Stworzono layout z nazwą, ikoną i przyciskami akcji.
5.  **Implementacja `ServerSettingsForm`:**
    - Skonfigurowano `react-hook-form` z `ServerSettingsViewModel`.
    - Zdefiniowano schemat walidacji Zod.
    - Zaimplementowano layout formularza używając komponentów z `shadcn/ui` (w tym dodanie brakujących komponentów i zależności: Button, Input, Textarea, Form, Label, Select, Switch, Sonner).
    - Dodano placeholder dla `MultiSelect` kanałów.
    - Dodano logikę obsługi `onSubmit`.
    - Naprawiono błędy importu i typowania.
6.  **Dodanie komponentów Shadcn/UI:** Zainstalowano i utworzono brakujące komponenty UI: Button, Input, Textarea, Form, Label, Select, Switch, Sonner.
7.  **Utworzenie utility:** Utworzono `src/lib/utils.ts` z funkcją `cn`.
8.  **Implementacja powiadomień:** Dodano `Toaster` do globalnego layoutu (`Layout.astro`) i zintegrowano wywołania `toast()` w `ServerSettingsView`.

## Kolejne kroki

1.  **Implementacja MultiSelect dla kanałów:** Zastąpić placeholder w `ServerSettingsForm` pełną implementacją komponentu `MultiSelect` dla wyboru kanałów.
2.  **Pobieranie list kanałów i ról:** Zaimplementować logikę pobierania list dostępnych kanałów i ról dla danego serwera (np. z API) w `ServerSettingsView` i przekazać je do `ServerSettingsForm`.
3.  **Ulepszona obsługa błędów:** Rozbudować obsługę błędów API, aby lepiej mapować błędy walidacji serwera na pola formularza.
4.  **Stylowanie:** Dopracować wygląd widoku zgodnie z resztą aplikacji.
5.  **Testowanie:** Napisać testy jednostkowe i integracyjne.
