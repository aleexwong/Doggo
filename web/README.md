# Doggo Web 🐶

A dog breed guessing game in an Android phone frame — a web remake of the
[Doggo Android app](https://github.com/aleexwong/Doggo), built to be embedded
on a personal site via iframe.

> **Note:** this folder is staged here temporarily and is meant to be moved
> to its own `doggo-web` repository (see `docs/PRD-doggo-web.md`).

## Play

- **Endless Streak** — play until you miss.
- **60s Blitz** — identify as many breeds as you can in a minute.
- Keyboard: press <kbd>1</kbd>–<kbd>4</kbd> to answer.

Photos from the free [Dog.CEO API](https://dog.ceo/dog-api/). No backend, no
auth — best scores live in `localStorage`.

## Develop

```sh
npm install
npm run dev      # local dev server
npm run build    # typecheck + production build (dist/)
```

## Embed (Next.js site)

```html
<iframe
  src="https://<deployed-url>"
  title="Doggo dog breed guessing game"
  loading="lazy"
  allow="clipboard-write"
  style="width: 400px; aspect-ratio: 9 / 21; border: 0"
/>
```
