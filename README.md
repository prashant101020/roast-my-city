# Roast My City 🔥

A lightweight web app that brutally (but humorously) roasts your city using Gemini AI.

## Features

*   **Savage Roasts:** Generates witty, meme-style roasts for any city.
*   **Hinglish Support:** Automatically switches to a Hindi-English mix (Hinglish) for Indian cities.
*   **City Detection:** Geolocation API to auto-detect your current city.
*   **Customizable Intensity:** Choose between Mild, Savage, or Brutal roasts.
*   **Dark Mode:** Built-in dark mode toggle for late-night roasting.
*   **Shareable:** Easy copy-to-clipboard and native sharing capabilities.
*   **Lightweight:** Built with Vite + React + Tailwind CSS with no backend.

## Setup Instructions

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/yourusername/roast-my-city.git
    cd roast-my-city
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    # or
    yarn install
    ```

3.  **Environment Variables:**
    Create a `.env` file in the root of your project and add your Gemini API Key:
    ```env
    VITE_GEMINI_API_KEY=your_actual_gemini_api_key_here
    ```
    *Note: You can get a free API key from Google AI Studio.*

4.  **Run locally:**
    ```bash
    npm run dev
    # or
    yarn dev
    ```

## Deployment Steps (Vercel)

Deploying this app to Vercel is extremely simple because it's a static frontend app.

1.  Push your code to a GitHub, GitLab, or Bitbucket repository.
2.  Go to [Vercel](https://vercel.com/) and sign in.
3.  Click **Add New... > Project**.
4.  Import your `roast-my-city` repository.
5.  In the **Configure Project** section:
    *   **Framework Preset:** Vercel should automatically detect **Vite**.
    *   **Environment Variables:** Add `VITE_GEMINI_API_KEY` and paste your Gemini API key as the value.
6.  Click **Deploy**.
7.  Once deployed, Vercel will give you a live URL where your app is hosted!

## Sample API Prompt Used Internally

The app constructs a prompt similar to this before sending it to the Gemini API:

```text
Act as a savage, witty, meme-style comedian who roasts cities.
Roast the city of: Delhi.

RULES:
1. If the city is in India, the roast MUST be in "Hinglish" (a mix of Hindi and English).
2. If the city is outside India, the roast MUST be in English.
3. The intensity of the roast should be: savage (mild = playful teasing, savage = witty and brutal, brutal = no mercy but still funny).
4. Include specific stereotypes, culture, food, traffic, weather, and people's habits of this city.
5. DO NOT use any hate speech targeting religion, caste, race, or marginalized groups. Keep it funny but not harmful.
6. Format the output clearly:
    - Start with a savage opening line.
    - Provide 5-8 short, meme-style punchlines as bullet points (use * or - for bullets).
    - End with one longer paragraph (3-4 sentences) that brutally summarises the city.
7. Add emojis sparingly but effectively.
8. Keep it highly shareable for Twitter/Instagram.
```

## Tech Stack

*   React 18
*   Vite
*   Tailwind CSS
*   Lucide React (Icons)
*   Google Generative AI SDK (`@google/generative-ai`)
