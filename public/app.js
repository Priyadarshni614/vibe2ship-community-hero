const state = {
  lat: null,
  lng: null,
  imageData: "",
  mediaType: "none",
  lastAnalysis: null,
  reports: [],
  user: null,
  language: localStorage.getItem("communityHeroLanguage") || "en",
  uiLanguageName: localStorage.getItem("communityHeroLanguageName") || "English",
  dynamicI18n: null,
  feedbackDrafts: {},
  feed: {
    search: "",
    filter: "all",
    sort: "smart",
    visibleCount: 10
  }
};

const $ = (id) => document.getElementById(id);
const form = $("issueForm");
const previewWrap = $("previewWrap");
const aiResult = $("aiResult");


const LANGUAGE_OPTIONS = {
  en: { label: "English", aiName: "English" },
  ta: { label: "தமிழ்", aiName: "Tamil" },
  hi: { label: "हिन्दी", aiName: "Hindi" },
  te: { label: "తెలుగు", aiName: "Telugu" },
  ml: { label: "മലയാളം", aiName: "Malayalam" },
  kn: { label: "ಕನ್ನಡ", aiName: "Kannada" },
  bn: { label: "বাংলা", aiName: "Bengali" },
  mr: { label: "मराठी", aiName: "Marathi" },
  gu: { label: "ગુજરાતી", aiName: "Gujarati" },
  ur: { label: "اردو", aiName: "Urdu" },
  pa: { label: "ਪੰਜਾਬੀ", aiName: "Punjabi" },
  or: { label: "ଓଡ଼ିଆ", aiName: "Odia" },
  as: { label: "অসমীয়া", aiName: "Assamese" },
  ne: { label: "नेपाली", aiName: "Nepali" },
  si: { label: "සිංහල", aiName: "Sinhala" },
  ar: { label: "العربية", aiName: "Arabic" },
  fr: { label: "Français", aiName: "French" },
  es: { label: "Español", aiName: "Spanish" },
  de: { label: "Deutsch", aiName: "German" },
  zh: { label: "中文", aiName: "Chinese" },
  ja: { label: "日本語", aiName: "Japanese" },
  ko: { label: "한국어", aiName: "Korean" },
  id: { label: "Bahasa Indonesia", aiName: "Indonesian" },
  custom: { label: "Other / Type language", aiName: "Custom language" }
};

const I18N = {
  en: {
    brand: "🛡️ Community Hero",
    navReport: "Report", navDashboard: "Dashboard", navLiveIssues: "Live Issues", languageMini: "Language",
    guestMode: "Guest mode", signInBtn: "Sign in", logoutBtn: "Logout", cancelBtn: "Cancel",
    citizenAccess: "Citizen access", signInTitle: "Sign in to report, verify, and give feedback",
    signInCopy: "This is a hackathon demo sign-in using browser storage. It can be replaced with Firebase Authentication later.",
    nameLabel: "Name", emailLabel: "Email", preferredLanguageLabel: "Preferred language",
    namePlaceholder: "Example: Priya", emailPlaceholder: "Example: priya@example.com",
    languageNote: "Your language choice translates the app UI and asks Gemini to return citizen-facing AI content in your preferred language.",
    heroEyebrow: "AI-powered hyperlocal problem solver", heroTitle: "Report, verify, track, and resolve community issues faster.",
    heroCopy: "Citizens can submit photos, videos, location, and descriptions. Gemini AI categorizes issues, predicts priority, detects duplicates, summarizes verification, highlights highly supported issues, and enhances citizen feedback after resolution.",
    submitIssueAction: "Submit Issue", viewImpactAction: "View Impact", todayIntel: "Today’s civic intelligence",
    totalReportsStat: "Total reports", resolvedIssuesStat: "Resolved issues", citizenFeedbackStat: "Citizen feedback", citizenSupportsStat: "Citizen supports", communityPointsStat: "Community points",
    citizenReportEyebrow: "Citizen report", submitLocalIssueTitle: "Submit a local issue",
    submitLocalIssueCopy: "Use photo/video, description, and location. AI fills report details, but location must be added by GPS or typed manually. Sign in is required before submitting.",
    issueTitleLabel: "Issue title", locationNameLabel: "Location name", descriptionLabel: "Description", uploadLabel: "Upload image/video",
    issueTitlePlaceholder: "Example: Large pothole near bus stop", locationPlaceholder: "Example: CIT hostel road, Chennai", descriptionPlaceholder: "Explain what happened, how serious it is, and nearby landmarks.",
    useLocationBtn: "📍 Use my location", locationNotAdded: "Location not added", autofillBtn: "🤖 Auto-fill with AI", analyzeBtn: "✨ Analyze with AI", submitReportBtn: "Submit Report",
    impactDashboardEyebrow: "Impact dashboard", overviewTitle: "Community issue overview", totalStat: "Total", verifiedStat: "Verified", inProgressStat: "In progress", resolvedStat: "Resolved", feedbackStat: "Feedback", supportsStat: "Supports", thoughtsStat: "Thoughts",
    categoryInsightsTitle: "Category insights", predictivePriorityTitle: "Predictive priority", priorityInsightEmpty: "Submit reports to see AI priority insights.", communitySpotlightTitle: "Community spotlight", communitySpotlightEmpty: "Support and comment on issues to create a community spotlight.",
    geminiCommunityTitle: "Gemini community intelligence", geminiCommunityCopy: "Generate AI insights from reports, likes, thoughts, verifications, status, and feedback.", generateInsightsBtn: "🧠 Generate AI Insights", aiGroupingTitle: "AI similar issue grouping", aiGroupingCopy: "When 100+ reports arrive, Gemini groups similar complaints so the dashboard shows clusters instead of repeated cards.", generateGroupsBtn: "🧩 Group Similar Issues",
    trackingEyebrow: "Real-time tracking", liveIssuesTitle: "Live community issues", liveIssuesCopy: "Citizens can verify, support, and add thoughts to reports. Gemini summarizes community verification and highlights highly liked/commented issues for awareness.",
    searchIssuesLabel: "Search issues", searchPlaceholder: "Search by location, category, status, department, title...", filterLabel: "Filter", sortLabel: "Sort",
    filterAll: "All issues", filterHighPriority: "High priority", filterMostSupported: "Most supported", filterMostCommented: "Most commented", filterPending: "Pending action", filterVerified: "Verified", filterInProgress: "In progress", filterResolved: "Resolved", filterNeedsFeedback: "Resolved, needs feedback",
    sortSmart: "AI smart rank", sortPriority: "Priority score", sortSupported: "Most supported", sortCommented: "Most commented", sortNewest: "Newest first", showingTopIssues: "Showing top issues first.", loadMoreBtn: "Load More Issues", footerText: "Built for Vibe2Ship Hackathon · Google Gemini API · Google Cloud Run · Community participation",
    aiCategory: "AI Category", severity: "Severity", priority: "Priority", department: "Department", summary: "Summary", suggestedAction: "Suggested Action",
    signedIn: "Signed in successfully.", fillNameEmail: "Please enter name and email.", logoutSuccess: "Logged out successfully.", pleaseSignIn: "Please sign in before you {action}.", continueAction: "continue",
    locationGetting: "Getting location...", locationUnsupported: "Geolocation is not supported in this browser.", locationDenied: "Location permission denied. Please type the location manually before submitting.", gpsAdded: "GPS location added", imageReady: "Image ready for Gemini vision analysis.", videoAttached: "Video attached for evidence. For this MVP, AI analysis uses title and description for videos.",
    autofillNeedInput: "Upload an image or type one small detail first. Then AI can auto-fill the form.", autofilling: "Auto-filling...", autofillNote: "AI auto-filled title and description. Location must be added by GPS or typed manually.", autofillFailed: "AI auto-fill failed: ",
    analysisNeedInput: "Please add title, description, or image first.", analyzing: "Analyzing...", analysisFailed: "AI analysis failed: ",
    titleDescriptionRequired: "Please fill title and description.", locationRequired: "Location is required. Click 'Use my location' or type the location name manually.", reportSubmitted: "Report submitted successfully! Community +10 points.",
    checkingDuplicates: "Checking existing reports for duplicates with AI...", duplicateCheck: "AI duplicate check", possibleDuplicate: "Possible duplicate found", noDuplicate: "No strong duplicate found", similarity: "Similarity", possibleMatch: "Possible match", duplicateFailed: "Duplicate check failed, but you can still submit if the report is correct.", duplicateConfirmFail: "AI duplicate check failed. Submit this report anyway?",
    noReports: "No reports match this search or filter.", showingIssues: "Showing {visible} of {total} matching issues. Use search, filters, and Load More to handle large issue lists.",
    communitySupport: "Community support", supportCopy: "Support means you agree this issue needs attention. Add your thought to help officials understand public impact.", supports: "supports", thoughts: "thoughts", noThoughts: "No citizen thoughts yet. Add a short thought to increase awareness.", thoughtLabel: "Your thought / awareness note", thoughtPlaceholder: "Example: This road is used by school students every morning.", supportIssueBtn: "👍 Support Issue", aiVerificationBtn: "🧠 AI Verification Summary", aiAwarenessBtn: "📣 AI Awareness Message",
    statusTracking: "Status tracking", verifyBtn: "Community Verify", feedbackTitle: "Citizen feedback after resolution", ratingLabel: "Rating", feedbackLabel: "Your feedback", feedbackPlaceholder: "Explain whether the issue was properly resolved.", enhanceFeedbackBtn: "✨ Enhance Feedback with AI", submitFeedbackBtn: "Submit Feedback", feedbackOnlyResolved: "Feedback opens when status is marked Resolved.", noFeedbackYet: "No feedback submitted yet.",
    officialNote: "Official note", createdBy: "Created by", smartRank: "AI smart rank", mapLink: "Open map", generatingInsights: "Gemini is generating community insights...", groupingIssues: "Gemini is grouping similar reports...", aiAwarenessTitle: "AI awareness message"
  },
  ta: {
    brand: "🛡️ கம்யூனிட்டி ஹீரோ",
    navReport: "புகார்", navDashboard: "டாஷ்போர்டு", navLiveIssues: "நேரடி பிரச்சினைகள்", languageMini: "மொழி",
    guestMode: "விருந்தினர் நிலை", signInBtn: "உள்நுழை", logoutBtn: "வெளியேறு", cancelBtn: "ரத்து செய்",
    citizenAccess: "குடிமக்கள் அணுகல்", signInTitle: "புகார், சரிபார்ப்பு, கருத்துக்கு உள்நுழையவும்",
    signInCopy: "இது browser storage பயன்படுத்தும் hackathon demo sign-in. பின்னர் Firebase Authentication ஆக மாற்றலாம்.",
    nameLabel: "பெயர்", emailLabel: "மின்னஞ்சல்", preferredLanguageLabel: "விருப்ப மொழி",
    namePlaceholder: "உதாரணம்: Priya", emailPlaceholder: "உதாரணம்: priya@example.com",
    languageNote: "உங்கள் மொழித் தேர்வு app UI-ஐ மொழிபெயர்க்கும்; Gemini குடிமக்கள் பார்க்கும் AI உள்ளடக்கத்தை அந்த மொழியில் தரும்.",
    heroEyebrow: "AI ஆதரித்த hyperlocal பிரச்சினை தீர்வு", heroTitle: "சமூக பிரச்சினைகளை வேகமாக புகாரளித்து, சரிபார்த்து, கண்காணித்து, தீர்க்கவும்.",
    heroCopy: "குடிமக்கள் புகைப்படம், வீடியோ, இருப்பிடம், விளக்கம் சமர்ப்பிக்கலாம். Gemini AI வகை, முன்னுரிமை, duplicate, verification summary, ஆதரவு பெற்ற பிரச்சினைகள், தீர்வுக்குப் பின் feedback ஆகியவற்றை கையாளும்.",
    submitIssueAction: "பிரச்சினை சமர்ப்பி", viewImpactAction: "தாக்கம் பார்க்க", todayIntel: "இன்றைய குடிமை அறிவு",
    totalReportsStat: "மொத்த புகார்கள்", resolvedIssuesStat: "தீர்க்கப்பட்டவை", citizenFeedbackStat: "குடிமக்கள் கருத்து", citizenSupportsStat: "குடிமக்கள் ஆதரவு", communityPointsStat: "சமூக புள்ளிகள்",
    citizenReportEyebrow: "குடிமக்கள் புகார்", submitLocalIssueTitle: "உள்ளூர் பிரச்சினை சமர்ப்பிக்கவும்",
    submitLocalIssueCopy: "புகைப்படம்/வீடியோ, விளக்கம், இருப்பிடம் சேர்க்கவும். AI விவரங்களை நிரப்பும்; ஆனால் இருப்பிடம் GPS அல்லது கையால் கட்டாயம் சேர்க்க வேண்டும். சமர்ப்பிக்க sign in தேவை.",
    issueTitleLabel: "பிரச்சினை தலைப்பு", locationNameLabel: "இருப்பிட பெயர்", descriptionLabel: "விளக்கம்", uploadLabel: "படம்/வீடியோ பதிவேற்று",
    issueTitlePlaceholder: "உதாரணம்: பேருந்து நிறுத்தம் அருகே பெரிய pothole", locationPlaceholder: "உதாரணம்: CIT hostel road, Chennai", descriptionPlaceholder: "என்ன நடந்தது, தீவிரம், அருகிலுள்ள landmark ஆகியவற்றை எழுதவும்.",
    useLocationBtn: "📍 என் இருப்பிடத்தை பயன்படுத்து", locationNotAdded: "இருப்பிடம் சேர்க்கப்படவில்லை", autofillBtn: "🤖 AI மூலம் நிரப்பு", analyzeBtn: "✨ AI ஆய்வு", submitReportBtn: "புகார் சமர்ப்பி",
    impactDashboardEyebrow: "தாக்க டாஷ்போர்டு", overviewTitle: "சமூக பிரச்சினை கண்ணோட்டம்", totalStat: "மொத்தம்", verifiedStat: "சரிபார்ப்பு", inProgressStat: "செயலில்", resolvedStat: "தீர்வு", feedbackStat: "கருத்து", supportsStat: "ஆதரவு", thoughtsStat: "கருத்துகள்",
    categoryInsightsTitle: "வகை பகுப்பாய்வு", predictivePriorityTitle: "முன்னுரிமை கணிப்பு", priorityInsightEmpty: "AI முன்னுரிமை பார்க்க புகார் சமர்ப்பிக்கவும்.", communitySpotlightTitle: "சமூக கவனம்", communitySpotlightEmpty: "ஆதரவு மற்றும் கருத்துகள் மூலம் community spotlight உருவாகும்.",
    geminiCommunityTitle: "Gemini சமூக அறிவு", geminiCommunityCopy: "புகார்கள், likes, thoughts, verifications, status, feedback ஆகியவற்றிலிருந்து AI insight உருவாக்கவும்.", generateInsightsBtn: "🧠 AI Insights உருவாக்கு", aiGroupingTitle: "AI ஒரே மாதிரி பிரச்சினை grouping", aiGroupingCopy: "100+ reports வந்தால், Gemini repeated cards-க்கு பதில் clusters ஆக group செய்கிறது.", generateGroupsBtn: "🧩 Similar Issues Group செய்",
    trackingEyebrow: "நேரடி கண்காணிப்பு", liveIssuesTitle: "நேரடி சமூக பிரச்சினைகள்", liveIssuesCopy: "குடிமக்கள் reports-ஐ verify, support, thoughts சேர்க்கலாம். Gemini verification summary மற்றும் awarenessக்கு முக்கிய issue-களை highlight செய்கிறது.",
    searchIssuesLabel: "பிரச்சினை தேடு", searchPlaceholder: "இருப்பிடம், வகை, நிலை, துறை, தலைப்பு மூலம் தேடு...", filterLabel: "வடிகட்டி", sortLabel: "வரிசைப்படுத்து",
    filterAll: "அனைத்து பிரச்சினைகள்", filterHighPriority: "உயர் முன்னுரிமை", filterMostSupported: "அதிக ஆதரவு", filterMostCommented: "அதிக கருத்துகள்", filterPending: "நிலுவை", filterVerified: "சரிபார்ப்பு", filterInProgress: "செயலில்", filterResolved: "தீர்க்கப்பட்டது", filterNeedsFeedback: "தீர்வு, feedback தேவை",
    sortSmart: "AI smart rank", sortPriority: "முன்னுரிமை மதிப்பு", sortSupported: "அதிக ஆதரவு", sortCommented: "அதிக கருத்துகள்", sortNewest: "புதியது முதலில்", showingTopIssues: "முக்கிய பிரச்சினைகள் முதலில் காட்டப்படும்.", loadMoreBtn: "மேலும் காண்", footerText: "Vibe2Ship Hackathon · Google Gemini API · Google Cloud Run · Community participation க்காக உருவாக்கப்பட்டது",
    aiCategory: "AI வகை", severity: "தீவிரம்", priority: "முன்னுரிமை", department: "துறை", summary: "சுருக்கம்", suggestedAction: "பரிந்துரைக்கப்பட்ட நடவடிக்கை",
    signedIn: "வெற்றிகரமாக உள்நுழைந்தீர்கள்.", fillNameEmail: "பெயர் மற்றும் மின்னஞ்சலை உள்ளிடவும்.", logoutSuccess: "வெற்றிகரமாக வெளியேறினீர்கள்.", pleaseSignIn: "{action} செய்ய முன் தயவு செய்து உள்நுழையவும்.", continueAction: "தொடர",
    locationGetting: "இருப்பிடம் பெறப்படுகிறது...", locationUnsupported: "இந்த browser geolocation-ஐ support செய்யவில்லை.", locationDenied: "Location permission மறுக்கப்பட்டது. சமர்ப்பிப்பதற்கு முன் இருப்பிடத்தை கையால் type செய்யவும்.", gpsAdded: "GPS இருப்பிடம் சேர்க்கப்பட்டது", imageReady: "படம் Gemini vision analysis-க்கு தயார்.", videoAttached: "ஆதாரமாக வீடியோ இணைக்கப்பட்டது. இந்த MVP-ல் video-க்கு title/description மூலம் AI analysis நடக்கும்.",
    autofillNeedInput: "ஒரு படம் upload செய்யவும் அல்லது சிறிய விவரம் type செய்யவும். பிறகு AI form நிரப்பும்.", autofilling: "AI நிரப்புகிறது...", autofillNote: "AI title மற்றும் description நிரப்பியது. இருப்பிடம் GPS அல்லது manual typing மூலம் சேர்க்க வேண்டும்.", autofillFailed: "AI auto-fill தோல்வி: ",
    analysisNeedInput: "முதலில் title, description அல்லது image சேர்க்கவும்.", analyzing: "AI ஆய்வு செய்கிறது...", analysisFailed: "AI analysis தோல்வி: ",
    titleDescriptionRequired: "Title மற்றும் description நிரப்பவும்.", locationRequired: "இருப்பிடம் கட்டாயம். 'என் இருப்பிடத்தை பயன்படுத்து' அழுத்தவும் அல்லது location name type செய்யவும்.", reportSubmitted: "Report வெற்றிகரமாக சமர்ப்பிக்கப்பட்டது! Community +10 points.",
    checkingDuplicates: "AI மூலம் duplicate reports சரிபார்க்கப்படுகிறது...", duplicateCheck: "AI duplicate check", possibleDuplicate: "Duplicate இருக்கலாம்", noDuplicate: "வலுவான duplicate இல்லை", similarity: "ஒற்றுமை", possibleMatch: "சாத்தியமான match", duplicateFailed: "Duplicate check தோல்வி; report சரியானது என்றால் submit செய்யலாம்.", duplicateConfirmFail: "AI duplicate check தோல்வி. இருந்தாலும் submit செய்யவா?",
    noReports: "இந்த search/filter-க்கு reports இல்லை.", showingIssues: "{total} பொருந்தும் பிரச்சினைகளில் {visible} காட்டப்படுகிறது. பெரிய பட்டியலுக்கு search, filters, Load More பயன்படுத்தவும்.",
    communitySupport: "சமூக ஆதரவு", supportCopy: "Support என்பது இந்த issueக்கு கவனம் தேவை என்பதைக் குறிக்கும். Public impact புரிய உங்கள் thought சேர்க்கவும்.", supports: "ஆதரவு", thoughts: "கருத்துகள்", noThoughts: "இன்னும் citizen thoughts இல்லை. Awareness அதிகரிக்க short thought சேர்க்கவும்.", thoughtLabel: "உங்கள் thought / awareness note", thoughtPlaceholder: "உதாரணம்: இந்த சாலை காலை பள்ளி மாணவர்கள் பயன்படுத்துகிறார்கள்.", supportIssueBtn: "👍 Issueக்கு ஆதரவு", aiVerificationBtn: "🧠 AI Verification Summary", aiAwarenessBtn: "📣 AI Awareness Message",
    statusTracking: "நிலை கண்காணிப்பு", verifyBtn: "Community Verify", feedbackTitle: "தீர்வுக்குப் பின் குடிமக்கள் feedback", ratingLabel: "மதிப்பீடு", feedbackLabel: "உங்கள் feedback", feedbackPlaceholder: "Issue சரியாக தீர்க்கப்பட்டதா என்பதைக் கூறவும்.", enhanceFeedbackBtn: "✨ AI மூலம் feedback மேம்படுத்து", submitFeedbackBtn: "Feedback சமர்ப்பி", feedbackOnlyResolved: "Status Resolved ஆன பிறகு feedback திறக்கும்.", noFeedbackYet: "இன்னும் feedback இல்லை.",
    officialNote: "அதிகாரி குறிப்பு", createdBy: "உருவாக்கியவர்", smartRank: "AI smart rank", mapLink: "Map திற", generatingInsights: "Gemini community insights உருவாக்குகிறது...", groupingIssues: "Gemini similar reports group செய்கிறது...", aiAwarenessTitle: "AI awareness message"
  },
  hi: {
    brand: "🛡️ कम्युनिटी हीरो",
    navReport: "रिपोर्ट", navDashboard: "डैशबोर्ड", navLiveIssues: "लाइव समस्याएँ", languageMini: "भाषा",
    guestMode: "गेस्ट मोड", signInBtn: "साइन इन", logoutBtn: "लॉग आउट", cancelBtn: "रद्द करें",
    citizenAccess: "नागरिक प्रवेश", signInTitle: "रिपोर्ट, सत्यापन और फीडबैक के लिए साइन इन करें",
    signInCopy: "यह browser storage वाला hackathon demo sign-in है। बाद में इसे Firebase Authentication से बदल सकते हैं।",
    nameLabel: "नाम", emailLabel: "ईमेल", preferredLanguageLabel: "पसंदीदा भाषा",
    namePlaceholder: "उदाहरण: Priya", emailPlaceholder: "उदाहरण: priya@example.com",
    languageNote: "आपकी भाषा पसंद app UI को बदलती है और Gemini से नागरिकों के लिए AI सामग्री उसी भाषा में मांगती है।",
    heroEyebrow: "AI-powered hyperlocal problem solver", heroTitle: "समुदाय की समस्याएँ जल्दी रिपोर्ट, सत्यापित, ट्रैक और हल करें।",
    heroCopy: "नागरिक फोटो, वीडियो, लोकेशन और विवरण जमा कर सकते हैं। Gemini AI category, priority, duplicate, verification summary, supported issues और resolution feedback को संभालता है।",
    submitIssueAction: "समस्या जमा करें", viewImpactAction: "Impact देखें", todayIntel: "आज की civic intelligence",
    totalReportsStat: "कुल रिपोर्ट", resolvedIssuesStat: "हल समस्याएँ", citizenFeedbackStat: "नागरिक feedback", citizenSupportsStat: "नागरिक support", communityPointsStat: "Community points",
    citizenReportEyebrow: "नागरिक रिपोर्ट", submitLocalIssueTitle: "स्थानीय समस्या जमा करें",
    submitLocalIssueCopy: "Photo/video, description और location जोड़ें। AI details भरता है, लेकिन location GPS या manually जरूरी है। Submit से पहले sign in जरूरी है।",
    issueTitleLabel: "समस्या शीर्षक", locationNameLabel: "स्थान नाम", descriptionLabel: "विवरण", uploadLabel: "Image/video upload करें",
    issueTitlePlaceholder: "उदाहरण: bus stop के पास बड़ा pothole", locationPlaceholder: "उदाहरण: CIT hostel road, Chennai", descriptionPlaceholder: "क्या हुआ, गंभीरता और nearby landmarks बताएं।",
    useLocationBtn: "📍 मेरी location उपयोग करें", locationNotAdded: "Location नहीं जोड़ी गई", autofillBtn: "🤖 AI से auto-fill", analyzeBtn: "✨ AI से analyze", submitReportBtn: "Report जमा करें",
    impactDashboardEyebrow: "Impact dashboard", overviewTitle: "Community issue overview", totalStat: "कुल", verifiedStat: "Verified", inProgressStat: "In progress", resolvedStat: "Resolved", feedbackStat: "Feedback", supportsStat: "Supports", thoughtsStat: "Thoughts",
    categoryInsightsTitle: "Category insights", predictivePriorityTitle: "Predictive priority", priorityInsightEmpty: "AI priority देखने के लिए reports submit करें।", communitySpotlightTitle: "Community spotlight", communitySpotlightEmpty: "Issues support/comment करके community spotlight बनाएं।",
    geminiCommunityTitle: "Gemini community intelligence", geminiCommunityCopy: "Reports, likes, thoughts, verification, status और feedback से AI insights बनाएं।", generateInsightsBtn: "🧠 AI Insights बनाएं", aiGroupingTitle: "AI similar issue grouping", aiGroupingCopy: "100+ reports आने पर Gemini repeated cards की जगह clusters बनाता है।", generateGroupsBtn: "🧩 Similar Issues Group करें",
    trackingEyebrow: "Real-time tracking", liveIssuesTitle: "Live community issues", liveIssuesCopy: "Citizens reports verify, support और thoughts add कर सकते हैं। Gemini verification summary और awareness के लिए important issues highlight करता है।",
    searchIssuesLabel: "Issues search करें", searchPlaceholder: "location, category, status, department, title से search...", filterLabel: "Filter", sortLabel: "Sort",
    filterAll: "All issues", filterHighPriority: "High priority", filterMostSupported: "Most supported", filterMostCommented: "Most commented", filterPending: "Pending action", filterVerified: "Verified", filterInProgress: "In progress", filterResolved: "Resolved", filterNeedsFeedback: "Resolved, needs feedback",
    sortSmart: "AI smart rank", sortPriority: "Priority score", sortSupported: "Most supported", sortCommented: "Most commented", sortNewest: "Newest first", showingTopIssues: "Top issues पहले दिखेंगे।", loadMoreBtn: "और issues दिखाएँ", footerText: "Vibe2Ship Hackathon · Google Gemini API · Google Cloud Run · Community participation के लिए बनाया गया",
    aiCategory: "AI Category", severity: "Severity", priority: "Priority", department: "Department", summary: "Summary", suggestedAction: "Suggested Action",
    signedIn: "Successfully signed in.", fillNameEmail: "Name और email दर्ज करें।", logoutSuccess: "Successfully logged out.", pleaseSignIn: "{action} से पहले sign in करें।", continueAction: "continue",
    locationGetting: "Location प्राप्त हो रही है...", locationUnsupported: "इस browser में geolocation support नहीं है।", locationDenied: "Location permission denied. Submit से पहले location manually type करें।", gpsAdded: "GPS location added", imageReady: "Image Gemini vision analysis के लिए ready है।", videoAttached: "Video evidence attach हुआ। इस MVP में video के लिए title/description से AI analysis होगा।",
    autofillNeedInput: "Image upload करें या एक छोटा detail type करें। फिर AI form auto-fill करेगा।", autofilling: "Auto-filling...", autofillNote: "AI ने title और description भरा। Location GPS या manual typing से जोड़ना जरूरी है।", autofillFailed: "AI auto-fill failed: ",
    analysisNeedInput: "पहले title, description या image जोड़ें।", analyzing: "Analyzing...", analysisFailed: "AI analysis failed: ",
    titleDescriptionRequired: "Title और description भरें।", locationRequired: "Location required है। 'Use my location' क्लिक करें या location name manually type करें।", reportSubmitted: "Report successfully submitted! Community +10 points.",
    checkingDuplicates: "AI से duplicate reports check हो रहे हैं...", duplicateCheck: "AI duplicate check", possibleDuplicate: "Possible duplicate found", noDuplicate: "No strong duplicate found", similarity: "Similarity", possibleMatch: "Possible match", duplicateFailed: "Duplicate check failed, लेकिन report सही है तो submit कर सकते हैं।", duplicateConfirmFail: "AI duplicate check failed. फिर भी submit करें?",
    noReports: "इस search/filter के लिए reports नहीं हैं।", showingIssues: "{total} matching issues में से {visible} दिख रहे हैं। Large lists के लिए search, filters और Load More इस्तेमाल करें।",
    communitySupport: "Community support", supportCopy: "Support का मतलब है कि इस issue को attention चाहिए। Public impact समझाने के लिए thought add करें।", supports: "supports", thoughts: "thoughts", noThoughts: "अभी citizen thoughts नहीं हैं। Awareness बढ़ाने के लिए short thought add करें।", thoughtLabel: "आपका thought / awareness note", thoughtPlaceholder: "उदाहरण: इस road से students हर सुबह जाते हैं।", supportIssueBtn: "👍 Support Issue", aiVerificationBtn: "🧠 AI Verification Summary", aiAwarenessBtn: "📣 AI Awareness Message",
    statusTracking: "Status tracking", verifyBtn: "Community Verify", feedbackTitle: "Resolution के बाद citizen feedback", ratingLabel: "Rating", feedbackLabel: "आपका feedback", feedbackPlaceholder: "बताएं कि issue ठीक से resolve हुआ या नहीं।", enhanceFeedbackBtn: "✨ AI से feedback improve करें", submitFeedbackBtn: "Submit Feedback", feedbackOnlyResolved: "Status Resolved होने पर feedback खुलेगा।", noFeedbackYet: "अभी feedback submit नहीं हुआ।",
    officialNote: "Official note", createdBy: "Created by", smartRank: "AI smart rank", mapLink: "Open map", generatingInsights: "Gemini community insights generate कर रहा है...", groupingIssues: "Gemini similar reports group कर रहा है...", aiAwarenessTitle: "AI awareness message"
  }
};

function currentLanguageCode() {
  return state.user?.language || state.language || "en";
}

function currentLanguageName() {
  if (state.user?.languageName) return state.user.languageName;
  const code = currentLanguageCode();
  if (code === "custom") return state.uiLanguageName || "English";
  return LANGUAGE_OPTIONS[code]?.aiName || state.uiLanguageName || "English";
}

function currentLanguageLabel() {
  const code = currentLanguageCode();
  if (code === "custom") return state.uiLanguageName || "Custom";
  return LANGUAGE_OPTIONS[code]?.label || currentLanguageName();
}

function uiCacheKey(code = currentLanguageCode(), name = currentLanguageName()) {
  return `communityHeroI18N:${code}:${name}`;
}

function loadCachedUiDictionary(code = currentLanguageCode(), name = currentLanguageName()) {
  try {
    const cached = localStorage.getItem(uiCacheKey(code, name));
    return cached ? JSON.parse(cached) : null;
  } catch {
    return null;
  }
}

function getCurrentDictionary() {
  const code = currentLanguageCode();
  return I18N[code] || state.dynamicI18n || loadCachedUiDictionary(code, currentLanguageName()) || I18N.en;
}

function t(key, replacements = {}) {
  const base = getCurrentDictionary();
  let value = base[key] || I18N.en[key] || key;
  Object.entries(replacements).forEach(([name, replacement]) => {
    value = value.replaceAll(`{${name}}`, replacement);
  });
  return value;
}

function needsGeminiUiTranslation() {
  const code = currentLanguageCode();
  const name = currentLanguageName();
  return !I18N[code] && name && name !== "English";
}

async function ensureGeminiUiTranslation() {
  if (!needsGeminiUiTranslation()) return;
  const code = currentLanguageCode();
  const name = currentLanguageName();
  const cached = loadCachedUiDictionary(code, name);
  if (cached) {
    state.dynamicI18n = cached;
    applyLanguage(false);
    return;
  }

  const status = $("translationStatus");
  if (status) status.textContent = `Translating UI with Gemini into ${name}...`;

  try {
    const result = await api("/api/translate-ui", {
      method: "POST",
      body: JSON.stringify({ language: name, labels: I18N.en })
    });
    const translated = result?.labels || result;
    if (translated && typeof translated === "object") {
      state.dynamicI18n = { ...I18N.en, ...translated };
      localStorage.setItem(uiCacheKey(code, name), JSON.stringify(state.dynamicI18n));
      applyLanguage(false);
      if (status) status.textContent = `UI translated into ${name} using Gemini.`;
    }
  } catch (error) {
    console.warn("UI translation failed:", error.message);
    if (status) status.textContent = "UI translation failed. English labels are shown, but AI outputs still use your selected language.";
  }
}

function populateLanguageSelects() {
  const selects = [$('languageSelect'), $('signInLanguage')].filter(Boolean);
  selects.forEach((select) => {
    const current = select.value || currentLanguageCode();
    select.innerHTML = Object.entries(LANGUAGE_OPTIONS)
      .map(([code, item]) => `<option value="${code}">${escapeHtml(item.label)}</option>`)
      .join("");
    select.value = LANGUAGE_OPTIONS[current] ? current : "en";
  });
}

function toggleCustomLanguageInput() {
  const wrap = $("customLanguageWrap");
  const input = $("customLanguageInput");
  const signInSelect = $("signInLanguage");
  if (!wrap || !input || !signInSelect) return;
  const isCustom = signInSelect.value === "custom";
  wrap.classList.toggle("hidden", !isCustom);
  input.required = isCustom;
  if (isCustom && !input.value && state.uiLanguageName && state.uiLanguageName !== "English") {
    input.value = state.uiLanguageName;
  }
}

function setLanguage(languageCode, persistUser = false, languageName = null) {
  const valid = LANGUAGE_OPTIONS[languageCode] ? languageCode : "en";
  state.language = valid;
  state.dynamicI18n = null;

  if (languageName) {
    state.uiLanguageName = languageName.trim();
  } else if (valid !== "custom") {
    state.uiLanguageName = LANGUAGE_OPTIONS[valid]?.aiName || "English";
  }

  localStorage.setItem("communityHeroLanguage", valid);
  localStorage.setItem("communityHeroLanguageName", state.uiLanguageName || currentLanguageName());

  if (persistUser && state.user) {
    state.user.language = valid;
    state.user.languageName = state.uiLanguageName || currentLanguageName();
    localStorage.setItem("communityHeroUser", JSON.stringify(state.user));
  }

  applyLanguage();
  renderAuth();
  renderReports();
  renderDashboard();
}

function applyLanguage(runTranslation = true) {
  const code = currentLanguageCode();
  state.language = code;
  document.documentElement.lang = code === "custom" ? "en" : code;
  document.querySelectorAll("[data-i18n]").forEach((node) => {
    node.textContent = t(node.dataset.i18n);
  });
  document.querySelectorAll("[data-i18n-placeholder]").forEach((node) => {
    node.setAttribute("placeholder", t(node.dataset.i18nPlaceholder));
  });
  const navSelect = $("languageSelect");
  const signInSelect = $("signInLanguage");
  if (navSelect) navSelect.value = LANGUAGE_OPTIONS[code] ? code : "en";
  if (signInSelect) signInSelect.value = LANGUAGE_OPTIONS[code] ? code : "en";
  toggleCustomLanguageInput();
  if (runTranslation) ensureGeminiUiTranslation();
}

const sampleReports = [
  {
    title: "Overflowing garbage near market",
    description: "Waste has not been cleared for three days and bad smell is spreading.",
    locationName: "Main Market Road",
    lat: 13.0827,
    lng: 80.2707,
    category: "Waste Management",
    severity: "Medium",
    priorityScore: 66,
    department: "Sanitation Department",
    summary: "Uncollected garbage is affecting public hygiene near the market.",
    suggestedAction: "Assign sanitation team for cleanup and daily monitoring.",
    citizenMessage: "Thank you for helping keep the community clean.",
    status: "Assigned",
    verifiedCount: 4,
    supportCount: 8,
    thoughts: [
      { id: "TH-DEMO-1", userName: "Market Vendor", thought: "The smell is strong during afternoon and customers are avoiding this area.", createdAt: new Date().toISOString() },
      { id: "TH-DEMO-2", userName: "Nearby Resident", thought: "Please clear it before rain because waste may enter the drain.", createdAt: new Date().toISOString() }
    ],
    mediaType: "none",
    reporterName: "Demo Citizen",
    reporterEmail: "demo@example.com",
    demoSeed: true
  },
  {
    title: "Streetlight repaired near hostel corner",
    description: "The streetlight was not working near the hostel corner, making the road unsafe at night.",
    locationName: "College Hostel Corner",
    lat: 12.8406,
    lng: 80.1534,
    category: "Streetlight Issue",
    severity: "High",
    priorityScore: 78,
    department: "Electricity / Streetlight Team",
    summary: "A failed streetlight created a night-time safety risk and has now been resolved.",
    suggestedAction: "Monitor the repaired streetlight for 48 hours and record citizen satisfaction.",
    citizenMessage: "Your safety concern has been resolved.",
    status: "Resolved",
    verifiedCount: 6,
    supportCount: 11,
    thoughts: [
      { id: "TH-DEMO-3", userName: "Hostel Student", thought: "Many students use this road at night, so this repair was important.", createdAt: new Date().toISOString() }
    ],
    mediaType: "none",
    reporterName: "Student Reporter",
    reporterEmail: "student@example.com",
    feedback: [
      {
        id: "FB-DEMO-1",
        userName: "Student Reporter",
        rating: 5,
        originalText: "Light is working now. Area feels safer.",
        enhancedText: "The streetlight is working now, and the area feels safer for students walking near the hostel at night.",
        sentiment: "Positive",
        followUpNeeded: false,
        officialNote: "Resolution appears successful.",
        createdAt: new Date().toISOString()
      }
    ],
    demoSeed: true
  }
];

function escapeHtml(text = "") {
  return String(text).replace(/[&<>'"]/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    "'": "&#039;",
    '"': "&quot;"
  }[char]));
}

const CLIENT_REPORTS_KEY = "communityHeroHostingReports";

function clientGeminiKey() {
  return window.CH_CONFIG?.GEMINI_API_KEY || localStorage.getItem("communityHeroGeminiKey") || "";
}

function parseJsonSafe(text, fallback = {}) {
  try {
    const cleaned = String(text || "")
      .replace(/```json/gi, "")
      .replace(/```/g, "")
      .trim();
    const start = cleaned.indexOf("{");
    const end = cleaned.lastIndexOf("}");
    if (start >= 0 && end > start) return JSON.parse(cleaned.slice(start, end + 1));
    return JSON.parse(cleaned);
  } catch {
    return fallback;
  }
}

function mediaPartFromDataUrl(dataUrl = "") {
  const match = String(dataUrl).match(/^data:(.*?);base64,(.*)$/);
  if (!match) return null;
  return { inline_data: { mime_type: match[1], data: match[2] } };
}

async function geminiJson(prompt, { imageData = "", fallback = {} } = {}) {
  const key = clientGeminiKey();
  if (!key) return fallback;

  const parts = [{ text: prompt }];
  const mediaPart = mediaPartFromDataUrl(imageData);
  if (mediaPart) parts.push(mediaPart);

  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${encodeURIComponent(key)}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ role: "user", parts }],
      generationConfig: { temperature: 0.25, responseMimeType: "application/json" }
    })
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || "Gemini request failed");
  }
  const data = await response.json();
  const text = data?.candidates?.[0]?.content?.parts?.map((part) => part.text || "").join("\n") || "";
  return parseJsonSafe(text, fallback);
}

function getBody(options = {}) {
  try { return options.body ? JSON.parse(options.body) : {}; } catch { return {}; }
}

function readClientReports() {
  try {
    const raw = localStorage.getItem(CLIENT_REPORTS_KEY);
    const parsed = raw ? JSON.parse(raw) : null;
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeClientReports(reports) {
  localStorage.setItem(CLIENT_REPORTS_KEY, JSON.stringify(reports));
}

function normalizeReport(report = {}) {
  return {
    id: report.id || `CH-${Date.now()}-${Math.random().toString(16).slice(2, 6)}`,
    createdAt: report.createdAt || new Date().toISOString(),
    status: report.status || "Reported",
    verifiedCount: Number(report.verifiedCount || 0),
    supportCount: Number(report.supportCount || 0),
    thoughts: Array.isArray(report.thoughts) ? report.thoughts : [],
    feedback: Array.isArray(report.feedback) ? report.feedback : [],
    category: report.category || "Public Infrastructure",
    severity: report.severity || "Medium",
    priorityScore: Number(report.priorityScore || 60),
    department: report.department || "Public Works Department",
    summary: report.summary || report.description || "Community issue submitted by a citizen.",
    suggestedAction: report.suggestedAction || "Inspect the issue location and assign the correct local authority team.",
    ...report
  };
}

function simpleCategory(text = "") {
  const value = text.toLowerCase();
  if (/(garbage|waste|trash|dump)/.test(value)) return ["Waste Management", "Sanitation Department"];
  if (/(water|leak|drain|flood|sewage|overflow)/.test(value)) return ["Water / Drainage Issue", "Water Supply / Public Works Department"];
  if (/(light|streetlight|electric|power)/.test(value)) return ["Streetlight Issue", "Electricity / Streetlight Team"];
  if (/(pothole|road|traffic|footpath|bridge)/.test(value)) return ["Road / Public Infrastructure", "Public Works Department"];
  return ["Public Infrastructure", "Public Works Department"];
}

function fallbackAnalysis(payload = {}) {
  const joined = `${payload.title || ""} ${payload.description || ""}`.trim();
  const [category, department] = simpleCategory(joined);
  const severity = /(danger|accident|injury|school|hospital|flood|open|broken|night)/i.test(joined) ? "High" : "Medium";
  const priorityScore = severity === "High" ? 78 : 62;
  return {
    title: payload.title || "Local civic issue reported by citizen",
    description: payload.description || "The uploaded evidence indicates a local community infrastructure issue that needs inspection.",
    category,
    severity,
    priorityScore,
    department,
    summary: payload.description || "A citizen-reported issue requires verification and department action.",
    suggestedAction: "Verify the location, inspect the issue, and assign the responsible local department for resolution.",
    citizenMessage: "Thank you for reporting this community issue."
  };
}

async function aiAnalyze(payload = {}, autofill = false) {
  const fallback = fallbackAnalysis(payload);
  const prompt = `You are Gemini powering Community Hero, a hyperlocal civic issue platform.
Analyze the citizen issue using the text and uploaded image if available.
Do NOT guess or generate the location.
Return only JSON with: title, description, category, severity, priorityScore, department, summary, suggestedAction, citizenMessage.
Use language: ${payload.language || "English"} for citizen-facing text.
Citizen title: ${payload.title || ""}
Citizen description: ${payload.description || ""}
Location provided by user, do not modify: ${payload.locationName || ""}
${autofill ? "If title/description are missing, generate a short clear title and description from the image/evidence." : ""}`;
  const result = await geminiJson(prompt, { imageData: payload.imageData, fallback });
  return { ...fallback, ...result, locationName: undefined };
}

function textSimilarity(a = "", b = "") {
  const wa = new Set(String(a).toLowerCase().split(/\W+/).filter((w) => w.length > 2));
  const wb = new Set(String(b).toLowerCase().split(/\W+/).filter((w) => w.length > 2));
  if (!wa.size || !wb.size) return 0;
  const intersection = [...wa].filter((w) => wb.has(w)).length;
  return Math.round((intersection / Math.max(wa.size, wb.size)) * 100);
}

async function api(path, options = {}) {
  const method = String(options.method || "GET").toUpperCase();
  const body = getBody(options);

  if (path === "/api/translate-ui" && method === "POST") {
    const fallback = { labels: body.labels || {} };
    const prompt = `Translate this JSON object of app UI labels into ${body.language}. Keep the same keys. Return only JSON as {"labels": {...}}. Labels: ${JSON.stringify(body.labels || {}).slice(0, 18000)}`;
    return geminiJson(prompt, { fallback });
  }

  if (path === "/api/analyze" && method === "POST") return aiAnalyze(body, false);
  if (path === "/api/autofill" && method === "POST") return aiAnalyze(body, true);

  if (path === "/api/reports" && method === "GET") return readClientReports();
  if (path === "/api/reports" && method === "POST") {
    const reports = readClientReports();
    const report = normalizeReport(body);
    reports.unshift(report);
    writeClientReports(reports);
    return report;
  }

  if (path === "/api/duplicates/check" && method === "POST") {
    const reports = readClientReports();
    const text = `${body.title || ""} ${body.description || ""} ${body.locationName || ""}`;
    let best = null;
    let score = 0;
    for (const report of reports) {
      const s = textSimilarity(text, `${report.title} ${report.description} ${report.locationName}`);
      if (s > score) { score = s; best = report; }
    }
    const fallback = {
      likelyDuplicate: score >= 45,
      similarity: score,
      matchedTitle: best?.title || "",
      reason: best ? "A similar report already exists in this browser demo data." : "No existing reports found.",
      recommendation: score >= 45 ? "Consider supporting the existing issue instead of creating a duplicate." : "Submit as a new report."
    };
    if (!reports.length) return fallback;
    const prompt = `Check whether the new civic report is a duplicate of any existing report. Return JSON with likelyDuplicate(boolean), similarity(0-100), matchedTitle, reason, recommendation. New report: ${JSON.stringify(body)} Existing reports: ${JSON.stringify(reports.slice(0, 20).map(r => ({title:r.title, locationName:r.locationName, category:r.category, description:r.description})))}. Use language ${body.language || currentLanguageName()}.`;
    return geminiJson(prompt, { fallback });
  }

  if (path === "/api/insights/dashboard" && method === "POST") {
    const reports = readClientReports();
    const top = [...reports].sort((a, b) => issueImportanceScore(b) - issueImportanceScore(a))[0];
    const fallback = {
      headline: "AI Community Insight",
      mostDiscussedIssue: top?.title || "No active issue yet",
      highRiskArea: top?.locationName || "Not enough data",
      trendSummary: reports.length ? `${reports.length} issue reports are currently available for community review.` : "No issue reports yet.",
      recommendedAction: top ? top.suggestedAction : "Encourage citizens to report verified local issues.",
      awarenessMessage: top ? `Citizens can support and verify “${top.title}” if they are affected.` : "Start by submitting a clear report with evidence and location."
    };
    const prompt = `Generate civic dashboard insights from these reports. Return JSON with headline, mostDiscussedIssue, highRiskArea, trendSummary, recommendedAction, awarenessMessage. Use language ${body.language || currentLanguageName()}. Reports: ${JSON.stringify(reports.slice(0, 30))}`;
    return geminiJson(prompt, { fallback });
  }

  if (path === "/api/insights/groups" && method === "POST") {
    const reports = readClientReports();
    const byCategory = {};
    reports.forEach((r) => { (byCategory[r.category] ||= []).push(r); });
    const groups = Object.entries(byCategory).map(([category, items]) => ({
      groupName: category,
      commonProblem: items[0]?.summary || "Similar community reports grouped by category.",
      reportCount: items.length,
      priorityScore: Math.max(...items.map((i) => Number(i.priorityScore || 0))),
      recommendedAction: items[0]?.suggestedAction || "Review and assign the relevant department."
    }));
    const fallback = { headline: "AI Similar Issue Groups", groups };
    const prompt = `Group similar civic reports into clusters. Return JSON with headline and groups array. Each group needs groupName, commonProblem, reportCount, priorityScore, recommendedAction. Use language ${body.language || currentLanguageName()}. Reports: ${JSON.stringify(reports.slice(0, 40))}`;
    return geminiJson(prompt, { fallback });
  }

  const awarenessMatch = path.match(/^\/api\/reports\/([^/]+)\/awareness$/);
  if (awarenessMatch && method === "POST") {
    const reports = readClientReports();
    const report = reports.find((r) => r.id === awarenessMatch[1]);
    const fallback = {
      awarenessMessage: report ? `Please be careful near ${report.locationName}. This issue has community attention and needs responsible action.` : "Support verified issues to improve community awareness.",
      callToAction: "Support, verify, or add a helpful thought if you are affected."
    };
    const prompt = `Create a safe, non-panic civic awareness message for this issue. Return JSON with awarenessMessage and callToAction. Use language ${body.language || currentLanguageName()}. Report: ${JSON.stringify(report || {})}`;
    return geminiJson(prompt, { fallback });
  }

  const verificationMatch = path.match(/^\/api\/reports\/([^/]+)\/verification-summary$/);
  if (verificationMatch && method === "POST") {
    const reports = readClientReports();
    const report = reports.find((r) => r.id === verificationMatch[1]);
    const confidence = Math.min(95, 45 + Number(report?.verifiedCount || 0) * 8 + Number(report?.supportCount || 0) * 4 + (report?.thoughts?.length || 0) * 5);
    const fallback = {
      validationStatus: confidence >= 75 ? "Likely valid" : "Needs more proof",
      confidenceScore: confidence,
      evidenceSummary: report ? `The issue has ${report.verifiedCount || 0} verifications, ${report.supportCount || 0} supports, and ${report.thoughts?.length || 0} citizen thoughts.` : "No report found.",
      riskNote: report?.severity || "Medium",
      recommendedNextStep: confidence >= 75 ? "Assign the responsible department for action." : "Ask more citizens to verify or add evidence."
    };
    const prompt = `Summarize community verification for this civic issue. Return JSON with validationStatus, confidenceScore, evidenceSummary, riskNote, recommendedNextStep. Use language ${body.language || currentLanguageName()}. Report: ${JSON.stringify(report || {})}`;
    const result = await geminiJson(prompt, { fallback });
    if (report) {
      report.verificationSummary = result;
      writeClientReports(reports);
    }
    return result;
  }

  const supportMatch = path.match(/^\/api\/reports\/([^/]+)\/support$/);
  if (supportMatch && method === "POST") {
    const reports = readClientReports();
    const report = reports.find((r) => r.id === supportMatch[1]);
    if (!report) throw new Error("Report not found");
    report.supportCount = Number(report.supportCount || 0) + 1;
    if (body.thought) {
      report.thoughts = Array.isArray(report.thoughts) ? report.thoughts : [];
      report.thoughts.push({ id: `TH-${Date.now()}`, userName: body.userName || "Citizen", userEmail: body.userEmail || "", thought: body.thought, createdAt: new Date().toISOString() });
    }
    writeClientReports(reports);
    return report;
  }

  const verifyMatch = path.match(/^\/api\/reports\/([^/]+)\/verify$/);
  if (verifyMatch && method === "PATCH") {
    const reports = readClientReports();
    const report = reports.find((r) => r.id === verifyMatch[1]);
    if (!report) throw new Error("Report not found");
    report.verifiedCount = Number(report.verifiedCount || 0) + 1;
    if (report.verifiedCount >= 3 && report.status === "Reported") report.status = "Verified";
    writeClientReports(reports);
    return report;
  }

  const statusMatch = path.match(/^\/api\/reports\/([^/]+)\/status$/);
  if (statusMatch && method === "PATCH") {
    const reports = readClientReports();
    const report = reports.find((r) => r.id === statusMatch[1]);
    if (!report) throw new Error("Report not found");
    report.status = body.status || report.status;
    writeClientReports(reports);
    return report;
  }

  if (path === "/api/feedback/enhance" && method === "POST") {
    const fallback = {
      enhancedFeedback: body.feedbackText || "The issue appears to be resolved, but the feedback should be reviewed by officials.",
      sentiment: Number(body.rating || 3) >= 4 ? "Positive" : Number(body.rating || 3) <= 2 ? "Negative" : "Neutral",
      followUpNeeded: Number(body.rating || 3) <= 3,
      officialNote: Number(body.rating || 3) <= 3 ? "Follow-up may be needed." : "Resolution appears satisfactory."
    };
    const prompt = `Improve this citizen feedback politely without changing meaning. Return JSON with enhancedFeedback, sentiment, followUpNeeded, officialNote. Use language ${body.language || currentLanguageName()}. Rating: ${body.rating}. Feedback: ${body.feedbackText}`;
    return geminiJson(prompt, { fallback });
  }

  const feedbackMatch = path.match(/^\/api\/reports\/([^/]+)\/feedback$/);
  if (feedbackMatch && method === "POST") {
    const reports = readClientReports();
    const report = reports.find((r) => r.id === feedbackMatch[1]);
    if (!report) throw new Error("Report not found");
    report.feedback = Array.isArray(report.feedback) ? report.feedback : [];
    report.feedback.push({ id: `FB-${Date.now()}`, createdAt: new Date().toISOString(), ...body });
    writeClientReports(reports);
    return report;
  }

  throw new Error(`Unsupported route in Firebase Hosting mode: ${path}`);
}

function loadSavedUser() {
  try {
    const saved = localStorage.getItem("communityHeroUser");
    state.user = saved ? JSON.parse(saved) : null;
    state.language = state.user?.language || localStorage.getItem("communityHeroLanguage") || "en";
    state.uiLanguageName = state.user?.languageName || localStorage.getItem("communityHeroLanguageName") || LANGUAGE_OPTIONS[state.language]?.aiName || "English";
  } catch {
    state.user = null;
    state.language = localStorage.getItem("communityHeroLanguage") || "en";
    state.uiLanguageName = localStorage.getItem("communityHeroLanguageName") || LANGUAGE_OPTIONS[state.language]?.aiName || "English";
  }
}

function renderAuth() {
  const badge = $("userBadge");
  const openBtn = $("openSignInBtn");
  const logoutBtn = $("logoutBtn");
  const authPanel = $("authPanel");

  if (!badge || !openBtn || !logoutBtn) return;

  if (state.user) {
    const langLabel = currentLanguageLabel();
    badge.innerHTML = `👤 ${escapeHtml(state.user.name)} <span class="lang-chip">${escapeHtml(langLabel)}</span>`;
    openBtn.classList.add("hidden");
    logoutBtn.classList.remove("hidden");
    authPanel?.classList.add("hidden");
    const authMessage = $("authMessage");
    if (authMessage) authMessage.textContent = t("signedIn");
  } else {
    badge.textContent = t("guestMode");
    openBtn.classList.remove("hidden");
    logoutBtn.classList.add("hidden");
  }
}

function requireUser(actionText = t("continueAction")) {
  if (state.user) return true;
  alert(t("pleaseSignIn", { action: actionText }));
  const next = encodeURIComponent(`${window.location.pathname}${window.location.hash || ""}`);
  window.location.href = `signin.html?next=${next}`;
  return false;
}

function openSignInPanel() {
  window.location.href = "signin.html";
}

function closeSignInPanel() {
  $("authPanel")?.classList.add("hidden");
}

function handleSignIn(event) {
  event.preventDefault();
  const name = $("signInName").value.trim();
  const email = $("signInEmail").value.trim();
  const language = $("signInLanguage")?.value || state.language || "en";
  const customName = $("customLanguageInput")?.value.trim() || "";
  const languageName = language === "custom" ? customName : LANGUAGE_OPTIONS[language]?.aiName || "English";
  if (!name || !email) {
    $("authMessage").textContent = t("fillNameEmail");
    return;
  }
  if (language === "custom" && !languageName) {
    $("authMessage").textContent = "Please type your desired language name.";
    $("customLanguageInput")?.focus();
    return;
  }

  state.user = { name, email, language, languageName, signedInAt: new Date().toISOString() };
  state.language = language;
  state.uiLanguageName = languageName;
  localStorage.setItem("communityHeroUser", JSON.stringify(state.user));
  localStorage.setItem("communityHeroLanguage", language);
  localStorage.setItem("communityHeroLanguageName", languageName);
  $("signInForm").reset();
  setLanguage(language, true, languageName);
  renderAuth();
}

function logout() {
  localStorage.removeItem("communityHeroUser");
  state.user = null;
  renderAuth();
  alert(t("logoutSuccess"));
}

function compressImage(file) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const reader = new FileReader();
    reader.onload = () => { img.src = reader.result; };
    reader.onerror = reject;
    img.onload = () => {
      const canvas = document.createElement("canvas");
      const maxSize = 900;
      const scale = Math.min(1, maxSize / Math.max(img.width, img.height));
      canvas.width = Math.round(img.width * scale);
      canvas.height = Math.round(img.height * scale);
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      resolve(canvas.toDataURL("image/jpeg", 0.72));
    };
    img.onerror = reject;
    reader.readAsDataURL(file);
  });
}

async function handleMedia(event) {
  const file = event.target.files?.[0];
  state.imageData = "";
  state.mediaType = "none";
  previewWrap.innerHTML = "";
  previewWrap.classList.add("hidden");

  if (!file) return;
  state.mediaType = file.type.startsWith("video/") ? "video" : "image";

  if (file.type.startsWith("image/")) {
    state.imageData = await compressImage(file);
    previewWrap.innerHTML = `<img src="${state.imageData}" alt="Uploaded civic issue preview" /><p>${escapeHtml(t("imageReady"))}</p>`;
  } else if (file.type.startsWith("video/")) {
    const url = URL.createObjectURL(file);
    previewWrap.innerHTML = `<video src="${url}" controls></video><p>${escapeHtml(t("videoAttached"))}</p>`;
  }

  previewWrap.classList.remove("hidden");
}

async function getLocation() {
  const status = $("locationStatus");
  if (!navigator.geolocation) {
    status.textContent = t("locationUnsupported");
    return;
  }
  status.textContent = t("locationGetting");
  navigator.geolocation.getCurrentPosition(
    (position) => {
      state.lat = Number(position.coords.latitude.toFixed(6));
      state.lng = Number(position.coords.longitude.toFixed(6));
      const gpsText = `GPS: ${state.lat}, ${state.lng}`;
      if (!$("locationName").value.trim()) {
        $("locationName").value = gpsText;
      }
      status.textContent = `${t("gpsAdded")}: ${state.lat}, ${state.lng}`;
    },
    () => {
      state.lat = null;
      state.lng = null;
      status.textContent = t("locationDenied");
    },
    { enableHighAccuracy: true, timeout: 10000 }
  );
}

function currentFormData() {
  return {
    title: $("title").value.trim(),
    description: $("description").value.trim(),
    locationName: $("locationName").value.trim(),
    lat: state.lat,
    lng: state.lng,
    imageData: state.imageData,
    mediaType: state.mediaType,
    languageCode: currentLanguageCode(),
    language: currentLanguageName()
  };
}

function renderAiResult(analysis) {
  aiResult.innerHTML = `
    <strong>${t("aiCategory")}:</strong> ${escapeHtml(analysis.category)}<br />
    <strong>${t("severity")}:</strong> ${escapeHtml(analysis.severity)} · <strong>${t("priority")}:</strong> ${analysis.priorityScore}/100<br />
    <strong>${t("department")}:</strong> ${escapeHtml(analysis.department)}<br />
    <strong>${t("summary")}:</strong> ${escapeHtml(analysis.summary)}<br />
    <strong>${t("suggestedAction")}:</strong> ${escapeHtml(analysis.suggestedAction)}
  `;
  aiResult.classList.remove("hidden");
}

async function autofillForm() {
  const payload = currentFormData();
  if (!payload.title && !payload.description && !payload.imageData) {
    alert(t("autofillNeedInput"));
    return;
  }

  const btn = $("autofillBtn");
  btn.disabled = true;
  btn.textContent = t("autofilling");

  try {
    const filled = await api("/api/autofill", {
      method: "POST",
      body: JSON.stringify(payload)
    });

    if (filled.title) $("title").value = filled.title;
    if (filled.description) $("description").value = filled.description;

    state.lastAnalysis = filled;
    renderAiResult(filled);
    aiResult.insertAdjacentHTML(
      "beforeend",
      `<br /><em>${escapeHtml(t("autofillNote"))}</em>`
    );
  } catch (error) {
    alert(t("autofillFailed") + error.message);
  } finally {
    btn.disabled = false;
    btn.textContent = t("autofillBtn");
  }
}

async function analyzeIssue() {
  const payload = currentFormData();
  if (!payload.title && !payload.description && !payload.imageData) {
    alert(t("analysisNeedInput"));
    return null;
  }
  $("analyzeBtn").disabled = true;
  $("analyzeBtn").textContent = t("analyzing");
  try {
    const analysis = await api("/api/analyze", {
      method: "POST",
      body: JSON.stringify(payload)
    });
    state.lastAnalysis = analysis;
    renderAiResult(analysis);
    return analysis;
  } catch (error) {
    alert(t("analysisFailed") + error.message);
    return null;
  } finally {
    $("analyzeBtn").disabled = false;
    $("analyzeBtn").textContent = t("analyzeBtn");
  }
}


async function checkDuplicateBeforeSubmit(reportPayload) {
  const panel = $("duplicateResult");
  if (panel) {
    panel.classList.remove("hidden");
    panel.textContent = t("checkingDuplicates");
  }

  try {
    const result = await api("/api/duplicates/check", {
      method: "POST",
      body: JSON.stringify(reportPayload)
    });

    if (panel) {
      const matchText = result.matchedTitle ? ` ${t("possibleMatch")}: “${escapeHtml(result.matchedTitle)}”.` : "";
      panel.innerHTML = `<strong>${t("duplicateCheck")}:</strong> ${result.likelyDuplicate ? t("possibleDuplicate") : t("noDuplicate")}<br />${t("similarity")}: ${Number(result.similarity || 0)}/100.${matchText}<br />${escapeHtml(result.recommendation || "")}`;
    }

    if (result.likelyDuplicate) {
      return confirm(`AI found a possible duplicate: ${result.matchedTitle || "existing report"}\n\n${result.reason}\n\nSubmit as a new report anyway?`);
    }
    return true;
  } catch (error) {
    if (panel) panel.textContent = t("duplicateFailed");
    return confirm(t("duplicateConfirmFail"));
  }
}

async function submitReport(event) {
  event.preventDefault();
  if (!requireUser(t("submitReportBtn").toLowerCase())) return;

  const base = currentFormData();
  if (!base.title || !base.description) {
    alert(t("titleDescriptionRequired"));
    return;
  }

  if (!base.locationName && !(base.lat && base.lng)) {
    alert(t("locationRequired"));
    $("locationName").focus();
    return;
  }

  if (!base.locationName && base.lat && base.lng) {
    base.locationName = `GPS: ${base.lat}, ${base.lng}`;
  }

  const analysis = state.lastAnalysis || await analyzeIssue();
  if (!analysis) return;

  const shouldSubmit = await checkDuplicateBeforeSubmit({ ...base, ...analysis });
  if (!shouldSubmit) return;

  await api("/api/reports", {
    method: "POST",
    body: JSON.stringify({
      ...base,
      ...analysis,
      reporterName: state.user.name,
      reporterEmail: state.user.email
    })
  });

  alert(t("reportSubmitted"));
  form.reset();
  state.imageData = "";
  state.mediaType = "none";
  state.lat = null;
  state.lng = null;
  state.lastAnalysis = null;
  $("locationStatus").textContent = t("locationNotAdded");
  previewWrap.innerHTML = "";
  previewWrap.classList.add("hidden");
  aiResult.classList.add("hidden");
  const duplicatePanel = $("duplicateResult");
  if (duplicatePanel) duplicatePanel.classList.add("hidden");
  await loadReports();
  document.querySelector("#feed").scrollIntoView({ behavior: "smooth" });
}

async function seedIfEmpty() {
  const existing = await api("/api/reports");
  if (existing.length > 0) return existing;
  for (const report of sampleReports) {
    await api("/api/reports", { method: "POST", body: JSON.stringify(report) });
  }
  return api("/api/reports");
}

async function loadReports() {
  try {
    state.reports = await seedIfEmpty();
    renderReports();
    renderDashboard();
  } catch (error) {
    $("reportList").innerHTML = `<div class="empty">Could not load reports: ${escapeHtml(error.message)}</div>`;
  }
}

function mapUrl(report) {
  if (!report.lat || !report.lng) return "";
  return `https://www.openstreetmap.org/?mlat=${report.lat}&mlon=${report.lng}#map=17/${report.lat}/${report.lng}`;
}

function severityWeight(severity = "") {
  const value = String(severity).toLowerCase();
  if (value === "critical") return 35;
  if (value === "high") return 25;
  if (value === "medium") return 12;
  return 5;
}

function unresolvedWeight(status = "") {
  return status === "Resolved" ? -20 : 10;
}

function issueImportanceScore(report) {
  return Math.round(
    Number(report.priorityScore || 0) +
    severityWeight(report.severity) +
    Number(report.supportCount || 0) * 5 +
    (Array.isArray(report.thoughts) ? report.thoughts.length : 0) * 4 +
    Number(report.verifiedCount || 0) * 3 +
    unresolvedWeight(report.status)
  );
}

function reportSearchText(report) {
  return [
    report.title,
    report.description,
    report.summary,
    report.locationName,
    report.category,
    report.severity,
    report.status,
    report.department,
    report.reporterName,
    ...(Array.isArray(report.thoughts) ? report.thoughts.map((item) => item.thought) : [])
  ].join(" ").toLowerCase();
}

function matchesFeedFilter(report) {
  const filter = state.feed.filter;
  const thoughts = Array.isArray(report.thoughts) ? report.thoughts.length : 0;
  const feedback = Array.isArray(report.feedback) ? report.feedback.length : 0;

  if (filter === "high-priority") return Number(report.priorityScore || 0) >= 75 || ["High", "Critical"].includes(report.severity);
  if (filter === "most-supported") return Number(report.supportCount || 0) >= 1;
  if (filter === "most-commented") return thoughts >= 1;
  if (filter === "pending") return ["Reported", "Verified", "Assigned"].includes(report.status);
  if (filter === "verified") return report.verifiedCount >= 3 || ["Verified", "Assigned", "In Progress", "Resolved"].includes(report.status);
  if (filter === "in-progress") return report.status === "In Progress";
  if (filter === "resolved") return report.status === "Resolved";
  if (filter === "needs-feedback") return report.status === "Resolved" && feedback === 0;
  return true;
}

function getSortedFilteredReports() {
  const query = state.feed.search.trim().toLowerCase();
  let filtered = state.reports.filter((report) => {
    const matchesSearch = !query || reportSearchText(report).includes(query);
    return matchesSearch && matchesFeedFilter(report);
  });

  const sort = state.feed.sort;
  filtered = [...filtered].sort((a, b) => {
    if (sort === "priority") return Number(b.priorityScore || 0) - Number(a.priorityScore || 0);
    if (sort === "supported") return Number(b.supportCount || 0) - Number(a.supportCount || 0);
    if (sort === "commented") return (b.thoughts?.length || 0) - (a.thoughts?.length || 0);
    if (sort === "newest") return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
    return issueImportanceScore(b) - issueImportanceScore(a);
  });
  return filtered;
}

function renderSupportSection(report) {
  const thoughts = Array.isArray(report.thoughts) ? report.thoughts : [];
  const recentThoughts = thoughts.slice(-3).reverse();
  const thoughtsHtml = recentThoughts.length
    ? `<div class="thought-list">
        ${recentThoughts.map((item) => `
          <div class="thought-item">
            <strong>${escapeHtml(item.userName || "Citizen")}</strong>
            <p>${escapeHtml(item.thought || "")}</p>
          </div>
        `).join("")}
      </div>`
    : `<p class="muted-small">${escapeHtml(t("noThoughts"))}</p>`;

  return `
    <div class="support-box">
      <h4>${t("communitySupport")}</h4>
      <p class="muted-small">${t("supportCopy")}</p>
      <div class="support-stats">
        <span>👍 ${Number(report.supportCount || 0)} ${t("supports")}</span>
        <span>💬 ${thoughts.length} ${t("thoughts")}</span>
      </div>
      ${thoughtsHtml}
      <label>${t("thoughtLabel")}
        <textarea id="supportThought-${report.id}" rows="2" placeholder="${escapeHtml(t("thoughtPlaceholder"))}"></textarea>
      </label>
      <div class="feedback-actions">
        <button type="button" onclick="supportIssue('${report.id}')">${t("supportIssueBtn")}</button>
        <button type="button" onclick="aiVerificationSummary('${report.id}')">${t("aiVerificationBtn")}</button>
        <button type="button" onclick="generateAwarenessMessage('${report.id}')">${t("aiAwarenessBtn")}</button>
      </div>
      <div id="awareness-${report.id}" class="verification-preview hidden"></div>
      <div id="verifySummary-${report.id}" class="verification-preview ${report.verificationSummary ? "" : "hidden"}">
        ${report.verificationSummary ? `
          <strong>${escapeHtml(report.verificationSummary.validationStatus || "AI summary")}</strong> · Confidence ${Number(report.verificationSummary.confidenceScore || 0)}/100<br />
          ${escapeHtml(report.verificationSummary.evidenceSummary || "")}<br />
          <em>${escapeHtml(report.verificationSummary.recommendedNextStep || "")}</em>
        ` : ""}
      </div>
    </div>
  `;
}

function renderFeedbackSection(report) {
  const existingFeedback = Array.isArray(report.feedback) ? report.feedback : [];
  const feedbackList = existingFeedback.length
    ? `<div class="feedback-list">
        ${existingFeedback.map((item) => `
          <div class="feedback-item">
            <div><strong>${"⭐".repeat(Number(item.rating || 0))}</strong> · ${escapeHtml(item.userName || "Citizen")}</div>
            <p>${escapeHtml(item.enhancedText || item.originalText || "")}</p>
            <small>Sentiment: ${escapeHtml(item.sentiment || "Neutral")} · ${item.followUpNeeded ? "Follow-up needed" : "No follow-up needed"}</small>
          </div>
        `).join("")}
      </div>`
    : `<p class="muted-small">${escapeHtml(t("noFeedbackYet"))}</p>`;

  if (report.status !== "Resolved") {
    return `
      <div class="feedback-box locked">
        <h4>${t("feedbackTitle")}</h4>
        <p class="muted-small">${t("feedbackOnlyResolved")}</p>
        ${feedbackList}
      </div>
    `;
  }

  return `
    <div class="feedback-box">
      <h4>${t("feedbackTitle")}</h4>
      <p class="muted-small">${t("feedbackOnlyResolved")}</p>
      ${feedbackList}
      <label>${t("ratingLabel")}
        <select id="rating-${report.id}">
          <option value="5">5 - Fully resolved</option>
          <option value="4">4 - Mostly resolved</option>
          <option value="3">3 - Partially resolved</option>
          <option value="2">2 - Poor resolution</option>
          <option value="1">1 - Not resolved</option>
        </select>
      </label>
      <label>${t("feedbackLabel")}
        <textarea id="feedback-${report.id}" rows="3" placeholder="${escapeHtml(t("feedbackPlaceholder"))}"></textarea>
      </label>
      <div id="feedbackPreview-${report.id}" class="feedback-preview hidden"></div>
      <div class="feedback-actions">
        <button type="button" onclick="enhanceFeedback('${report.id}')">${t("enhanceFeedbackBtn")}</button>
        <button type="button" onclick="submitFeedback('${report.id}')">${t("submitFeedbackBtn")}</button>
      </div>
    </div>
  `;
}

function renderReports() {
  const list = $("reportList");
  const count = $("visibleIssueCount");
  const loadMoreBtn = $("loadMoreBtn");
  const filteredReports = getSortedFilteredReports();
  const visibleReports = filteredReports.slice(0, state.feed.visibleCount);

  if (count) {
    const hiddenCount = Math.max(0, filteredReports.length - visibleReports.length);
    count.textContent = t("showingIssues", { visible: String(visibleReports.length), total: String(filteredReports.length) });
  }

  if (loadMoreBtn) {
    loadMoreBtn.classList.toggle("hidden", visibleReports.length >= filteredReports.length);
  }

  if (!state.reports.length) {
    list.innerHTML = `<div class="empty">${t("noReports")}</div>`;
    return;
  }

  if (!visibleReports.length) {
    list.innerHTML = `<div class="empty">${t("noReports")}</div>`;
    return;
  }

  list.innerHTML = visibleReports.map((report, index) => {
    const severityClass = String(report.severity || "medium").toLowerCase();
    const statusClass = String(report.status || "reported").toLowerCase().replaceAll(" ", "-");
    const link = mapUrl(report);
    const aiRank = issueImportanceScore(report);
    return `
      <article class="report-card">
        ${report.imageData ? `<img src="${report.imageData}" alt="Issue evidence" />` : ""}
        <div class="report-content">
          <div class="badges">
            <span class="badge rank-badge">#${index + 1} ${t("smartRank")}</span>
            <span class="badge">${escapeHtml(report.category)}</span>
            <span class="badge ${severityClass}">${escapeHtml(report.severity)}</span>
            <span class="badge ${statusClass}">${escapeHtml(report.status)}</span>
          </div>
          <h3>${escapeHtml(report.title)}</h3>
          <p>${escapeHtml(report.summary || report.description)}</p>
          <p><strong>${t("locationNameLabel")}:</strong> ${escapeHtml(report.locationName || "Unknown")}</p>
          <p><strong>${t("createdBy")}:</strong> ${escapeHtml(report.reporterName || "Anonymous Citizen")}</p>
          <p><strong>${t("department")}:</strong> ${escapeHtml(report.department)}</p>
          <p><strong>${t("priority")}:</strong> ${report.priorityScore}/100 · <strong>${t("smartRank")}:</strong> ${aiRank} · <strong>${t("verifiedStat")}:</strong> ${report.verifiedCount} · <strong>${t("supportsStat")}:</strong> ${report.supportCount || 0}</p>
          <div class="card-actions">
            <button onclick="verifyReport('${report.id}')">✅ ${t("verifyBtn")}</button>
            ${link ? `<a target="_blank" rel="noreferrer" href="${link}">🗺️ ${t("mapLink")}</a>` : ""}
            <select class="status-select" onchange="changeStatus('${report.id}', this.value)">
              ${["Reported", "Verified", "Assigned", "In Progress", "Resolved"].map((status) =>
                `<option value="${status}" ${status === report.status ? "selected" : ""}>${status}</option>`
              ).join("")}
            </select>
          </div>
          ${renderSupportSection(report)}
          ${renderFeedbackSection(report)}
        </div>
      </article>
    `;
  }).join("");
}

function countBy(key) {
  return state.reports.reduce((acc, report) => {
    const value = report[key] || "Unknown";
    acc[value] = (acc[value] || 0) + 1;
    return acc;
  }, {});
}

function renderDashboard() {
  const reports = state.reports;
  const total = reports.length;
  const verified = reports.filter((r) => r.verifiedCount >= 3 || ["Verified", "Assigned", "In Progress", "Resolved"].includes(r.status)).length;
  const progress = reports.filter((r) => r.status === "In Progress").length;
  const resolved = reports.filter((r) => r.status === "Resolved").length;
  const feedbackCount = reports.reduce((sum, r) => sum + (Array.isArray(r.feedback) ? r.feedback.length : 0), 0);
  const supportCount = reports.reduce((sum, r) => sum + Number(r.supportCount || 0), 0);
  const thoughtCount = reports.reduce((sum, r) => sum + (Array.isArray(r.thoughts) ? r.thoughts.length : 0), 0);
  const points = reports.reduce((sum, r) => sum + 10 + (r.verifiedCount * 2) + ((r.supportCount || 0) * 3) + ((r.thoughts?.length || 0) * 4) + (r.status === "Resolved" ? 20 : 0) + ((r.feedback?.length || 0) * 5), 0);

  $("totalReports").textContent = total;
  $("verifiedReports").textContent = verified;
  $("progressReports").textContent = progress;
  $("resolvedReports").textContent = resolved;
  $("feedbackReports").textContent = feedbackCount;
  if ($("supportReports")) $("supportReports").textContent = supportCount;
  if ($("thoughtReports")) $("thoughtReports").textContent = thoughtCount;
  $("heroTotal").textContent = total;
  $("heroResolved").textContent = resolved;
  $("heroPoints").textContent = points;
  $("heroFeedback").textContent = feedbackCount;
  if ($("heroSupport")) $("heroSupport").textContent = supportCount;

  const categories = countBy("category");
  const max = Math.max(1, ...Object.values(categories));
  $("categoryBars").innerHTML = Object.entries(categories).map(([name, value]) => `
    <div class="bar-line">
      <div class="bar-label"><span>${escapeHtml(name)}</span><span>${value}</span></div>
      <div class="bar-bg"><div class="bar-fill" style="width:${(value / max) * 100}%"></div></div>
    </div>
  `).join("") || t("priorityInsightEmpty");

  const top = [...reports].sort((a, b) => b.priorityScore - a.priorityScore)[0];
  $("priorityInsight").textContent = top
    ? `${t("priority")}: “${top.title}” (${top.category}) · ${top.priorityScore}/100. ${t("suggestedAction")}: ${top.suggestedAction}`
    : t("priorityInsightEmpty");

  const discussed = [...reports].sort((a, b) =>
    ((b.supportCount || 0) * 5 + (b.thoughts?.length || 0) * 4 + (b.verifiedCount || 0)) -
    ((a.supportCount || 0) * 5 + (a.thoughts?.length || 0) * 4 + (a.verifiedCount || 0))
  )[0];
  if ($("communitySpotlight")) {
    $("communitySpotlight").textContent = discussed
      ? `“${discussed.title}” · ${discussed.supportCount || 0} ${t("supports")} · ${discussed.thoughts?.length || 0} ${t("thoughts")}.`
      : t("communitySpotlightEmpty");
  }
}


window.supportIssue = async (id) => {
  if (!requireUser(t("supportIssueBtn"))) return;
  const textarea = $(`supportThought-${id}`);
  const thought = textarea?.value.trim() || "";

  await api(`/api/reports/${id}/support`, {
    method: "POST",
    body: JSON.stringify({
      thought,
      userName: state.user.name,
      userEmail: state.user.email,
      languageCode: currentLanguageCode(),
      language: currentLanguageName()
    })
  });

  alert(thought ? "Support and thought added! Community +7 points." : "Support added! Community +3 points.");
  await loadReports();
};

window.aiVerificationSummary = async (id) => {
  const box = $(`verifySummary-${id}`);
  if (box) {
    box.classList.remove("hidden");
    box.textContent = "Generating AI verification summary from supports, thoughts, and verifications...";
  }

  try {
    const result = await api(`/api/reports/${id}/verification-summary`, { method: "POST", body: JSON.stringify({ languageCode: currentLanguageCode(), language: currentLanguageName() }) });
    if (box) {
      box.innerHTML = `
        <strong>${escapeHtml(result.validationStatus || "AI summary")}</strong> · Confidence ${Number(result.confidenceScore || 0)}/100<br />
        ${escapeHtml(result.evidenceSummary || "")}<br />
        <strong>Risk:</strong> ${escapeHtml(result.riskNote || "")}<br />
        <em>${escapeHtml(result.recommendedNextStep || "")}</em>
      `;
    }
    await loadReports();
  } catch (error) {
    if (box) box.textContent = "AI verification summary failed: " + error.message;
  }
};

async function generateDashboardInsights() {
  const box = $("aiDashboardInsight");
  if (!box) return;
  box.classList.remove("hidden");
  box.textContent = t("generatingInsights");

  try {
    const result = await api("/api/insights/dashboard", { method: "POST", body: JSON.stringify({ languageCode: currentLanguageCode(), language: currentLanguageName() }) });
    box.innerHTML = `
      <h4>${escapeHtml(result.headline || "AI Community Insight")}</h4>
      <p><strong>Most discussed:</strong> ${escapeHtml(result.mostDiscussedIssue || "")}</p>
      <p><strong>High-risk area:</strong> ${escapeHtml(result.highRiskArea || "")}</p>
      <p><strong>Trend:</strong> ${escapeHtml(result.trendSummary || "")}</p>
      <p><strong>Official action:</strong> ${escapeHtml(result.recommendedAction || "")}</p>
      <p><strong>Citizen awareness:</strong> ${escapeHtml(result.awarenessMessage || "")}</p>
    `;
  } catch (error) {
    box.textContent = "AI dashboard insight failed: " + error.message;
  }
}

async function generateIssueGroups() {
  const box = $("issueGroupsResult");
  if (!box) return;
  box.classList.remove("hidden");
  box.textContent = t("groupingIssues");

  try {
    const result = await api("/api/insights/groups", { method: "POST", body: JSON.stringify({ languageCode: currentLanguageCode(), language: currentLanguageName() }) });
    const groups = Array.isArray(result.groups) ? result.groups : [];
    box.innerHTML = `
      <h4>${escapeHtml(result.headline || "AI Issue Groups")}</h4>
      ${groups.length ? groups.map((group) => `
        <div class="group-card">
          <strong>${escapeHtml(group.groupName || "Issue group")}</strong>
          <p>${escapeHtml(group.commonProblem || "")}</p>
          <small>${Number(group.reportCount || 0)} reports · Priority ${Number(group.priorityScore || 0)}/100 · ${escapeHtml(group.recommendedAction || "")}</small>
        </div>
      `).join("") : `<p>No similar groups found yet.</p>`}
    `;
  } catch (error) {
    box.textContent = "AI issue grouping failed: " + error.message;
  }
}

window.generateAwarenessMessage = async (id) => {
  const box = $(`awareness-${id}`);
  if (box) {
    box.classList.remove("hidden");
    box.textContent = t("generatingInsights");
  }

  try {
    const result = await api(`/api/reports/${id}/awareness`, { method: "POST", body: JSON.stringify({ languageCode: currentLanguageCode(), language: currentLanguageName() }) });
    if (box) {
      box.innerHTML = `
        <strong>${t("aiAwarenessTitle")}</strong><br />
        ${escapeHtml(result.awarenessMessage || "")}
        <br /><em>${escapeHtml(result.callToAction || "")}</em>
      `;
    }
  } catch (error) {
    if (box) box.textContent = "AI awareness message failed: " + error.message;
  }
};

window.verifyReport = async (id) => {
  if (!requireUser(t("verifyBtn"))) return;
  await api(`/api/reports/${id}/verify`, { method: "PATCH" });
  await loadReports();
};

window.changeStatus = async (id, status) => {
  if (!requireUser(t("statusTracking"))) {
    await loadReports();
    return;
  }
  await api(`/api/reports/${id}/status`, {
    method: "PATCH",
    body: JSON.stringify({ status })
  });
  await loadReports();
};

window.enhanceFeedback = async (id) => {
  if (!requireUser(t("feedbackLabel"))) return;
  const textarea = $(`feedback-${id}`);
  const rating = $(`rating-${id}`)?.value || "5";
  const preview = $(`feedbackPreview-${id}`);
  const feedbackText = textarea?.value.trim();

  if (!feedbackText) {
    alert("Please type your feedback first.");
    textarea?.focus();
    return;
  }

  preview.classList.remove("hidden");
  preview.textContent = t("generatingInsights");

  try {
    const result = await api("/api/feedback/enhance", {
      method: "POST",
      body: JSON.stringify({ reportId: id, feedbackText, rating, languageCode: currentLanguageCode(), language: currentLanguageName() })
    });

    state.feedbackDrafts[id] = {
      originalText: feedbackText,
      enhancedText: result.enhancedFeedback,
      sentiment: result.sentiment,
      followUpNeeded: result.followUpNeeded,
      officialNote: result.officialNote
    };

    textarea.value = result.enhancedFeedback;
    preview.innerHTML = `
      <strong>AI-enhanced feedback ready.</strong><br />
      Sentiment: ${escapeHtml(result.sentiment)} · ${result.followUpNeeded ? "Follow-up needed" : "No follow-up needed"}<br />
      <em>You can edit the enhanced feedback before submitting.</em>
    `;
  } catch (error) {
    preview.textContent = "Feedback enhancement failed: " + error.message;
  }
};

window.submitFeedback = async (id) => {
  if (!requireUser(t("submitFeedbackBtn"))) return;
  const textarea = $(`feedback-${id}`);
  const rating = $(`rating-${id}`)?.value || "5";
  const text = textarea?.value.trim();

  if (!text) {
    alert("Please type your feedback before submitting.");
    textarea?.focus();
    return;
  }

  const draft = state.feedbackDrafts[id] || {};
  await api(`/api/reports/${id}/feedback`, {
    method: "POST",
    body: JSON.stringify({
      rating,
      originalText: draft.originalText || text,
      enhancedText: text,
      sentiment: draft.sentiment || "Neutral",
      followUpNeeded: Boolean(draft.followUpNeeded),
      officialNote: draft.officialNote || "Review feedback for resolution quality.",
      userName: state.user.name,
      userEmail: state.user.email,
      languageCode: currentLanguageCode(),
      language: currentLanguageName()
    })
  });

  delete state.feedbackDrafts[id];
  alert("Feedback submitted successfully! Community +5 points.");
  await loadReports();
};

$("media").addEventListener("change", handleMedia);
$("locateBtn").addEventListener("click", getLocation);
$("autofillBtn").addEventListener("click", autofillForm);
$("analyzeBtn").addEventListener("click", analyzeIssue);
$("generateInsightsBtn")?.addEventListener("click", generateDashboardInsights);
$("generateGroupsBtn")?.addEventListener("click", generateIssueGroups);
$("issueSearch")?.addEventListener("input", (event) => {
  state.feed.search = event.target.value;
  state.feed.visibleCount = 10;
  renderReports();
});
$("issueFilter")?.addEventListener("change", (event) => {
  state.feed.filter = event.target.value;
  state.feed.visibleCount = 10;
  renderReports();
});
$("issueSort")?.addEventListener("change", (event) => {
  state.feed.sort = event.target.value;
  state.feed.visibleCount = 10;
  renderReports();
});
$("loadMoreBtn")?.addEventListener("click", () => {
  state.feed.visibleCount += 10;
  renderReports();
});
form.addEventListener("submit", submitReport);
$("openSignInBtn")?.addEventListener("click", openSignInPanel);
$("logoutBtn")?.addEventListener("click", logout);
$("cancelSignInBtn")?.addEventListener("click", closeSignInPanel);
$("signInForm")?.addEventListener("submit", handleSignIn);
$("languageSelect")?.addEventListener("change", (event) => {
  const selected = event.target.value;
  if (selected === "custom") {
    const typed = prompt("Type your desired language, for example Kannada, Arabic, French, Sinhala, etc.");
    if (!typed) {
      applyLanguage();
      return;
    }
    setLanguage("custom", Boolean(state.user), typed);
  } else {
    setLanguage(selected, Boolean(state.user));
  }
});
$("signInLanguage")?.addEventListener("change", (event) => {
  const selected = event.target.value;
  const name = selected === "custom" ? ($("customLanguageInput")?.value.trim() || state.uiLanguageName || "") : LANGUAGE_OPTIONS[selected]?.aiName || "English";
  state.language = selected;
  state.uiLanguageName = name || "English";
  localStorage.setItem("communityHeroLanguage", state.language);
  localStorage.setItem("communityHeroLanguageName", state.uiLanguageName);
  toggleCustomLanguageInput();
  applyLanguage();
});
$("customLanguageInput")?.addEventListener("input", (event) => {
  if ($("signInLanguage")?.value === "custom") {
    state.uiLanguageName = event.target.value.trim();
    localStorage.setItem("communityHeroLanguageName", state.uiLanguageName);
  }
});

loadSavedUser();
populateLanguageSelects();
applyLanguage();
renderAuth();
loadReports();
