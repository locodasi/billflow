import i18n from "i18next"
import { initReactI18next } from "react-i18next"
import HttpBackend from "i18next-http-backend"


export function getInitialLanguage(): string {
    // 1️⃣ idioma guardado por el usuario
    const savedLang = localStorage.getItem("language");
    if (savedLang) {
        return savedLang;
    }

    // 2️⃣ idioma del navegador
    if (typeof navigator !== "undefined") {
        const browserLang = navigator.language.split("-")[0]; // es-AR → es
        return browserLang;
    }

    // 3️⃣ fallback
    return "en";
}

const initialLanguage = getInitialLanguage()
console.log("initialLanguage", initialLanguage)
i18n
    .use(HttpBackend)
    .use(initReactI18next)
    .init({
        lng: initialLanguage,
        fallbackLng: "en",

        supportedLngs: ["en", "es", "de"],

        ns: ["common", "invoice"],
        defaultNS: "common",

        backend: {
            loadPath: "locales/{{lng}}/{{ns}}.json",
        },

        interpolation: {
            escapeValue: false,
        },

        react: {
            useSuspense: false,
        },
    })

export default i18n