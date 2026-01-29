import { menuItems, categories } from '@/data/menu.js';
import { getItem, setItem, STORAGE_KEYS } from '@/utils/storage.js';

const delay = (min = 300, max = 800) => {
  const ms = Math.floor(Math.random() * (max - min + 1)) + min;
  return new Promise((resolve) => setTimeout(resolve, ms));
};

const simulateError = () => {
  if (Math.random() < 0.05) {
    throw new Error('Network request failed. Please try again.');
  }
};

export const fetchMenu = async (categoryId = null) => {
  await delay();
  simulateError();

  if (categoryId) {
    return menuItems.filter((item) => item.category === categoryId);
  }

  return menuItems;
};

export const fetchCategories = async () => {
  await delay(200, 400);
  simulateError();

  return categories;
};

export const fetchItemDetails = async (itemId) => {
  await delay();
  simulateError();

  const item = menuItems.find((item) => item.id === itemId);
  return item || null;
};

export const searchMenuItems = async (query) => {
  await delay(200, 500);
  simulateError();

  if (!query || query.trim() === '') {
    return [];
  }

  const lowerQuery = query.toLowerCase();

  return menuItems.filter((item) => {
    const nameMatch = item.name.toLowerCase().includes(lowerQuery);
    const descriptionMatch = item.description.toLowerCase().includes(lowerQuery);
    const tagsMatch = item.tags.some((tag) => tag.toLowerCase().includes(lowerQuery));

    return nameMatch || descriptionMatch || tagsMatch;
  });
};

export const submitOrder = async (orderData) => {
  await delay(1000, 2000);
  simulateError();

  const orderId = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

  const order = {
    ...orderData,
    orderId,
    status: 'pending',
    createdAt: Date.now(),
    updatedAt: Date.now(),
    estimatedTime: 45,
  };

  const orders = getItem(STORAGE_KEYS.ORDERS, []);
  orders.unshift(order);
  setItem(STORAGE_KEYS.ORDERS, orders);

  return order;
};

export const fetchOrderHistory = async () => {
  await delay();
  simulateError();

  const orders = getItem(STORAGE_KEYS.ORDERS, []);
  return orders.sort((a, b) => b.createdAt - a.createdAt);
};

export const fetchOrderById = async (orderId) => {
  await delay();
  simulateError();

  const orders = getItem(STORAGE_KEYS.ORDERS, []);
  const order = orders.find((o) => o.orderId === orderId);
  return order || null;
};
export const updateOrderStatus = async (orderId, newStatus) => {
  await delay();
  simulateError();

  const orders = getItem(STORAGE_KEYS.ORDERS, []);
  const orderIndex = orders.findIndex((o) => o.orderId === orderId);

  if (orderIndex === -1) {
    throw new Error('Order not found');
  }

  orders[orderIndex].status = newStatus;
  orders[orderIndex].updatedAt = Date.now();

  setItem(STORAGE_KEYS.ORDERS, orders);

  return orders[orderIndex];
};

export const cancelOrder = async (orderId) => {
  return updateOrderStatus(orderId, 'cancelled');
};

export default {
  fetchMenu,
  fetchCategories,
  fetchItemDetails,
  searchMenuItems,
  submitOrder,
  fetchOrderHistory,
  fetchOrderById,
  updateOrderStatus,
  cancelOrder,
};
