# Guia de Desenvolvimento

## 📋 Índice
- [Configuração do Ambiente](#configuração-do-ambiente)
- [Primeiros Passos](#primeiros-passos)
- [Estrutura de Desenvolvimento](#estrutura-de-desenvolvimento)
- [Convenções de Código](#convenções-de-código)
- [Fluxo de Desenvolvimento](#fluxo-de-desenvolvimento)
- [Debugging](#debugging)
- [Testes](#testes)
- [Build e Deploy](#build-e-deploy)

## ⚙️ Configuração do Ambiente

### Pré-requisitos

- **Node.js**: 18.x ou superior
- **npm**: 8.x ou superior  
- **Expo CLI**: `npm install -g @expo/cli`
- **Android Studio**: Para desenvolvimento Android
- **Xcode**: Para desenvolvimento iOS (macOS apenas)
- **Git**: Para controle de versão

### Instalação

1. **Clone do repositório:**
```bash
git clone https://github.com/POUPE-AI/poupeai-mobile.git
cd poupeai-mobile
```

2. **Instale as dependências:**
```bash
npm install
```

3. **Configure as variáveis de ambiente:**
```bash
cp .env.example .env
```

Edite o arquivo `.env` com suas configurações:
```env
# Keycloak OAuth
EXPO_PUBLIC_KEYCLOAK_SERVER_URL=https://auth.poupeai.com
EXPO_PUBLIC_KEYCLOAK_REALM=poupeai
EXPO_PUBLIC_KEYCLOAK_CLIENT_ID=poupeai-mobile

# API
EXPO_PUBLIC_API_BASE_URL=https://api.poupeai.com

# App
EXPO_PUBLIC_APP_SCHEME=ai.poupe
```

4. **Inicie o servidor de desenvolvimento:**
```bash
npm start
```

### Configuração de IDEs

#### VS Code (Recomendado)

Instale as extensões essenciais:
```json
{
  "recommendations": [
    "ms-vscode.vscode-typescript-next",
    "bradlc.vscode-tailwindcss",
    "esbenp.prettier-vscode",
    "ms-vscode.vscode-eslint",
    "expo.vscode-expo-tools",
    "ms-vscode.vscode-react-native"
  ]
}
```

Configuração do workspace (`.vscode/settings.json`):
```json
{
  "typescript.preferences.includePackageJsonAutoImports": "on",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true,
    "source.organizeImports": true
  },
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode"
}
```

#### Android Studio

1. Instale o Android Studio
2. Configure as variáveis de ambiente:
```bash
export ANDROID_HOME=$HOME/Android/Sdk
export PATH=$PATH:$ANDROID_HOME/emulator
export PATH=$PATH:$ANDROID_HOME/tools
export PATH=$PATH:$ANDROID_HOME/tools/bin
export PATH=$PATH:$ANDROID_HOME/platform-tools
```

3. Crie um AVD (Android Virtual Device)

## 🚀 Primeiros Passos

### Estrutura do Projeto

```
poupeai-mobile/
├── 📱 app/                 # Roteamento (expo-router)
├── 🎨 assets/              # Imagens, ícones, fontes
├── 🧩 src/                 # Código fonte principal
├── 📚 docs/                # Documentação
├── 🧪 __tests__/           # Testes
├── 📦 package.json         # Dependências e scripts
├── 🔧 app.json             # Configuração do Expo
├── 📝 tsconfig.json        # Configuração TypeScript
└── 🌍 .env                 # Variáveis de ambiente
```

### Scripts Disponíveis

```bash
# Desenvolvimento
npm start              # Inicia Expo dev server
npm run android        # Roda no Android
npm run ios           # Roda no iOS
npm run web           # Roda no navegador

# Build
npm run build         # Build de produção
npm run build:android # Build Android específico
npm run build:ios     # Build iOS específico

# Qualidade de código
npm run lint          # ESLint
npm run format        # Prettier
npm run type-check    # TypeScript check

# Testes
npm test              # Roda todos os testes
npm run test:watch    # Testes em modo watch
npm run test:coverage # Coverage report
```

### Primeiro Componente

Crie um novo componente seguindo nossa estrutura:

```bash
# Estrutura de pastas
src/components/atoms/MeuComponente/
├── index.tsx
└── styles.ts
```

```typescript
// src/components/atoms/MeuComponente/index.tsx
import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Text } from '@/components/atoms/Text';
import { useTheme } from '@/contexts/ThemeContext';
import { styles } from './styles';

interface MeuComponenteProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary';
}

export const MeuComponente = ({ 
  title, 
  onPress, 
  variant = 'primary' 
}: MeuComponenteProps) => {
  const { theme } = useTheme();
  const style = styles(theme);

  return (
    <TouchableOpacity 
      style={[style.container, style[variant]]}
      onPress={onPress}
    >
      <Text variant="body" style={style.title}>
        {title}
      </Text>
    </TouchableOpacity>
  );
};
```

```typescript
// src/components/atoms/MeuComponente/styles.ts
import { StyleSheet } from 'react-native';
import { ThemeType } from '@/contexts/ThemeContext';
import { colors } from '@/constants/theme';

export const styles = (theme: ThemeType) => StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primary: {
    backgroundColor: colors.primary[500],
  },
  secondary: {
    backgroundColor: colors.theme[theme].surface,
    borderWidth: 1,
    borderColor: colors.theme[theme].border,
  },
  title: {
    fontWeight: '600',
  },
});
```

## 📐 Estrutura de Desenvolvimento

### Arquitetura de Componentes

#### Atomic Design Pattern

```
🔬 Atoms
├── Elementos básicos (Button, Text, Input)
├── Não possuem dependências de outros componentes
├── Altamente reutilizáveis
└── Focados em uma única responsabilidade

🧬 Molecules  
├── Combinações funcionais de atoms
├── Encapsulam lógica específica
├── Ainda reutilizáveis em diferentes contextos
└── Exemplo: SearchBox, FormField, ModalHeader

🖥️ Screens
├── Páginas completas da aplicação
├── Combinam molecules e atoms
├── Específicas para cada rota
└── Contêm lógica de negócio da tela
```

#### Padrão de Estilos

Todos os componentes seguem o padrão de estilos responsivos:

```typescript
// Sempre use factory function para estilos
export const styles = (theme: ThemeType) => StyleSheet.create({
  container: {
    backgroundColor: colors.theme[theme].background,
    // ... outros estilos
  },
});

// No componente
const { theme } = useTheme();
const style = styles(theme);
```

### Gerenciamento de Estado

#### Hierarquia de Estado

```
📊 Server State (React Query)
├── Dados da API (budgets, transactions, categories)
├── Cache automático com invalidação inteligente
├── Loading e error states automatizados
└── Sincronização background

🌍 Global State (Context API)
├── Autenticação (user, tokens, isAuthenticated)
├── Tema (mode, colors, setThemeMode)
└── Configurações gerais

🗺️ Navigation State (React Navigation)
├── Estado de navegação automático
├── Deep linking
└── Histórico de navegação

🏠 Local State (useState/useReducer)
├── Estado específico do componente
├── Formulários e inputs
├── Modal visibility
└── UI interactions temporárias
```

#### Custom Hooks Pattern

Encapsule lógica em hooks customizados:

```typescript
// Hook de dados (Server State)
export function useBudgets(filters?: BudgetFilters) {
  return useQuery({
    queryKey: budgetsKeys.list(filters),
    queryFn: () => budgetsService.getBudgets(filters),
    staleTime: 5 * 60 * 1000,
  });
}

// Hook de UI (Local State)
export function useModal() {
  const [visible, setVisible] = useState(false);
  
  return {
    visible,
    open: () => setVisible(true),
    close: () => setVisible(false),
  };
}

// Hook de integração (Business Logic)
export function useBudgetOperations() {
  const createMutation = useCreateBudget();
  const updateMutation = useUpdateBudget();
  const deleteMutation = useDeleteBudget();
  
  const createBudget = async (data: CreateBudgetRequest) => {
    try {
      await createMutation.mutateAsync(data);
      // Success feedback
    } catch (error) {
      // Error handling
    }
  };
  
  return {
    createBudget,
    isCreating: createMutation.isPending,
    // ... outras operações
  };
}
```

## 📝 Convenções de Código

### TypeScript

#### Interfaces e Types

```typescript
// Use interface para objetos que podem ser estendidos
interface User {
  id: string;
  name: string;
  email: string;
}

interface AdminUser extends User {
  permissions: string[];
}

// Use type para unions, intersections e primitivos
type Status = 'loading' | 'success' | 'error';
type ApiResponse<T> = {
  data: T;
  status: number;
};

// Props sempre com interface
interface ComponentProps {
  title: string;
  onPress: () => void;
  disabled?: boolean;
}
```

#### Naming Conventions

```typescript
// Componentes: PascalCase
export const BudgetModal = () => {};

// Hooks: camelCase com 'use' prefix
export const useBudgets = () => {};

// Constantes: UPPER_SNAKE_CASE
export const API_ENDPOINTS = {
  BUDGETS: '/budgets',
} as const;

// Arquivos: PascalCase para componentes, camelCase para utilitários
BudgetModal/index.tsx
useBudgets.ts
dateUtils.ts
```

### React Patterns

#### Component Props

```typescript
// ✅ Bom: Props específicas e tipadas
interface ButtonProps {
  title: string;
  variant: 'primary' | 'secondary';
  onPress: () => void;
  disabled?: boolean;
}

// ❌ Evitar: Props genéricas demais
interface ButtonProps {
  [key: string]: any;
}
```

#### Hooks Usage

```typescript
// ✅ Bom: Hooks no topo, ordem consistente
export const Component = ({ prop1, prop2 }: Props) => {
  // 1. Hooks de estado
  const [loading, setLoading] = useState(false);
  
  // 2. Hooks de contexto
  const { theme } = useTheme();
  const { user } = useAuth();
  
  // 3. Hooks de query
  const { data } = useBudgets();
  
  // 4. Hooks customizados
  const { visible, open, close } = useModal();
  
  // 5. useEffect no final
  useEffect(() => {
    // side effects
  }, []);
  
  // 6. Event handlers
  const handlePress = useCallback(() => {
    // handler logic
  }, []);
  
  // 7. Render
  return <View />;
};
```

#### Performance

```typescript
// ✅ Memoização quando necessário
const ExpensiveComponent = React.memo(({ data, onPress }) => {
  const expensiveValue = useMemo(() => {
    return data.reduce((sum, item) => sum + item.value, 0);
  }, [data]);
  
  const handlePress = useCallback((id: string) => {
    onPress(id);
  }, [onPress]);
  
  return <View>{/* JSX */}</View>;
});

// ✅ Evitar re-renders desnecessários
const Parent = () => {
  const [count, setCount] = useState(0);
  
  // ❌ Evitar: função criada a cada render
  // const handlePress = () => setCount(c => c + 1);
  
  // ✅ Bom: função memoizada
  const handlePress = useCallback(() => {
    setCount(c => c + 1);
  }, []);
  
  return <Child onPress={handlePress} />;
};
```

### Organização de Imports

```typescript
// 1. React e libs externas
import React, { useState, useCallback } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { useQuery } from '@tanstack/react-query';

// 2. Componentes internos
import { Button } from '@/components/atoms/Button';
import { Modal } from '@/components/molecules/Modal';

// 3. Hooks e utilitários
import { useTheme } from '@/contexts/ThemeContext';
import { useBudgets } from '@/hooks/useBudgets';

// 4. Types e constantes
import { Budget } from '@/types';
import { colors } from '@/constants/theme';

// 5. Estilos (sempre por último)
import { styles } from './styles';
```

## 🔄 Fluxo de Desenvolvimento

### Git Workflow

#### Branch Strategy

```bash
main                    # Produção
├── develop            # Desenvolvimento
│   ├── feature/       # Novas funcionalidades
│   ├── bugfix/        # Correções
│   └── hotfix/        # Correções urgentes
```

#### Commit Messages

Seguimos o padrão Conventional Commits:

```bash
# Tipos
feat: nova funcionalidade
fix: correção de bug
docs: documentação
style: formatação, sem mudança de lógica
refactor: refatoração de código
test: adição/correção de testes
chore: tarefas de manutenção

# Exemplos
feat(budgets): adicionar filtro por categoria
fix(auth): corrigir refresh token
docs(components): atualizar documentação de Button
```

#### Pull Request Template

```markdown
## Descrição
Breve descrição das mudanças

## Tipo de mudança
- [ ] Bug fix
- [ ] Nova funcionalidade
- [ ] Breaking change
- [ ] Documentação

## Checklist
- [ ] Código segue padrões do projeto
- [ ] Testes passando
- [ ] Documentação atualizada
- [ ] Screenshots anexados (se UI)

## Screenshots (se aplicável)
Antes | Depois
```

### Code Review

#### Checklist do Reviewer

- **Funcionalidade**: O código faz o que deveria fazer?
- **Performance**: Há otimizações desnecessárias ou gargalos?
- **Segurança**: Há vulnerabilidades de segurança?
- **Legibilidade**: O código é fácil de entender?
- **Testes**: A funcionalidade está adequadamente testada?
- **Documentação**: Mudanças complexas estão documentadas?

#### Boas Práticas

```typescript
// ✅ Bom: Código auto-explicativo
const calculateBudgetProgress = (spent: number, limit: number): number => {
  return Math.min((spent / limit) * 100, 100);
};

// ❌ Evitar: Lógica obscura sem comentários
const calc = (a: number, b: number) => Math.min((a/b)*100, 100);
```

## 🐛 Debugging

### React Native Debugger

1. **Instalar o React Native Debugger:**
```bash
# macOS
brew install --cask react-native-debugger

# Windows
choco install react-native-debugger
```

2. **Configuração:**
```bash
# Porta padrão do Metro
19000
```

3. **Ativar debugging:**
- Pressione `Cmd+D` (iOS) ou `Ctrl+M` (Android) no simulador
- Selecione "Debug JS Remotely"

### Flipper Integration

```javascript
// metro.config.js
const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Flipper integration
config.resolver.platforms = ['ios', 'android', 'native', 'web'];

module.exports = config;
```

### Logging

```typescript
// src/utils/logger.ts
class Logger {
  static debug(message: string, data?: any) {
    if (__DEV__) {
      console.log(`🔍 [DEBUG] ${message}`, data);
    }
  }
  
  static info(message: string, data?: any) {
    console.log(`ℹ️ [INFO] ${message}`, data);
  }
  
  static warn(message: string, data?: any) {
    console.warn(`⚠️ [WARN] ${message}`, data);
  }
  
  static error(message: string, error?: any) {
    console.error(`❌ [ERROR] ${message}`, error);
    
    // Reportar em produção
    if (!__DEV__) {
      // crashlytics().recordError(error);
    }
  }
}

// Uso
Logger.debug('Carregando orçamentos', { userId, filters });
Logger.error('Falha ao criar orçamento', error);
```

### Performance Monitoring

```typescript
// src/utils/performance.ts
export const measurePerformance = (name: string) => {
  const start = Date.now();
  
  return {
    end: () => {
      const duration = Date.now() - start;
      Logger.debug(`⏱️ ${name} levou ${duration}ms`);
      return duration;
    },
  };
};

// Uso
const perf = measurePerformance('Budget List Render');
// ... operação custosa
perf.end();
```

## 🧪 Testes

### Estrutura de Testes

```
__tests__/
├── components/         # Testes de componentes
│   ├── atoms/
│   ├── molecules/
│   └── screens/
├── hooks/             # Testes de hooks
├── utils/             # Testes de utilitários
└── setup.ts           # Configuração global
```

### Testing Stack

- **Jest**: Framework de testes
- **React Native Testing Library**: Testes de componentes
- **MSW**: Mock Service Worker para APIs
- **React Query Testing**: Utilitários para React Query

### Exemplo de Teste

```typescript
// __tests__/components/atoms/Button.test.tsx
import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { Button } from '@/components/atoms/Button';
import { ThemeProvider } from '@/contexts/ThemeContext';

const renderWithTheme = (component: React.ReactElement) => {
  return render(
    <ThemeProvider>
      {component}
    </ThemeProvider>
  );
};

describe('Button', () => {
  it('should render correctly', () => {
    const { getByText } = renderWithTheme(
      <Button title="Test Button" onPress={() => {}} />
    );
    
    expect(getByText('Test Button')).toBeTruthy();
  });
  
  it('should call onPress when pressed', () => {
    const onPress = jest.fn();
    const { getByText } = renderWithTheme(
      <Button title="Test Button" onPress={onPress} />
    );
    
    fireEvent.press(getByText('Test Button'));
    expect(onPress).toHaveBeenCalledTimes(1);
  });
  
  it('should be disabled when disabled prop is true', () => {
    const onPress = jest.fn();
    const { getByText } = renderWithTheme(
      <Button title="Test Button" onPress={onPress} disabled />
    );
    
    const button = getByText('Test Button');
    fireEvent.press(button);
    expect(onPress).not.toHaveBeenCalled();
  });
});
```

### Hook Testing

```typescript
// __tests__/hooks/useBudgets.test.ts
import { renderHook, waitFor } from '@testing-library/react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useBudgets } from '@/hooks/useBudgets';
import { budgetsService } from '@/services/budgets';

jest.mock('@/services/budgets');

const createTestQueryClient = () => new QueryClient({
  defaultOptions: {
    queries: { retry: false },
    mutations: { retry: false },
  },
});

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider client={createTestQueryClient()}>
    {children}
  </QueryClientProvider>
);

describe('useBudgets', () => {
  it('should fetch budgets successfully', async () => {
    const mockBudgets = { results: [{ id: 1, name: 'Test Budget' }] };
    (budgetsService.getBudgets as jest.Mock).mockResolvedValue(mockBudgets);
    
    const { result } = renderHook(() => useBudgets(), { wrapper });
    
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual(mockBudgets);
  });
});
```

## 🚀 Build e Deploy

### Build Configurations

```javascript
// app.json
{
  "expo": {
    "name": "PoupeAI",
    "slug": "poupeai-mobile",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/icon.png",
    "userInterfaceStyle": "automatic",
    "splash": {
      "image": "./assets/splash.png",
      "resizeMode": "contain",
      "backgroundColor": "#FF660F"
    },
    "updates": {
      "fallbackToCacheTimeout": 0
    },
    "assetBundlePatterns": ["**/*"],
    "ios": {
      "supportsTablet": true,
      "bundleIdentifier": "ai.poupe.mobile"
    },
    "android": {
      "adaptiveIcon": {
        "foregroundImage": "./assets/adaptive-icon.png",
        "backgroundColor": "#FF660F"
      },
      "package": "ai.poupe.mobile"
    }
  }
}
```

### EAS Build

```javascript
// eas.json
{
  "cli": {
    "version": ">= 0.52.0"
  },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal"
    },
    "preview": {
      "distribution": "internal",
      "android": {
        "buildType": "apk"
      }
    },
    "production": {
      "distribution": "store"
    }
  },
  "submit": {
    "production": {
      "ios": {
        "appleId": "developer@poupeai.com",
        "ascAppId": "123456789",
        "appleTeamId": "ABCD123456"
      },
      "android": {
        "serviceAccountKeyPath": "./service-account-key.json",
        "track": "production"
      }
    }
  }
}
```

### Build Commands

```bash
# Development build
eas build --profile development --platform android
eas build --profile development --platform ios

# Preview build (para QA)
eas build --profile preview --platform all

# Production build
eas build --profile production --platform all

# Submit para stores
eas submit --profile production --platform ios
eas submit --profile production --platform android
```

### Environment Variables

```bash
# .env.production
EXPO_PUBLIC_KEYCLOAK_SERVER_URL=https://auth.poupeai.com
EXPO_PUBLIC_API_BASE_URL=https://api.poupeai.com

# .env.staging  
EXPO_PUBLIC_KEYCLOAK_SERVER_URL=https://auth-staging.poupeai.com
EXPO_PUBLIC_API_BASE_URL=https://api-staging.poupeai.com

# .env.development
EXPO_PUBLIC_KEYCLOAK_SERVER_URL=http://localhost:8080
EXPO_PUBLIC_API_BASE_URL=http://localhost:8000
```

### CI/CD Pipeline

```yaml
# .github/workflows/build.yml
name: Build and Deploy

on:
  push:
    branches: [main, develop]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run tests
        run: npm test
      
      - name: Setup Expo
        uses: expo/expo-github-action@v7
        with:
          expo-version: latest
          token: ${{ secrets.EXPO_TOKEN }}
      
      - name: Build for production
        if: github.ref == 'refs/heads/main'
        run: eas build --profile production --platform all --non-interactive
```

---

*Documentação atualizada em: Julho 2025*
