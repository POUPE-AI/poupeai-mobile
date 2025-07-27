# React Query Setup - PoupeAI Mobile

Esta documentação descreve a implementação do React Query no projeto PoupeAI Mobile para gerenciamento de estado e requisições HTTP.

## 📁 Estrutura de Arquivos

```
src/
├── providers/
│   └── ReactQueryProvider.tsx     # Provider do React Query
├── services/
│   ├── api.ts                     # Configuração base da API com Axios
│   └── categories.ts              # Serviço específico para categorias
└── hooks/
    └── useCategories.ts           # Hooks customizados do React Query
```

## 🔧 Configuração

### 1. Instalação das dependências

```bash
npm install @tanstack/react-query axios
```

### 2. Provider integrado no app

O `ReactQueryProvider` foi adicionado no `app/_layout.tsx`:

```tsx
<SafeAreaProvider>
  <ThemeProvider>
    <ReactQueryProvider>
      <AuthProvider>
        <StatusBar style="light" />
        <Slot />
      </AuthProvider>
    </ReactQueryProvider>
  </ThemeProvider>
</SafeAreaProvider>
```

## 🌐 Serviço de API

### ApiService (`src/services/api.ts`)

Classe que configura o Axios com:
- **Base URL**: `http://localhost:8000`
- **Autenticação automática**: Interceptor que adiciona o Bearer token
- **Tratamento de erros**: Interceptor que padroniza erros da API
- **Timeout**: 10 segundos por requisição

```typescript
import { api } from '@/services/api';

// Uso básico
const response = await api.get('finances/categories');
const data = await api.post('finances/categories', { name: 'Nova Categoria' });
```

### CategoriesService (`src/services/categories.ts`)

Serviço específico para operações com categorias:
- `getCategories()` - Lista categorias com filtros opcionais
- `getCategoryById(id)` - Busca categoria específica
- `createCategory(data)` - Cria nova categoria
- `updateCategory(data)` - Atualiza categoria existente
- `deleteCategory(id)` - Remove categoria
- `getCategoriesByType(type)` - Filtra por tipo (income/expense)

## 🎣 Hooks Customizados

### useCategories

Hooks disponíveis em `src/hooks/useCategories.ts`:

#### Queries (Buscar dados)

```typescript
import { useCategories, useCategory, useCategoriesByType } from '@/hooks/useCategories';

// Buscar todas as categorias
const { data, isLoading, error } = useCategories();

// Buscar com filtros
const { data } = useCategories({ 
  type: 'expense', 
  search: 'mercado',
  page: 1 
});

// Buscar categoria específica
const { data: category } = useCategory('category-id');

// Buscar por tipo (otimizado)
const { data: incomeCategories } = useCategoriesByType('income');

// Shortcuts
const { data: expenses } = useExpenseCategories();
const { data: incomes } = useIncomeCategories();
```

#### Mutations (Modificar dados)

```typescript
import { useCreateCategory, useUpdateCategory, useDeleteCategory } from '@/hooks/useCategories';

// Criar categoria
const createMutation = useCreateCategory();
createMutation.mutate({
  name: 'Supermercado',
  color_hex: '#007AFF',
  type: 'expense'
}, {
  onSuccess: (newCategory) => {
    console.log('Categoria criada:', newCategory);
  },
  onError: (error) => {
    console.error('Erro:', error.message);
  }
});

// Atualizar categoria
const updateMutation = useUpdateCategory();
updateMutation.mutate({
  id: 'category-id',
  name: 'Novo nome'
});

// Deletar categoria
const deleteMutation = useDeleteCategory();
deleteMutation.mutate('category-id');
```

## 🎯 Exemplo de Uso Completo

Veja o componente de exemplo em `src/components/examples/CategoriesListExample.tsx` para implementação completa com:
- Lista de categorias com loading e error states
- Criação de categorias
- Exclusão com confirmação
- Tratamento de diferentes tipos de resposta da API

### Uso no componente:

```tsx
import React from 'react';
import { View, Text, FlatList } from 'react-native';
import { useExpenseCategories } from '@/hooks/useCategories';

export function MyComponent() {
  const { data: categories, isLoading, error } = useExpenseCategories();

  if (isLoading) return <Text>Carregando...</Text>;
  if (error) return <Text>Erro: {error.message}</Text>;

  return (
    <FlatList
      data={categories}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <View>
          <Text>{item.name}</Text>
          <Text>{item.type}</Text>
        </View>
      )}
    />
  );
}
```

## ⚙️ Configurações do React Query

### Cache e Performance
- **staleTime**: 5 minutos (dados são considerados frescos)
- **gcTime**: 10 minutos (tempo para garbage collection)
- **retry**: Estratégia inteligente de retry baseada no status HTTP
- **refetchOnWindowFocus**: true (refaz requisição quando app ganha foco)

### Query Keys
Seguindo padrão hierárquico para invalidação eficiente:

```typescript
categoriesKeys = {
  all: ['categories'],
  lists: ['categories', 'list'],
  list: (filters) => ['categories', 'list', { filters }],
  details: ['categories', 'detail'],
  detail: (id) => ['categories', 'detail', id],
  byType: (type) => ['categories', 'byType', type],
}
```

## 🔄 Invalidação de Cache

As mutations automaticamente invalidam o cache apropriado:

- **Create**: Invalida listas e adiciona ao cache por tipo
- **Update**: Atualiza cache específico e invalida listas
- **Delete**: Remove do cache e invalida todas as listas

## 🚨 Tratamento de Erros

Erros são padronizados com a interface:

```typescript
interface ApiError {
  message: string;
  status?: number;
  code?: string;
}
```

Códigos de erro tratados:
- **401**: Token expirado ou inválido
- **403**: Acesso negado  
- **404**: Recurso não encontrado
- **500**: Erro interno do servidor
- **ECONNABORTED**: Timeout
- **Network Error**: Problemas de conexão

## 🎨 Integração com Theme

Os componentes de exemplo já estão integrados com o sistema de tema do app, usando `useTheme()` para cores dinâmicas baseadas no modo light/dark.

## 📱 Próximos Passos

Para expandir para outras entidades (transactions, accounts, etc.):

1. Criar serviço específico em `src/services/`
2. Criar hooks customizados em `src/hooks/`
3. Seguir o mesmo padrão de query keys e cache invalidation
4. Reutilizar a instância `api` configurada

## 🔍 Debug

Para debug das queries, você pode acessar:
- **React Query DevTools** (em desenvolvimento)
- **Console logs** nos interceptors da API
- **Query states** nos hooks (isLoading, error, data, etc.)
