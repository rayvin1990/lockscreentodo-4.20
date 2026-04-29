export interface BackgroundScene {
  id: string;
  name: string;
  icon: string;
  description: string;
  searchKeywords: string[];
  color: string;
}

export const BACKGROUND_SCENES: BackgroundScene[] = [
  {
    id: "calm-minimal",
    name: "Calm Minimal",
    icon: "",
    description: "Quiet negative-space photos for readable reminders",
    searchKeywords: ["minimal calm background", "negative space", "soft light", "quiet", "wallpaper"],
    color: "from-slate-200 to-zinc-300",
  },
  {
    id: "soft-nature",
    name: "Soft Nature",
    icon: "",
    description: "Gentle natural scenes with room for text",
    searchKeywords: ["minimal nature", "mist", "forest", "soft light", "calm"],
    color: "from-emerald-100 to-stone-300",
  },
  {
    id: "quiet-home",
    name: "Quiet Home",
    icon: "",
    description: "Warm interiors for personal daily reminders",
    searchKeywords: ["minimal home interior", "warm light", "quiet room", "cozy minimal"],
    color: "from-stone-200 to-amber-200",
  },
  {
    id: "morning-light",
    name: "Morning Light",
    icon: "",
    description: "Clean morning mood for today's priorities",
    searchKeywords: ["morning light", "minimal window", "soft sunrise", "quiet"],
    color: "from-sky-100 to-stone-200",
  },
  {
    id: "city-errands",
    name: "City Errands",
    icon: "",
    description: "Subtle streets and transit for out-of-home tasks",
    searchKeywords: ["minimal city street", "commute", "soft light", "urban calm"],
    color: "from-zinc-200 to-slate-400",
  },
  {
    id: "documents-travel",
    name: "Documents & Travel",
    icon: "",
    description: "Clean travel context for passports and appointments",
    searchKeywords: ["minimal travel", "passport", "airport", "luggage", "soft light"],
    color: "from-stone-200 to-slate-300",
  },
  {
    id: "health-calm",
    name: "Health Calm",
    icon: "",
    description: "Quiet, clean backgrounds for medication reminders",
    searchKeywords: ["minimal wellness", "clean morning", "soft bed", "calm health"],
    color: "from-teal-100 to-slate-200",
  },
  {
    id: "evening-warm",
    name: "Evening Warm",
    icon: "",
    description: "Low-noise dusk scenes for end-of-day tasks",
    searchKeywords: ["minimal evening", "dusk", "warm light", "quiet street"],
    color: "from-orange-200 to-zinc-400",
  },
  {
    id: "botanical-quiet",
    name: "Botanical Quiet",
    icon: "",
    description: "Simple plants and textures without visual clutter",
    searchKeywords: ["minimal plant", "botanical", "green leaves", "negative space"],
    color: "from-lime-100 to-emerald-200",
  },
  {
    id: "family-warmth",
    name: "Family Warmth",
    icon: "",
    description: "Soft home mood for family calls and visits",
    searchKeywords: ["warm home", "family home", "soft light", "cozy interior"],
    color: "from-rose-200 to-pink-300",
  },
];

export interface UnsplashImage {
  id: string;
  urls: {
    regular: string;
    small: string;
    thumb: string;
  };
  description: string | null;
  user: {
    name: string;
    username: string;
  };
}
