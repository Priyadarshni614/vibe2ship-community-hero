# Community Hero - Hyperlocal Problem Solver

## Problem Statement Selected

Community Hero - Hyperlocal Problem Solver

## Problem Statement

Communities frequently face issues such as potholes, water leakages, damaged streetlights, waste management concerns, and public infrastructure challenges. Existing reporting methods are often fragmented, difficult to track, and lack transparency.

## Solution Overview

Community Hero is an AI-powered civic issue reporting platform that helps citizens report, verify, track, and review local community problems. Citizens can upload photos or videos, describe the issue, add location, and submit reports. Google Gemini AI analyzes the report, categorizes the issue, estimates severity, gives a priority score, recommends the correct department, and suggests the next action.

The system also includes sign in/logout with preferred language selection, universal language support, community verification, citizen support/likes, public thoughts/comments, status tracking, and post-resolution feedback. Gemini AI produces citizen-facing AI content in the user's selected language and checks for duplicate reports before submission, summarizes community verification evidence, groups similar issues for scalable handling of 100+ reports, highlights highly supported and commented issues on the dashboard, generates citizen awareness messages, and improves feedback into clear, useful language for officials without changing the citizen's meaning.

## Key Features

1. Citizen sign in and logout
2. Preferred language selection during profile/sign in
3. Universal language support with English, Tamil, Hindi, many presets, and custom language entry
4. Gemini-generated citizen-facing content and AI-translated UI labels in the selected/custom language
5. Image/video-based issue reporting
6. AI auto-fill for issue title and description
7. Location required through GPS or manual entry
8. AI-powered issue categorization
9. AI severity prediction and priority scoring
10. AI department routing and suggested action
11. Community verification of reported issues
12. Citizen support/likes and public thoughts for awareness
13. AI duplicate detection to reduce repeated complaints
14. AI community verification summary using supports, thoughts, and verification count
15. AI dashboard insights for trends, high-risk areas, and highly discussed issues
16. Search, filter, smart ranking, and Load More to handle 100+ reports
17. AI similar issue grouping to reduce repeated cards
18. AI awareness message generation for highly supported/commented issues
19. Real-time status tracking: Reported, Verified, Assigned, In Progress, Resolved
20. Citizen feedback after issue resolution
21. AI-enhanced feedback for clear communication
22. Impact dashboard with reports, verified count, resolved count, feedback count, supports, thoughts, and category insights
23. Gamification points for reporting, verification, support, thoughts, resolution, and feedback

## Technologies Used

- HTML, CSS, JavaScript for frontend
- Node.js and Express.js for backend
- Google Gemini API for AI analysis and feedback enhancement
- Firebase Hosting / Google Cloud for deployment
- Firestore optional support for persistent cloud storage
- OpenStreetMap links for map viewing

## Google Technologies Utilized

1. Google AI Studio / Gemini API
   - Universal language assistance and Gemini-powered UI translation
   - Image-based issue understanding
   - Report auto-fill
   - Category detection
   - Severity and priority estimation
   - Department routing
   - Suggested action generation
   - Duplicate issue detection
   - Community verification summarization
   - Dashboard insight generation
   - Highly liked/commented issue spotlight
   - Similar issue grouping for high-volume report handling
   - Citizen awareness message generation
   - Citizen feedback enhancement in the user's preferred/custom language
   - Sentiment and follow-up signal generation

2. Firebase Hosting / Google Cloud
   - Public deployment of the full-stack web application

3. Firestore-ready backend
   - The backend supports Firestore when a Google Cloud project is configured

## Why AI is Useful Here

AI reduces the effort required from citizens and helps officials act faster. Citizens may not know which department to contact, how to describe an issue clearly, or may prefer to use the app in their local or native language. Gemini AI converts a photo and short description into a structured civic report and returns citizen-facing text in the selected or custom language. Gemini also translates UI labels for languages not built into the app. It also prioritizes urgent issues, reduces duplicate complaints, groups similar issue reports, converts citizen support and thoughts into verification summaries, highlights issues that are highly supported or commented, generates awareness messages, and improves citizen feedback after resolution, making the platform more transparent and action-oriented.

## Safety and Accuracy Measures

The AI does not auto-fill or guess the location. Language translation is used for citizen-facing text and UI labels; system fields such as severity/status are kept controlled for reliable filtering and ranking. The citizen must provide location through GPS or manual typing. This prevents fake or incorrect reports from being created with guessed locations. The citizen can also edit AI-generated report text before submission.

## Final Submission Items

- Deployed Application Link: Firebase Hosting / Google Cloud URL
- GitHub Repository Link: Source code repository
- Google Doc Link: This project description document with public view access


## Dedicated Sign-in and Universal Language Access

The latest version uses a separate `signin.html` page for a cleaner profile creation flow. Citizens enter name, email, and preferred language before using the main platform. The language preference is stored in browser storage for the hackathon demo, and Gemini is used to translate citizen-facing AI outputs and dynamic UI content for universal accessibility.


## Deployment Note

Because Cloud Run required billing activation, this no-billing fallback is deployed using Firebase Hosting on the Firebase Spark plan. The MVP remains within the Google/Firebase ecosystem and continues to use Gemini API for AI-powered analysis, auto-fill, insights, awareness messages, verification summaries, and feedback enhancement.

For the hackathon demo, reports are stored in browser localStorage. The project can be upgraded to Firestore or Cloud Run when billing/free trial access is available.
