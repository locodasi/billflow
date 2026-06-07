
export const formatDate = (dateString: string) => {
    const locale = navigator.language;
    return new Date(dateString).toLocaleDateString(locale, {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
    }).replace(/\b\w/g, c => c.toUpperCase())
}