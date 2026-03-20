"use client";

import { useState, useEffect } from "react";
import { Button } from "@saasfly/ui/button";
import { env } from "~/env.mjs";

export function SaaSStartLanding() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);

  // Add global paste event listener
  useEffect(() => {
    const handleGlobalPaste = (e: ClipboardEvent) => {
      // Only handle paste if no input/textarea is focused
      const activeElement = document.activeElement;
      if (activeElement && (activeElement.tagName === 'INPUT' || activeElement.tagName === 'TEXTAREA')) {
        return;
      }

      const items = e.clipboardData?.items;
      if (!items) return;

      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        if (item.type.indexOf('image') !== -1) {
          e.preventDefault();
          const file = item.getAsFile();
          if (file) {
            setSelectedImage(file);
            setPrompt("");
          }
          break;
        }
      }
    };

    // Add event listener
    document.addEventListener('paste', handleGlobalPaste);

    // Cleanup
    return () => {
      document.removeEventListener('paste', handleGlobalPaste);
    };
  }, []);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      // 清空之前的prompt，准备新的转换
      setPrompt("");
    }
  };

  const handleGetStarted = () => {
    // Trigger file selection
    const fileInput = document.getElementById('get-started-upload') as HTMLInputElement;
    if (fileInput) {
      fileInput.click();
    }
  };

  const generatePrompt = async (file: File) => {
    setIsGenerating(true);

    try {
      console.log('Processing image:', file.name);

      // AI Image to Prompt feature is disabled
      setPrompt(`⚠️ 功能暂时不可用

抱歉，图片转提示词功能正在维护中。

📸 图片已选择: ${file.name}
📏 文件大小: ${(file.size / 1024).toFixed(2)} KB

💡 您可以：
• 手动输入您想要的绘画提示词
• 尝试描述图片中的内容
• 使用预设模板创建锁屏壁纸

✨ 感谢您的理解！`);
      setIsGenerating(false);
      return;
    } catch (error) {
      console.error('Error in image processing:', error);
      setPrompt("❌ 处理错误: " + (error as Error).message);
      setIsGenerating(false);
    }
  };


  const handlePaste = async (e: React.ClipboardEvent) => {
    try {
      const items = e.clipboardData?.items;
      if (!items) return;

      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        if (item.type.indexOf('image') !== -1) {
          e.preventDefault();
          const file = item.getAsFile();
          if (file) {
            setSelectedImage(file);
            setPrompt("");
          }
          break;
        }
      }
    } catch (error) {
      console.error('Error in handlePaste:', error);
    }
  };

  const clearImage = () => {
    setSelectedImage(null);
    setPrompt("");
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Navigation Header */}
      <header className="flex items-center justify-between px-8 py-6 border-b border-border">
        {/* Logo */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-xl">🎨</span>
          </div>
          <span className="text-2xl font-medium">Image to Prompt</span>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          <a href="#" className="text-foreground/80 hover:text-foreground transition-colors">Features</a>
          <a href="#" className="text-foreground/80 hover:text-foreground transition-colors">Examples</a>
          <a href="#" className="text-foreground/80 hover:text-foreground transition-colors">Pricing</a>
          <a href="#" className="text-foreground/80 hover:text-foreground transition-colors">Docs</a>
        </nav>

        {/* Right side buttons */}
        <div className="flex items-center space-x-4">
          <Button variant="ghost" className="hidden md:block">
            Sign In
          </Button>
          <Button onClick={handleGetStarted}>
            Get Started
          </Button>
          {/* Hidden file input for Get Started button */}
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
            id="get-started-upload"
          />

          {/* Mobile menu button */}
          <button
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </header>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden border-b border-border">
          <nav className="flex flex-col space-y-4 px-6 py-4">
            <a href="#" className="text-foreground/80 hover:text-foreground transition-colors">Features</a>
            <a href="#" className="text-foreground/80 hover:text-foreground transition-colors">Examples</a>
            <a href="#" className="text-foreground/80 hover:text-foreground transition-colors">Pricing</a>
            <a href="#" className="text-foreground/80 hover:text-foreground transition-colors">Docs</a>
            <Button variant="ghost" className="justify-start">
              Sign In
            </Button>
          </nav>
        </div>
      )}

      {/* Main Content */}
      <main className="container mx-auto px-4 py-16">
        <div className="max-w-6xl mx-auto">
          {/* Hero Section */}
          <div className="text-center space-y-6 mb-16">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold">
              Image to{" "}
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                Prompt
              </span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Convert images to high-quality text descriptions using AI technology, perfectly compatible with Midjourney, DALL-E, Stable Diffusion and other AI art tools. Make AI art creation more efficient and simpler.
            </p>
          </div>

          {/* Tool Section */}
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* Left Side - Image Upload */}
            <div className="flex flex-col h-full">
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold">Image Upload</h3>
                </div>

                <div className="border-2 border-dashed border-border rounded-lg p-4 text-center hover:border-primary/50 transition-colors min-h-64 flex flex-col justify-center items-center flex-grow"
                     onPaste={handlePaste}
                     tabIndex={0}>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    id="image-upload"
                  />
                  <label
                    htmlFor="image-upload"
                    className="cursor-pointer block space-y-4 w-full h-full flex flex-col justify-center items-center"
                  >
                    {selectedImage ? (
                      <div className="space-y-4 w-full">
                        <div className="relative inline-block">
                          <img
                            src={URL.createObjectURL(selectedImage)}
                            alt="Uploaded"
                            className="max-h-48 mx-auto rounded-lg shadow-lg"
                          />
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              clearImage();
                            }}
                            className="absolute top-2 right-2 w-8 h-8 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center transition-colors shadow-lg"
                            aria-label="Delete image"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Click to change image
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                          <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                          </svg>
                        </div>
                        <div>
                          <p className="text-lg font-medium">Upload or Paste Image</p>
                          <p className="text-sm text-muted-foreground">Click, drag & drop, or paste (Ctrl+V)</p>
                          <p className="text-xs text-muted-foreground mt-2">💡 Tip: Copy an image and press Ctrl+V to paste</p>
                          <p className="text-sm text-muted-foreground">Supports JPG, PNG, WEBP formats, up to 10MB</p>
                        </div>
                      </div>
                    )}
                  </label>
                </div>

                <Button
                  className="w-full"
                  onClick={() => selectedImage && generatePrompt(selectedImage)}
                  disabled={!selectedImage || isGenerating}
                >
                  {isGenerating ? "Generating..." : "Convert Now"}
                </Button>
              </div>
            </div>

            {/* Right Side - Prompt Output */}
            <div className="flex flex-col h-full">
              <div className="space-y-4 flex flex-col h-full">
                <div>
                  <h3 className="text-lg font-semibold">Generated Prompt</h3>
                </div>

                <div className="min-h-64 bg-muted rounded-lg border-2 border-dashed border-border p-4 flex items-center justify-center flex-grow">
                  {isGenerating ? (
                    <div className="text-center space-y-2">
                      <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
                      <p className="text-sm text-muted-foreground">Generating Prompt...</p>
                    </div>
                  ) : prompt ? (
                    <div className="w-full h-full overflow-auto">
                      <div className="whitespace-pre-wrap text-sm leading-relaxed break-words">
                        {prompt}
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground text-center">
                      Upload an image and AI will automatically generate detailed prompt descriptions
                    </p>
                  )}
                </div>

                <Button
                  className={`w-full ${copied
                    ? "bg-green-500 hover:bg-green-600 text-white border-green-500 hover:border-green-600"
                    : ""
                  }`}
                  onClick={() => {
                    if (prompt) {
                      navigator.clipboard.writeText(prompt);
                      setCopied(true);
                      setTimeout(() => setCopied(false), 2000);
                    }
                  }}
                  disabled={!prompt}
                >
                  {copied ? (
                    <>
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Copied!
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                      Copy the text
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>

              </div>
      </main>
    </div>
  );
}