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
    id: "minimal-office",
    name: "Minimal Office",
    icon: "",
    description: "Clean & professional workspace vibes",
    searchKeywords: ["minimal", "office", "workspace", "clean", "professional", "desk"],
    color: "from-gray-100 to-gray-200",
  },
  {
    id: "artistic-fresh",
    name: "Artistic Fresh",
    icon: "",
    description: "Gentle & healing aesthetic",
    searchKeywords: ["flowers", "nature", "soft", "pastel", "delicate", "spring"],
    color: "from-pink-200 to-pink-300",
  },
  {
    id: "creative-art",
    name: "Creative Art",
    icon: "",
    description: "Unique & artistic personality",
    searchKeywords: ["abstract", "art", "colorful", "creative", "painting", "design"],
    color: "from-purple-500 to-pink-500",
  },
  {
    id: "cyberpunk",
    name: "Cyberpunk",
    icon: "",
    description: "Futuristic & tech-savvy",
    searchKeywords: ["cyberpunk", "neon", "futuristic", "city lights", "night city", "tech"],
    color: "from-indigo-900 to-purple-900",
  },
  {
    id: "vacation-travel",
    name: "Vacation Travel",
    icon: "",
    description: "Relaxing & scenic destinations",
    searchKeywords: ["beach", "mountain", "travel", "sunset", "ocean", "landscape", "vacation"],
    color: "from-orange-400 to-pink-600",
  },
  {
    id: "gaming-esports",
    name: "Gaming Esports",
    icon: "",
    description: "Cool & dynamic gaming style",
    searchKeywords: ["gaming", "esports", "rgb", "neon lights", "gaming setup", "tech"],
    color: "from-green-400 to-blue-500",
  },
  {
    id: "luxury-premium",
    name: "Luxury Premium",
    icon: "",
    description: "Elegant & sophisticated quality",
    searchKeywords: ["luxury", "gold", "elegant", "premium", "marble", "black and gold"],
    color: "from-yellow-400 to-amber-600",
  },
  {
    id: "senior-friendly",
    name: "Senior Friendly",
    icon: "",
    description: "Easy to read & comfortable",
    searchKeywords: ["simple", "clear", "large text", "readable", "calm", "gentle", "elderly"],
    color: "from-amber-100 to-orange-200",
  },
  {
    id: "garden-nature",
    name: "Garden & Nature",
    icon: "",
    description: "Peaceful garden & floral scenes",
    searchKeywords: ["garden", "flowers", "plants", "nature", "blooming", "spring", "outdoor", "peaceful", "greenery", "botanical"],
    color: "from-green-200 to-emerald-300",
  },
  {
    id: "family-grandkids",
    name: "Family & Grandkids",
    icon: "",
    description: "Warm family moments together",
    searchKeywords: ["family", "grandparents", "grandchildren", "family gathering", "warm", "love", "together", "generations", "home"],
    color: "from-rose-200 to-pink-300",
  },
  {
    id: "retro-nostalgia",
    name: "Retro Nostalgia",
    icon: "",
    description: "Classic vintage memories",
    searchKeywords: ["vintage", "retro", "nostalgic", "classic", "old fashioned", "memories", "antique", "traditional", "heritage"],
    color: "from-yellow-200 to-amber-300",
  },
  {
    id: "cozy-home",
    name: "Cozy Home",
    icon: "",
    description: "Comfortable & warm home vibes",
    searchKeywords: ["cozy", "home", "comfortable", "warm", "living room", "peaceful", "relaxing", "simple", "homely"],
    color: "from-orange-200 to-amber-200",
  },
  {
    id: "sunrise-sunset",
    name: "Sunrise & Sunset",
    icon: "",
    description: "Beautiful golden hour moments",
    searchKeywords: ["sunrise", "sunset", "golden hour", "peaceful", "calm", "serene", "beautiful sky", "warm light", "nature"],
    color: "from-orange-300 to-rose-400",
  },
  {
    id: "birds-nature",
    name: "Birds & Nature",
    icon: "",
    description: "Gentle birds & natural beauty",
    searchKeywords: ["birds", "nature", "wildlife", "peaceful", "animals", "outdoor", "serene", "gentle", "natural"],
    color: "from-sky-200 to-blue-300",
  },
  {
    id: "fitness-workout",
    name: "Fitness Workout",
    icon: "",
    description: "Motivating & energetic",
    searchKeywords: ["fitness", "gym", "workout", "exercise", "training", "motivation", "sport"],
    color: "from-red-500 to-orange-500",
  },
  {
    id: "mom-parenting",
    name: "Mom & Parenting",
    icon: "",
    description: "Warm & nurturing atmosphere",
    searchKeywords: ["mother", "parenting", "baby", "family", "warm", "soft", "cute", "gentle"],
    color: "from-rose-200 to-pink-300",
  },
  {
    id: "pet-lovers",
    name: "Pet Lovers",
    icon: "",
    description: "Cute & furry friends",
    searchKeywords: ["pets", "cats", "dogs", "animals", "cute", "furry", "adorable", "pet"],
    color: "from-yellow-200 to-amber-300",
  },
  {
    id: "nature-calm",
    name: "Nature Calm",
    icon: "",
    description: "Peaceful & natural serenity",
    searchKeywords: ["nature", "forest", "calm", "peaceful", "green", "outdoors", "serenity", "zen"],
    color: "from-green-300 to-emerald-400",
  },
  {
    id: "coffee-cozy",
    name: "Coffee Cozy",
    icon: "",
    description: "Warm & comfortable vibes",
    searchKeywords: ["coffee", "cafe", "cozy", "warm", "book", "reading", "comfortable"],
    color: "from-amber-200 to-yellow-300",
  },
  {
    id: "motivation-goals",
    name: "Motivation Goals",
    icon: "",
    description: "Inspiring & achievement focused",
    searchKeywords: ["motivation", "success", "goals", "achievement", "inspiring", "business", "career"],
    color: "from-blue-500 to-indigo-600",
  },
  {
    id: "study-focus",
    name: "Study Focus",
    icon: "",
    description: "Concentrated & productive",
    searchKeywords: ["study", "learning", "books", "focus", "education", "academic", "knowledge"],
    color: "from-blue-200 to-indigo-300",
  },
  {
    id: "cartoon-style",
    name: "Cartoon Style",
    icon: "",
    description: "Fun & playful illustrations",
    searchKeywords: ["cartoon", "illustration", "cute", "kawaii", "anime", "manga", "colorful", "playful", "fun", "animated"],
    color: "from-pink-300 to-purple-400",
  },
  {
    id: "design-style",
    name: "Design Style",
    icon: "",
    description: "Modern & artistic aesthetics",
    searchKeywords: ["design", "minimal", "modern", "abstract", "geometric", "graphic", "artistic", "aesthetic", "creative", "contemporary"],
    color: "from-violet-400 to-fuchsia-500",
  },
  {
    id: "tech-style",
    name: "Tech Style",
    icon: "",
    description: "Innovative & futuristic digital",
    searchKeywords: ["technology", "digital", "innovation", "futuristic", "modern tech", "computers", "programming", "AI", "robotics", "cutting edge"],
    color: "from-cyan-400 to-blue-600",
  },
  {
    id: "romantic-sweet",
    name: "Romantic Sweet",
    icon: "",
    description: "Love & romantic sweetness",
    searchKeywords: ["romantic", "love", "sweet", "couple", "heart", "valentine", "pink", "flowers", "candlelight", "romance", "dating"],
    color: "from-rose-300 to-pink-400",
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
