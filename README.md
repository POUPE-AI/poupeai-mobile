# 📱 Poupe.AI Mobile

<p align="center">
  <img src="./assets/icons/adaptive-icon.png" alt="Poupe.AI Logo" width="120" height="120">
</p>

<p align="center">
  <strong>Aplicativo mobile para controle financeiro pessoal inteligente</strong>
</p>

## 📋 Sobre o Projeto

O **Poupe.AI Mobile** é um aplicativo desenvolvido em React Native + Expo que oferece uma experiência completa de gerenciamento financeiro pessoal. O app permite:

- 💰 **Gerenciamento de Transações**: Registrar receitas e despesas de forma simples e intuitiva
- 📊 **Visualização de Saldos**: Acompanhar o saldo em tempo real de contas bancárias e cartões
- 🎯 **Controle de Orçamentos**: Definir e monitorar metas de gastos por categoria
- 📈 **Relatórios Financeiros**: Gráficos e análises detalhadas dos seus hábitos financeiros
- 🤖 **Consultor IA**: Interação com assistente financeiro virtual para dicas personalizadas
- 🔐 **Autenticação Segura**: Login integrado com Keycloak OAuth2

## 🛠️ Tecnologias Utilizadas

- **React Native** - Framework para desenvolvimento mobile
- **Expo** - Plataforma para desenvolvimento e deploy
- **TypeScript** - Tipagem estática para JavaScript
- **Expo Router** - Sistema de roteamento baseado em arquivos
- **React Query** - Gerenciamento de estado e cache de dados
- **Keycloak** - Autenticação e autorização OAuth2
- **React Hook Form + Zod** - Validação de formulários
- **Reanimated** - Animações performáticas

## 📋 Pré-requisitos

- **Node.js** (versão 18 ou superior)
- **npm** ou **yarn**
- **Expo CLI**: `npm install -g expo-cli`
- **Android Studio** (para desenvolvimento Android)
- **Xcode** (para desenvolvimento iOS - apenas macOS)

## 🚀 Como Usar

### 1. Clone o repositório

```bash
git clone https://github.com/POUPE-AI/poupeai-mobile.git
cd poupeai-mobile
```

### 2. Instale as dependências

```bash
npm install
```

### 3. Configure as variáveis de ambiente

Copie o arquivo de exemplo e configure suas variáveis:

```bash
# Para ambiente local de desenvolvimento
cp .env.local.example .env.local

# Para outros ambientes
cp .env.example .env
```

Edite o arquivo `.env.local` ou `.env` com suas configurações:

```bash
# API Configuration
EXPO_PUBLIC_API_BASE_URL=http://seu-servidor-api:8000

# Keycloak Configuration
EXPO_PUBLIC_KEYCLOAK_BASE_URL=http://seu-servidor-keycloak:8080
EXPO_PUBLIC_KEYCLOAK_REALM=seu-realm
EXPO_PUBLIC_KEYCLOAK_CLIENT_ID=seu-client-id

# App Configuration
EXPO_PUBLIC_APP_SCHEME=ai.poupe.mobile
```

### 4. Execute o projeto

#### Modo Desenvolvimento (Expo Go)

```bash
npm start
# ou
expo start
```

#### Modo Development Client (Recomendado)

```bash
npm start -- --dev-client
# ou
expo start --dev-client
```

#### Executar no Android

```bash
npm run android
# ou
expo run:android
```

#### Executar no iOS (apenas macOS)

```bash
npm run ios
# ou
expo run:ios
```

### 5. Acesse o app

- **Expo Go**: Escaneie o QR Code no terminal/navegador
- **Development Client**: O app será instalado automaticamente no dispositivo/emulador
- **Dispositivo físico**: Conecte via USB e execute os comandos `run:android` ou `run:ios`

## 📦 Build e Deploy

### Build de Desenvolvimento

```bash
# Build para Android (APK)
eas build --platform android --profile development

# Build para iOS
eas build --platform ios --profile development
```

### Build de Preview (Interno)

```bash
# Build para Android
eas build --platform android --profile preview

# Build para iOS
eas build --platform ios --profile preview
```

### Build de Produção

```bash
# Build para Android (APK/AAB)
eas build --platform android --profile production

# Build para iOS
eas build --platform ios --profile production
```

### Deploy com EAS Update

```bash
# Deploy para canal de desenvolvimento
eas update --channel development

# Deploy para canal de preview
eas update --channel preview

# Deploy para canal de produção
eas update --channel production
```

## 🔧 Configurações Importantes

### Deep Linking

O app está configurado para responder aos schemes:

- `ai.poupe.mobile://` (produção)
- `exp://` (desenvolvimento)

### Permissões Android

O app está configurado para usar `usesCleartextTraffic: true` para desenvolvimento com servidores HTTP locais.

### Timezone

O app está configurado para usar o timezone `America/Fortaleza`.

## 📁 Estrutura do Projeto

```
poupeai-mobile/
├── app/                    # Roteamento com expo-router
│   ├── _layout.tsx         # Layout raiz com providers
│   ├── login.tsx          # Tela de login
│   └── (drawer)/          # Área autenticada
├── src/
│   ├── components/        # Componentes reutilizáveis
│   │   ├── atoms/         # Componentes básicos
│   │   ├── molecules/     # Combinações de componentes
│   │   └── screens/       # Telas completas
│   ├── contexts/          # Contextos React (Auth, Theme)
│   ├── hooks/             # Hooks customizados
│   ├── services/          # Serviços de API
│   ├── types/             # Tipos TypeScript
│   └── utils/             # Utilitários
├── assets/                # Imagens e ícones
└── android/               # Código nativo Android
```

## 🔐 Autenticação

O app utiliza **Keycloak** com fluxo OAuth2 + PKCE para autenticação segura. As credenciais são armazenadas localmente usando AsyncStorage com as chaves:

- `@poupeai:user` - Dados do usuário
- `@poupeai:tokens` - Tokens de acesso e refresh

## 🎨 Temas

O app suporta três modos de tema:

- **Light** - Tema claro
- **Dark** - Tema escuro
- **System** - Segue o tema do sistema

## 📄 Licença

Este projeto está sob a licença especificada no arquivo [LICENSE](LICENSE).
