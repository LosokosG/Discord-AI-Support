# Przykładowy dokument Markdown

To jest przykładowy dokument, który demonstruje wszystkie funkcje formatowania obsługiwane przez naszą implementację Markdown.

## Podstawowe formatowanie

**Pogrubienie** i _kursywa_ oraz **_pogrubiona kursywa_**.
Możemy też używać ~~przekreślenia~~ tekstu.

## Linki i obrazy

[Link do przykładowej strony](https://example.com)

![Przykładowy obraz](https://via.placeholder.com/150)

## Listy

### Lista nienumerowana

- Element pierwszy
- Element drugi
  - Zagnieżdżony element
  - Kolejny zagnieżdżony element
- Element trzeci

### Lista numerowana

1. Pierwszy krok
2. Drugi krok
   1. Zagnieżdżony krok
   2. Kolejny zagnieżdżony krok
3. Trzeci krok

### Lista zadań

- [x] Zadanie wykonane
- [ ] Zadanie do zrobienia
- [ ] Kolejne zadanie

## Cytaty

> To jest cytat.
>
> Może zawierać wiele akapitów.
>
> > A to jest zagnieżdżony cytat.

## Kod

Wstawka kodu w linii: `const x = 42;`

Blok kodu z podświetlaniem składni:

```javascript
function przykład() {
  const tekst = "Witaj, świecie!";
  console.log(tekst);
  return tekst.split(" ");
}
```

```python
def funkcja_python():
    return "Python też działa!"
```

## Tabele

| Nazwa     | Typ    | Opis                      |
| --------- | ------ | ------------------------- |
| id        | string | Unikalny identyfikator    |
| createdAt | date   | Data utworzenia dokumentu |
| content   | string | Treść dokumentu           |

## Wzory matematyczne

Wzór w linii: $E = mc^2$

Blok wzoru:

$$
\frac{d}{dx}(e^x) = e^x
$$

$$
\sum_{i=1}^{n} i = \frac{n(n+1)}{2}
$$

## Pozioma linia

---

## Znaki specjalne

Możemy używać znaków specjalnych \*bez formatowania\* używając backslash.

## Podsumowanie

To są wszystkie główne funkcje formatowania Markdown obsługiwane przez naszą implementację. Każda z nich jest w pełni funkcjonalna i stylizowana zgodnie z motywem Discord.
