export const formatCurrency = (num) =>
    new Intl.NumberFormat("ru-RU").format(num);