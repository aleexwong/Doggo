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

Photos from the free [Dog.CEO API](https://dog.ceo/dog-api/). No auth — best
scores live in `localStorage`.

## Top Dogs leaderboard (optional)

Scores can be posted to a global leaderboard backed by the original Doggo
app's Firebase project via the Firestore REST API. Copy `.env.example` to
`.env.local` (or set the variables in your deploy environment) with the
`project_id` and `api_key` from `../app/google-services.json`. Unset, the
leaderboard UI hides itself entirely.

Firestore rules need to allow public reads and creates on the
`web_leaderboard_streak` and `web_leaderboard_blitz` collections, e.g.:

```
match /web_leaderboard_{mode}/{doc} {
  allow read: if true;
  allow create: if request.resource.data.name is string
    && request.resource.data.name.size() <= 16
    && request.resource.data.score is int
    && request.resource.data.score >= 0
    && request.resource.data.score < 10000;
}
```

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
