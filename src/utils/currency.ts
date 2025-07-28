/**
 * Formata um valor numérico para a representação em moeda brasileira
 * @param value - Valor a ser formatado (number ou string)
 * @param options - Opções de formatação
 * @returns String no formato "R$ 1.234,56"
 */
export function formatCurrency(
  value: number | string,
  options: {
    showThousandsSeparator?: boolean;
    showSymbol?: boolean;
  } = {}
): string {
  const {
    showThousandsSeparator = true,
    showSymbol = true,
  } = options;

  // Converter string para número se necessário
  const numValue = typeof value === 'string' ? parseFloat(value) : value;
  
  // Verificar se é um número válido
  if (isNaN(numValue)) {
    return showSymbol ? 'R$ 0,00' : '0,00';
  }

  // Formatar com 2 casas decimais
  const formatted = numValue.toFixed(2);
  
  // Substituir ponto por vírgula para decimal
  let result = formatted.replace('.', ',');
  
  // Adicionar separador de milhares se solicitado
  if (showThousandsSeparator) {
    const parts = result.split(',');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    result = parts.join(',');
  }
  
  // Adicionar símbolo da moeda se solicitado
  return showSymbol ? `R$ ${result}` : result;
}

/**
 * Versão simplificada sem separador de milhares
 * Mantida para compatibilidade com componentes que não precisam de separador
 */
export function formatCurrencySimple(value: number | string): string {
  return formatCurrency(value, { showThousandsSeparator: false });
}

/**
 * Versão com separador de milhares
 * Para valores maiores onde o separador é importante para legibilidade
 */
export function formatCurrencyWithThousands(value: number | string): string {
  return formatCurrency(value, { showThousandsSeparator: true });
}
