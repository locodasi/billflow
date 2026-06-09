
export const formatDate = (dateString: string) => {
    const locale = navigator.language;
    return new Date(dateString).toLocaleDateString(locale, {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
    }).replace(/\b\w/g, c => c.toUpperCase())
}

export const parseDateToLocaleFormat = (dateString: string) => {
    console.log(dateString)
    const formatted = new Intl.DateTimeFormat(
        navigator.language
    ).format(new Date(dateString))

    console.log(formatted)
    return formatted;
}