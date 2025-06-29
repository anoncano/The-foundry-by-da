# Repository Guidelines

This repository contains a Next.js application that uses Firebase for authentication.

## Testing

Run `npm install` and `npm run build` inside the `my-app` directory to build the project.

## Deployment

GitHub Actions workflow at `.github/workflows/firebase-hosting.yml` deploys to Firebase Hosting. Add a secret `FIREBASE_SERVICE_ACCOUNT` containing your service account JSON.
