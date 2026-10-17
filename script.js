const translations = {
  en: {
    home: "Home",
    services: "Services",
    about: "About",
    heading: "Your Health, Our Priority",
    description: "Find laboratory tests, book appointments, and manage your laboratory services in one place.",
    bookTest: "Explore Tests",
    login: "Login",
    servicesHeading: "Our Services",
    patientTitle: "Patient Portal",
    patientDescription: "View tests, manage bookings, and access your reports.",
    labTitle: "Laboratory Management",
    labDescription: "Manage laboratory tests, bookings, and reports.",
    homeTitle: "Home Sample Collection",
    homeDescription: "Request sample collection from your home.",
    aboutHeading: "About SmartLab",
    aboutDescription: "SmartLab aims to simplify pathology laboratory management and make laboratory services easier to access.",
    loginHeading: "Get Started",
    loginDescription: "Patient and laboratory owner login will be available here.",
    footer: "All rights reserved.",
    disclaimer: "SmartLab does not replace professional medical advice."
  },

  mr: {
    home: "मुख्यपृष्ठ",
    services: "सेवा",
    about: "आमच्याबद्दल",
    heading: "तुमचे आरोग्य, आमची प्राथमिकता",
    description: "पॅथॉलॉजी चाचण्या शोधा, अपॉइंटमेंट बुक करा आणि प्रयोगशाळेच्या सेवा एकाच ठिकाणी वापरा.",
    bookTest: "चाचण्या पाहा",
    login: "लॉगिन",
    servicesHeading: "आमच्या सेवा",
    patientTitle: "रुग्ण पोर्टल",
    patientDescription: "चाचण्या पाहा, बुकिंग व्यवस्थापित करा आणि तुमचे रिपोर्ट मिळवा.",
    labTitle: "प्रयोगशाळा व्यवस्थापन",
    labDescription: "प्रयोगशाळेच्या चाचण्या, बुकिंग आणि रिपोर्ट व्यवस्थापित करा.",
    homeTitle: "घरून नमुना संकलन",
    homeDescription: "घरून नमुना गोळा करण्याची विनंती करा.",
    aboutHeading: "SmartLab बद्दल",
    aboutDescription: "SmartLab प्रयोगशाळेचे व्यवस्थापन सोपे करण्यासाठी आणि सेवा सहज उपलब्ध करण्यासाठी तयार केले आहे.",
    loginHeading: "सुरुवात करा",
    loginDescription: "रुग्ण आणि प्रयोगशाळा मालकांसाठी लॉगिन सुविधा येथे उपलब्ध होईल.",
    footer: "सर्व हक्क राखीव.",
    disclaimer: "SmartLab हा व्यावसायिक वैद्यकीय सल्ल्याचा पर्याय नाही."
  },

  hi: {
    home: "होम",
    services: "सेवाएँ",
    about: "हमारे बारे में",
    heading: "आपका स्वास्थ्य, हमारी प्राथमिकता",
    description: "पैथोलॉजी टेस्ट खोजें, अपॉइंटमेंट बुक करें और प्रयोगशाला की सेवाएँ एक ही जगह पर पाएँ।",
    bookTest: "टेस्ट देखें",
    login: "लॉगिन",
    servicesHeading: "हमारी सेवाएँ",
    patientTitle: "मरीज़ पोर्टल",
    patientDescription: "टेस्ट देखें, बुकिंग संभालें और अपनी रिपोर्ट प्राप्त करें।",
    labTitle: "प्रयोगशाला प्रबंधन",
    labDescription: "टेस्ट, बुकिंग और रिपोर्ट प्रबंधित करें।",
    homeTitle: "घर से सैंपल कलेक्शन",
    homeDescription: "घर से सैंपल लेने का अनुरोध करें।",
    aboutHeading: "SmartLab के बारे में",
    aboutDescription: "SmartLab का उद्देश्य प्रयोगशाला प्रबंधन को आसान बनाना और सेवाओं को अधिक सुलभ करना है।",
    loginHeading: "शुरू करें",
    loginDescription: "मरीज़ और प्रयोगशाला मालिक का लॉगिन यहाँ उपलब्ध होगा।",
    footer: "सर्वाधिकार सुरक्षित।",
    disclaimer: "SmartLab पेशेवर चिकित्सा सलाह का विकल्प नहीं है।"
  }
};

const languageSelect = document.getElementById("languageSelect");

function changeLanguage(language) {
  const dictionary = translations[language];

  if (!dictionary) return;

  document.documentElement.lang = language;

  document.querySelectorAll("[data-translate]").forEach((element) => {
    const key = element.dataset.translate;

    if (dictionary[key]) {
      element.textContent = dictionary[key];
    }
  });

  try {
    localStorage.setItem("smartlab-language", language);
  } catch (error) {
    // The page still works when browser storage is unavailable.
  }
}

if (languageSelect) {
  languageSelect.addEventListener("change", (event) => {
    changeLanguage(event.target.value);
  });

  try {
    const savedLanguage = localStorage.getItem("smartlab-language");

    if (savedLanguage && translations[savedLanguage]) {
      languageSelect.value = savedLanguage;
      changeLanguage(savedLanguage);
    }
  } catch (error) {
    changeLanguage("en");
  }
}

const searchButton = document.getElementById("searchButton");
const labSearch = document.getElementById("labSearch");
const searchMessage = document.getElementById("searchMessage");

if (searchButton && labSearch && searchMessage) {
  searchButton.addEventListener("click", () => {
    const query = labSearch.value.trim();

    if (!query) {
      searchMessage.textContent =
        "Enter a laboratory name or city to search.";
      labSearch.focus();
      return;
    }

    const labSection = document.getElementById("labs");

    if (labSection) {
      labSection.scrollIntoView({ behavior: "smooth" });
    }

    searchMessage.textContent =
      "Demo listings are shown below. Live laboratory search will be connected to the database later.";
  });

  labSearch.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      searchButton.click();
    }
  });
}
