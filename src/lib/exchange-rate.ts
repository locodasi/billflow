"use server"

export async function convertToUSD(
    amount: number,
    currency: string
) {
    // Atajo para USD
    if (currency.toUpperCase() === "USD") {
        return {
            exchangeRate: 1,
            amountUsd: amount,
        }
    }

    const response = await fetch(
        `https://api.frankfurter.app/latest?from=${currency}&to=USD`
    )

    if (!response.ok) {
        throw new Error("Failed to fetch exchange rate")
    }

    const data = await response.json()

    const exchangeRate = data.rates.USD

    return {
        exchangeRate,
        amountUsd: Number((amount * exchangeRate).toFixed(2)),
    }
}