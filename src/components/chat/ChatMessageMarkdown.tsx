'use client';

import * as React from 'react';
import Link from 'next/link';

interface ChatMessageMarkdownProps {
  content: string;
}

export function ChatMessageMarkdown({ content }: ChatMessageMarkdownProps) {
  if (!content) return null;

  // Split into paragraphs / lines
  const lines = content.split('\n');

  const renderInline = (text: string) => {
    // Regex matches:
    // 1. [text](url)
    // 2. **bold**
    // 3. *italic*
    // 4. `code`
    const regex = /(\[[^\]]+\]\([^)]+\)|\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`)/g;
    const parts = text.split(regex);

    return parts.map((part, index) => {
      if (!part) return null;

      // Link match
      if (part.startsWith('[') && part.includes('](') && part.endsWith(')')) {
        const match = part.match(/\[([^\]]+)\]\(([^)]+)\)/);
        if (match) {
          const [, linkText, href] = match;
          const isExternal = href.startsWith('http');
          if (isExternal) {
            return (
              <a
                key={index}
                href={href}
                target="_blank"
                rel="noreferrer"
                className="text-[#C5A059] underline underline-offset-2 hover:text-[#E5C378] font-medium"
              >
                {linkText}
              </a>
            );
          }
          return (
            <Link
              key={index}
              href={href}
              className="text-[#C5A059] underline underline-offset-2 hover:text-[#E5C378] font-medium"
            >
              {linkText}
            </Link>
          );
        }
      }

      // Bold match **text**
      if (part.startsWith('**') && part.endsWith('**') && part.length >= 4) {
        const boldText = part.slice(2, -2);
        return (
          <strong key={index} className="font-semibold text-[#FAF7F2] tracking-wide">
            {boldText}
          </strong>
        );
      }

      // Italic match *text*
      if (part.startsWith('*') && part.endsWith('*') && part.length >= 2) {
        const italicText = part.slice(1, -1);
        return (
          <em key={index} className="italic text-[#E5C378]">
            {italicText}
          </em>
        );
      }

      // Inline code / badge `text`
      if (part.startsWith('`') && part.endsWith('`') && part.length >= 2) {
        const codeText = part.slice(1, -1);
        return (
          <code
            key={index}
            className="px-1.5 py-0.5 rounded bg-[#071326] border border-[#162B4C] text-[#E5C378] text-[11px] font-mono"
          >
            {codeText}
          </code>
        );
      }

      return <React.Fragment key={index}>{part}</React.Fragment>;
    });
  };

  return (
    <div className="space-y-1.5 leading-relaxed text-xs">
      {lines.map((line, idx) => {
        const trimmed = line.trim();

        // Empty line
        if (!trimmed) {
          return <div key={idx} className="h-1" />;
        }

        // Bullet point (* or -)
        if (trimmed.startsWith('* ') || trimmed.startsWith('- ')) {
          const itemText = trimmed.replace(/^(\*|-)\s+/, '');
          return (
            <div key={idx} className="flex items-start gap-2 pl-1 my-0.5">
              <span className="text-[#C5A059] text-[10px] leading-tight mt-0.5 shrink-0">•</span>
              <div className="flex-1">{renderInline(itemText)}</div>
            </div>
          );
        }

        // Numbered list (1. 2. etc.)
        const numMatch = trimmed.match(/^(\d+)\.\s+(.*)$/);
        if (numMatch) {
          const [, num, numText] = numMatch;
          return (
            <div key={idx} className="flex items-start gap-2 pl-1 my-0.5">
              <span className="text-[#C5A059] text-[11px] font-semibold shrink-0">{num}.</span>
              <div className="flex-1">{renderInline(numText)}</div>
            </div>
          );
        }

        // Standard paragraph line
        return <p key={idx}>{renderInline(trimmed)}</p>;
      })}
    </div>
  );
}
export default ChatMessageMarkdown;
