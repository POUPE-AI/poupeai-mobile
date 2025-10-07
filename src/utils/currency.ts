type FormattedCurrencyResult = {
  displayValue: string;
  numericValue: number;
};

/**
 * Processa a entrada de texto para um campo de valor monetário no formato brasileiro.
 * Remove caracteres indesejados, formata para exibição e converte para valor numérico.
 * @param inputText O texto digitado pelo usuário no input.
 * @returns Um objeto contendo 'displayValue' (string formatada) e 'numericValue' (número).
 */
export function formatAndParseCurrency(inputText: string): FormattedCurrencyResult {
  // Substitui o primeiro ponto por vírgula, se não houver vírgula ainda
  if (!inputText.includes(',') && inputText.includes('.')) {
    inputText = inputText.replace('.', ',');
  }

  // Remove todos os caracteres que não sejam dígitos ou vírgula
  let cleanedText = inputText.replace(/[^0-9,]/g, '');

  // Remove vírgulas adicionais, mantendo apenas a primeira
  const parts = cleanedText.split(',');
  if (parts.length > 2) {
    cleanedText = parts[0] + ',' + parts[1]; // descarta as vírgulas extras
  }

  // Trata início com vírgula
  if ((cleanedText.startsWith(',') && cleanedText.length > 1)) {
    cleanedText = '0' + cleanedText;
  }

  // Se for apenas vírgula, retorna 0,
  if (cleanedText === ',') {
    return {
      displayValue: '0,',
      numericValue: 0,
    };
  }

  const displayValue = cleanedText;
  const valueForParse = cleanedText.replace(',', '.');
  const numericValue = parseFloat(valueForParse);

  return {
    displayValue: displayValue,
    numericValue: isNaN(numericValue) ? 0 : numericValue,
  };
}

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

  const numValue = typeof value === 'string' ? parseFloat(value) : value;

  if (isNaN(numValue)) {
    return showSymbol ? 'R$ 0,00' : '0,00';
  }

  const formatted = numValue.toFixed(2);

  let result = formatted.replace('.', ',');

  if (showThousandsSeparator) {
    const parts = result.split(',');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    result = parts.join(',');
  }

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