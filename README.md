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

### Automatic adoption email

When someone agrees to adopt, the app calls a backend endpoint that sends an email on your behalf—no email client redirect required. Expose that endpoint to the client by creating a `.env` file with:

```
VITE_ADOPTION_EMAIL_ENDPOINT=https://your-service.example.com/send-email
```

The endpoint should accept a JSON payload shaped like `{ "subject": "Yes, the cat has been adopted!", "body": "Great news! Someone just agreed to adopt the cat. Please reach out to coordinate the essentials." }` and deliver the email (for example, with Nodemailer, SendGrid, or AWS SES). If the endpoint is unreachable or misconfigured, the modal will display an inline error so you can retry after fixing the setup.
