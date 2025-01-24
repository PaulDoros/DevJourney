import { useState } from 'react';
import { Highlight } from 'prism-react-renderer';
import { Button } from '~/components/ui/Button';
import { cn } from '~/lib/utils';

interface CodeEditorProps {
  initialCode: string;
  componentId: string;
}

export function CodeEditor({ initialCode, componentId }: CodeEditorProps) {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(initialCode);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy code:', err);
    }
  };

  return (
    <div className="space-y-4 rounded-lg border border-gray-200 p-4 dark:border-gray-700">
      <div className="relative">
        <div className="overflow-x-auto">
          <Highlight code={initialCode} language="tsx">
            {({ className, style, tokens, getLineProps, getTokenProps }) => (
              <pre
                className={cn(
                  className,
                  'min-w-[400px] p-4',
                  'scrollbar-thin scrollbar-track-transparent scrollbar-thumb-gray-400/20 hover:scrollbar-thumb-gray-400/40',
                )}
                style={style}
              >
                {tokens.map((line, i) => (
                  <div
                    key={i}
                    {...getLineProps({ line })}
                    className="whitespace-pre"
                  >
                    {line.map((token, key) => (
                      <span key={key} {...getTokenProps({ token })} />
                    ))}
                  </div>
                ))}
              </pre>
            )}
          </Highlight>
        </div>
      </div>

      <div className="flex justify-end">
        <Button onClick={handleCopy} variant="secondary">
          {isCopied ? 'Copied!' : 'Copy Code'}
        </Button>
      </div>
    </div>
  );
}
