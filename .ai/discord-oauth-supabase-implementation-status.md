# Status implementacji Discord OAuth z Supabase

## Zrealizowane kroki

1. **Utworzenie klienta Supabase dla Server-Side Rendering:**

   - Zaimplementowano klienta Supabase w `src/lib/supabase/server.ts`
   - Skonfigurowano klienta do obsługi środowiska SSR

2. **Implementacja endpointów autentykacji:**

   - Utworzono endpoint inicjujący logowanie przez Discord OAuth (`/api/auth/login.ts`)
   - Utworzono endpoint callback dla OAuth (`/api/auth/callback.ts`)
   - Utworzono endpoint wylogowania (`/api/auth/logout.ts`)
   - Dodano endpoint debugowania stanu sesji (`/api/auth/status.ts`)

3. **Rozszerzenie middleware:**

   - Zmodyfikowano middleware (`src/middleware/index.ts`) do weryfikacji stanu autentykacji
   - Dodano logikę przekierowań bazującą na stanie autentykacji

4. **Aktualizacja typów zmiennych środowiskowych:**

   - Rozszerzono typy w `src/env.d.ts` o nowe zmienne związane z autentykacją Discord

5. **Debugowanie:**
   - Dodano szczegółowe logowanie w całym procesie autentykacji
   - Utworzono endpoint diagnostyczny do weryfikacji stanu sesji
   - Modyfikowano konfigurację URL przekierowań

## Problemy

1. **Utrata sesji po autoryzacji:**

   - Po zakończeniu procesu OAuth użytkownik nie jest prawidłowo utrzymywany w sesji
   - Mimo poprawnej autoryzacji przez Discord, sesja nie jest zachowywana między przekierowaniami
   - Próby debugowania wykazały, że sesja nie jest poprawnie ustawiana lub odczytywana

2. **Problemy z przekierowaniami:**
   - Użytkownik jest przekierowywany z powrotem do strony logowania mimo zakończenia autoryzacji

## Kolejne kroki

1. **Naprawa sesji użytkownika:**

   - Sprawdzenie poprawności zapisywania i odczytywania danych sesji
   - Weryfikacja poprawności konfiguracji Supabase Auth
   - Implementacja alternatywnego mechanizmu przechowywania sesji (np. cookies zamiast localStorage)

2. **Dokończenie komponentów UI:**

   - Implementacja `LoginButton.tsx` zgodnie ze specyfikacją
   - Implementacja `ServerSelector.tsx` do wyboru serwerów Discord
   - Implementacja `UserMenu.tsx` do wyświetlania informacji o użytkowniku
   - Implementacja `AuthGuard.tsx` jako HOC dla chronionych komponentów

3. **Integracja z Discord.js:**

   - Dodanie logiki pobierania listy serwerów użytkownika
   - Implementacja weryfikacji uprawnień użytkownika do serwerów
   - Filtrowanie serwerów, gdzie użytkownik ma uprawnienia administratora

4. **Dokończenie modeli danych:**

   - Implementacja modelu użytkownika w bazie danych
   - Synchronizacja danych między Discord i Supabase

5. **Poprawa bezpieczeństwa:**

   - Implementacja ochrony przed CSRF
   - Zabezpieczenie cookies sesji
   - Właściwa konfiguracja CORS

6. **Refaktoryzacja i optymalizacja:**
   - Optymalizacja liczby zapytań do API Discord
   - Refaktoryzacja istniejącego kodu do współpracy z nowym systemem autentykacji
   - Cachowanie informacji o serwerach i uprawnieniach
