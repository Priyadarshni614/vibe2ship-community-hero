# Community Hero - Hyperlocal Problem Solver

Community Hero is an AI-powered civic issue reporting platform built for the Vibe2Ship hackathon. Citizens can report problems such as potholes, water leakages, broken streetlights, waste issues, and public safety risks. Gemini AI helps with report understanding, category detection, priority scoring, department routing, and feedback enhancement.

## New Features Added

- Demo sign in and logout using browser localStorage
- Universal profile language selection with common presets plus custom language
- Built-in UI support for English, Tamil, and Hindi, plus Gemini-powered UI translation for other languages
- Gemini returns citizen-facing AI text in the user's preferred language, including custom languages
- Signed-in users can submit reports, verify reports, update status, and give feedback
- Gemini AI auto-fills issue title and description from image/user input
- Gemini AI does not guess location; location must be GPS or manually typed
- Location is required before report submission
- AI category, severity, priority score, department, and action suggestion
- AI duplicate detection before creating a new report
- Citizens can support/like issues and add their own thoughts
- Gemini AI summarizes community verification signals
- Gemini AI dashboard insights highlight highly supported/commented issues
- Search, filter, smart ranking, and Load More for handling 100+ issues
- Gemini AI groups similar issues so repeated reports become clear issue clusters
- Gemini AI creates citizen awareness messages for highly supported issues
- Resolved issues unlock citizen feedback
- Gemini AI enhances citizen feedback after resolution
- Dashboard shows total reports, verified reports, resolved issues, and feedback count

## Tech Stack

- Frontend: HTML, CSS, JavaScript
- Backend: Node.js, Express.js
- AI: Google Gemini API from Google AI Studio
- Deployment: Google Cloud Run
- Optional Storage: Firestore when Google Cloud project environment is available

## Setup in VS Code

1. Extract the ZIP.
2. Open this folder in VS Code.
3. Create a `.env` file:

```env
GEMINI_API_KEY=PASTE_YOUR_NEW_GEMINI_API_KEY_HERE
```

4. Install dependencies:

```bash
npm install
```

5. Run locally:

```bash
npm run dev
```

6. Open:

```text
http://localhost:8080
```

## Demo Flow

1. Click **Sign in**, enter name/email, and choose a preferred language.
2. Try Tamil/Hindi for built-in translation, or choose **Other / Type language** and type Kannada, Arabic, French, Sinhala, etc.
3. Check that Gemini translates the app UI and citizen-facing AI content to the selected language.
4. Upload an issue photo.
5. Click **Auto-fill with AI** and show that AI content appears in the selected language.
5. Add location manually or use GPS.
6. Submit the report. The app runs an AI duplicate check before final submission.
7. Open a report and click **Support Issue** with a citizen thought.
8. Click **AI Verification Summary** to show whether the issue is likely valid.
9. Open the dashboard and click **Generate AI Insights**.
10. Click **Group Similar Issues** to show how 100+ reports can be clustered.
11. Use Search / Filter / Sort / Load More to show scalable issue handling.
12. Click **AI Awareness Message** inside a report card.
13. Update status to **Resolved**.
14. In the resolved report card, type feedback.
15. Click **Enhance Feedback with AI**.
16. Submit the feedback.

## Google Cloud Run Deployment

```bash
gcloud init
gcloud config set project YOUR_PROJECT_ID
gcloud services enable run.googleapis.com cloudbuild.googleapis.com artifactregistry.googleapis.com
gcloud run deploy community-hero --source . --region asia-south1 --allow-unauthenticated --set-env-vars GEMINI_API_KEY=YOUR_NEW_GEMINI_API_KEY
```

## Important Security Note

Do not commit `.env` to GitHub. The `.gitignore` file already includes `.env`.

If your Gemini API key was shared in a screenshot or chat, delete that key in Google AI Studio and create a new one.


## Universal Language Mode

The app includes built-in English, Tamil, and Hindi labels for fast loading. For other languages, the user can choose a preset language or select **Other / Type language** during sign in. Gemini translates the UI labels and also generates citizen-facing AI content in that chosen language. Translations are cached in browser localStorage so repeated testing is faster.


## Dedicated Sign-in and Universal Language Access

The latest version uses a separate `signin.html` page for a cleaner profile creation flow. Citizens enter name, email, and preferred language before using the main platform. The language preference is stored in browser storage for the hackathon demo, and Gemini is used to translate citizen-facing AI outputs and dynamic UI content for universal accessibility.


## No-billing Firebase Hosting fallback

This version is prepared for Firebase Hosting on the no-cost Spark plan. It runs as a static web app and uses browser localStorage for demo reports. Gemini API calls are made from the browser using `public/config.js`.

Create `public/config.js` before deploying:

```js
window.CH_CONFIG = {
  GEMINI_API_KEY: "YOUR_NEW_RESTRICTED_GEMINI_API_KEY"
};
```

Do not commit a real `config.js` to GitHub. For a public demo, restrict the Gemini API key to the deployed Firebase Hosting domain in Google AI Studio / Google Cloud API key restrictions.

Deploy from Cloud Shell:

```bash
firebase use ibe2ship
firebase deploy --only hosting
```
