/**
 * LinkPreview Component
 * Displays a clickable preview card for URLs
 */

'use client';

import { ExternalLink, Link as LinkIcon } from 'lucide-react';

interface LinkPreviewProps {
  url: string;
}

export default function LinkPreview({ url }: LinkPreviewProps) {
  // Extract domain from URL
  const getDomain = (urlString: string): string => {
    try {
      const urlObj = new URL(urlString);
      return urlObj.hostname.replace('www.', '');
    } catch {
      return urlString;
    }
  };

  // Get favicon URL
  const getFaviconUrl = (urlString: string): string => {
    try {
      const urlObj = new URL(urlString);
      return `https://www.google.com/s2/favicons?domain=${urlObj.hostname}&sz=32`;
    } catch {
      return '';
    }
  };

  const domain = getDomain(url);
  const faviconUrl = getFaviconUrl(url);

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="group my-2 flex items-center gap-3 rounded-lg border border-slate-200 bg-slate-50 p-3 transition-all hover:border-blue-300 hover:bg-blue-50 dark:border-slate-700 dark:bg-slate-800 dark:hover:border-blue-600 dark:hover:bg-slate-700"
    >
      {/* Favicon */}
      <div className="flex-shrink-0">
        {faviconUrl ? (
          <img
            src={faviconUrl}
            alt={domain}
            className="h-8 w-8 rounded"
            onError={(e) => {
              // Fallback to icon if favicon fails to load
              e.currentTarget.style.display = 'none';
              const fallback = e.currentTarget.nextElementSibling as HTMLElement;
              if (fallback) fallback.style.display = 'flex';
            }}
          />
        ) : null}
        <div className="hidden h-8 w-8 items-center justify-center rounded bg-blue-100 dark:bg-blue-900">
          <LinkIcon className="h-4 w-4 text-blue-600 dark:text-blue-400" />
        </div>
      </div>

      {/* URL Info */}
      <div className="flex-1 overflow-hidden">
        <div className="truncate text-sm font-medium text-slate-900 dark:text-slate-100">
          {domain}
        </div>
        <div className="truncate text-xs text-slate-500 dark:text-slate-400">
          {url}
        </div>
      </div>

      {/* External Link Icon */}
      <div className="flex-shrink-0">
        <ExternalLink className="h-4 w-4 text-slate-400 transition-colors group-hover:text-blue-600 dark:group-hover:text-blue-400" />
      </div>
    </a>
  );
}
