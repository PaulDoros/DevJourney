const DEBUG = process.env.VERCEL_DEBUG === 'true';

export function debugLog(message: string, data?: any) {
  console.log(`[DEBUG] ${message}`, data);
}

export function errorLog(error: unknown, context: string) {
  console.error(`[ERROR] ${context}:`, error);
  if (error instanceof Error) {
    console.error('Stack:', error.stack);
  }
}
