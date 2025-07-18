# Autenticação Keycloak

Este projeto utiliza Keycloak para autenticação de usuários através do protocolo OpenID Connect.

## Configuração

### 1. Variáveis de Ambiente

Copie o arquivo `.env.example` para `.env` e configure as variáveis:

```bash
cp .env.example .env
```

Configure as seguintes variáveis no arquivo `.env`:

- `EXPO_PUBLIC_KEYCLOAK_BASE_URL`: URL base do servidor Keycloak
- `EXPO_PUBLIC_KEYCLOAK_REALM`: Nome do realm no Keycloak
- `EXPO_PUBLIC_KEYCLOAK_CLIENT_ID`: ID do cliente configurado no Keycloak
- `EXPO_PUBLIC_APP_SCHEME`: Esquema de URL do aplicativo

### 2. Configuração do Keycloak

No Admin Console do Keycloak, configure o cliente com:

- **Client ID**: Valor de `EXPO_PUBLIC_KEYCLOAK_CLIENT_ID`
- **Client Protocol**: `openid-connect`
- **Access Type**: `public`
- **Standard Flow Enabled**: `ON`
- **Valid Redirect URIs**: 
  - `{EXPO_PUBLIC_APP_SCHEME}://`
  - `exp://localhost:8081/*` (para desenvolvimento)

## Uso

### AuthContext

O `AuthContext` fornece:

- `user`: Dados do usuário autenticado
- `isLoading`: Estado de carregamento
- `isAuthenticated`: Se o usuário está autenticado
- `signIn()`: Função para fazer login
- `signOut()`: Função para fazer logout

### Hook useAccessToken

Para acessar o token de acesso atual:

```tsx
import { useAccessToken } from '../hooks/useAccessToken';

const accessToken = useAccessToken();
```

## Estrutura de Arquivos

```
src/
├── config/
│   └── auth.ts           # Configurações de autenticação
├── contexts/
│   └── AuthContext.tsx   # Context de autenticação
├── hooks/
│   └── useAccessToken.ts # Hook para acessar tokens
├── types/
│   └── index.ts          # Tipos TypeScript
└── utils/
    └── env.ts            # Validação de variáveis de ambiente
```
