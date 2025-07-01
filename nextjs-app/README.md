# NDIS Shift Logging and Invoicing Demo

This app demonstrates a small Next.js + Firebase setup for logging shifts and creating invoices for NDIS workers and participants. Use `/signup/participant` or `/signup/worker` to access the onboarding wizards.

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

- Participant signup wizard with plan details and service selection
- Worker signup wizard with account setup and ABN details
- Worker dashboard with clients, shifts, invoices and expenses
- Admin area for uploading NDIS support catalogues, assigning roles and viewing audit logs. A CSV uploader converts line items into JSON.
- Participant job posting form with recurring job option and worker invites

### Twilio SMS

The included Firebase extension watches the `messages` collection for outbound
SMS. Each queued message should include a `to`, `body`, and `cost` field. The
admin dashboard lets you configure inbound and outbound SMS pricing and shows
usage grouped by user for a selected date range.

This project uses Tailwind CSS for styling and Firebase for authentication and storage. The PDF generation and SMS features are placeholders for future implementation.
