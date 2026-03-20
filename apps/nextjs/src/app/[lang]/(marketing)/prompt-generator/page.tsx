"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { Button } from "@saasfly/ui/button";
import { Card, CardContent } from "@saasfly/ui/card";
import { Upload, Sparkles, Copy, Download, RefreshCw, Image as ImageIcon, Bot } from "lucide-react";
import type { Locale } from "~/config/i18n-config";

export default function PromptGeneratorPage({
  params: { lang },
}: {
  params: { lang: Locale };
}) {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [generatedPrompt, setGeneratedPrompt] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [errorDetails, setErrorDetails] = useState<any>(null);
  const [copied, setCopied] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
            handleImageUpload(file);
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
  }, []); // Empty dependency array means this runs once on mount

  const handleImageUpload = (file: File) => {
    console.log('Handling image upload:', file.type);
    try {
      if (!file || !file.type.startsWith("image/")) {
        console.log('Invalid file type:', file?.type);
        return;
      }

      // Store the File object for API calls
      setSelectedImage(file);

      // Create a blob URL for display
      if (imageUrl) {
        URL.revokeObjectURL(imageUrl); // Clean up previous URL
      }
      const newImageUrl = URL.createObjectURL(file);
      setImageUrl(newImageUrl);
      setGeneratedPrompt("");
    } catch (error) {
      console.error('Error in handleImageUpload:', error);
      alert('Error uploading image. Please try again.');
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const file = e.target.files?.[0];
      if (file) {
        handleImageUpload(file);
      }
    } catch (error) {
      console.error('Error in handleFileSelect:', error);
      alert('Error selecting file. Please try again.');
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    try {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files?.[0];
      if (file) {
        handleImageUpload(file);
      }
    } catch (error) {
      console.error('Error in handleDrop:', error);
      setIsDragging(false);
      alert('Error dropping file. Please try again.');
    }
  };

  const generatePrompt = async () => {
    try {
      if (!selectedImage) {
        console.log('No image selected');
        return;
      }

      console.log('Starting prompt generation with AI...');
      setIsGenerating(true);
      setError(null);

      try {
        // AI Image to Prompt feature is disabled
        throw new Error('图片转提示词功能正在维护中，请手动输入提示词或稍后再试。');
      } catch (apiError) {
        console.error('AI error generating prompt:', apiError);

        // Show error to user
        const errorMessage = apiError instanceof Error ? apiError.message : '功能维护中';
        setError(errorMessage);
        setGeneratedPrompt('');
      }
    } catch (error) {
      console.error('Error in generatePrompt:', error);
      setError('图片转提示词功能正在维护中，请手动输入提示词。');
    } finally {
      setIsGenerating(false);
    }
  };


  const copyToClipboard = () => {
    try {
      if (!generatedPrompt) {
        return;
      }
      navigator.clipboard.writeText(generatedPrompt);
      setCopied(true);
      // Reset copied state after 2 seconds
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Error copying to clipboard:', error);
    }
  };

  const downloadPrompt = () => {
    try {
      if (!generatedPrompt) {
        alert('No prompt to download');
        return;
      }
      const element = document.createElement("a");
      const file = new Blob([generatedPrompt], { type: "text/plain" });
      element.href = URL.createObjectURL(file);
      element.download = "prompt.txt";
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    } catch (error) {
      console.error('Error downloading prompt:', error);
      alert('Error downloading prompt. Please try again.');
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
            handleImageUpload(file);
          }
          break;
        }
      }
    } catch (error) {
      console.error('Error in handlePaste:', error);
    }
  };

  const resetAll = () => {
    try {
      setSelectedImage(null);
      setGeneratedPrompt("");
      setIsGenerating(false);
      setError(null);
      setErrorDetails(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error) {
      console.error('Error resetting state:', error);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b border-border bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href={`/${lang}`} className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-purple-600 rounded-lg flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="text-foreground font-bold text-xl">Promptify</span>
            </Link>

            <div className="flex items-center space-x-4">
              <Link href={`/${lang}`}>
                <Button variant="ghost" className="text-muted-foreground hover:text-foreground">
                  ← Back to Home
                </Button>
              </Link>
              <Link href={`/${lang}/pricing`}>
                <Button variant="ghost" className="text-muted-foreground hover:text-foreground">
                  Pricing
                </Button>
              </Link>
              <Link href={`/${lang}/libra-ai`}>
                <Button className="bg-gradient-to-r from-blue-400 to-purple-600 hover:from-blue-500 hover:to-purple-700 text-white border-0">
                  Try Libra AI
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">
              AI Prompt Generator
            </h1>
            <p className="text-muted-foreground">
              Transform your images into perfect AI prompts
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 h-full">
            {/* Left: Upload Section */}
            <div className="space-y-6 flex-grow">
              {/* Upload Area */}
              <Card className="h-full">
                <CardContent className="p-6 h-full flex flex-col">
                  <h3 className="text-lg font-semibold text-foreground mb-4">
                    1. Upload your image
                  </h3>

                  {!selectedImage ? (
                    <div
                      className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                        isDragging
                          ? "border-blue-400 bg-blue-50"
                          : "border-gray-300 hover:border-gray-400"
                      }`}
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                      onPaste={handlePaste}
                      onClick={() => fileInputRef.current?.click()}
                      tabIndex={0}
                    >
                      <div className="flex flex-col items-center">
                        <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center mb-4">
                          <Upload className="w-6 h-6 text-muted-foreground" />
                        </div>
                        <p className="text-muted-foreground mb-2">
                          Drop your image here, <span className="text-blue-600 underline">browse</span>, or <span className="text-green-600 underline">paste</span>
                        </p>
                        <p className="text-sm text-muted-foreground">
                          PNG, JPG, GIF up to 10MB
                        </p>
                        <p className="text-xs text-muted-foreground mt-2">
                          💡 Tip: Copy an image and press Ctrl+V to paste
                        </p>
                      </div>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleFileSelect}
                        className="hidden"
                      />
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="relative">
                        <img
                          src={imageUrl}
                          alt="Selected"
                          className="w-full h-64 object-cover rounded-lg"
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          className="absolute top-2 right-2 bg-white/90 hover:bg-white"
                          onClick={resetAll}
                        >
                          <RefreshCw className="w-4 h-4" />
                        </Button>
                      </div>
                      <div className="space-y-3">
                        {/* Generate Prompt Button */}
                        <Button
                          onClick={generatePrompt}
                          disabled={isGenerating}
                          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                        >
                          {isGenerating ? (
                            <>
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                              Calling AI...
                            </>
                          ) : (
                            <>
                              <Bot className="w-4 h-4 mr-2" />
                              Convert Now
                            </>
                          )}
                        </Button>

                        {/* Error Display */}
                        {error && (
                          <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
                            <p className="text-sm text-destructive font-medium mb-2">{error}</p>
                            {errorDetails && (
                              <div className="text-xs text-destructive/80 space-y-1">
                                {errorDetails.message && (
                                  <p>Details: {errorDetails.message}</p>
                                )}
                                {errorDetails.solution && (
                                  <p className="font-medium">{errorDetails.solution}</p>
                                )}
                                {errorDetails.steps && (
                                  <div className="mt-2 space-y-1">
                                    <p className="font-medium">Steps to fix:</p>
                                    <ol className="list-decimal list-inside space-y-1 text-left">
                                      {errorDetails.steps.map((step: string, index: number) => (
                                        <li key={index}>{step}</li>
                                      ))}
                                    </ol>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Examples */}
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-foreground mb-4">
                    Example prompts
                  </h3>
                  <div className="space-y-3">
                    <div className="p-3 bg-muted rounded-lg text-sm text-muted-foreground">
                      "A serene mountain landscape at sunrise with misty valleys and golden light filtering through pine trees."
                    </div>
                    <div className="p-3 bg-muted rounded-lg text-sm text-muted-foreground">
                      "Futuristic robot character with sleek metallic design, blue LED lights, standing in a neon-lit cyberpunk city."
                    </div>
                    <div className="p-3 bg-muted rounded-lg text-sm text-muted-foreground">
                      "Cozy coffee shop interior with warm lighting, wooden tables, bookshelves, and people working on laptops."
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right: Result Section */}
            <div className="space-y-6 flex-grow">
              {/* Generated Prompt - Expanded to full height */}
              <Card className="h-full">
                <CardContent className="p-6 h-full flex flex-col">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-foreground">
                      2. Generated prompt
                    </h3>
                    {generatedPrompt && (
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={copyToClipboard}
                          className={`${copied
                            ? "bg-green-500 text-white hover:bg-green-600 border-green-500 hover:border-green-600"
                            : "text-muted-foreground hover:text-foreground"
                          }`}
                        >
                          {copied ? (
                            <>
                              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                              Copied!
                            </>
                          ) : (
                            <>
                              <Copy className="w-4 h-4 mr-1" />
                              Copy
                            </>
                          )}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={downloadPrompt}
                          className="text-muted-foreground hover:text-foreground"
                        >
                          <Download className="w-4 h-4 mr-1" />
                          Download
                        </Button>
                      </div>
                    )}
                  </div>

                  {generatedPrompt ? (
                    <div className="h-full flex flex-col">
                      {/* Generated Prompt - Unified paragraph style */}
                      <div className="p-6 bg-muted rounded-lg flex-grow overflow-auto">
                        <p className="text-gray-700 leading-normal">
                          {generatedPrompt}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="p-8 bg-muted rounded-lg text-center h-full flex items-center justify-center">
                      <ImageIcon className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                      <p className="text-muted-foreground">
                        Your generated prompt will appear here
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}