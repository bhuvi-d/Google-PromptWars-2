export const translations = {
  en: {
    // Header
    "nav.assistant": "AI Assistant",
    "nav.journey": "Journey",
    "nav.documents": "Documents",
    "nav.help": "Help",
    "header.readiness": "Readiness",
    "header.askAI": "Ask AI",
    
    // Home Page
    "home.badge": "Election 2026 Ready",
    "home.title.1": "Your Trusted Guide to",
    "home.title.2": "Elections & Voting",
    "home.subtitle": "VOTEXA simplifies the voting process. From checking eligibility and finding your polling station, to clearing up myths and answering your questions instantly with our AI assistant.",
    "home.btn.journey": "Start Your Journey",
    "home.btn.askAI": "Ask AI Assistant",
    "home.deadline.title": "Registration Deadline Approaching",
    "home.deadline.desc": "Make sure your name is on the electoral roll before the upcoming cutoff.",
    "home.deadline.btn": "Check Status Now",
    "home.features.title": "Everything you need to be ready",
    "home.features.subtitle": "We make the democratic process accessible and easy to understand for everyone.",
    
    // Features
    "feat.1.title": "Verify Eligibility",
    "feat.1.desc": "Quickly check if you are eligible to vote and what you need to register.",
    "feat.2.title": "Document Checklist",
    "feat.2.desc": "A smart, personalized checklist of exactly what to bring on voting day.",
    "feat.3.title": "Election Timeline",
    "feat.3.desc": "Track important dates, from registration deadlines to counting day.",
    "feat.4.title": "Special Situations",
    "feat.4.desc": "Recently moved? Lost ID? Find specific guidance for your unique situation.",
    
    // AI Section
    "home.ai.title": "Confused? Ask our AI Assistant",
    "home.ai.subtitle": "Powered by Google Gemini, our intelligent assistant provides accurate, structured, and calm answers to all your election-related questions in seconds.",
    "home.ai.btn": "Try the AI Assistant now",
  },
  hi: {
    // Header
    "nav.assistant": "एआई सहायक",
    "nav.journey": "आपकी यात्रा",
    "nav.documents": "दस्तावेज़",
    "nav.help": "मदद",
    "header.readiness": "तैयारी",
    "header.askAI": "एआई से पूछें",
    
    // Home Page
    "home.badge": "चुनाव 2026 के लिए तैयार",
    "home.title.1": "चुनाव और मतदान के लिए आपका",
    "home.title.2": "विश्वसनीय मार्गदर्शक",
    "home.subtitle": "VOTEXA मतदान प्रक्रिया को सरल बनाता है। अपनी पात्रता जांचने और अपना मतदान केंद्र खोजने से लेकर, मिथकों को दूर करने और हमारे एआई सहायक के साथ तुरंत अपने सवालों के जवाब पाने तक।",
    "home.btn.journey": "अपनी यात्रा शुरू करें",
    "home.btn.askAI": "एआई सहायक से पूछें",
    "home.deadline.title": "पंजीकरण की समय सीमा नजदीक है",
    "home.deadline.desc": "सुनिश्चित करें कि आगामी कटऑफ से पहले आपका नाम मतदाता सूची में है।",
    "home.deadline.btn": "अभी स्थिति जांचें",
    "home.features.title": "तैयार होने के लिए आपको जो कुछ भी चाहिए",
    "home.features.subtitle": "हम लोकतांत्रिक प्रक्रिया को सभी के लिए सुलभ और समझने में आसान बनाते हैं।",
    
    // Features
    "feat.1.title": "पात्रता सत्यापित करें",
    "feat.1.desc": "जल्दी से जांचें कि क्या आप मतदान करने के पात्र हैं और आपको पंजीकरण के लिए क्या चाहिए।",
    "feat.2.title": "दस्तावेज़ चेकलिस्ट",
    "feat.2.desc": "मतदान के दिन क्या लाना है, इसकी एक स्मार्ट, व्यक्तिगत चेकलिस्ट।",
    "feat.3.title": "चुनाव समयरेखा",
    "feat.3.desc": "पंजीकरण की समय सीमा से लेकर मतगणना के दिन तक, महत्वपूर्ण तिथियों को ट्रैक करें।",
    "feat.4.title": "विशेष स्थितियाँ",
    "feat.4.desc": "हाल ही में स्थानांतरित हुए? आईडी खो गई? अपनी अनूठी स्थिति के लिए विशिष्ट मार्गदर्शन प्राप्त करें।",
    
    // AI Section
    "home.ai.title": "उलझन में हैं? हमारे एआई सहायक से पूछें",
    "home.ai.subtitle": "Google Gemini द्वारा संचालित, हमारा बुद्धिमान सहायक आपके सभी चुनाव-संबंधी प्रश्नों के सटीक, संरचित और स्पष्ट उत्तर कुछ ही सेकंड में प्रदान करता है।",
    "home.ai.btn": "एआई सहायक आज़माएं",
  }
};

export type Language = "en" | "hi";

export function useTranslation(lang: Language) {
  return function t(key: keyof typeof translations.en): string {
    return translations[lang][key] || translations.en[key] || key;
  };
}
