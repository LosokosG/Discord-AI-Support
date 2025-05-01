# Plan implementacji bota Discord dla AI Support Bot

## 1. Przegląd struktury bota

Bot Discord będzie głównym elementem systemu obsługi pierwszej linii wsparcia technicznego, automatyzującym odpowiedzi na powtarzalne pytania. System będzie zbudowany na solidnej architekturze shardingu umożliwiającej obsługę dużej liczby serwerów (do 2500 na shard). Bot będzie zintegrowany z:

- **Supabase** jako backend do przechowywania konfiguracji, bazy wiedzy i transkryptów
- **OpenRouter.ai** do komunikacji z modelami AI generującymi odpowiedzi
- **API REST** do komunikacji między botem a dashboardem administracyjnym

Główne funkcjonalności bota to:
- Automatyczne odpowiadanie na pytania w skonfigurowanych kanałach
- Wykorzystanie bazy wiedzy do kontekstualizacji odpowiedzi
- Przekazywanie zgłoszeń do zespołu wsparcia gdy bot nie może pomóc
- Przechowywanie transkryptów rozmów w bazie danych
- Obsługa limitów i konfiguracji pobieranej z bazy danych

## 2. Lista komend i interakcji

### Komendy administracyjne

#### Komenda: /setup
- **Opis**: Inicjalna konfiguracja bota na serwerze
- **Główny cel**: Szybkie ustawienie podstawowych parametrów działania bota
- **Kluczowe informacje**: Wybór kanałów do monitorowania, rola do pingowania, język odpowiedzi
- **Kluczowe komponenty**: Wywołania API do zapisania konfiguracji w bazie danych
- **UX/Bezpieczeństwo**: Dostępne tylko dla administratorów serwera, podpowiedzi dla kanałów i ról

#### Komenda: /status
- **Opis**: Sprawdzenie aktualnego statusu bota i jego konfiguracji
- **Główny cel**: Diagnostyka i uzyskanie informacji o stanie bota
- **Kluczowe informacje**: Status (włączony/wyłączony), monitorowane kanały, statystyki użycia
- **Kluczowe komponenty**: API do pobrania konfiguracji i statystyk
- **UX/Bezpieczeństwo**: Czytelny embed z danymi, ograniczony dostęp

#### Komenda: /config
- **Opis**: Zarządzanie szczegółową konfiguracją bota
- **Główny cel**: Dostosowanie działania bota do potrzeb serwera
- **Kluczowe informacje**: Opcje konfiguracyjne pogrupowane tematycznie
- **Kluczowe komponenty**: API do aktualizacji konfiguracji, formularze Discord
- **UX/Bezpieczeństwo**: Formularze z walidacją danych wejściowych, ograniczony dostęp

#### Komenda: /activate
- **Opis**: Włączenie bota na serwerze
- **Główny cel**: Aktywacja monitorowania kanałów
- **Kluczowe informacje**: Potwierdzenie aktywacji, monitorowane kanały
- **Kluczowe komponenty**: API do aktualizacji statusu w konfiguracji
- **UX/Bezpieczeństwo**: Dostępne tylko dla administratorów, zabezpieczenie przed przypadkową aktywacją

#### Komenda: /deactivate
- **Opis**: Wyłączenie bota na serwerze
- **Główny cel**: Czasowe wstrzymanie monitorowania kanałów
- **Kluczowe informacje**: Potwierdzenie deaktywacji
- **Kluczowe komponenty**: API do aktualizacji statusu w konfiguracji
- **UX/Bezpieczeństwo**: Dostępne tylko dla administratorów, potwierdzenie operacji

### Komendy supportu

#### Komenda: /tickets
- **Opis**: Wyświetlenie listy przekazanych zgłoszeń
- **Główny cel**: Zarządzanie zgłoszeniami przez zespół supportu
- **Kluczowe informacje**: Lista aktywnych zgłoszeń, ich status i przypisanie
- **Kluczowe komponenty**: API do pobrania ForwardedTickets, paginacja wyników
- **UX/Bezpieczeństwo**: Dostępne dla roli support, sortowanie i filtrowanie zgłoszeń

#### Komenda: /transcript
- **Opis**: Pobranie historii konkretnej konwersacji
- **Główny cel**: Analiza przeszłych interakcji
- **Kluczowe informacje**: Pełna historia konwersacji z datami i użytkownikami
- **Kluczowe komponenty**: API do pobrania transkryptów, formatowanie wiadomości
- **UX/Bezpieczeństwo**: Dostępne dla administratorów i roli support, paginacja długich historii

### Interakcje z użytkownikami

#### Interakcja: Automatyczna odpowiedź na pytanie
- **Opis**: Bot odpowiada na pytania użytkowników w monitorowanych kanałach
- **Główny cel**: Automatyzacja wsparcia dla powtarzalnych pytań
- **Kluczowe informacje**: Odpowiedź na pytanie, opcje dalszych działań
- **Kluczowe komponenty**: OpenRouter do generowania odpowiedzi, API do pobrania bazy wiedzy i zapisania transkryptu
- **UX/Bezpieczeństwo**: Jasna identyfikacja jako bot, czytelność odpowiedzi, obsługa języków

#### Interakcja: Przycisk "Forward to a human"
- **Opis**: Przekazanie zgłoszenia do zespołu supportu
- **Główny cel**: Eskalacja zgłoszenia gdy bot nie może pomóc
- **Kluczowe informacje**: Potwierdzenie przekazania, pingowanie roli support
- **Kluczowe komponenty**: API do zmiany statusu konwersacji i utworzenia ForwardedTicket
- **UX/Bezpieczeństwo**: Przycisk dostępny tylko w kontekście rozmowy z botem

#### Interakcja: Wątki konwersacji
- **Opis**: Automatyczne tworzenie i zarządzanie wątkami dla pytań
- **Główny cel**: Organizacja konwersacji i zachowanie kontekstu rozmowy
- **Kluczowe informacje**: Historia konwersacji, status zgłoszenia
- **Kluczowe komponenty**: Discord Thread API, zapisywanie historii w bazie danych
- **UX/Bezpieczeństwo**: Zachowanie kontekstu między wiadomościami, przejrzystość dla użytkownika

#### Interakcja: Przejęcie zgłoszenia
- **Opis**: Agent supportu przejmuje zgłoszenie
- **Główny cel**: Przypisanie zgłoszenia do konkretnej osoby
- **Kluczowe informacje**: Status zgłoszenia, informacja dla użytkownika
- **Kluczowe komponenty**: API do aktualizacji ForwardedTicket, powiadomienia
- **UX/Bezpieczeństwo**: Tylko dla roli support, jasna informacja dla wszystkich zaangażowanych

## 3. Mapa przepływu użytkownika

### Przepływ administratora
1. Administrator instaluje bota na serwerze
2. Korzysta z `/setup` do wstępnej konfiguracji:
   - Wybiera kanały, gdzie bot będzie aktywny
   - Określa rolę supportu do pingowania
   - Wybiera domyślny język odpowiedzi
3. Przez `/config` dostosowuje szczegółowe parametry:
   - Ustawia instrukcje dla modelu AI
   - Konfiguruje limity wiadomości
   - Dostosowuje wygląd wiadomości
4. Aktywuje bota przez `/activate`
5. Monitoruje działanie przez `/status`
6. Może tymczasowo wyłączyć bota przez `/deactivate`
7. Przegląda historyczne konwersacje przez `/transcript`

### Przepływ użytkownika końcowego
1. Użytkownik zadaje pytanie na monitorowanym kanale
2. Bot automatycznie tworzy wątek do konwersacji
3. Bot analizuje pytanie i przeszukuje bazę wiedzy
4. Bot odpowiada na pytanie w wątku
5. Użytkownik może:
   - Doprecyzować pytanie i kontynuować rozmowę
   - Zakończyć interakcję (podziękować i wyjść)
   - Poprosić o kontakt z człowiekiem (kliknąć przycisk "Forward to a human")
6. Jeśli pytanie zostało przekazane, użytkownik otrzymuje informację o przekazaniu
7. Użytkownik kontynuuje rozmowę z agentem supportu w tym samym wątku

### Przepływ agenta supportu
1. Agent dostaje powiadomienie o nowym zgłoszeniu (ping roli)
2. Przegląda listę zgłoszeń przez `/tickets`
3. Wybiera zgłoszenie do obsługi i przejmuje je
4. Przegląda historię konwersacji użytkownika z botem
5. Odpowiada bezpośrednio w wątku
6. Po rozwiązaniu problemu zamyka zgłoszenie

## 4. Struktura kodu

Kod bota będzie zorganizowany zgodnie z rekomendacjami dla DiscordJS, z następującą strukturą katalogów:

```
src/discord-bot/
├── commands/                 # Pliki komend slash
│   ├── admin/                # Komendy administracyjne
│   │   ├── setup.ts          # Komenda /setup
│   │   ├── status.ts         # Komenda /status
│   │   ├── config.ts         # Komenda /config
│   │   ├── activate.ts       # Komenda /activate
│   │   └── deactivate.ts     # Komenda /deactivate
│   ├── support/              # Komendy dla zespołu supportu
│   │   ├── tickets.ts        # Komenda /tickets
│   │   └── transcript.ts     # Komenda /transcript
│   └── loader.ts             # Ładowanie komend
│
├── events/                   # Pliki obsługi zdarzeń Discord
│   ├── ready.ts              # Zdarzenie gotowości bota
│   ├── interactionCreate.ts  # Obsługa interakcji (komendy, przyciski)
│   ├── messageCreate.ts      # Obsługa nowych wiadomości
│   ├── threadCreate.ts       # Obsługa tworzenia wątków
│   └── loader.ts             # Ładowanie zdarzeń
│
├── services/                 # Serwisy pomocnicze
│   ├── api.ts                # Komunikacja z API
│   ├── openrouter.ts         # Integracja z OpenRouter
│   ├── conversation.ts       # Zarządzanie konwersacjami
│   ├── knowledge.ts          # Dostęp do bazy wiedzy
│   ├── config.ts             # Zarządzanie konfiguracją
│   └── cache.ts              # System cache'owania
│
├── interactions/             # Obsługa interakcji UI
│   ├── buttons.ts            # Obsługa przycisków
│   ├── modals.ts             # Obsługa modali formularzy
│   └── autocomplete.ts       # Obsługa podpowiedzi w komendach
│
├── utils/                    # Narzędzia pomocnicze
│   ├── embeds.ts             # Generowanie osadzonych wiadomości
│   ├── permissions.ts        # Sprawdzanie uprawnień
│   ├── validation.ts         # Walidacja danych
│   ├── formatting.ts         # Formatowanie odpowiedzi
│   └── errors.ts             # Obsługa błędów
│
├── bot.ts                    # Główny plik bota
├── index.ts                  # Sharding manager
└── config.ts                 # Podstawowa konfiguracja
```

Kluczowe elementy struktury:
- **commands/** - implementacja komend slash podzielonych na kategorie
- **events/** - obsługa zdarzeń Discord (wiadomości, interakcje)
- **services/** - logika biznesowa i komunikacja z zewnętrznymi API
- **interactions/** - obsługa komponentów interaktywnych (przyciski, formularze)
- **utils/** - funkcje pomocnicze wielokrotnego użytku
- **bot.ts** - inicjalizacja klienta Discord
- **index.ts** - implementacja shardingu dla skalowalności

## 5. Kluczowe komponenty

### Serwis API (services/api.ts)
- Implementacja komunikacji z backendem przez REST API
- Zarządzanie autoryzacją przez JWT z Supabase Auth
- Obsługa endpointów do zarządzania serwerami, konfiguracją, bazą wiedzy
- Zapisywanie i pobieranie transkryptów konwersacji
- Zarządzanie zgłoszeniami przekazanymi do supportu

### Serwis OpenRouter (services/openrouter.ts)
- Integracja z OpenRouter.ai do komunikacji z modelami AI
- Formatowanie zapytań z kontekstem bazy wiedzy
- Obsługa odpowiedzi modelu i formatowanie na potrzeby Discord
- Zarządzanie limitami tokenów i kosztami zapytań
- Implementacja strategii retry przy błędach

### Serwis konfiguracji (services/config.ts)
- Pobieranie konfiguracji z API dla każdego serwera
- Cache'owanie konfiguracji w pamięci dla szybkiego dostępu
- Mechanizm odświeżania konfiguracji po zmianach w dashboardzie
- Zarządzanie limitami użycia (max wiadomości, długość tekstu)
- Walidacja uprawnień na podstawie konfiguracji

### Serwis konwersacji (services/conversation.ts)
- Tworzenie i zarządzanie wątkami Discord
- Zapamiętywanie kontekstu rozmowy między wiadomościami
- Zapisywanie transkryptów konwersacji do bazy danych
- Zarządzanie statusem konwersacji (aktywna, przekazana, zakończona)
- Obsługa przekazywania zgłoszeń do zespołu supportu

### System shardingu (index.ts)
- Implementacja ShardingManager do zarządzania wieloma instancjami bota
- Równomierne rozłożenie serwerów między shardy
- Monitorowanie wydajności poszczególnych shardów
- Automatyczne tworzenie nowych shardów przy wzroście liczby serwerów
- Obsługa komunikacji między shardami

### Serwis bazy wiedzy (services/knowledge.ts)
- Pobieranie dokumentów z bazy wiedzy dla danego serwera
- Przygotowanie kontekstu dla modelu AI na podstawie pytania
- Zarządzanie cache'owaniem bazy wiedzy dla wydajności
- Wykrywanie braku wiedzy i proponowanie przekazania do człowieka
- Formatowanie wiedzy dla modelu AI 