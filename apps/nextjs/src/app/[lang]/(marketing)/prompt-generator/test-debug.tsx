"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { Button } from "@saasfly/ui/button";
import { Card, CardContent } from "@saasfly/ui/card";
import { Upload, Sparkles, Copy, Download, RefreshCw, Image as ImageIcon, Bot } from "lucide-react";
import type { Locale } from "~/config/i18n-config";

export default function TestDebugPromptGeneratorPage({
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
  const [copied, setCopied] = useState(false);
  const [debugInfo, setDebugInfo] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const updateDebugInfo = (info: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setDebugInfo(prev => `[${timestamp}] ${info}\n${prev}`);
  };

  const handleImageUpload = (file: File) => {
    updateDebugInfo(`Image uploaded: ${file.name} (${file.size} bytes, ${file.type})`);
    try {
      if (!file || !file.type.startsWith("image/")) {
        updateDebugInfo(`Invalid file type: ${file?.type}`);
        return;
      }

      setSelectedImage(file);
      if (imageUrl) {
        URL.revokeObjectURL(imageUrl);
      }
      const newImageUrl = URL.createObjectURL(file);
      setImageUrl(newImageUrl);
      setGeneratedPrompt("");
      setError(null);
    } catch (error) {
      updateDebugInfo(`Error handling image: ${error}`);
      alert('Error uploading image. Please try again.');
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleImageUpload(file);
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
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleImageUpload(file);
    }
  };

  const generatePrompt = async () => {
    if (!selectedImage) {
      updateDebugInfo("No image selected");
      return;
    }

    updateDebugInfo("Starting prompt generation...");
    setIsGenerating(true);
    setError(null);

    try {
      updateDebugInfo("Creating FormData...");
      const formData = new FormData();
      formData.append('file', selectedImage);
      formData.append('prompt', "请描述一下这个图片并生成适合的提示词");

      updateDebugInfo(`Sending request to /api/ai-prompt?t=${Date.now()}`);
      console.log('FormData created:', {
        fileName: selectedImage.name,
        fileSize: selectedImage.size,
        fileType: selectedImage.type
      });

      const response = await fetch(`/api/ai-prompt?t=${Date.now()}`, {
        method: 'POST',
        body: formData
      });

      updateDebugInfo(`Response status: ${response.status} ${response.statusText}`);
      console.log('API response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        updateDebugInfo(`Error response: ${errorText}`);
        console.error('API error response:', errorText);
        throw new Error(`HTTP error! status: ${response.status}, details: ${errorText}`);
      }

      const data = await response.json();
      updateDebugInfo(`Response data: ${JSON.stringify(data, null, 2)}`);
      console.log('API response data:', data);

      if (data.success) {
        setGeneratedPrompt(data.prompt || "No prompt generated.");
        updateDebugInfo("Success! Prompt generated.");
      } else {
        throw new Error(data.error || data.details || 'Failed to generate prompt with AI');
      }
    } catch (apiError: any) {
      updateDebugInfo(`API Error: ${apiError.message}`);
      console.error('AI error generating prompt:', apiError);
      setError(apiError instanceof Error ? apiError.message : 'Failed to generate prompt');
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = () => {
    if (!generatedPrompt) return;
    navigator.clipboard.writeText(generatedPrompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadPrompt = () => {
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
  };

  const resetAll = () => {
    setSelectedImage(null);
    setGeneratedPrompt("");
    setIsGenerating(false);
    setError(null);
    setDebugInfo("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
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
              <span className="text-foreground font-bold text-xl">Promptify (Debug)</span>
            </Link>
            <Button onClick={resetAll} variant="outline" size="sm">
              Clear All
            </Button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">
              AI Prompt Generator (Debug Version)
            </h1>
            <p className="text-muted-foreground">
              Debug version - Check console and debug info below
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Left: Upload Section */}
            <div className="space-y-6">
              <Card>
                <CardContent className="p-6">
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
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <div className="flex flex-col items-center">
                        <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center mb-4">
                          <Upload className="w-6 h-6 text-muted-foreground" />
                        </div>
                        <p className="text-muted-foreground mb-2">
                          Drop your image here or <span className="text-blue-600 underline">browse</span>
                        </p>
                        <p className="text-sm text-muted-foreground">
                          PNG, JPG, GIF up to 10MB
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
                          src={imageUrl || ""}
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
                      {error && (
                        <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
                          <p className="text-sm text-destructive">{error}</p>
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Right: Result Section */}
            <div className="space-y-6">
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
                          className={`${copied ? "bg-green-500 text-white hover:bg-green-600" : ""}`}
                        >
                          {copied ? "Copied!" : <Copy className="w-4 h-4" />}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={downloadPrompt}
                        >
                          <Download className="w-4 h-4" />
                        </Button>
                      </div>
                    )}
                  </div>

                  {generatedPrompt ? (
                    <div className="h-full flex flex-col">
                      <div className="p-6 bg-muted rounded-lg flex-grow overflow-auto">
                        <p className="text-gray-700 leading-normal">{generatedPrompt}</p>
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

          {/* Debug Info */}
          <Card className="mt-8">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">
                Debug Information
              </h3>
              <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm max-h-64 overflow-y-auto">
                <pre>{debugInfo || "No debug information yet..."}</pre>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}