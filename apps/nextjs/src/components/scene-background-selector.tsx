"use client";

import { useState, useEffect } from "react";
import { Image as ImageIcon, Loader2, X, ChevronLeft, ChevronDown } from "lucide-react";
import { BACKGROUND_SCENES, UnsplashImage } from "~/lib/background-scenes";

interface SceneBackgroundSelectorProps {
  onSelect: (imageUrl: string) => void;
  selectedImage: string;
}

export function SceneBackgroundSelector({
  onSelect,
  selectedImage,
}: SceneBackgroundSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedScene, setSelectedScene] = useState<string | null>(null);
  const [images, setImages] = useState<UnsplashImage[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch images when scene is selected
  useEffect(() => {
    if (!selectedScene) return;

    const fetchImages = async () => {
      setLoading(true);
      setError(null);

      try {
        const scene = BACKGROUND_SCENES.find((s) => s.id === selectedScene);
        if (!scene) return;

        // Use the first keyword to search
        const query = scene.searchKeywords[0];

        const response = await fetch(
          `/api/unsplash/photos?query=${encodeURIComponent(query)}&per_page=12`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch images");
        }

        const data = await response.json();
        setImages(data.images || []);
      } catch (err) {
        console.error("Error fetching images:", err);
        setError("Failed to load images. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchImages();
  }, [selectedScene]);

  const handleBackToScenes = () => {
    setSelectedScene(null);
    setImages([]);
    setError(null);
  };

  const handleImageSelect = (imageUrl: string) => {
    onSelect(imageUrl);
  };

  // Get current scene info for display
  const currentScene = selectedScene ? BACKGROUND_SCENES.find((s) => s.id === selectedScene) : null;

  return (
    <div className="bg-brand-card rounded-2xl p-6 border border-gray-800">
      {/* Dropdown Selector */}
      <div className="relative">
        <button
          onClick={() => {
            if (selectedScene) {
              handleBackToScenes();
            } else {
              setIsOpen(!isOpen);
            }
          }}
          className="w-full flex items-center justify-between px-4 py-3 bg-brand-bg hover:bg-gray-800 border-2 border-gray-700 hover:border-brand-green rounded-xl transition-all"
        >
          <div className="flex items-center gap-3">
            {selectedScene ? (
              <>
                {currentScene && (
                  <div className="text-left">
                    <span className="text-white font-medium block">{currentScene.name}</span>
                    <span className="text-gray-400 text-sm">{currentScene.description}</span>
                  </div>
                )}
              </>
            ) : (
              <span className="text-gray-400">Choose Your Vibe</span>
            )}
          </div>
          {selectedScene ? (
            <ChevronLeft className="w-5 h-5 text-gray-400" />
          ) : (
            <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
          )}
        </button>

        {/* Dropdown Menu - Scene Selection */}
        {isOpen && !selectedScene && (
          <div className="absolute z-50 w-full mt-2 bg-brand-card border-2 border-gray-700 rounded-xl shadow-xl max-h-96 overflow-y-auto">
            <div className="p-2 space-y-2">
              {BACKGROUND_SCENES.map((scene) => (
                <button
                  key={scene.id}
                  onClick={() => {
                    setSelectedScene(scene.id);
                    setIsOpen(false);
                  }}
                  className="w-full flex items-center gap-3 p-3 bg-brand-bg hover:bg-gray-800 border-2 border-gray-700 hover:border-brand-green rounded-xl transition-all hover:scale-[1.02] group"
                >
                  <div className="flex-1 text-left">
                    <div className="text-white font-semibold text-sm">
                      {scene.name}
                    </div>
                    <div className="text-gray-400 text-xs mt-0.5">
                      {scene.description}
                    </div>
                  </div>
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="w-2 h-2 bg-brand-green rounded-full" />
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Image Grid - When a scene is selected */}
        {selectedScene && currentScene && (
          <div className="mt-4 space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-white">
                  {currentScene.name}
                </h3>
                <p className="text-gray-400 text-sm">{currentScene.description}</p>
              </div>
            </div>

            {/* Loading State */}
            {loading && (
              <div className="flex flex-col items-center justify-center py-16">
                <Loader2 className="w-12 h-12 text-brand-green animate-spin mb-4" />
                <p className="text-gray-400">Loading beautiful images...</p>
              </div>
            )}

            {/* Error State */}
            {error && (
              <div className="bg-red-500/10 border border-red-500/50 rounded-xl p-4 text-center">
                <p className="text-red-400 mb-3">{error}</p>
                <button
                  onClick={handleBackToScenes}
                  className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm font-medium transition-colors"
                >
                  Go Back
                </button>
              </div>
            )}

            {/* Images Grid */}
            {!loading && !error && images.length > 0 && (
              <div className="grid grid-cols-3 gap-3">
                {images.map((image) => (
                  <button
                    key={image.id}
                    onClick={() => handleImageSelect(image.urls.regular)}
                    className={`relative aspect-[9/16] rounded-xl overflow-hidden transition-all duration-200 hover:scale-105 ${
                      selectedImage === image.urls.regular
                        ? "ring-3 ring-brand-green shadow-lg shadow-brand-green/30"
                        : "ring-2 ring-gray-700 hover:ring-brand-green"
                    }`}
                  >
                    <img
                      src={image.urls.small}
                      alt={image.description || "Background image"}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                    {selectedImage === image.urls.regular && (
                      <div className="absolute top-2 right-2 w-4 h-4 bg-brand-green rounded-full flex items-center justify-center">
                        <div className="w-2 h-2 bg-white rounded-full" />
                      </div>
                    )}
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-2">
                      <p className="text-white text-xs truncate">
                        Photo by {image.user.name}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            )}

            {!loading && !error && images.length === 0 && (
              <div className="text-center py-16">
                <ImageIcon className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                <p className="text-gray-400">No images found for this scene.</p>
                <button
                  onClick={handleBackToScenes}
                  className="mt-4 px-4 py-2 bg-brand-bg hover:bg-gray-800 text-white rounded-lg text-sm font-medium transition-colors"
                >
                  Choose Another Scene
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
