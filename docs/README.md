# 📚 Documentação do PoupeAI Mobile

> **Índice principal da documentação técnica completa**

## 🎯 Visão Geral

PoupeAI Mobile é um aplicativo React Native + Expo para controle financeiro pessoal, desenvolvido para oferecer uma experiência móvel intuitiva e moderna. O app permite gerenciar transações, categorias, orçamentos, metas e cartões de crédito, com integração a um sistema de autenticação OAuth/Keycloak.

## 📖 Navegação da Documentação

| 📄 Documento | 📝 Descrição | 👥 Público |
|--------------|--------------|------------|
| **[🏠 Wiki Principal](./wiki.md)** | Visão geral, quick start e introdução ao projeto | Todos |
| **[🏗️ Arquitetura](./architecture.md)** | Estrutura técnica, padrões e fluxo de dados | Desenvolvedores |
| **[🧩 Componentes](./components.md)** | Guia completo dos componentes UI (Atomic Design) | Desenvolvedores, Designers |
| **[🌐 API e Integração](./api-integration.md)** | Endpoints, OAuth2, hooks e cache | Desenvolvedores Backend/Frontend |
| **[👨‍💻 Guia de Desenvolvimento](./development-guide.md)** | Setup, convenções, debugging e deploy | Desenvolvedores |

## 🚀 Quick Start

### 1. Para Novos Desenvolvedores
```bash
# Configuração inicial completa
git clone https://github.com/POUPE-AI/poupeai-mobile.git
cd poupeai-mobile
npm install
cp .env.example .env
# Configure suas variáveis de ambiente no .env
npm start
```

### 2. Para Designers
- Consulte o **[Guia de Componentes](./components.md)** para entender a biblioteca de UI
- Veja os padrões de design e temas no **[Sistema de Design](./architecture.md#sistema-de-temas)**

### 3. Para Product Managers
- Comece pela **[Wiki Principal](./wiki.md)** para visão geral das funcionalidades
- Confira o **[Roadmap](./wiki.md#roadmap)** para próximas features

## 🎯 Funcionalidades Principais

- **🔐 Autenticação OAuth2**: Login seguro via Keycloak com PKCE
- **📊 Dashboard Financeiro**: Visão consolidada de saldos e gráficos
- **💰 Gestão de Transações**: Criação, listagem e categorização
- **📈 Orçamentos**: Criação e acompanhamento por categoria
- **🎯 Metas Financeiras**: Definição e progresso de objetivos
- **💳 Cartões de Crédito**: Gestão de limites e faturas
- **🏷️ Categorias**: Sistema flexível com cores personalizadas
- **📱 Temas**: Suporte a modo claro/escuro/sistema

## 🏗️ Arquitetura em Resumo

### Stack Tecnológica
- **React Native 0.76.9** + **Expo 52.0**
- **TypeScript 5.3** com tipagem estrita
- **Expo Router 4.0** (file-based routing)
- **React Query 5.83** para gerenciamento de estado
- **OAuth2 + PKCE** via Keycloak

### Padrões Arquiteturais
- **Atomic Design** para organização de componentes
- **Custom Hooks** para lógica de negócio
- **Service Layer** para integração com APIs
- **Context API** para estado global (Auth, Theme)

### Estrutura de Pastas
```
poupeai-mobile/
├── 📱 app/                    # Roteamento (expo-router)
├── 🧩 src/components/         # UI Components (Atomic Design)
├── 🔧 src/contexts/           # React Contexts
├── 🎣 src/hooks/              # Custom Hooks
├── 🌐 src/services/           # Camada de API
├── 📝 src/types/              # Definições TypeScript
└── 📚 docs/                   # Esta documentação
```

## 📊 Métricas e Performance

### Otimizações Implementadas
- **Cache Inteligente**: React Query com invalidação hierárquica
- **Lazy Loading**: Carregamento sob demanda de telas
- **Optimistic Updates**: UI responsiva com rollback automático
- **Bundle Splitting**: Code splitting por feature
- **Offline Support**: Cache persistente para funcionalidade offline

### Qualidade de Código
- **TypeScript**: Tipagem estrita habilitada
- **ESLint + Prettier**: Formatação e linting automatizados
- **Conventional Commits**: Padrão para mensagens de commit
- **Testing**: Jest + React Native Testing Library

## 🔐 Segurança

### Autenticação
- **OAuth2 + PKCE**: Fluxo seguro para aplicações móveis
- **Token Management**: Refresh automático e armazenamento seguro
- **Deep Linking**: URLs seguras para callback OAuth

### Proteção de Dados
- **AsyncStorage**: Armazenamento criptografado local
- **API Interceptors**: Injeção automática de tokens
- **Error Handling**: Tratamento seguro de erros sem exposição

## 🤝 Como Contribuir

### Para Desenvolvedores
1. Leia o **[Guia de Desenvolvimento](./development-guide.md)**
2. Configure o ambiente local
3. Siga as convenções de código estabelecidas
4. Abra Pull Requests com descrição detalhada

### Reportar Issues
- Use os templates de issue no GitHub
- Inclua informações do ambiente (iOS/Android/versão)
- Adicione screenshots quando aplicável

## 📞 Suporte e Contato

- **📋 Issues**: [GitHub Issues](https://github.com/POUPE-AI/poupeai-mobile/issues)
- **💬 Discussões**: [GitHub Discussions](https://github.com/POUPE-AI/poupeai-mobile/discussions)
- **📧 Email**: developer@poupeai.com

## 📈 Status do Projeto

- **Versão Atual**: 1.0.0
- **Status**: Em desenvolvimento ativo
- **Plataformas**: iOS, Android
- **Última Atualização**: Julho 2025

## ⚖️ Licença

Este projeto está licenciado sob a **MIT License**. Veja o arquivo [LICENSE](../LICENSE) para detalhes.

---

**Desenvolvido com ❤️ pela equipe POUPE.AI**

*Para começar, recomendamos ler a [Wiki Principal](./wiki.md) e depois mergulhar nos guias específicos conforme sua necessidade.*
