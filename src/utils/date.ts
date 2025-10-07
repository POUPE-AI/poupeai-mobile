import {
  parseISO,
  isToday,
  isYesterday,
  isSameMonth,
  format,
  isValid,
} from "date-fns";
import { ptBR } from "date-fns/locale";

export const FormatDate = (dateString: string) => {
  const date = parseISO(dateString);

  if (!isValid(date)) {
    return "Data inválida";
  }

  if (isToday(date)) {
    return "Hoje";
  }

  if (isYesterday(date)) {
    return "Ontem";
  }

  if (isSameMonth(date, new Date())) {
    return format(date, "dd/MM/yyyy", { locale: ptBR });
  }

  const capitalizeFirstLetter = (str: string): string => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  return capitalizeFirstLetter(
    format(date, "MMMM 'de' yyyy", { locale: ptBR })
  );
};

export const formatDateTime = (dateString: string): string => {
  const date = parseISO(dateString);
  if (!isValid(date)) {
    return "Data inválida";
  }

  return format(date, "dd/MM/yyyy HH:mm", { locale: ptBR });
};

export const formatDate_DDMMYYYY = (dateString: string): string => {
  const date = parseISO(dateString);
  if (!isValid(date)) {
    return "Data inválida";
  }

  return format(date, "dd/MM/yyyy", { locale: ptBR });
};
