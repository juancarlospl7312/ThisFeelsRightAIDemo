export const environment = {
    production: false,
    environmentName: "ThisFeelsRightAIDemo",

    // Hardcoded API keys (replace these with real values)
    googleApiKey: process.env.googleApiKey,
    cseId: process.env.cseId,
    googleApiURl: "https://www.googleapis.com/customsearch/v1",
    // Scraper API key
    scraperApiKey: process.env.scraperApiKey,
    scraperApiUrl: "https://api.scraperapi.com",
    // OpenAI API key
    openAiApiKey: process.env.openAiApiKey,
    apiUrl: "https://api.openai.com/v1/chat/completions",
}