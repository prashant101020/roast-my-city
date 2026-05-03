import { useState, useEffect } from 'react';
import { Flame, MapPin, Copy, Share2, Moon, Sun, Loader2 } from 'lucide-react';

// Replace with your actual OpenRouter API key in production, preferably via env variables
const API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY || "YOUR_API_KEY_HERE";

function App() {
  const [city, setCity] = useState('');
  const [roast, setRoast] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingText, setLoadingText] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [intensity, setIntensity] = useState('savage'); // mild, savage, brutal
  const [detecting, setDetecting] = useState(false);

  const loadingPhrases = [
    "Collecting insults...",
    "Consulting local haters...",
    "Judging your life choices...",
    "Analyzing traffic patterns and bad decisions...",
    "Warming up the grill..."
  ];

  useEffect(() => {
    // Check system preference on load
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    if (!isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const generatePrompt = (targetCity) => {
    return `
      Act as a savage, witty, meme-style comedian who roasts cities.
      Roast the city of: ${targetCity}.

      RULES:
      1. If the city is in India, the roast MUST be in "Hinglish" (a mix of Hindi and English).
      2. If the city is outside India, the roast MUST be in English.
      3. The intensity of the roast should be: ${intensity} (mild = playful teasing, savage = witty and brutal, brutal = no mercy but still funny).
      4. Include specific stereotypes, culture, food, traffic, weather, and people's habits of this city.
      5. Format the output clearly:
         - Start with a savage opening line.
         - Provide 5-8 short, meme-style punchlines as bullet points (use * or - for bullets).
         - End with one longer paragraph (3-4 sentences) that brutally summarises the city.
      7. Add emojis sparingly but effectively.
      8. Keep it highly shareable for Twitter/Instagram.
    `;
  };

  const handleRoast = async (e) => {
    if (e) e.preventDefault();
    if (!city.trim()) return;

    setLoading(true);
    setRoast('');

    // Cycle loading text
    let phraseIndex = 0;
    setLoadingText(loadingPhrases[0]);
    const interval = setInterval(() => {
      phraseIndex = (phraseIndex + 1) % loadingPhrases.length;
      setLoadingText(loadingPhrases[phraseIndex]);
    }, 1500);

    try {
      const currentApiKey = import.meta.env.VITE_OPENROUTER_API_KEY || API_KEY;
      const prompt = generatePrompt(city);

      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${currentApiKey}`,
          "HTTP-Referer": window.location.href,
          "X-Title": "Roast My City",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "claude-3-5-haiku:beta",
          messages: [{ role: "user", content: prompt }],
          temperature: 1,
          top_p: 1,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || `API Error: ${response.status}`);
      }

      const data = await response.json();
      const text = data.choices[0]?.message?.content || "";
      setRoast(text);
    } catch (error) {
      console.error("Error generating roast:", error);
      let errorMessage = "Uh oh, the roasting engine broke down. Probably stuck in your city's traffic. Try again later! 💀\n\n";
      if (error.message) {
        errorMessage += `Details: ${error.message}`;
      } else {
        errorMessage += "(Make sure you've set a valid OpenRouter API Key)";
      }
      setRoast(errorMessage);
    } finally {
      clearInterval(interval);
      setLoading(false);
    }
  };

  const detectCity = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }

    setDetecting(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          // Free reverse geocoding using OpenStreetMap Nominatim
          const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=10&addressdetails=1`, {
            headers: {
              'Accept-Language': 'en'
            }
          });
          const data = await response.json();

          let detectedCity = data.address.city || data.address.town || data.address.county || data.address.state_district;

          if (detectedCity) {
            setCity(detectedCity);
          } else {
            alert("Couldn't pinpoint your exact city, maybe you're in the middle of nowhere?");
          }
        } catch (error) {
          console.error("Error fetching location details:", error);
          alert("Failed to get city name. Enter it manually.");
        } finally {
          setDetecting(false);
        }
      },
      (error) => {
        console.error("Error getting location:", error);
        alert("Location access denied or unavailable. Enter your city manually.");
        setDetecting(false);
      }
    );
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(roast);
    alert("Roast copied to clipboard!");
  };

  const shareRoast = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Roast of ${city}`,
          text: roast,
          url: window.location.href,
        });
      } catch (err) {
        console.error('Error sharing:', err);
      }
    } else {
      copyToClipboard();
    }
  };

  return (
    <div className="min-h-screen font-sans selection:bg-orange-500 selection:text-white">
      {/* Header */}
      <header className="p-4 flex justify-end">
        <button
          onClick={toggleDarkMode}
          className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors"
          aria-label="Toggle Dark Mode"
        >
          {isDarkMode ? <Sun size={24} /> : <Moon size={24} />}
        </button>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-12 flex flex-col items-center text-center">

        {/* Hero Section */}
        <div className="mb-10 animate-fade-in-up">
          <h1 className="text-5xl md:text-6xl font-extrabold mb-4 tracking-tight flex items-center justify-center gap-2">
            Roast My City <Flame className="text-orange-500" size={48} />
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            Enter your city and get roasted brutally. No mercy.
          </p>
        </div>

        {/* Input Section */}
        <div className="w-full max-w-md bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-6 mb-8 border border-gray-100 dark:border-gray-800">
          <form onSubmit={handleRoast} className="flex flex-col gap-4">
            <div className="relative">
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="e.g. Delhi, Mumbai, New York..."
                className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all text-lg"
                required
              />
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={detectCity}
                disabled={detecting || loading}
                className="flex-1 flex items-center justify-center gap-2 py-3 px-4 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl font-medium transition-colors disabled:opacity-50"
              >
                {detecting ? <Loader2 size={20} className="animate-spin" /> : <MapPin size={20} />}
                <span className="hidden sm:inline">Detect</span>
              </button>

              <button
                type="submit"
                disabled={loading || !city.trim()}
                className="flex-[2] py-3 px-4 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-bold text-lg transition-colors shadow-lg shadow-orange-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Roast It
              </button>
            </div>

            {/* Intensity Slider */}
            <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800">
              <label className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2 block">
                Roast Intensity: <span className="text-orange-500 font-bold capitalize">{intensity}</span>
              </label>
              <input
                type="range"
                min="0"
                max="2"
                value={intensity === 'mild' ? 0 : intensity === 'savage' ? 1 : 2}
                onChange={(e) => {
                  const val = parseInt(e.target.value);
                  setIntensity(val === 0 ? 'mild' : val === 1 ? 'savage' : 'brutal');
                }}
                className="w-full accent-orange-500"
              />
              <div className="flex justify-between text-xs text-gray-400 mt-1">
                <span>Mild</span>
                <span>Savage</span>
                <span>Brutal</span>
              </div>
            </div>
          </form>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-12 animate-pulse">
            <Flame className="text-orange-500 animate-bounce mb-4" size={40} />
            <p className="text-lg font-medium text-gray-600 dark:text-gray-400">{loadingText}</p>
          </div>
        )}

        {/* Output Card */}
        {roast && !loading && (
          <div className="w-full max-w-2xl bg-white dark:bg-gray-900 rounded-2xl shadow-2xl p-6 md:p-8 border-t-4 border-orange-500 text-left animate-fade-in">
            <div className="prose dark:prose-invert prose-orange max-w-none text-lg whitespace-pre-wrap">
              {roast}
            </div>

            <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-gray-100 dark:border-gray-800">
              <button
                onClick={copyToClipboard}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 transition-colors text-sm font-medium"
              >
                <Copy size={16} /> Copy
              </button>
              <button
                onClick={shareRoast}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-orange-100 hover:bg-orange-200 text-orange-700 dark:bg-orange-900/30 dark:hover:bg-orange-900/50 dark:text-orange-400 transition-colors text-sm font-medium"
              >
                <Share2 size={16} /> Share
              </button>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}

export default App;
