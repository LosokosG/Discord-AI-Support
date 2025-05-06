# Analiza Architektury Autentykacji

## Przepływy autentykacji

Na podstawie dokumentacji projektowej oraz specyfikacji autentykacji, zidentyfikowałem następujące przepływy autentykacji:

### 1. Inicjacja logowania
- Użytkownik klika przycisk "Zaloguj przez Discord" na stronie głównej lub stronie logowania
- System generuje URL do API Discord z odpowiednimi parametrami OAuth
- System tworzy token state do ochrony przed CSRF
- Użytkownik jest przekierowywany do strony autoryzacji Discord

### 2. Proces autoryzacji OAuth
- Discord wyświetla ekran autoryzacji z prośbą o dostęp do danych użytkownika
- Użytkownik akceptuje lub odmawia dostępu
- Discord przekierowuje użytkownika z powrotem do aplikacji z kodem autoryzacji lub błędem

### 3. Przetwarzanie callback
- System odbiera żądanie callback z kodem autoryzacji lub błędem
- System weryfikuje token state dla ochrony przed CSRF
- System wymienia kod autoryzacji na token dostępu
- System pobiera dane użytkownika i informacje o serwerach
- System tworzy lub aktualizuje rekord użytkownika w Supabase
- System tworzy sesję użytkownika i ustawia cookie

### 4. Weryfikacja sesji
- Przy każdym żądaniu chronionego zasobu, middleware weryfikuje token sesji
- Jeśli token jest ważny, żądanie jest kontynuowane
- Jeśli token wygasł, system próbuje go odświeżyć
- Jeśli odświeżenie nie jest możliwe, użytkownik jest przekierowywany do strony logowania

### 5. Odświeżanie tokenu
- System wykrywa wygaśnięcie tokenu dostępu
- System używa tokenu odświeżania do uzyskania nowego tokenu dostępu
- System aktualizuje sesję użytkownika z nowym tokenem

### 6. Wylogowanie
- Użytkownik klika przycisk wylogowania
- System usuwa sesję użytkownika w Supabase Auth
- System usuwa cookie sesji
- Użytkownik jest przekierowywany do strony głównej

## Aktorzy procesu autentykacji

1. **Przeglądarka** - inicjuje procesy logowania, przechowuje cookie sesji, wykonuje żądania do chronionych zasobów
2. **Astro Middleware** - weryfikuje sesję, przekazuje kontekst autentykacji, zarządza przekierowaniami
3. **Astro API** - obsługuje endpointy logowania, callback, wylogowania i dostępu do danych
4. **Supabase Auth** - zarządza użytkownikami, sesjami i tokenami
5. **Discord API** - przeprowadza autoryzację OAuth, dostarcza dane użytkownika i serwerów

## Procesy weryfikacji i odświeżania tokenów

1. **Weryfikacja tokenu sesji**
   - Middleware sprawdza istnienie i ważność tokenu sesji w cookie
   - Token jest weryfikowany przez Supabase Auth
   - Dane użytkownika są dodawane do kontekstu żądania

2. **Odświeżanie tokenu**
   - Gdy token dostępu wygasa, middleware wykrywa błąd autoryzacji
   - Middleware próbuje użyć tokenu odświeżania do uzyskania nowego tokenu dostępu
   - Nowy token jest zapisywany w sesji i cookie

## Krytyczne punkty bezpieczeństwa

1. **Ochrona przed CSRF**
   - Generowanie i weryfikacja tokenu state podczas procesu OAuth
   - Zabezpieczenie cookie (HttpOnly, Secure, SameSite)

2. **Weryfikacja zakresów OAuth**
   - Sprawdzenie, czy aplikacja otrzymuje wymagane zakresy uprawnień:
     - `identify` - dostęp do podstawowych informacji o użytkowniku
     - `guilds` - dostęp do listy serwerów użytkownika
     - `email` - dostęp do adresu email użytkownika

3. **Bezpieczne przechowywanie tokenów**
   - Tokeny dostępu i odświeżania są przechowywane tylko po stronie serwera
   - Sesja użytkownika jest identyfikowana przez bezpieczne cookie
   - Wrażliwe dane nie są przechowywane w localStorage ani sessionStorage

4. **Wygasanie sesji**
   - Automatyczne wylogowanie po przekroczeniu czasu sesji
   - Obsługa wygasania tokenu z informacją dla użytkownika 