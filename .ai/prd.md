# Dokument Wymagań Projektowych (PRD): Discord AI Support Bot

## 1. Wprowadzenie

### 1.1 Cel produktu
Discord AI Support Bot ma na celu automatyzację pierwszej linii wsparcia technicznego na serwerach Discord, umożliwiając właścicielom serwerów redukcję kosztów operacyjnych i czasu poświęcanego na odpowiadanie na powtarzalne pytania.

### 1.2 Zakres MVP
<<<<<<< HEAD
Pierwsza wersja produktu skupia się na podstawowych funkcjonalnościach potrzebnych do efektywnego automatyzowania supportu z możliwością przekazania trudniejszych przypadków do obsługi ludzkiej.
=======
Pierwsza wersja produktu skupia się **przede wszystkim na funkcjonalności bota Discord** i jego zdolności do efektywnego automatyzowania supportu. Dashboard administracyjny będzie zaimplementowany w podstawowej formie, z możliwością rozwinięcia w przyszłych wersjach.
>>>>>>> master

### 1.3 Kontekst biznesowy
Rosnące koszty utrzymania zespołów wsparcia oraz powtarzalność znacznej części pytań użytkowników stwarzają okazję do wprowadzenia rozwiązania opartego na AI, które pozwoli na natychmiastową odpowiedź 24/7.

<<<<<<< HEAD
=======
### 1.4 Priorytety rozwojowe
1. Funkcjonalny i skalowalny bot Discord z pełną implementacją obsługi AI
2. Architektura umożliwiająca łatwą konfigurację i zarządzanie
3. Podstawowy dashboard administracyjny
4. Rozwój zaawansowanych funkcji dashboardu w przyszłych iteracjach

>>>>>>> master
## 2. Użytkownicy docelowi

### 2.1 Główne persony

#### 2.1.1 Administrator serwera Discord
- **Charakterystyka**: Właściciel projektu/firmy zarządzający serwerem Discord
- **Potrzeby**: Redukcja czasu spędzanego na wsparciu, możliwość konfiguracji bota i bazy wiedzy
- **Punkty bólu**: Powtarzalne pytania, wysoki koszt zatrudniania zespołu wsparcia, niemożność zapewnienia odpowiedzi 24/7

#### 2.1.2 Członek zespołu wsparcia
- **Charakterystyka**: Osoba odpowiedzialna za pomoc użytkownikom przy bardziej złożonych problemach
- **Potrzeby**: Szybkie powiadomienia o przekazanych zgłoszeniach, dostęp do historii konwersacji
- **Punkty bólu**: Zbyt wiele prostych pytań zabierających czas, który mógłby być przeznaczony na trudniejsze przypadki

#### 2.1.3 Użytkownik końcowy
- **Charakterystyka**: Klient lub użytkownik projektu/firmy szukający pomocy
- **Potrzeby**: Szybkie i dokładne odpowiedzi na pytania, opcja kontaktu z człowiekiem gdy potrzebna
- **Punkty bólu**: Długi czas oczekiwania na odpowiedź, niezrozumiałe lub nieprawidłowe odpowiedzi

## 3. Szczegółowe wymagania funkcjonalne

<<<<<<< HEAD
### 3.1 System autentykacji

#### 3.1.1 Logowanie przez Discord
- Bot wymaga uwierzytelnienia poprzez OAuth Discord
- Dostęp do dashboardu tylko dla osób z uprawnieniami administratora na serwerze Discord
- Automatyczne wykrywanie serwerów administrowanych przez zalogowanego użytkownika

#### 3.1.2 Autoryzacja i zarządzanie uprawnieniami
- Uprawnienia dziedziczone z serwera Discord
- Tylko administratorzy serwerów mają dostęp do pełnej funkcjonalności dashboardu
- Brak dodatkowych poziomów uprawnień w MVP

### 3.2 Web Dashboard

#### 3.2.1 Interfejs zarządzania serwerami
- Lista serwerów administrowanych przez użytkownika
- Możliwość przełączania między serwerami z zachowaniem indywidualnych ustawień
- Wizualne wskaźniki statusu dla każdego serwera (online/offline, aktywność)

#### 3.2.2 Zarządzanie bazą wiedzy
- Interfejs do przesyłania plików (.txt, .md, .pdf)
- System podglądu i edycji zawartości bazy wiedzy
- Wskaźnik wielkości i liczby dokumentów w bazie wiedzy
- Możliwość usuwania dokumentów z bazy wiedzy
- Interfejs do wprowadzania informacji bezpośrednio przez formularz tekstowy

#### 3.2.3 Konfiguracja modelu AI
- Pole tekstowe do wprowadzania dodatkowych instrukcji dla modelu AI
- Wybór domyślnego języka odpowiedzi (dropdown z listą wspieranych języków)
- Konfiguracja tonu i stylu odpowiedzi (formalny/nieformalny, techniczny/przyjazny)
- Możliwość ustawienia tekstu powitalnego bota

#### 3.2.4 Konfiguracja kanałów Discord
- Lista dostępnych kanałów i kategorii na serwerze
- System wyboru kanałów/kategorii, gdzie bot ma być aktywny
- Opcja włączenia/wyłączenia obsługi wątków w wybranych kanałach

#### 3.2.5 Konfiguracja przekazywania zgłoszeń
- Wybór roli Discord, która będzie pingowana przy przekazywaniu zgłoszeń
- Ustawienia czasu nieaktywności, po którym zgłoszenie jest automatycznie zamykane
- Możliwość dodania niestandardowego szablonu wiadomości przy przekazaniu zgłoszenia

#### 3.2.6 Zarządzanie limitami
- Ustawienie maksymalnej liczby wiadomości per użytkownik przed automatycznym przekierowaniem
- Konfiguracja maksymalnej długości tekstu akceptowanej w pojedynczej wiadomości

### 3.3 Bot Discord

#### 3.3.1 Obsługa zapytań użytkowników
=======
### 3.1 Bot Discord - Główny priorytet MVP

#### 3.1.1 Architektura bota
- Implementacja z wykorzystaniem Discord.js z pełnym wsparciem dla shardingu
- Projektowanie z myślą o pełnej konfigurowalności przez zewnętrzne API
- Modelowanie konfiguracji w formie JSON dla łatwego pobierania i zapisywania
- System ładowania ustawień z bazy danych przy inicjalizacji
- Implementacja mechanizmu cache'owania konfiguracji dla poprawy wydajności
- Mechanizm automatycznego odświeżania konfiguracji po jej zmianie w dashboardzie

#### 3.1.2 System Shardingu
- Implementacja architektury shardingu bota zgodnie z wytycznymi Discord API
- Automatyczne tworzenie nowych shardów w miarę wzrostu liczby serwerów
- Równomierne rozłożenie obciążenia między shardy
- System monitorowania wydajności poszczególnych shardów
- Konfigurowalny próg aktywacji nowych shardów

#### 3.1.3 Obsługa zapytań użytkowników
>>>>>>> master
- Automatyczne odpowiadanie na pytania tylko w skonfigurowanych kanałach/kategoriach/wątkach
- Jasna identyfikacja jako bot AI z zachowaniem ludzkiego tonu
- Możliwość obsługi pytań wieloetapowych w ramach jednego wątku
- Obsługa różnorodnych formatów pytań (proste pytania, opisy problemów, screenshoty)
- Automatyczne tłumaczenie odpowiedzi na ustawiony domyślny język

<<<<<<< HEAD
#### 3.3.2 Wykorzystanie bazy wiedzy
=======
#### 3.1.4 Wykorzystanie bazy wiedzy
>>>>>>> master
- Kontekstualizacja odpowiedzi w oparciu o importowaną bazę wiedzy
- Zachowanie kontekstu konwersacji w ramach jednego wątku
- Informowanie użytkownika gdy odpowiedź nie znajduje się w bazie wiedzy
- Przyznawanie się do niewiedzy zamiast podawania niepewnych informacji
<<<<<<< HEAD

#### 3.3.3 System przekazywania zgłoszeń
=======
- Efektywne wyszukiwanie odpowiednich fragmentów wiedzy z bazy danych

#### 3.1.5 System przekazywania zgłoszeń
>>>>>>> master
- Przycisk "Forward to a human" wyświetlany gdy:
  * AI proponuje przekazanie zgłoszenia ze względu na brak pewności
  * Użytkownik wyraźnie prosi o kontakt z człowiekiem
- Automatyczne pingowanie skonfigurowanej roli Discord przy przekazaniu
- Zachowanie pełnej historii konwersacji dla osoby przejmującej zgłoszenie

<<<<<<< HEAD

#### 3.3.4 Przechowywanie transkryptów
- Zapisywanie wszystkich interakcji w bazie danych
- Zachowanie metadanych konwersacji (data, użytkownik, serwer, kanał)
- Oznaczanie punktów przekazania zgłoszenia i osób obsługujących
- Brak limitu czasowego przechowywania (w MVP)

### 3.4 Analityka i monitoring

#### 3.4.1 Podstawowe statystyki użycia
- Liczba obsłużonych zapytań (dziennie/tygodniowo/miesięcznie)
- Liczba interakcji w podziale na kanały i użytkowników

#### 3.4.2 Monitoring wydajności
- System alertów przy przeciążeniu bota
- Wykrywanie problemów z dostępnością
- Monitorowanie czasu odpowiedzi i jego degradacji
=======
#### 3.1.6 Przechowywanie transkryptów
- Zapisywanie wszystkich interakcji w bazie danych
- Zachowanie metadanych konwersacji (data, użytkownik, serwer, kanał)
- Oznaczanie punktów przekazania zgłoszenia i osób obsługujących
- API do szybkiego pobierania historii konwersacji

#### 3.1.7 Zarządzanie limitami i konfiguracją
- Obsługa limitów ustawionych w bazie danych bez potrzeby restartu bota
- Weryfikacja ograniczeń maksymalnej długości tekstu przed przetwarzaniem
- Śledzenie liczby wiadomości per użytkownik dla automatycznego przekierowania
- Weryfikacja uprawnień i ograniczeń przed wykonaniem każdej operacji

### 3.2 API do integracji - Część priorytetowa

#### 3.2.1 Projektowanie API
- RESTful API do komunikacji między botem a dashboardem
- Endpointy do pełnej konfiguracji bota
- Zaawansowane mechanizmy walidacji danych wejściowych
- Zabezpieczenia przed nieautoryzowanym dostępem
- Dokumentacja API z przykładami użycia

#### 3.2.2 Zarządzanie konfiguracją
- API do pobierania i modyfikacji konfiguracji bota
- Wsparcie dla masowej aktualizacji ustawień
- Wersjonowanie konfiguracji dla możliwości cofnięcia zmian
- System natychmiastowego powiadamiania bota o zmianach w konfiguracji

#### 3.2.3 Zarządzanie bazą wiedzy
- API do dodawania, usuwania i aktualizacji dokumentów w bazie wiedzy
- Wsparcie dla różnych formatów plików (.txt, .md, .pdf)
- Automatyczne indeksowanie i przetwarzanie zawartości dokumentów
- System wersjonowania dokumentów

### 3.3 Web Dashboard - Uproszczona wersja MVP

#### 3.3.1 System autentykacji
- Logowanie przez OAuth Discord za pośrednictwem Supabase Auth
- Dostęp do dashboardu tylko dla osób z uprawnieniami administratora na serwerze Discord
- Automatyczne wykrywanie serwerów administrowanych przez zalogowanego użytkownika
- Strona główna (landing page) dostępna publicznie, zawierająca opis produktu i przycisk logowania
- Wszystkie pozostałe funkcje dashboardu wymagają zalogowania
- Automatyczne przekierowanie na stronę logowania przy próbie dostępu do chronionych zasobów
- Przechowywanie tokenów sesji w bezpieczny sposób zgodny z wytycznymi Supabase

#### 3.3.2 Podstawowy interfejs zarządzania serwerami
- Minimalistyczna lista serwerów administrowanych przez użytkownika
- Podstawowa funkcjonalność przełączania między serwerami
- Prosty wskaźnik statusu dla każdego serwera (online/offline)

#### 3.3.3 Podstawowe zarządzanie bazą wiedzy
- Prosty interfejs do przesyłania plików (.txt, .md, .pdf)
- Podstawowa funkcjonalność podglądu i usuwania dokumentów
- Minimalistyczny wskaźnik liczby dokumentów w bazie wiedzy

#### 3.3.4 Konfiguracja podstawowych ustawień bota
- Formularz do wprowadzania instrukcji dla modelu AI
- Podstawowy wybór języka odpowiedzi
- Prosty interfejs do wyboru kanałów Discord dla działania bota
- Podstawowe ustawienia roli do pingowania przy przekazywaniu zgłoszeń

#### 3.3.5 Zarządzanie limitami
- Podstawowy formularz do ustawienia limitów wiadomości i długości tekstu
>>>>>>> master

## 4. Szczegółowe przepływy użytkownika

### 4.1 Proces konfiguracji bota przez administratora

<<<<<<< HEAD
1. Administrator loguje się do dashboardu przez OAuth Discord
2. System automatycznie wykrywa serwery, gdzie użytkownik ma uprawnienia administratora
3. Administrator wybiera serwer do skonfigurowania
4. Administrator przechodzi do sekcji "Knowledge Base" i przesyła pliki z wiedzą
5. Administrator przechodzi do sekcji "Configuration" i:
   - Wybiera kanały/kategorie, gdzie bot ma być aktywny
   - Konfiguruje rolę do pingowania przy przekazywaniu zgłoszeń
   - Ustawia domyślny język odpowiedzi
   - Dodaje niestandardowe instrukcje dla AI
6. Administrator przechodzi do sekcji "Limits" i konfiguruje:
   - Maksymalną liczbę wiadomości per użytkownik
   - Maksymalną długość tekstu w pojedynczej wiadomości
7. Administrator zapisuje konfigurację i aktywuje bota
8. System potwierdza aktywację i pokazuje status bota
=======
1. Administrator wchodzi na stronę główną (landing page) produktu
2. Administrator klika przycisk logowania i autentykuje się przez OAuth Discord
3. System automatycznie wykrywa serwery, gdzie użytkownik ma uprawnienia administratora
4. Administrator wybiera serwer do skonfigurowania
5. Administrator przesyła pliki do bazy wiedzy przez prosty interfejs
6. Administrator konfiguruje podstawowe ustawienia:
   - Wybiera kanały Discord dla działania bota
   - Ustawia rolę do pingowania przy przekazywaniu zgłoszeń
   - Wprowadza podstawowe instrukcje dla AI
7. Administrator zapisuje konfigurację i aktywuje bota
8. System potwierdza aktywację bota
>>>>>>> master

### 4.2 Proces obsługi pytania użytkownika

1. Użytkownik zadaje pytanie na skonfigurowanym kanale
<<<<<<< HEAD
2. Bot automatycznie tworzy wątek (jeśli funkcja włączona) lub odpowiada w istniejącym wątku
3. Bot analizuje pytanie i przeszukuje bazę wiedzy
4. Bot formułuje odpowiedź na podstawie bazy wiedzy z uwzględnieniem dodatkowych instrukcji
5. Bot prezentuje odpowiedź użytkownikowi w ludzkim tonie, ale z jasną identyfikacją jako AI
6. Użytkownik może:
=======
2. Bot analizuje pytanie i przeszukuje bazę wiedzy
3. Bot formułuje odpowiedź na podstawie bazy wiedzy
4. Bot prezentuje odpowiedź użytkownikowi w ludzkim tonie
5. Użytkownik może:
>>>>>>> master
   - Zadać pytanie uzupełniające w tym samym wątku
   - Podziękować i zakończyć interakcję
   - Poprosić o przekazanie do człowieka

### 4.3 Proces przekazania zgłoszenia do człowieka

1. Przekazanie inicjowane gdy:
   - Użytkownik wyraźnie prosi o kontakt z człowiekiem
   - Bot nie znajduje odpowiedzi i proponuje przekazanie
   - Przekroczony został limit wiadomości bez rozwiązania
2. Bot informuje użytkownika o przekazaniu i dodaje przycisk "Forward to a human"
3. Po kliknięciu przycisku:
   - System pinguje skonfigurowaną rolę "Support"
   - Do wątku dodawana jest informacja o przekazaniu
   - Historia konwersacji pozostaje dostępna dla obsługującego
<<<<<<< HEAD
4. Członek zespołu support może:
   - Przejąć konwersację i odpowiedzieć bezpośrednio
   - Dodać brakujące informacje do bazy wiedzy
   - Przekazać zgłoszenie z powrotem do AI po rozwiązaniu problemu
=======
4. Członek zespołu support może przejąć konwersację i odpowiedzieć bezpośrednio
>>>>>>> master

## 5. Wymagania niefunkcjonalne

### 5.1 Wydajność
- Czas odpowiedzi bota: maksymalnie 10 sekund na standardowe zapytanie
<<<<<<< HEAD
- Na każdym serwerze kilka zapytań na raz jest procesowane w kolejce, a nie na raz.
- Czas ładowania dashboardu: maksymalnie 3 sekundy

### 5.2 Bezpieczeństwo
- Pełna zgodność z wymaganiami Discord odnośnie botów
- Szyfrowanie danych przechowywanych w bazie
- Ograniczenie dostępu do dashboardu tylko dla administratorów


### 5.3 Kompatybilność
- Pełna funkcjonalność na przeglądarkach: Chrome, Firefox, Safari, Edge
- Responsywny design dashboardu (desktop i mobile)
=======
- Na każdym serwerze kilka zapytań na raz jest procesowane w kolejce, a nie równolegle
- System shardingu musi obsługiwać minimum 2500 serwerów na shard
- Czas ładowania podstawowego dashboardu: maksymalnie 3 sekundy

### 5.2 Niezawodność
- Dostępność systemu: minimum 99.5% czasu
- Automatyczne odzyskiwanie po awariach
- Mechanizm kolejkowania zapytań przy przeciążeniu
- Redundancja shardów zapewniająca ciągłość działania w przypadku awarii pojedynczego sharda

### 5.3 Bezpieczeństwo
- Pełna zgodność z wymaganiami Discord odnośnie botów
- Szyfrowanie danych przechowywanych w bazie
- Ograniczenie dostępu do dashboardu tylko dla administratorów
- Zabezpieczenie API przed nieautoryzowanym dostępem

### 5.4 Skalowalność
- Architektura shardingu pozwalająca na obsługę ponad 2500 serwerów Discord
- Automatyczne skalowanie liczby shardów w zależności od liczby serwerów
- Optymalizacja wykorzystania zasobów przez poszczególne shardy

### 5.5 Kompatybilność
- Pełna funkcjonalność bota na wszystkich platformach Discord
- Podstawowy dashboard działa na głównych przeglądarkach: Chrome, Firefox, Safari, Edge
- Minimalistyczny responsywny design dashboardu
>>>>>>> master

## 6. Ograniczenia MVP

### 6.1 Funkcjonalność wyłączona z MVP
<<<<<<< HEAD
- Sharding bota
=======
- Zaawansowane funkcje dashboardu (wizualizacje, rozbudowane statystyki)
>>>>>>> master
- Integracje z innymi platformami poza Discord
- Zaawansowana kategoryzacja/tagowanie bazy wiedzy
- Zaawansowane analityki wykorzystania bazy wiedzy
- System kolejkowania zgłoszeń dla zespołu supportu
- Różne poziomy dostępu w dashboardzie
- Implementacja monetyzacji (planowana subskrypcja miesięczna)
<<<<<<< HEAD
=======
- Zaawansowany interfejs zarządzania shardami
>>>>>>> master

### 6.2 Znane ograniczenia
- Obsługa tylko formatów plików .txt, .md i .pdf dla bazy wiedzy
- Brak automatycznego wykrywania konfliktujących informacji w bazie wiedzy
- Ograniczona obsługa multimediów (obrazy, wideo) w zapytaniach
<<<<<<< HEAD

## 7. Kryteria akceptacji MVP

1. Administrator może skonfigurować bota przez dashboard
2. Bot odpowiada na pytania we wskazanych kanałach/wątkach
=======
- Podstawowy, surowy interfejs dashboardu

## 7. Kryteria akceptacji MVP

1. Bot odpowiada na pytania we wskazanych kanałach/wątkach wykorzystując bazę wiedzy
2. System shardingu działa poprawnie i obsługuje skalowanie
>>>>>>> master
3. Baza wiedzy może być importowana w wymienionych formatach
4. System przekazywania zgłoszeń do człowieka działa poprawnie
5. Transkrypty konwersacji są zapisywane w bazie danych
6. Limity skonfigurowane w dashboardzie są respektowane przez bota
<<<<<<< HEAD
7. Wydajność systemu spełnia określone wymagania niefunkcjonalne
=======
7. Podstawowy dashboard umożliwia konfigurację głównych funkcji bota
8. API pozwala na pełną konfigurację bota i jest przygotowane na rozwój zaawansowanego dashboardu
>>>>>>> master

## 8. Plan wdrożenia i rozwoju

### 8.1 Kolejność implementacji
<<<<<<< HEAD
1. Autentykacja przez Discord i podstawowy dashboard
2. Import bazy wiedzy i konfiguracja AI
3. Odpowiadanie na pytania w wybranych kanałach
4. System przekazywania zgłoszeń do człowieka
5. Konfiguracja limitów i dodatkowe ustawienia
6. Analityka i monitoring

### 8.2 Planowane rozszerzenia po MVP
1. Monetyzacja przez model subskrypcji
2. Zaawansowana kategoryzacja bazy wiedzy
3. Integracje z innymi platformami
4. System kolejkowania dla zespołu supportu
5. Zaawansowane analityki i raportowanie
=======
1. Implementacja podstawowych funkcji bota Discord
2. Mechanizm shardingu bota
3. Integracja z modelem AI i implementacja obsługi bazy wiedzy
4. System przekazywania zgłoszeń do człowieka
5. API do konfiguracji bota
6. Autentykacja przez Discord i podstawowy dashboard
7. Implementacja mechanizmów pobierania konfiguracji przez bota

### 8.2 Planowane rozszerzenia po MVP
1. Rozbudowa dashboardu administracyjnego
2. Zaawansowany interfejs zarządzania bazą wiedzy
3. Zaawansowany system zarządzania i monitorowania shardów
4. Monetyzacja przez model subskrypcji
5. Zaawansowana kategoryzacja bazy wiedzy
6. Integracje z innymi platformami
7. System kolejkowania dla zespołu supportu
8. Zaawansowane analityki i raportowanie
>>>>>>> master

## 9. Miary sukcesu produktu

1. Liczba aktywnych botów na różnych serwerach
2. Procent zapytań rozwiązanych bez interwencji człowieka
<<<<<<< HEAD
3. Średni czas rozwiązania problemu użytkownika
4. Zadowolenie użytkowników końcowych (w przyszłych wersjach)
5. Redukcja kosztów obsługi supportu dla właścicieli serwerów
=======
3. Średni czas odpowiedzi bota na zapytanie
4. Stabilność systemu i czas bezawaryjnego działania
5. Redukcja kosztów obsługi supportu dla właścicieli serwerów

## 10. Architektura systemu

### 10.1 Komponenty architektury
1. **Bot Discord** - główny komponent systemu
   - Moduł obsługi komunikacji z Discord API
   - Moduł AI do przetwarzania zapytań
   - Moduł zarządzania bazą wiedzy
   - Moduł zarządzania konfiguracją
   - System shardingu

2. **API** - interfejs do komunikacji i konfiguracji
   - Endpointy do zarządzania konfiguracją
   - Endpointy do zarządzania bazą wiedzy
   - Endpointy do monitorowania i zbierania statystyk
   - System uwierzytelniania i autoryzacji

3. **Baza danych** - przechowywanie danych systemu
   - Konfiguracja botów dla serwerów
   - Baza wiedzy
   - Transkrypty konwersacji
   - Metadane użytkowników i serwerów

4. **Podstawowy Dashboard** - interfejs użytkownika
   - System autentykacji przez Discord OAuth
   - Podstawowy interfejs zarządzania serwerami
   - Prosty interfejs zarządzania bazą wiedzy
   - Podstawowe formularze konfiguracyjne

### 10.2 Przepływ danych
1. Konfiguracja bota zapisywana jest w bazie danych przez API
2. Bot regularnie pobiera aktualną konfigurację z bazy danych
3. Zapytania użytkowników są przetwarzane przez bota i przekazywane do modelu AI
4. Model AI przeszukuje bazę wiedzy i generuje odpowiedzi
5. Transkrypty konwersacji są zapisywane w bazie danych
6. Dashboard prezentuje dane pobierane z bazy danych poprzez API

### 10.3 Struktura shardingu
1. **Shard Manager** - centralny komponent zarządzający wszystkimi shardami
   - Monitoruje liczbę serwerów obsługiwanych przez bota
   - Automatycznie tworzy nowe shardy gdy liczba serwerów zbliża się do limitu
   - Dystrybuuje serwery między shardy równomiernie

2. **Shardy** - niezależne instancje bota obsługujące do 2500 serwerów każda
   - Każdy shard działa jako niezależna instancja bota
   - Komunikuje się z centralnym Shard Managerem
   - Raportuje swoją wydajność i obciążenie

## 11: Zarządzanie konfiguracją bota i bazą wiedzy

- **Tytuł**: Zarządzanie konfiguracją bota i bazą wiedzy
- **Opis**: Jako administrator serwera Discord chcę móc zarządzać konfiguracją bota oraz bazą wiedzy, aby zapewnić efektywne działanie systemu wsparcia AI.
- **Kryteria akceptacji**:
  - Administrator może edytować konfigurację bota (kanały, role, instrukcje AI, limity) dla każdego administrowanego serwera.
  - Administrator może przeglądać aktualną konfigurację serwera w dashboardzie.
  - Administrator może dodawać dokumenty do bazy wiedzy (.txt, .md, .pdf).
  - Administrator może przeglądać, aktualizować i usuwać dokumenty w bazie wiedzy.
  - Zmiany w konfiguracji są natychmiast aplikowane do działającego bota.
  - Wszystkie funkcje zarządzania konfiguracją wymagają wcześniejszego zalogowania.
  - Dostęp do konfiguracji serwera jest możliwy tylko dla użytkowników z uprawnieniami administratora na danym serwerze.
  - System automatycznie ogranicza widoczność oraz dostęp do serwerów zgodnie z uprawnieniami użytkownika.

## 12: Autentykacja przez Discord OAuth

- **Tytuł**: Autentykacja przez Discord OAuth
- **Opis**: Jako użytkownik dashboardu administracyjnego chcę móc logować się do systemu przez Discord, aby uzyskać bezpieczny dostęp do zarządzania botem tylko dla serwerów, których jestem administratorem.
- **Kryteria akceptacji**:
  - Logowanie odbywa się wyłącznie przez OAuth Discord za pośrednictwem Supabase Auth.
  - System automatycznie wykrywa i wyświetla tylko serwery, na których użytkownik ma uprawnienia administratora.
  - Dostęp do dashboardu i jego funkcji jest ograniczony do zalogowanych użytkowników.
  - Strona główna (landing page) jest jedyną stroną dostępną bez logowania.
  - Strona główna zawiera opis produktu, jego główne funkcje i wyraźny przycisk logowania.
  - Użytkownik może się wylogować z systemu poprzez przycisk w interfejsie dashboardu.
  - System weryfikuje uprawnienia użytkownika przy każdej akcji modyfikującej konfigurację.
  - Dashboard wyświetla tylko serwery, na których bot jest już zainstalowany i użytkownik ma uprawnienia administratora.
  - System przechowuje tokeny sesji w bezpieczny sposób zgodny z wytycznymi Supabase.
  - Użytkownik jest automatycznie przekierowywany do strony logowania przy próbie dostępu do chronionych zasobów.
  - Po zalogowaniu użytkownik jest przekierowywany do wcześniej żądanej strony lub do listy serwerów jako domyślnej.
>>>>>>> master
