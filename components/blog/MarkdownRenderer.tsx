/**
 * Markdown Renderer Component with syntax highlighting
 */

'use client';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import rehypeRaw from 'rehype-raw';
import 'highlight.js/styles/github-dark.css';

interface MarkdownRendererProps {
  content: string;
}

export default function MarkdownRenderer({ content }: MarkdownRendererProps) {
  return (
    <div className="prose prose-lg prose-gray max-w-none dark:prose-invert prose-headings:font-bold prose-a:text-blue-600 hover:prose-a:text-blue-700 dark:prose-a:text-blue-400 dark:hover:prose-a:text-blue-300 prose-code:rounded prose-code:bg-gray-100 prose-code:px-1 prose-code:py-0.5 prose-code:text-sm prose-code:font-mono dark:prose-code:bg-gray-800 prose-pre:bg-gray-900 prose-pre:text-gray-100 prose-img:rounded-lg">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight, rehypeRaw]}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
