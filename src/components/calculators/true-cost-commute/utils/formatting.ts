export const formatNumberWithCommas = (value: number): string => {
    if (isNaN(value)) return '';
    return value.toLocaleString('en-US');
  };