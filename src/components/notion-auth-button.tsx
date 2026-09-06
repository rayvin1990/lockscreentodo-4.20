"use client";

import React from "react";
import { Button } from "~/components/ui/button";
import { useToast } from "~/components/ui/use-toast";
import { trackEvent } from "~/lib/analytics";
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
    trackEvent("notion_connect_click", { connected: isConnected });

    try {
      const state = Math.random().toString(36).substring(2, 15) +
                   Math.random().toString(36).substring(2, 15);

      sessionStorage.setItem('notion_oauth_state', state);

      const notionClientId = process.env.NEXT_PUBLIC_NOTION_CLIENT_ID;
      if (!notionClientId) {
        trackEvent("notion_connect_config_missing");
        throw new Error('Notion Client ID not configured');
      }

      // Pin the redirect URI to a fixed, public env value instead of deriving it
      // from window.location.origin. Notion requires it to match the URI
      // registered in the integration's settings *exactly* (scheme + host +
      // path), so letting it drift with www/apex redirects breaks OAuth. The
      // window.location.origin fallback only applies to local dev where the env
      // var is unset.
      const redirectUri = process.env.NEXT_PUBLIC_NOTION_REDIRECT_URI ||
        (window.location.origin + '/api/notion/auth/callback');
      const oauthUrl = `https://api.notion.com/v1/oauth/authorize?` +
        `client_id=${notionClientId}&` +
        `response_type=code&` +
        `owner=user&` +
        `redirect_uri=${encodeURIComponent(redirectUri)}&` +
        `state=${state}`;

      window.location.href = oauthUrl;
    } catch (error) {
      console.error("Notion auth error:", error);
      trackEvent("notion_connect_failure", {
        reason: error instanceof Error ? error.message : "unknown",
      });
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
        <div className="space-y-1.5">
          <p className="text-xs text-gray-500 text-center leading-relaxed">
            Read-only access to tasks only. Your privacy is protected.
          </p>
          <div className="rounded-lg bg-white/[0.03] border border-white/[0.06] px-3 py-2">
            <p className="text-[11px] text-gray-400 leading-relaxed">
              <span className="text-gray-300 font-medium">On the Notion page that opens next:</span>{" "}
              click <span className="text-gray-200 font-medium">&quot;Select pages&quot;</span>, then
              tick the page or database that holds your to-do list (e.g. &quot;Tasks&quot;,
              &quot;To-do&quot;). You don&apos;t need to share anything else.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
