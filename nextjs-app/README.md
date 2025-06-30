# NDIS Shift Logging and Invoicing Demo

This app demonstrates a small Next.js + Firebase setup for logging shifts and creating invoices for NDIS workers and participants.

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the development server:
   ```bash
   npm run dev
   ```
3. Build for production:
   ```bash
   npm run build
   ```

## Features

- Participant signup wizard with service selection
- Worker dashboard with clients, shifts, invoices and expenses
- Admin area for uploading NDIS support catalogues

### Twilio SMS

The included Firebase extension watches the `messages` collection for outbound
SMS. Each queued message should include a `to`, `body`, and `cost` field. The
admin dashboard displays these messages and their total cost.

This project uses Tailwind CSS for styling and Firebase for authentication and storage. The PDF generation and SMS features are placeholders for future implementation.
