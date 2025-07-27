import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Configuração do Query Client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Tempo de cache padrão (5 minutos)
      staleTime: 5 * 60 * 1000,
      // Tempo para garbage collection (10 minutos)
      gcTime: 10 * 60 * 1000,
      // Retry em caso de erro
      retry: (failureCount, error: any) => {
        // Não retry em erros 401, 403, 404
        if (error?.status === 401 || error?.status === 403 || error?.status === 404) {
          return false;
        }
        // Retry até 3 vezes para outros erros
        return failureCount < 3;
      },
      // Refetch automático quando a tela ganha foco
      refetchOnWindowFocus: true,
      // Refetch quando reconecta
      refetchOnReconnect: true,
    },
    mutations: {
      // Retry para mutations (mais conservador)
      retry: (failureCount, error: any) => {
        // Não retry em erros 4xx
        if (error?.status >= 400 && error?.status < 500) {
          return false;
        }
        // Retry até 2 vezes para erros 5xx
        return failureCount < 2;
      },
    },
  },
});

interface ReactQueryProviderProps {
  children: React.ReactNode;
}

export function ReactQueryProvider({ children }: ReactQueryProviderProps) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}

export { queryClient };
