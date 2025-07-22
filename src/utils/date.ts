export const FormatDate = (dateString: string) => {
    const date = new Date(dateString);

    if (isNaN(date.getTime())) {
      return 'Data inválida';
    }

    if (date.toDateString() === new Date().toDateString()) {
      return 'Hoje';
    }

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    if (date.toDateString() === yesterday.toDateString()) {
      return 'Ontem';
    }

    const currentMonth = new Date().getMonth();
    if (date.getMonth() === currentMonth) {
      return date.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    }

    const capitalizeFirstLetter = (str: string): string => {
      return str.charAt(0).toUpperCase() + str.slice(1);
    };
    
    return capitalizeFirstLetter(date.toLocaleDateString('pt-BR', {
      month: 'long',
      year: 'numeric'
    }));
  }