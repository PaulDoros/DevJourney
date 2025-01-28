export interface ErrorDescription {
  title: string;
  description: string;
}

export const errorMessages: Record<number, ErrorDescription> = {
  400: {
    title: 'Bad Request',
    description:
      'The request could not be understood or was missing required parameters.',
  },
  401: {
    title: 'Unauthorized',
    description:
      'Authentication is required. Please log in to access this resource.',
  },
  403: {
    title: 'Forbidden',
    description: "You don't have permission to access this resource.",
  },
  404: {
    title: 'Not Found',
    description:
      "The page or resource you're looking for couldn't be found. It may have been moved or deleted.",
  },
  408: {
    title: 'Request Timeout',
    description:
      'The server timed out waiting for the request. Please try again.',
  },
  429: {
    title: 'Too Many Requests',
    description:
      "You've made too many requests. Please wait a while before trying again.",
  },
  500: {
    title: 'Internal Server Error',
    description:
      "Something went wrong on our servers. We're working to fix this.",
  },
  502: {
    title: 'Bad Gateway',
    description:
      'We received an invalid response from the upstream server. Please try again later.',
  },
  503: {
    title: 'Service Unavailable',
    description:
      "Our service is temporarily unavailable. We're working to restore it.",
  },
  504: {
    title: 'Gateway Timeout',
    description:
      'The upstream server took too long to respond. Please try again later.',
  },
};

export function getErrorMessage(status: number): ErrorDescription {
  return (
    errorMessages[status] || {
      title: `Error ${status}`,
      description: 'An unexpected error occurred. Please try again later.',
    }
  );
}
