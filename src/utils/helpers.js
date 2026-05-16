export const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

export const truncateAddress = (address) => {
  if (!address) return '';
  return `${address.substring(0, 6)}...${address.substring(38)}`;
};

export const formatPrice = (price) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(price);
};

export const getStatusColor = (status) => {
  const colors = {
    PENDING: 'yellow',
    CONFIRMED: 'blue',
    SHIPPED: 'purple',
    DELIVERED: 'green',
    CANCELLED: 'red'
  };
  return colors[status] || 'gray';
};