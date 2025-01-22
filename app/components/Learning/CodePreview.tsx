import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Button } from '~/components/ui/Button';
import { useState } from 'react';

interface CodePreviewProps {
  code: string;
}

export function CodePreview({ code }: CodePreviewProps) {
  const [isCopied, setIsCopied] = useState(false);

  const copyCode = async () => {
    await navigator.clipboard.writeText(code);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="relative rounded-lg bg-gray-900 p-2 sm:p-4">
      <Button
        size="sm"
        variant="secondary"
        className="absolute right-2 top-2 h-7 px-2 text-xs sm:right-4 sm:top-4 sm:h-8 sm:px-3 sm:text-sm"
        onClick={copyCode}
      >
        {isCopied ? 'Copied!' : 'Copy'}
      </Button>
      <div className="text-sm sm:text-base">
        <SyntaxHighlighter
          language="typescript"
          style={oneDark}
          customStyle={{
            margin: 0,
            padding: 0,
            background: 'transparent',
            fontSize: 'inherit',
          }}
          wrapLines
          wrapLongLines
        >
          {code}
        </SyntaxHighlighter>
      </div>
    </div>
  );
}
