import { QueryClient } from '@tanstack/react-query';

// Create a single QueryClient instance for the entire application
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false, // Prevent automatic refetch when clicking away and back
      retry: false, // Disable retries on failure to keep behavior clean and predictable
      staleTime: 5 * 60 * 1000, // Data remains fresh for 5 minutes
    },
  },
});

export default queryClient;
