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

### Adoption email recipient

The adoption confirmation email uses the `mailto:` protocol. Update the `EMAIL_ADDRESS` constant in [`src/App.jsx`](src/App.jsx) with the inbox that should receive confirmation emails.
