export const formatCurrency = (amount, currency = 'INR') => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency,
  }).format(amount);
};

export const formatPrice = (amount) => {
  return amount.toFixed(2);
};

export const calculatePercentage = (amount, percentage) => {
  return (amount * percentage) / 100;
};

export const calculateTax = (subtotal, rate = 5) => {
  return calculatePercentage(subtotal, rate);
};

export const calculateDeliveryFee = (subtotal, freeDeliveryThreshold = 500, deliveryFee = 50) => {
  return subtotal >= freeDeliveryThreshold ? 0 : deliveryFee;
};
