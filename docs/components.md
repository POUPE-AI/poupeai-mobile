# Componentes - Guia Completo

## 📋 Índice
- [Estrutura Atomic Design](#estrutura-atomic-design)
- [Atoms (Componentes Base)](#atoms-componentes-base)
- [Molecules (Componentes Compostos)](#molecules-componentes-compostos)
- [Screens (Telas Completas)](#screens-telas-completas)
- [Padrões de Desenvolvimento](#padrões-de-desenvolvimento)

## 🧩 Estrutura Atomic Design

O projeto segue estritamente a metodologia Atomic Design para organização e escalabilidade dos componentes:

```
src/components/
├── atoms/          # Elementos básicos e reutilizáveis
├── molecules/      # Combinações funcionais de atoms
└── screens/        # Telas completas
```

## ⚛️ Atoms (Componentes Base)

### ActionButton
Botão de ação pequeno para operações inline.

**Localização:** `src/components/atoms/ActionButton/`

**Props:**
```typescript
interface ActionButtonProps {
  icon: string;
  onPress: () => void;
  disabled?: boolean;
}
```

**Uso:**
```jsx
<ActionButton 
  icon="pencil" 
  onPress={() => editItem(id)} 
/>
```

---

### AddButtonMenu
Menu flutuante com opções de criação rápida.

**Localização:** `src/components/atoms/AddButtonMenu/`

**Props:**
```typescript
interface AddButtonMenuProps {
  onNewTransaction: () => void;
  onNewGoal: () => void;
  onNewBudget: () => void;
}
```

**Funcionalidades:**
- Menu animado com spring animation
- Overlay semi-transparente
- Três opções de ação pré-definidas

---

### BalanceCard
Card de exibição de saldo com gráfico.

**Localização:** `src/components/atoms/BalanceCard/`

**Props:**
```typescript
interface BalanceCardProps {
  title: string;
  amount: number;
  percentage: number;
  data: LineData[];
}
```

**Características:**
- Gráfico de linha integrado
- Formatação monetária automática
- Indicador de tendência (positiva/negativa)

---

### BudgetListItem
Item de lista para exibição de orçamentos.

**Localização:** `src/components/atoms/BudgetListItem/`

**Props:**
```typescript
interface BudgetListItemProps {
  budget: Budget;
  progress: BudgetProgress;
  onEdit: (budget: Budget) => void;
  onDelete: (id: number) => void;
}
```

**Funcionalidades:**
- Barra de progresso visual
- Status colorido (safe/warning/danger)
- Ações inline (editar/excluir)
- Cálculo automático de percentual

---

### Button
Botão principal do sistema com múltiplas variantes.

**Localização:** `src/components/atoms/Button/`

**Props:**
```typescript
interface ButtonProps {
  title: string;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  loading?: boolean;
  icon?: string;
  onPress: () => void;
}
```

**Variantes:**
- **Primary**: Botão principal com cor primária
- **Secondary**: Botão secundário com fundo neutro
- **Outline**: Botão apenas com borda

---

### CategoryListItem
Item para listagem de categorias.

**Localização:** `src/components/atoms/CategoryListItem/`

**Props:**
```typescript
interface CategoryListItemProps {
  category: Category;
  onEdit: (category: Category) => void;
  onDelete: (id: string) => void;
}
```

**Características:**
- Indicador de cor da categoria
- Tipo da categoria (receita/despesa)
- Ações de edição e exclusão

---

### FormField
Campo de formulário com validação integrada.

**Localização:** `src/components/atoms/FormField/`

**Props:**
```typescript
interface FormFieldProps {
  label: string;
  placeholder?: string;
  value: string;
  onChangeText: (text: string) => void;
  error?: string;
  secureTextEntry?: boolean;
  multiline?: boolean;
  numberOfLines?: number;
  keyboardType?: KeyboardTypeOptions;
}
```

**Funcionalidades:**
- Estados de erro com mensagem
- Suporte a texto multiline
- Tipos de teclado personalizados
- Entrada segura (senhas)

---

### ModalContainer
Container base para modais.

**Localização:** `src/components/atoms/ModalContainer/`

**Props:**
```typescript
interface ModalContainerProps {
  children: React.ReactNode;
}
```

**Características:**
- Fundo responsivo ao tema
- Área segura automática
- Base para todos os modais

---

### ModalHeader
Cabeçalho padrão para modais.

**Localização:** `src/components/atoms/ModalHeader/`

**Props:**
```typescript
interface ModalHeaderProps {
  title: string;
  onClose: () => void;
}
```

**Funcionalidades:**
- Título centralizado
- Botão de fechar
- Separador visual

---

### Text
Componente de texto com tipografia consistente.

**Localização:** `src/components/atoms/Text/`

**Props:**
```typescript
interface TextProps {
  children: React.ReactNode;
  variant?: 'title' | 'subtitle' | 'body' | 'caption';
  color?: 'text' | 'textSecondary' | 'primary' | string;
  align?: 'left' | 'center' | 'right';
  style?: TextStyle;
}
```

**Variantes:**
- **Title**: Títulos principais (24px, bold)
- **Subtitle**: Subtítulos (18px, semibold)
- **Body**: Texto normal (16px, regular)
- **Caption**: Texto pequeno (14px, regular)

---

### TransactionsListItem
Item individual para lista de transações.

**Localização:** `src/components/atoms/TransactionsListItem/`

**Props:**
```typescript
interface TransactionsListItemProps {
  transaction: Transaction;
  onPress?: (transaction: Transaction) => void;
}
```

**Características:**
- Cor da categoria na borda esquerda
- Formatação de valor (receita verde, despesa vermelha)
- Informações de categoria e data

---

### TypeSelector
Seletor de tipo (receita/despesa).

**Localização:** `src/components/atoms/TypeSelector/`

**Props:**
```typescript
interface TypeSelectorProps {
  selected: 'income' | 'expense';
  onSelect: (type: 'income' | 'expense') => void;
}
```

**Funcionalidades:**
- Toggle visual entre receita e despesa
- Cores diferenciadas por tipo
- Estados ativo/inativo

## 🧬 Molecules (Componentes Compostos)

### BudgetModal
Modal completo para criação/edição de orçamentos.

**Localização:** `src/components/molecules/BudgetModal/`

**Props:**
```typescript
interface BudgetModalProps {
  visible: boolean;
  onClose: () => void;
  budget?: Budget;
  onSave: (data: CreateBudgetRequest) => void;
}
```

**Funcionalidades:**
- Validação com Zod schema
- Dropdown de categorias
- Formatação monetária
- Estados de loading/error
- Modo criação/edição

**Validação:**
```typescript
const budgetSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  category: z.number().min(1, 'Categoria é obrigatória'),
  amount: z.string().min(1, 'Valor é obrigatório'),
});
```

---

### CategoryModal
Modal para gestão de categorias.

**Localização:** `src/components/molecules/CategoryModal/`

**Props:**
```typescript
interface CategoryModalProps {
  visible: boolean;
  onClose: () => void;
  category?: Category;
  onSave: (data: CreateCategoryRequest) => void;
}
```

**Funcionalidades:**
- Seletor de tipo (receita/despesa)
- Paleta de cores predefinidas
- Color picker customizado
- Validação de nome único
- Prévia visual da cor

---

### ColorPickerModal
Modal dedicado para seleção de cores.

**Localização:** `src/components/molecules/ColorPickerModal/`

**Props:**
```typescript
interface ColorPickerModalProps {
  visible: boolean;
  onClose: () => void;
  initialColor: string;
  onColorSelect: (color: string) => void;
}
```

**Funcionalidades:**
- Color picker completo
- Prévia da cor selecionada
- Painel de matiz e saturação
- Controle de opacidade

---

### CustomDrawer
Drawer de navegação personalizado.

**Localização:** `src/components/molecules/CustomDrawer/`

**Props:**
```typescript
interface CustomDrawerProps extends DrawerContentComponentProps {}
```

**Funcionalidades:**
- Header com gradiente e informações do usuário
- Menu hierárquico por seções
- Indicação de tela ativa
- Ação de logout
- Design responsivo ao tema

**Estrutura do Menu:**
```typescript
const ITEMS = [
  {
    section: [
      { label: "Resumo Financeiro", route: "(tabs)", icon: "home" },
      { label: "Relatórios", route: "(tabs)/reports", icon: "document-text" },
    ],
  },
  // ... outras seções
];
```

---

### CustomTabBar
Barra de navegação inferior personalizada.

**Localização:** `src/components/molecules/CustomTabBar/`

**Props:**
```typescript
interface TabBarProps {
  state: TabNavigationState;
  descriptors: any;
  navigation: any;
}
```

**Funcionalidades:**
- Indicação visual da aba ativa
- Integração com AddButtonMenu
- Ícones e labels personalizados
- Animações suaves

---

### EstimatedSavingsCard
Card de economia estimada.

**Localização:** `src/components/molecules/EstimatedSavingsCard/`

**Props:**
```typescript
interface EstimatedSavingsCardProps {
  value: number;
  title?: string;
}
```

**Funcionalidades:**
- Cálculo automático de ícone e cor
- Formatação de valor positivo/negativo
- Design adaptativo ao valor

---

### Header
Cabeçalho principal do aplicativo.

**Localização:** `src/components/molecules/Header/`

**Props:**
```typescript
interface HeaderProps extends DrawerHeaderProps {}
```

**Características:**
- Logo centralizado
- Botão de menu (drawer)
- Fundo com cor primária
- Safe area automática

---

### LoginHeader
Cabeçalho da tela de login.

**Localização:** `src/components/molecules/LoginHeader/`

**Props:**
```typescript
interface LoginHeaderProps {
  subtitle: string;
}
```

**Componentes:**
- Logo SVG responsivo
- Subtítulo descritivo
- Layout centralizado

---

### LoginSection
Seção de login com botão OAuth.

**Localização:** `src/components/molecules/LoginSection/`

**Props:**
```typescript
interface LoginSectionProps {
  onLogin: () => void;
  loading: boolean;
}
```

**Funcionalidades:**
- Botão de login OAuth
- Estados de loading
- Texto instrutivo

---

### SettingsItem
Item individual para configurações.

**Localização:** `src/components/molecules/SettingsItem/`

**Props:**
```typescript
interface SettingsItemProps {
  title: string;
  subtitle: string;
  icon: string;
  onPress?: () => void;
  disabled?: boolean;
  children?: React.ReactNode;
  showChevron?: boolean;
}
```

**Funcionalidades:**
- Ícone personalizado
- Conteúdo adicional (switches, etc.)
- Estados disabled
- Indicador de navegação (chevron)

---

### TransactionsList
Lista inteligente de transações com agrupamento.

**Localização:** `src/components/molecules/TransactionsList/`

**Props:**
```typescript
interface TransactionsListProps {
  transactions: Transaction[];
}
```

**Funcionalidades:**
- Agrupamento automático por data
- Separadores visuais ("Hoje", "Ontem", "Junho 2025")
- Performance otimizada com SectionList
- Estados vazios

**Lógica de Agrupamento:**
```typescript
const getGroupKey = (dateString: string): string => {
  const date = new Date(dateString);
  const today = new Date();
  
  if (isSameDay(date, today)) return "Hoje";
  if (isSameDay(date, yesterday)) return "Ontem";
  if (isSameMonth(date, today)) return formatDate(date, 'dd');
  return formatDate(date, 'MMMM yyyy');
};
```

## 🖥️ Screens (Telas Completas)

### Dashboard
Tela principal com resumo financeiro.

**Localização:** `src/components/screens/Dashboard/`

**Componentes Utilizados:**
- `BalanceCard` - Cards de saldo
- `CategoriesCard` - Gráfico de categorias
- `EstimatedSavingsCard` - Economia estimada
- `TransactionsListItem` - Últimas transações

**Layout:**
- ScrollView vertical
- Cards em grid responsivo
- Seções bem definidas

---

### Transactions
Listagem completa de transações.

**Localização:** `src/components/screens/Transactions/`

**Funcionalidades:**
- Lista paginada
- Filtros por categoria
- Busca por texto
- Ordenação por data
- Ações inline

---

### BudgetsList
Gerenciamento de orçamentos.

**Localização:** `src/components/screens/BudgetsList/`

**Funcionalidades:**
- Lista de orçamentos
- Progresso visual
- Criação/edição via modal
- Exclusão com confirmação

---

### CategoriesList
Gestão de categorias.

**Localização:** `src/components/screens/CategoriesList/`

**Funcionalidades:**
- Filtros por tipo (receita/despesa)
- Criação com color picker
- Edição inline
- Validação de unicidade

## 🎨 Padrões de Desenvolvimento

### Estrutura de Arquivo
Cada componente segue a mesma estrutura:

```
ComponentName/
├── index.tsx       # Lógica e JSX
└── styles.ts       # Estilos responsivos
```

### Pattern de Estilos
```typescript
// styles.ts
import { ThemeType } from '@/contexts/ThemeContext';
import { StyleSheet } from 'react-native';
import { colors } from '@/constants/theme';

export const styles = (theme: ThemeType) => StyleSheet.create({
  container: {
    backgroundColor: colors.theme[theme].background,
    // ... outros estilos
  },
});
```

### Pattern de Componente
```typescript
// index.tsx
import React from 'react';
import { View } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { styles } from './styles';

interface ComponentProps {
  // props interface
}

export const Component = ({ ...props }: ComponentProps) => {
  const { theme } = useTheme();
  const style = styles(theme);

  return (
    <View style={style.container}>
      {/* JSX content */}
    </View>
  );
};
```

### Boas Práticas

1. **Props Interface**: Sempre definir interface para props
2. **Theme Hook**: Usar `useTheme()` para estilos responsivos
3. **Memoização**: Usar `React.memo()` para componentes pesados
4. **Error Boundaries**: Implementar para componentes críticos
5. **Accessibility**: Adicionar props de acessibilidade
6. **TypeScript**: Tipagem estrita em todas as props e estados

### Convenções de Nomenclatura

- **Componentes**: PascalCase (`ButtonPrimary`)
- **Props**: camelCase (`onButtonPress`)
- **Arquivos**: PascalCase para componentes (`Button/index.tsx`)
- **Constantes**: UPPER_SNAKE_CASE (`BUTTON_SIZES`)

---

*Documentação atualizada em: Julho 2025*
