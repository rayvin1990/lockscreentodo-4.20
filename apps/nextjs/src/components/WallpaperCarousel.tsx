'use client';

import { useState, useEffect } from 'react';

const WALLPAPERS = [
  '/wallpapers/demo/lockscreen-1771824310075.png',
  '/wallpapers/demo/lockscreen-1771824567770.png',
  '/wallpapers/demo/lockscreen-1771824679346.png',
  '/wallpapers/demo/lockscreen-1771824832136.png',
  '/wallpapers/demo/lockscreen-1771824994713.png',
  '/wallpapers/demo/lockscreen-1771825872291.png',
  '/wallpapers/demo/lockscreen-1771827052413.png',
  '/wallpapers/demo/lockscreen-1771827272546.png',
];

export default function WallpaperCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      // Fade out
      setIsVisible(false);

      // Change image and fade in after transition completes
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % WALLPAPERS.length);
        setIsVisible(true);
      }, 500); // Wait for fade out to complete
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="absolute inset-0 w-full h-full">
      {/* Preload all images */}
      {WALLPAPERS.map((src, index) => (
        <link key={index} rel="preload" as="image" href={src} />
      ))}

      {/* Current wallpaper with fade transition */}
      <img
        key={currentIndex}
        src={WALLPAPERS[currentIndex]}
        alt={`Wallpaper ${currentIndex + 1}`}
        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${
          isVisible ? 'opacity-100' : 'opacity-0'
        }`}
      />
    </div>
  );
}
