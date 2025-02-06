import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            gcTime: (1000 * 60 * 24 * 24) * 5 // 5 days
        }
    }
});