# Dokument Wymagań Projektowych (PRD): Discord AI Support Bot

## 1. Wprowadzenie

### 1.1 Cel produktu
Discord AI Support Bot ma na celu automatyzację pierwszej linii wsparcia technicznego na serwerach Discord, umożliwiając właścicielom serwerów redukcję kosztów operacyjnych i czasu poświęcanego na odpowiadanie na powtarzalne pytania.

### 1.2 Zakres MVP
Pierwsza wersja produktu skupia się na podstawowych funkcjonalnościach potrzebnych do efektywnego automatyzowania supportu z możliwością przekazania trudniejszych przypadków do obsługi ludzkiej.

### 1.3 Kontekst biznesowy
Rosnące koszty utrzymania zespołów wsparcia oraz powtarzalność znacznej części pytań użytkowników stwarzają okazję do wprowadzenia rozwiązania opartego na AI, które pozwoli na natychmiastową odpowiedź 24/7.

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
- Automatyczne odpowiadanie na pytania tylko w skonfigurowanych kanałach/kategoriach/wątkach
- Jasna identyfikacja jako bot AI z zachowaniem ludzkiego tonu
- Możliwość obsługi pytań wieloetapowych w ramach jednego wątku
- Obsługa różnorodnych formatów pytań (proste pytania, opisy problemów, screenshoty)
- Automatyczne tłumaczenie odpowiedzi na ustawiony domyślny język

#### 3.3.2 Wykorzystanie bazy wiedzy
- Kontekstualizacja odpowiedzi w oparciu o importowaną bazę wiedzy
- Zachowanie kontekstu konwersacji w ramach jednego wątku
- Informowanie użytkownika gdy odpowiedź nie znajduje się w bazie wiedzy
- Przyznawanie się do niewiedzy zamiast podawania niepewnych informacji

#### 3.3.3 System przekazywania zgłoszeń
- Przycisk "Forward to a human" wyświetlany gdy:
  * AI proponuje przekazanie zgłoszenia ze względu na brak pewności
  * Użytkownik wyraźnie prosi o kontakt z człowiekiem
- Automatyczne pingowanie skonfigurowanej roli Discord przy przekazaniu
- Zachowanie pełnej historii konwersacji dla osoby przejmującej zgłoszenie


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

## 4. Szczegółowe przepływy użytkownika

### 4.1 Proces konfiguracji bota przez administratora

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

### 4.2 Proces obsługi pytania użytkownika

1. Użytkownik zadaje pytanie na skonfigurowanym kanale
2. Bot automatycznie tworzy wątek (jeśli funkcja włączona) lub odpowiada w istniejącym wątku
3. Bot analizuje pytanie i przeszukuje bazę wiedzy
4. Bot formułuje odpowiedź na podstawie bazy wiedzy z uwzględnieniem dodatkowych instrukcji
5. Bot prezentuje odpowiedź użytkownikowi w ludzkim tonie, ale z jasną identyfikacją jako AI
6. Użytkownik może:
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
4. Członek zespołu support może:
   - Przejąć konwersację i odpowiedzieć bezpośrednio
   - Dodać brakujące informacje do bazy wiedzy
   - Przekazać zgłoszenie z powrotem do AI po rozwiązaniu problemu

## 5. Wymagania niefunkcjonalne

### 5.1 Wydajność
- Czas odpowiedzi bota: maksymalnie 10 sekund na standardowe zapytanie
- Na każdym serwerze kilka zapytań na raz jest procesowane w kolejce, a nie na raz.
- Czas ładowania dashboardu: maksymalnie 3 sekundy

### 5.2 Bezpieczeństwo
- Pełna zgodność z wymaganiami Discord odnośnie botów
- Szyfrowanie danych przechowywanych w bazie
- Ograniczenie dostępu do dashboardu tylko dla administratorów


### 5.3 Kompatybilność
- Pełna funkcjonalność na przeglądarkach: Chrome, Firefox, Safari, Edge
- Responsywny design dashboardu (desktop i mobile)

## 6. Ograniczenia MVP

### 6.1 Funkcjonalność wyłączona z MVP
- Sharding bota
- Integracje z innymi platformami poza Discord
- Zaawansowana kategoryzacja/tagowanie bazy wiedzy
- Zaawansowane analityki wykorzystania bazy wiedzy
- System kolejkowania zgłoszeń dla zespołu supportu
- Różne poziomy dostępu w dashboardzie
- Implementacja monetyzacji (planowana subskrypcja miesięczna)

### 6.2 Znane ograniczenia
- Obsługa tylko formatów plików .txt, .md i .pdf dla bazy wiedzy
- Brak automatycznego wykrywania konfliktujących informacji w bazie wiedzy
- Ograniczona obsługa multimediów (obrazy, wideo) w zapytaniach

## 7. Kryteria akceptacji MVP

1. Administrator może skonfigurować bota przez dashboard
2. Bot odpowiada na pytania we wskazanych kanałach/wątkach
3. Baza wiedzy może być importowana w wymienionych formatach
4. System przekazywania zgłoszeń do człowieka działa poprawnie
5. Transkrypty konwersacji są zapisywane w bazie danych
6. Limity skonfigurowane w dashboardzie są respektowane przez bota
7. Wydajność systemu spełnia określone wymagania niefunkcjonalne

## 8. Plan wdrożenia i rozwoju

### 8.1 Kolejność implementacji
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

## 9. Miary sukcesu produktu

1. Liczba aktywnych botów na różnych serwerach
2. Procent zapytań rozwiązanych bez interwencji człowieka
3. Średni czas rozwiązania problemu użytkownika
4. Zadowolenie użytkowników końcowych (w przyszłych wersjach)
5. Redukcja kosztów obsługi supportu dla właścicieli serwerów