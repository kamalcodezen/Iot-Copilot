'use client';

import CodeBlock from './CodeBlock';

// Renders the plain-text replies the AI returns: fenced code blocks, inline
// code, **bold**, bullet lists, and numbered lists.

function renderInline(text: string) {
  const segments = text.split(/(`[^`]+`)/g);
  return segments.map((segment, i) => {
    if (segment.startsWith('`') && segment.endsWith('`')) {
      return (
        <code key={i} className="px-1 py-0.5 rounded bg-glass text-accent text-xs code-font">
          {segment.slice(1, -1)}
        </code>
      );
    }
    const boldParts = segment.split(/(\*\*[^*]+\*\*)/g);
    return boldParts.map((boldPart, j) => {
      if (boldPart.startsWith('**') && boldPart.endsWith('**')) {
        return (
          <strong key={j} className="font-semibold text-text-primary">
            {boldPart.slice(2, -2)}
          </strong>
        );
      }
      return <span key={j}>{boldPart}</span>;
    });
  });
}

// Renders one paragraph's lines, detecting bullets, numbered items, and
// plain text.
function renderParagraph(text: string) {
  return text.split('\n').map((line, i) => {
    const trimmed = line.trim();
    if (!trimmed) return <div key={i} className="h-1.5" />;
    const bullet = trimmed.match(/^[-*]\s+(.*)/);
    if (bullet) {
      return (
        <div key={i} className="flex gap-2 pl-1">
          <span className="mt-[7px] h-1 w-1 rounded-full bg-accent flex-shrink-0" />
          <span>{renderInline(bullet[1])}</span>
        </div>
      );
    }
    const numbered = trimmed.match(/^\d+[.)]\s+(.*)/);
    if (numbered) {
      return (
        <div key={i} className="flex gap-2 pl-1">
          <span className="mt-[1px] text-accent font-semibold flex-shrink-0">{numbered[0].match(/^\d+[.)]/)?.[0]}</span>
          <span>{renderInline(numbered[1])}</span>
        </div>
      );
    }
    return <p key={i}>{renderInline(trimmed)}</p>;
  });
}

export default function MarkdownText({ content }: { content: string }) {
  const parts = content.split(/(```[\s\S]*?```)/g);
  return (
    <>
      {parts.map((part, i) => {
        if (part.startsWith('```')) {
          const match = part.match(/```(\w*)\n([\s\S]*?)```/);
          if (match) {
            return <CodeBlock key={i} code={match[2].trim()} language={match[1] || 'text'} />;
          }
        }
        return (
          <div key={i} className="space-y-1.5">
            {renderParagraph(part)}
          </div>
        );
      })}
    </>
  );
}
