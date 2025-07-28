# API e Integração - Guia Completo

## 📋 Índice
- [Visão Geral da API](#visão-geral-da-api)
- [Autenticação](#autenticação)
- [Endpoints](#endpoints)
- [Tipos de Dados](#tipos-de-dados)
- [Hooks de Integração](#hooks-de-integração)
- [Tratamento de Erros](#tratamento-de-erros)
- [Cache e Performance](#cache-e-performance)

## 🌐 Visão Geral da API

O PoupeAI Mobile integra com uma API REST desenvolvida em Python/Django, usando autenticação OAuth2 via Keycloak. A comunicação é feita através de uma camada de serviços que abstrai as chamadas HTTP e gerencia o estado com React Query.

### Configuração Base

```typescript
// src/services/api.ts
export class ApiService {
  private baseURL = process.env.EXPO_PUBLIC_API_BASE_URL;
  private timeout = 10000;
  
  constructor() {
    this.setupInterceptors();
  }
  
  private setupInterceptors() {
    // Request interceptor - adiciona token automaticamente
    this.instance.interceptors.request.use(async (config) => {
      const tokens = await AsyncStorage.getItem(storageKeys.tokens);
      if (tokens) {
        const { access_token } = JSON.parse(tokens);
        config.headers.Authorization = `Bearer ${access_token}`;
      }
      return config;
    });
    
    // Response interceptor - trata erros globais
    this.instance.interceptors.response.use(
      (response) => response,
      async (error) => {
        if (error.response?.status === 401) {
          // Token expirado - tenta refresh
          await this.handleTokenRefresh();
        }
        return Promise.reject(error);
      }
    );
  }
}
```

## 🔐 Autenticação

### OAuth2 + PKCE Flow

O aplicativo utiliza o fluxo OAuth2 com PKCE (Proof Key for Code Exchange) para máxima segurança:

```typescript
// src/contexts/AuthContext.tsx
export function AuthProvider({ children }: AuthProviderProps) {
  const [request, response, promptAsync] = useAuthRequest(
    {
      clientId: keycloakConfig.clientId,
      scopes: ['openid', 'profile', 'email'],
      redirectUri: makeRedirectUri({
        scheme: keycloakConfig.appScheme,
      }),
      responseType: ResponseType.Code,
      usePKCE: true, // Ativa PKCE para segurança adicional
    },
    discoveryEndpoints
  );

  const handleAuthResponse = useCallback(async (code: string) => {
    const tokenResponse = await fetch(discoveryEndpoints.tokenEndpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        client_id: keycloakConfig.clientId,
        code: code,
        redirect_uri: redirectUri,
        code_verifier: request.codeVerifier, // PKCE verification
      }),
    });
    
    const tokens = await tokenResponse.json();
    await this.storeTokens(tokens);
  }, []);
}
```

### Configuração Keycloak

```typescript
// src/config/auth.ts
export const keycloakConfig = {
  realm: process.env.EXPO_PUBLIC_KEYCLOAK_REALM!,
  clientId: process.env.EXPO_PUBLIC_KEYCLOAK_CLIENT_ID!,
  serverUrl: process.env.EXPO_PUBLIC_KEYCLOAK_SERVER_URL!,
  appScheme: process.env.EXPO_PUBLIC_APP_SCHEME!,
};

export const discoveryEndpoints = {
  issuer: `${keycloakConfig.serverUrl}/realms/${keycloakConfig.realm}`,
  authorizationEndpoint: `${keycloakConfig.serverUrl}/realms/${keycloakConfig.realm}/protocol/openid-connect/auth`,
  tokenEndpoint: `${keycloakConfig.serverUrl}/realms/${keycloakConfig.realm}/protocol/openid-connect/token`,
  userInfoEndpoint: `${keycloakConfig.serverUrl}/realms/${keycloakConfig.realm}/protocol/openid-connect/userinfo`,
};
```

### Gerenciamento de Tokens

```typescript
export class TokenManager {
  private static readonly STORAGE_KEY = '@poupeai:tokens';
  
  static async storeTokens(tokens: TokenData): Promise<void> {
    const tokenWithExpiry = {
      ...tokens,
      expiresAt: new Date(Date.now() + tokens.expires_in * 1000).toISOString(),
    };
    
    await AsyncStorage.setItem(this.STORAGE_KEY, JSON.stringify(tokenWithExpiry));
  }
  
  static async getValidToken(): Promise<string | null> {
    const stored = await AsyncStorage.getItem(this.STORAGE_KEY);
    if (!stored) return null;
    
    const tokens = JSON.parse(stored);
    
    // Verifica se o token está próximo de expirar (2 minutos de margem)
    const expiresAt = new Date(tokens.expiresAt);
    const now = new Date();
    const twoMinutesFromNow = new Date(now.getTime() + 2 * 60 * 1000);
    
    if (expiresAt <= twoMinutesFromNow) {
      // Token expirando - tenta refresh
      return await this.refreshToken(tokens.refresh_token);
    }
    
    return tokens.access_token;
  }
  
  private static async refreshToken(refreshToken: string): Promise<string> {
    const response = await fetch(discoveryEndpoints.tokenEndpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        grant_type: 'refresh_token',
        client_id: keycloakConfig.clientId,
        refresh_token: refreshToken,
      }),
    });
    
    if (!response.ok) {
      await this.clearTokens();
      throw new Error('Token refresh failed');
    }
    
    const newTokens = await response.json();
    await this.storeTokens(newTokens);
    return newTokens.access_token;
  }
}
```

## 🔗 Endpoints

### Orçamentos (Budgets)

#### Listar Orçamentos
```http
GET /api/budgets/
Authorization: Bearer {token}
```

**Query Parameters:**
- `category`: ID da categoria (opcional)
- `search`: Busca por nome (opcional)
- `page`: Número da página (padrão: 1)
- `page_size`: Itens por página (padrão: 20)

**Response:**
```json
{
  "count": 150,
  "next": "https://api.poupeai.com/api/budgets/?page=2",
  "previous": null,
  "results": [
    {
      "id": 1,
      "name": "Supermercado",
      "category": 5,
      "amount": "500.00",
      "actual_amount": 320.50,
      "profile": "user123",
      "created_at": "2025-07-01T10:00:00Z",
      "updated_at": "2025-07-15T14:30:00Z"
    }
  ]
}
```

#### Criar Orçamento
```http
POST /api/budgets/
Content-Type: application/json
Authorization: Bearer {token}

{
  "name": "Alimentação",
  "category": 5,
  "amount": "600.00"
}
```

#### Atualizar Orçamento
```http
PUT /api/budgets/{id}/
Content-Type: application/json
Authorization: Bearer {token}

{
  "name": "Alimentação Atualizada",
  "category": 5,
  "amount": "650.00"
}
```

#### Excluir Orçamento
```http
DELETE /api/budgets/{id}/
Authorization: Bearer {token}
```

### Categorias (Categories)

#### Listar Categorias
```http
GET /api/categories/
Authorization: Bearer {token}
```

**Query Parameters:**
- `type`: 'income' | 'expense' (opcional)
- `search`: Busca por nome (opcional)

**Response:**
```json
{
  "results": [
    {
      "id": "cat123",
      "name": "Alimentação",
      "color_hex": "#FF9800",
      "type": "expense",
      "profile": "user123",
      "created_at": "2025-07-01T10:00:00Z",
      "updated_at": "2025-07-01T10:00:00Z"
    }
  ]
}
```

#### Criar Categoria
```http
POST /api/categories/
Content-Type: application/json
Authorization: Bearer {token}

{
  "name": "Nova Categoria",
  "color_hex": "#4CAF50",
  "type": "income"
}
```

### Transações (Transactions)

#### Listar Transações
```http
GET /api/transactions/
Authorization: Bearer {token}
```

**Query Parameters:**
- `category`: ID da categoria
- `type`: 'income' | 'expense'
- `date_from`: Data inicial (YYYY-MM-DD)
- `date_to`: Data final (YYYY-MM-DD)
- `search`: Busca por descrição

### Contas (Accounts)

#### Listar Contas
```http
GET /api/accounts/
Authorization: Bearer {token}
```

#### Obter Saldo Consolidado
```http
GET /api/accounts/balance/
Authorization: Bearer {token}
```

**Response:**
```json
{
  "total_balance": 5420.75,
  "income_total": 8500.00,
  "expense_total": 3079.25,
  "accounts": [
    {
      "id": 1,
      "name": "Conta Corrente",
      "balance": 2500.00,
      "type": "checking"
    }
  ]
}
```

## 📊 Tipos de Dados

### Interfaces TypeScript

```typescript
// src/types/budgets.ts
export interface Budget {
  id: number;
  category: number;
  profile: string;
  name: string;
  amount: string;           // Decimal como string
  actual_amount: number;    // Valor atual gasto
  created_at: string;
  updated_at: string;
}

export interface BudgetsResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Budget[];
}

export interface CreateBudgetRequest {
  category: number;
  name: string;
  amount: string;
}

export interface BudgetProgress {
  percentage: number;
  status: 'safe' | 'warning' | 'danger';
  remaining: number;
}
```

```typescript
// src/types/categories.ts
export type CategoryType = 'income' | 'expense';

export interface Category {
  id: string;
  name: string;
  color_hex: string;
  type: CategoryType;
  profile: string;
  created_at: string;
  updated_at: string;
}

export interface CreateCategoryRequest {
  name: string;
  color_hex: string;
  type: CategoryType;
}
```

```typescript
// src/types/transactions.ts
export interface Transaction {
  id: string;
  title: string;
  category: {
    id: string;
    name: string;
    color: string;
  };
  amount: number;           // Positivo para receita, negativo para despesa
  date: string;             // YYYY-MM-DD
  type: 'income' | 'expense';
  description?: string;
  account?: string;
}

export interface TransactionSection {
  title: string;            // "Hoje", "Ontem", "Julho 2025"
  date: string;             // Data para ordenação
  data: Transaction[];
}
```

## 🎣 Hooks de Integração

### Orçamentos

```typescript
// src/hooks/useBudgets.ts
export const budgetsKeys = {
  all: ['budgets'] as const,
  lists: () => [...budgetsKeys.all, 'list'] as const,
  list: (filters: BudgetFilters) => [...budgetsKeys.lists(), { filters }] as const,
  details: () => [...budgetsKeys.all, 'detail'] as const,
  detail: (id: number) => [...budgetsKeys.details(), id] as const,
};

export function useBudgets(params?: BudgetParams) {
  return useQuery({
    queryKey: budgetsKeys.list(params || {}),
    queryFn: () => budgetsService.getBudgets(params),
    staleTime: 5 * 60 * 1000, // 5 minutos
    gcTime: 10 * 60 * 1000,   // 10 minutos
  });
}

export function useCreateBudget() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: budgetsService.createBudget,
    onSuccess: () => {
      // Invalida cache das listas
      queryClient.invalidateQueries({ queryKey: budgetsKeys.lists() });
    },
    onError: (error) => {
      console.error('Erro ao criar orçamento:', error);
    },
  });
}

export function useUpdateBudget() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateBudgetRequest }) =>
      budgetsService.updateBudget(id, data),
    onSuccess: (updatedBudget) => {
      // Atualiza cache específico
      queryClient.setQueryData(
        budgetsKeys.detail(updatedBudget.id),
        updatedBudget
      );
      
      // Invalida listas para re-fetch
      queryClient.invalidateQueries({ queryKey: budgetsKeys.lists() });
    },
  });
}

export function useDeleteBudget() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: budgetsService.deleteBudget,
    onSuccess: (_, deletedId) => {
      // Remove do cache
      queryClient.removeQueries({ queryKey: budgetsKeys.detail(deletedId) });
      
      // Atualiza listas
      queryClient.invalidateQueries({ queryKey: budgetsKeys.lists() });
    },
  });
}
```

### Categorias

```typescript
// src/hooks/useCategories.ts
export const categoriesKeys = {
  all: ['categories'] as const,
  lists: () => [...categoriesKeys.all, 'list'] as const,
  list: (filters: CategoryFilters) => [...categoriesKeys.lists(), { filters }] as const,
};

export function useCategories(params?: CategoryParams) {
  return useQuery({
    queryKey: categoriesKeys.list(params || {}),
    queryFn: () => categoriesService.getCategories(params),
    staleTime: 10 * 60 * 1000, // Cache por 10 minutos (categorias mudam pouco)
  });
}

export function useIncome Categories() {
  return useCategories({ type: 'income' });
}

export function useExpenseCategories() {
  return useCategories({ type: 'expense' });
}

export function useCreateCategory() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: categoriesService.createCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: categoriesKeys.lists() });
    },
  });
}
```

### Transações

```typescript
// src/hooks/useTransactions.ts
export function useTransactions(params?: TransactionParams) {
  return useInfiniteQuery({
    queryKey: ['transactions', params],
    queryFn: ({ pageParam = 1 }) =>
      transactionsService.getTransactions({ ...params, page: pageParam }),
    getNextPageParam: (lastPage) => {
      return lastPage.next ? lastPage.page + 1 : undefined;
    },
    staleTime: 2 * 60 * 1000, // 2 minutos (dados mais dinâmicos)
  });
}

export function useTransactionsGrouped(params?: TransactionParams) {
  const { data, ...rest } = useTransactions(params);
  
  const groupedTransactions = useMemo(() => {
    if (!data) return [];
    
    const allTransactions = data.pages.flatMap(page => page.results);
    return groupTransactionsByDate(allTransactions);
  }, [data]);
  
  return { data: groupedTransactions, ...rest };
}
```

## 🚨 Tratamento de Erros

### Classe de Erro Customizada

```typescript
// src/services/errors.ts
export class ApiError extends Error {
  constructor(
    public status: number,
    public message: string,
    public code?: string,
    public details?: any
  ) {
    super(message);
    this.name = 'ApiError';
  }
  
  static fromResponse(response: Response, data?: any): ApiError {
    return new ApiError(
      response.status,
      data?.message || response.statusText,
      data?.code,
      data?.details
    );
  }
}

export const handleApiError = (error: unknown): string => {
  if (error instanceof ApiError) {
    switch (error.status) {
      case 400:
        return error.details?.field_errors 
          ? Object.values(error.details.field_errors).flat().join(', ')
          : 'Dados inválidos. Verifique as informações.';
      
      case 401:
        return 'Sessão expirada. Faça login novamente.';
      
      case 403:
        return 'Você não tem permissão para realizar esta ação.';
      
      case 404:
        return 'Recurso não encontrado.';
      
      case 409:
        return 'Conflito: este registro já existe.';
      
      case 422:
        return 'Dados inválidos. Verifique os campos obrigatórios.';
      
      case 429:
        return 'Muitas tentativas. Aguarde alguns minutos.';
      
      case 500:
        return 'Erro interno do servidor. Tente novamente em alguns minutos.';
      
      case 503:
        return 'Serviço temporariamente indisponível.';
      
      default:
        return error.message || 'Erro desconhecido';
    }
  }
  
  if (error instanceof TypeError) {
    return 'Erro de conexão. Verifique sua internet.';
  }
  
  return 'Erro inesperado. Tente novamente.';
};
```

### Error Boundaries para React Query

```typescript
// src/components/ErrorBoundary.tsx
export const QueryErrorBoundary = ({ children }: { children: React.ReactNode }) => {
  return (
    <QueryErrorResetBoundary>
      {({ reset }) => (
        <ErrorBoundary
          onReset={reset}
          fallbackRender={({ error, resetErrorBoundary }) => (
            <View style={styles.container}>
              <Text style={styles.title}>Algo deu errado</Text>
              <Text style={styles.message}>{handleApiError(error)}</Text>
              <Button title="Tentar novamente" onPress={resetErrorBoundary} />
            </View>
          )}
        >
          {children}
        </ErrorBoundary>
      )}
    </QueryErrorResetBoundary>
  );
};
```

### Hook de Tratamento Global

```typescript
// src/hooks/useErrorHandler.ts
export function useErrorHandler() {
  const showToast = useToast();
  
  const handleError = useCallback((error: unknown) => {
    const message = handleApiError(error);
    showToast({
      type: 'error',
      title: 'Erro',
      message,
    });
    
    // Log para debugging
    if (__DEV__) {
      console.error('API Error:', error);
    }
    
    // Reportar para serviço de monitoramento em produção
    if (!__DEV__ && error instanceof ApiError) {
      crashlytics().recordError(error);
    }
  }, [showToast]);
  
  return { handleError };
}
```

## ⚡ Cache e Performance

### Estratégias de Cache

```typescript
// src/config/reactQuery.ts
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,      // 5 minutos padrão
      gcTime: 10 * 60 * 1000,        // 10 minutos para GC
      retry: (failureCount, error) => {
        const apiError = error as ApiError;
        
        // Não retry erros de client (4xx)
        if (apiError.status >= 400 && apiError.status < 500) {
          return false;
        }
        
        // Retry até 3 vezes para erros de servidor
        return failureCount < 3;
      },
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    },
  },
});

// Cache específico por tipo de dados
export const cacheConfig = {
  // Dados que mudam raramente - cache longo
  categories: {
    staleTime: 30 * 60 * 1000,    // 30 minutos
    gcTime: 60 * 60 * 1000,       // 1 hora
  },
  
  // Dados dinâmicos - cache curto
  transactions: {
    staleTime: 2 * 60 * 1000,     // 2 minutos
    gcTime: 10 * 60 * 1000,       // 10 minutos  
  },
  
  // Dados moderadamente dinâmicos
  budgets: {
    staleTime: 5 * 60 * 1000,     // 5 minutos
    gcTime: 15 * 60 * 1000,       // 15 minutos
  },
};
```

### Prefetching Inteligente

```typescript
// src/hooks/usePrefetch.ts
export function usePrefetch() {
  const queryClient = useQueryClient();
  
  const prefetchDashboardData = useCallback(async () => {
    // Prefetch dados críticos do dashboard
    await Promise.all([
      queryClient.prefetchQuery({
        queryKey: budgetsKeys.lists(),
        queryFn: budgetsService.getBudgets,
        staleTime: cacheConfig.budgets.staleTime,
      }),
      
      queryClient.prefetchQuery({
        queryKey: categoriesKeys.lists(),
        queryFn: categoriesService.getCategories,
        staleTime: cacheConfig.categories.staleTime,
      }),
      
      queryClient.prefetchQuery({
        queryKey: ['transactions', { limit: 5 }],
        queryFn: () => transactionsService.getTransactions({ limit: 5 }),
        staleTime: cacheConfig.transactions.staleTime,
      }),
    ]);
  }, [queryClient]);
  
  const prefetchOnFocus = useCallback(() => {
    // Prefetch quando app ganha foco
    if (AppState.currentState === 'active') {
      prefetchDashboardData();
    }
  }, [prefetchDashboardData]);
  
  useEffect(() => {
    const subscription = AppState.addEventListener('change', prefetchOnFocus);
    return () => subscription?.remove();
  }, [prefetchOnFocus]);
  
  return { prefetchDashboardData };
}
```

### Background Sync

```typescript
// src/hooks/useBackgroundSync.ts
export function useBackgroundSync() {
  const queryClient = useQueryClient();
  
  useEffect(() => {
    const interval = setInterval(() => {
      // Sync em background apenas se app está ativo
      if (AppState.currentState === 'active') {
        queryClient.invalidateQueries({
          queryKey: ['transactions'],
          refetchType: 'inactive', // Não refetch se já está carregando
        });
      }
    }, 5 * 60 * 1000); // 5 minutos
    
    return () => clearInterval(interval);
  }, [queryClient]);
}
```

### Optimistic Updates

```typescript
// src/hooks/useBudgets.ts
export function useCreateBudget() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: budgetsService.createBudget,
    
    // Optimistic update
    onMutate: async (newBudget) => {
      await queryClient.cancelQueries({ queryKey: budgetsKeys.lists() });
      
      const previousBudgets = queryClient.getQueryData(budgetsKeys.lists());
      
      // Adiciona o novo orçamento otimisticamente
      queryClient.setQueryData(budgetsKeys.lists(), (old: any) => ({
        ...old,
        results: [
          {
            ...newBudget,
            id: Date.now(), // ID temporário
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
          ...old.results,
        ],
      }));
      
      return { previousBudgets };
    },
    
    onError: (error, newBudget, context) => {
      // Reverte em caso de erro
      if (context?.previousBudgets) {
        queryClient.setQueryData(budgetsKeys.lists(), context.previousBudgets);
      }
    },
    
    onSettled: () => {
      // Sempre refetch para garantir consistência
      queryClient.invalidateQueries({ queryKey: budgetsKeys.lists() });
    },
  });
}
```

## 📱 Offline Support

### Cache Persistente

```typescript
// src/config/offlineCache.ts
import AsyncStorage from '@react-native-async-storage/async-storage';

const persistConfig = {
  key: 'poupeai-cache',
  storage: AsyncStorage,
  whitelist: ['budgets', 'categories'], // Dados para persistir
};

export const persistQueryClient = async (queryClient: QueryClient) => {
  await persistQueryClientRestore({
    queryClient,
    persister: createAsyncStoragePersister({
      storage: AsyncStorage,
      key: 'REACT_QUERY_OFFLINE_CACHE',
    }),
  });
};
```

### Detecção de Conectividade

```typescript
// src/hooks/useNetworkStatus.ts
import NetInfo from '@react-native-netinfo';

export function useNetworkStatus() {
  const [isOnline, setIsOnline] = useState(true);
  const queryClient = useQueryClient();
  
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      const online = state.isConnected && state.isInternetReachable;
      setIsOnline(online);
      
      if (online) {
        // Quando voltar online, refetch dados críticos
        queryClient.invalidateQueries({
          queryKey: ['transactions'],
          refetchType: 'active',
        });
      }
    });
    
    return unsubscribe;
  }, [queryClient]);
  
  return { isOnline };
}
```

---

*Documentação atualizada em: Julho 2025*
