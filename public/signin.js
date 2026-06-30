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

const SIGNIN_I18N = {
  en: {
    accessEyebrow: "Profile setup",
    formTitle: "Sign in to continue",
    formHelp: "Your language choice will translate the app UI and ask Gemini to return citizen-facing AI content in your selected language.",
    nameText: "Name",
    emailText: "Email",
    languageText: "Preferred language",
    customLanguageText: "Custom language",
    submitText: "Sign in",
    cancelText: "Cancel",
    preview: "{language} selected. The main app will open in this language.",
    fill: "Please enter your name and email.",
    custom: "Please type your desired language name.",
    success: "Signed in successfully. Opening Community Hero..."
  },
  ta: {
    accessEyebrow: "சுயவிவர அமைப்பு",
    formTitle: "தொடர உள்நுழைக",
    formHelp: "நீங்கள் தேர்ந்தெடுத்த மொழியில் app UI மாற்றப்படும்; குடிமக்களுக்கு தெரியும் AI பதில்களையும் Gemini அதே மொழியில் தரும்.",
    nameText: "பெயர்",
    emailText: "மின்னஞ்சல்",
    languageText: "விருப்ப மொழி",
    customLanguageText: "தனிப்பயன் மொழி",
    submitText: "உள்நுழை",
    cancelText: "ரத்து செய்",
    preview: "{language} தேர்ந்தெடுக்கப்பட்டது. முதன்மை app இந்த மொழியில் திறக்கும்.",
    fill: "உங்கள் பெயர் மற்றும் மின்னஞ்சலை உள்ளிடவும்.",
    custom: "உங்கள் விருப்ப மொழி பெயரை தட்டச்சு செய்யவும்.",
    success: "வெற்றிகரமாக உள்நுழைந்தீர்கள். Community Hero திறக்கப்படுகிறது..."
  },
  hi: {
    accessEyebrow: "प्रोफ़ाइल सेटअप",
    formTitle: "जारी रखने के लिए साइन इन करें",
    formHelp: "आपकी भाषा पसंद app UI को बदलेगी और Gemini नागरिकों के लिए AI content उसी भाषा में देगा।",
    nameText: "नाम",
    emailText: "ईमेल",
    languageText: "पसंदीदा भाषा",
    customLanguageText: "Custom language",
    submitText: "साइन इन",
    cancelText: "रद्द करें",
    preview: "{language} चुनी गई है। मुख्य app इसी भाषा में खुलेगा।",
    fill: "कृपया अपना नाम और email दर्ज करें।",
    custom: "कृपया अपनी इच्छित भाषा का नाम लिखें।",
    success: "Successfully signed in. Community Hero खुल रहा है..."
  }
};

const $ = (id) => document.getElementById(id);

function getLanguageName(code) {
  if (code === "custom") return $("customLanguageInput")?.value.trim() || "Custom language";
  return LANGUAGE_OPTIONS[code]?.aiName || "English";
}

function getSavedLanguage() {
  return localStorage.getItem("communityHeroLanguage") || "en";
}

function getSelectedDict() {
  const code = $("signInLanguage")?.value || getSavedLanguage();
  return SIGNIN_I18N[code] || SIGNIN_I18N.en;
}

function fillLanguageSelect() {
  const select = $("signInLanguage");
  if (!select) return;
  select.innerHTML = Object.entries(LANGUAGE_OPTIONS)
    .map(([code, item]) => `<option value="${code}">${item.label}</option>`)
    .join("");
  const saved = getSavedLanguage();
  select.value = LANGUAGE_OPTIONS[saved] ? saved : "en";

  if (select.value === "custom") {
    $("customLanguageInput").value = localStorage.getItem("communityHeroLanguageName") || "";
  }
}

function updateCustomVisibility() {
  const isCustom = $("signInLanguage").value === "custom";
  $("customLanguageWrap").classList.toggle("hidden", !isCustom);
  $("customLanguageInput").required = isCustom;
}

function applySigninText() {
  const dict = getSelectedDict();
  ["accessEyebrow", "formTitle", "formHelp", "nameText", "emailText", "languageText", "customLanguageText", "submitText", "cancelText"].forEach((id) => {
    if ($(id)) $(id).textContent = dict[id];
  });
  const languageName = getLanguageName($("signInLanguage").value);
  $("languagePreview").textContent = dict.preview.replace("{language}", languageName);
}

function selectedRedirect() {
  const params = new URLSearchParams(window.location.search);
  const next = params.get("next");
  if (next && !next.startsWith("http")) return next;
  return "index.html";
}

function handleSignIn(event) {
  event.preventDefault();
  const name = $("signInName").value.trim();
  const email = $("signInEmail").value.trim();
  const language = $("signInLanguage").value;
  const languageName = getLanguageName(language);
  const dict = getSelectedDict();

  if (!name || !email) {
    $("authMessage").textContent = dict.fill;
    return;
  }
  if (language === "custom" && !languageName) {
    $("authMessage").textContent = dict.custom;
    $("customLanguageInput").focus();
    return;
  }

  const user = { name, email, language, languageName, signedInAt: new Date().toISOString() };
  localStorage.setItem("communityHeroUser", JSON.stringify(user));
  localStorage.setItem("communityHeroLanguage", language);
  localStorage.setItem("communityHeroLanguageName", languageName);
  $("authMessage").textContent = dict.success;

  setTimeout(() => {
    window.location.href = selectedRedirect();
  }, 450);
}

fillLanguageSelect();
updateCustomVisibility();
applySigninText();

$("signInLanguage").addEventListener("change", () => {
  const code = $("signInLanguage").value;
  const name = getLanguageName(code);
  localStorage.setItem("communityHeroLanguage", code);
  localStorage.setItem("communityHeroLanguageName", name);
  updateCustomVisibility();
  applySigninText();
});

$("customLanguageInput").addEventListener("input", () => {
  localStorage.setItem("communityHeroLanguageName", getLanguageName("custom"));
  applySigninText();
});

$("signInForm").addEventListener("submit", handleSignIn);
