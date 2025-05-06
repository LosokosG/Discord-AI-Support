# Analiza Podróży Użytkownika - Autentykacja Discord

<user_journey_analysis>

## 1. Ścieżki użytkownika zidentyfikowane w dokumentacji

Na podstawie dokumentacji projektowej zidentyfikowałem następujące ścieżki użytkownika:

1. **Wejście niezalogowanego użytkownika na stronę główną**

   - Wyświetlenie strony głównej (landing page) z opisem produktu
   - Możliwość kliknięcia przycisku "Zaloguj przez Discord"

2. **Proces logowania przez Discord OAuth**

   - Rozpoczęcie procesu logowania
   - Autoryzacja uprawnień w Discord
   - Obsługa callback z Discord
   - Przekierowanie po udanym logowaniu

3. **Wybór serwera po zalogowaniu**

   - Wyświetlenie listy serwerów administrowanych przez użytkownika
   - Filtrowanie serwerów z uprawnieniami administratora
   - Wybór serwera do zarządzania

4. **Korzystanie z funkcji dashboardu**

   - Zarządzanie bazą wiedzy
   - Konfiguracja ustawień bota
   - Zarządzanie limitami

5. **Wylogowanie z aplikacji**

   - Zakończenie sesji
   - Przekierowanie na stronę główną

6. **Weryfikacja sesji przy każdym żądaniu**
   - Sprawdzanie ważności tokenu sesji
   - Automatyczne odświeżanie tokenu
   - Przekierowanie w przypadku wygaśnięcia sesji

## 2. Główne podróże i stany

### Podróż 1: Niezalogowany użytkownik → Zalogowany użytkownik

**Stany:**

- Strona główna (Landing Page)
- Strona logowania
- Ekran autoryzacji Discord
- Obsługa callback
- Wybór serwera

### Podróż 2: Zalogowany użytkownik → Korzystanie z aplikacji

**Stany:**

- Wybór serwera
- Dashboard główny
- Zarządzanie bazą wiedzy
- Konfiguracja bota
- Ustawienia limitów

### Podróż 3: Zalogowany użytkownik → Wylogowanie

**Stany:**

- Dowolna strona w aplikacji
- Proces wylogowania
- Strona główna

### Podróż 4: Weryfikacja sesji

**Stany:**

- Weryfikacja middleware
- Sprawdzenie tokenu
- Odświeżenie tokenu (jeśli wygasł)
- Przekierowanie do logowania (jeśli token niepoprawny)

## 3. Punkty decyzyjne i alternatywne ścieżki

### Punkt decyzyjny 1: Autoryzacja Discord

- **Opcja 1:** Użytkownik akceptuje uprawnienia → Kontynuacja procesu logowania
- **Opcja 2:** Użytkownik odmawia uprawnień → Wyświetlenie komunikatu błędu i powrót do strony logowania

### Punkt decyzyjny 2: Weryfikacja tokenu CSRF

- **Opcja 1:** Token poprawny → Kontynuacja procesu logowania
- **Opcja 2:** Token niepoprawny → Wyświetlenie komunikatu błędu i powrót do strony logowania

### Punkt decyzyjny 3: Sprawdzenie dostępnych serwerów

- **Opcja 1:** Użytkownik ma dostępne serwery → Wyświetlenie listy serwerów
- **Opcja 2:** Użytkownik nie ma serwerów z wymaganymi uprawnieniami → Wyświetlenie komunikatu informacyjnego

### Punkt decyzyjny 4: Weryfikacja sesji

- **Opcja 1:** Sesja aktywna → Kontynuacja żądania
- **Opcja 2:** Sesja wygasła, ale token odświeżania jest dostępny → Odświeżenie tokenu
- **Opcja 3:** Sesja wygasła i brak tokenu odświeżania → Przekierowanie do strony logowania

## 4. Cel każdego stanu

### Strona główna (Landing Page)

**Cel:** Prezentacja produktu i umożliwienie logowania przez Discord.

### Strona logowania

**Cel:** Dedykowana strona dla procesu logowania z przyciskiem "Zaloguj przez Discord".

### Ekran autoryzacji Discord

**Cel:** Umożliwienie użytkownikowi autoryzacji aplikacji do uzyskania dostępu do danych konta Discord.

### Obsługa callback

**Cel:** Przetworzenie odpowiedzi z Discord, wymiana kodu autoryzacji na token i pobranie danych użytkownika.

### Wybór serwera

**Cel:** Umożliwienie użytkownikowi wyboru serwera Discord do zarządzania.

### Dashboard

**Cel:** Centralny panel zarządzania wybranym serwerem i botem Discord.

### Zarządzanie bazą wiedzy

**Cel:** Umożliwienie dodawania, edycji i usuwania dokumentów w bazie wiedzy dla bota.

### Konfiguracja bota

**Cel:** Konfiguracja ustawień bota, w tym instrukcji dla modelu AI i kanałów Discord.

### Ustawienia limitów

**Cel:** Zarządzanie limitami wiadomości i długości tekstu dla bota.

### Proces wylogowania

**Cel:** Bezpieczne zakończenie sesji użytkownika i usunięcie danych uwierzytelniających.

### Weryfikacja sesji

**Cel:** Zapewnienie, że użytkownik ma ważną sesję przed dostępem do chronionych zasobów.

</user_journey_analysis>

<mermaid_diagram>

```mermaid
stateDiagram-v2
    [*] --> StronaGlowna

    state "Dostęp Jako Niezalogowany" as DostepNiezalogowany {
        StronaGlowna: Strona z opisem produktu
        StronaGlowna --> StronaLogowania: Kliknięcie "Zaloguj przez Discord"

        note right of StronaGlowna
            Landing page z:
            - Opisem produktu
            - Głównymi funkcjami
            - Przyciskiem logowania
        end note
    }

    state "Proces Autentykacji" as ProcesAutentykacji {
        StronaLogowania: Dedykowana strona logowania
        EkranAutoryzacjiDiscord: Ekran autoryzacji Discord

        state if_autoryzacja <<choice>>

        StronaLogowania --> EkranAutoryzacjiDiscord: Przekierowanie do OAuth Discord
        EkranAutoryzacjiDiscord --> if_autoryzacja: Akcja użytkownika
        if_autoryzacja --> ObslugaCallback: Akceptacja
        if_autoryzacja --> KomunikatBledu: Odmowa/Błąd

        ObslugaCallback: Przetwarzanie callback OAuth
        ObslugaCallback --> WeryfikacjaTokenu: Wymiana kodu na token

        KomunikatBledu: Komunikat o błędzie
        KomunikatBledu --> StronaLogowania: Powrót do logowania

        state "Weryfikacja Danych" as WeryfikacjaTokenu {
            WeryfikacjaCSRF: Weryfikacja tokenu state
            PobranieInformacji: Pobranie danych użytkownika i serwerów
            UtworzenieSesji: Utworzenie/aktualizacja danych w Supabase

            WeryfikacjaCSRF --> PobranieInformacji: Token poprawny
            PobranieInformacji --> UtworzenieSesji: Dane pobrane
        }

        UtworzenieSesji --> WyborSerwera: Przekierowanie
    }

    state "Dostęp Jako Zalogowany" as DostepZalogowany {
        WyborSerwera: Strona wyboru serwera

        state if_serwery <<choice>>

        WyborSerwera --> if_serwery: Sprawdzenie uprawnień i serwerów
        if_serwery --> BrakSerwerow: Brak serwerów/uprawnień
        if_serwery --> ListaSerwerow: Dostępne serwery

        BrakSerwerow: Komunikat o braku dostępnych serwerów

        ListaSerwerow: Lista serwerów z dostępem
        ListaSerwerow --> Dashboard: Wybór serwera

        state "Panel Główny" as Dashboard {
            state StronaGlownaPanel <<fork>>
            StronaGlownaPanel --> ZarzadzanieBazaWiedzy
            StronaGlownaPanel --> KonfiguracjaBota
            StronaGlownaPanel --> UstawieniaLimitow

            ZarzadzanieBazaWiedzy: Zarządzanie bazą wiedzy
            KonfiguracjaBota: Konfiguracja ustawień bota
            UstawieniaLimitow: Ustawienia limitów
        }

        Dashboard --> WyborSerwera: Zmiana serwera
    }

    DostepZalogowany --> WylogowanieProcess: Kliknięcie "Wyloguj"

    state "Proces Wylogowania" as WylogowanieProcess {
        UsuwanieSesji: Usunięcie sesji
        CzyszczenieCookie: Czyszczenie cookie

        UsuwanieSesji --> CzyszczenieCookie
        CzyszczenieCookie --> StronaGlowna: Przekierowanie
    }

    state VerifyProcess <<join>>
    WeryfikacjaTokenu --> VerifyProcess: Token niepoprawny/brak
    VerifyProcess --> KomunikatBledu

    state "Weryfikacja Sesji" as WeryfikacjaSesji {
        state SesjaCheck <<choice>>
        WeryfikacjaMiddleware: Sprawdzanie tokenu przez middleware

        WeryfikacjaMiddleware --> SesjaCheck
        SesjaCheck --> DostepZalogowany: Sesja aktywna

        state if_odswiezenie <<choice>>
        SesjaCheck --> if_odswiezenie: Sesja wygasła
        if_odswiezenie --> DostepZalogowany: Odświeżenie udane
        if_odswiezenie --> StronaLogowania: Brak możliwości odświeżenia
    }

    Dashboard --> WeryfikacjaSesji: Żądanie chronionego zasobu
```

</mermaid_diagram>
