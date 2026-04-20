"use client";

import React from "react";
import { Button } from "~/components/ui/button";
import { useToast } from "~/components/ui/use-toast";
import { Loader2, Link as LinkIcon } from "lucide-react";

interface NotionAuthButtonProps {
  isConnected?: boolean;
  onConnected?: () => void;
}

export function NotionAuthButton({
  isConnected = false,
  onConnected,
}: NotionAuthButtonProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = React.useState(false);

  const handleConnect = async () => {
    setIsLoading(true);

    try {
      const state = Math.random().toString(36).substring(2, 15) +
                   Math.random().toString(36).substring(2, 15);

      sessionStorage.setItem('notion_oauth_state', state);

      const notionClientId = process.env.NEXT_PUBLIC_NOTION_CLIENT_ID;
      if (!notionClientId) {
        throw new Error('Notion Client ID not configured');
      }

      const redirectUri = window.location.origin + '/api/notion/auth/callback';
      const oauthUrl = `https://api.notion.com/v1/oauth/authorize?` +
        `client_id=${notionClientId}&` +
        `response_type=code&` +
        `owner=user&` +
        `redirect_uri=${encodeURIComponent(redirectUri)}&` +
        `state=${state}`;

      window.location.href = oauthUrl;
    } catch (error) {
      console.error("Notion auth error:", error);
      toast({
        variant: "destructive",
        title: "Connection failed",
        description: "Unable to connect to Notion. Please try again later.",
      });
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-2">
      <Button
        onClick={handleConnect}
        disabled={isLoading || isConnected}
        className={`w-full font-semibold transition-all ${
          isConnected
            ? "bg-green-600 hover:bg-green-700 text-white"
            : "bg-black hover:bg-gray-800 text-white dark:bg-white dark:text-black dark:hover:bg-gray-200"
        }`}
      >
        {isLoading ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Connecting...
          </>
        ) : isConnected ? (
          <>
            <LinkIcon className="w-4 h-4 mr-2" />
            Connected to Notion
          </>
        ) : (
          <>
            <LinkIcon className="w-4 h-4 mr-2" />
            Connect Notion
          </>
        )}
      </Button>
      {!isConnected && !isLoading && (
        <p className="text-xs text-gray-500 text-center leading-relaxed">
          Read-only access to tasks only. Your privacy is protected.
        </p>
      )}
    </div>
  );
}