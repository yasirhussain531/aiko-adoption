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

When someone agrees to adopt, the app attempts to deliver an email on your behalf—no email client redirect required. You have two options:

#### 1. Use your own backend (any provider)

Expose a server endpoint through a `.env` file:

```
VITE_ADOPTION_EMAIL_ENDPOINT=https://your-service.example.com/send-email
```

Your endpoint should accept `{ "subject": "Yes, the cat has been adopted!", "body": "Great news! Someone just agreed to adopt the cat. Please reach out to coordinate the essentials." }` and send the email via your favourite provider (Nodemailer, SendGrid, AWS SES, etc.). If the endpoint is unreachable or misconfigured, the happy modal will report the failure so you can retry after fixing the setup.

#### 2. Use a free EmailJS account (no backend required)

EmailJS offers a generous free tier that lets you send emails directly from the browser. After creating an account:

1. Create an email service (choose your email provider) and note the **Service ID**.
2. Create an email template with `{{subject}}` and `{{message}}` variables.
3. Copy your **Template ID** and **Public Key** from the EmailJS dashboard.
4. Create a `.env` file with:

   ```
   VITE_EMAILJS_SERVICE_ID=your_service_id
   VITE_EMAILJS_TEMPLATE_ID=your_template_id
   VITE_EMAILJS_PUBLIC_KEY=your_public_key
   ```

The app will automatically detect these values and send the adoption confirmation through EmailJS. You can customise the template to include additional context (for example, the adopter's IP or timestamp) using the variables provided in `template_params` within [`src/App.jsx`](src/App.jsx).
