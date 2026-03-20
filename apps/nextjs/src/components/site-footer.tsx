import * as React from "react";

import { cn } from "@saasfly/ui";

function getCopyrightText(
  dict: Record<string, string | Record<string, string>>,
) {
  const fixedYear = 2025; // 使用固定年份 2025
  const copyrightTemplate = String(dict.copyright);
  return copyrightTemplate?.replace("${currentYear}", String(fixedYear));
}

export function SiteFooter({
  className,
  params,
  dict,
}: {
  className?: string;
  params: {
    lang: string;
  };

  dict: Record<string, string | Record<string, string>>;
}) {
  const currentLang = params?.lang || 'en';

  return (
    <footer className={cn("border-t bg-background", className)}>
      <div className="container flex flex-col items-center justify-center gap-2 py-8">
        <p className="text-center text-sm leading-loose text-muted-foreground">
          {getCopyrightText(dict)}
        </p>

        {/* Legal Links */}
        <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground">
          <a
            href={`/${currentLang}/privacy`}
            className="hover:text-foreground transition-colors"
          >
            Privacy Policy
          </a>
          <span>|</span>
          <a
            href={`/${currentLang}/terms`}
            className="hover:text-foreground transition-colors"
          >
            Terms of Use
          </a>
        </div>

        <p className="text-center text-xs text-muted-foreground">
          Made with ❤️ for better productivity
        </p>
      </div>
    </footer>
  );
}
