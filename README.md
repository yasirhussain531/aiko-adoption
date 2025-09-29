# Aiko Adoption

A playful single-page React experience where you can browse a carousel of adorable cats and decide whether to adopt them. The app opens with a spinning cat loader, then reveals the adoption call-to-action with Yes/No interactions.

## Getting Started

```bash
npm install
npm run dev
```

Visit the development server URL printed in the terminal (defaults to `http://localhost:5173`).

### Production build

```bash
npm run build
```

### Replacing the carousel images

Open [`src/App.jsx`](src/App.jsx) and update the `createCarouselImages` function with your own image URLs and alt text.

### Discord DM notification

When someone agrees to adopt, the app posts `"Yes the cat have been adopted"` straight to your Discord DMs via a backend endpoint of your choosing. Expose that endpoint to the client by creating a `.env` file with:

```
VITE_DISCORD_DM_ENDPOINT=https://your-service.example.com/discord-dm
```

The endpoint should accept a JSON payload shaped like `{ "message": "Yes the cat have been adopted" }` and forward it to your personal Discord account (for example, by using a serverless function with a Discord bot token). If the endpoint is unreachable or misconfigured, the modal will display an inline error so you can retry after fixing the setup.
