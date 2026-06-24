"use client"

import { useEffect } from "react"
import i18n from "@/i18n"
import { useUserStore } from "@/stores/userStore"

const I18nSync = () => {
    const language = useUserStore(
        (s) => s.language
    )

    // useEffect(() => {
    //     i18n.changeLanguage(language)
    //     localStorage.setItem("language", language)
    // }, [language])

    return null
}

export default I18nSync