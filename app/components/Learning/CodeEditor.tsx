import { useState } from 'react';
import { Highlight } from 'prism-react-renderer';
import { Button } from '~/components/ui/Button';
import { useFetcher } from '@remix-run/react';
import { cn } from '~/lib/utils';

interface CodeEditorProps {
  initialCode: string;
  componentId: string;
  onSuccess: () => void;
}

interface ValidateCodeResponse {
  success?: boolean;
  error?: string;
  message?: string;
}

export function CodeEditor({
  initialCode,
  componentId,
  onSuccess,
}: CodeEditorProps) {
  const [code, setCode] = useState(initialCode);
  const [isEditing, setIsEditing] = useState(false);
  const fetcher = useFetcher<ValidateCodeResponse>();

  const handleRunCode = () => {
    fetcher.submit(
      { code, componentId },
      { method: 'POST', action: '/api/validate-code' },
    );
  };

  // Call onSuccess only when code is validated successfully
  if (fetcher.data?.success && !fetcher.state === 'submitting') {
    onSuccess();
  }

  const feedbackMessage = fetcher.data?.error || fetcher.data?.message;
  const isSuccess = fetcher.data?.success;

  return (
    <div className="space-y-4 rounded-lg border border-gray-200 p-4 dark:border-gray-700">
      <div className="relative">
        {isEditing ? (
          <div className="space-y-2">
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="h-[300px] w-full rounded-md border border-gray-300 bg-white p-4 font-mono text-sm dark:border-gray-600 dark:bg-gray-800"
              spellCheck={false}
            />
            <p className="text-xs text-light-text/70 dark:text-dark-text/70">
              Try modifying the code and click "Run Code" to test your changes
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Highlight code={code} language="tsx">
              {({ className, style, tokens, getLineProps, getTokenProps }) => (
                <pre
                  className={cn(
                    className,
                    'min-w-[400px] p-4', // Prevent code from getting too squished
                    'scrollbar-thin scrollbar-track-transparent scrollbar-thumb-gray-400/20 hover:scrollbar-thumb-gray-400/40', // Nice scrollbar
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
        )}
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex gap-2">
          <Button onClick={() => setIsEditing(!isEditing)} variant="secondary">
            {isEditing ? 'Preview' : 'Edit Code'}
          </Button>
          <Button
            onClick={handleRunCode}
            disabled={fetcher.state === 'submitting'}
          >
            {fetcher.state === 'submitting' ? 'Running...' : 'Run Code'}
          </Button>
        </div>

        {feedbackMessage && (
          <div
            className={cn(
              'rounded-md px-4 py-2 text-sm',
              isSuccess
                ? 'bg-green-500/10 text-green-600 dark:bg-green-500/20 dark:text-green-400'
                : 'bg-red-500/10 text-red-600 dark:bg-red-500/20 dark:text-red-400',
            )}
          >
            {feedbackMessage}
          </div>
        )}
      </div>
    </div>
  );
}
