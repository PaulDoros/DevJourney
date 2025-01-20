export function DefaultErrorFallback() {
  return (
    <html lang="en" className="h-full">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <title>Loading...</title>
      </head>
      <body className="h-full">
        <div className="flex min-h-screen flex-col items-center justify-center bg-light-secondary">
          <div className="flex w-full max-w-2xl flex-col items-center justify-center rounded-lg bg-light-primary p-8 shadow-lg">
            <h1 className="mb-4 text-4xl font-bold text-light-accent">
              Loading...
            </h1>
          </div>
        </div>
      </body>
    </html>
  );
}
