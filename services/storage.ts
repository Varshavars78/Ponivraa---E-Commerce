import { Product, Order, Category, User, Review, PaymentSettings } from '../types';

// Initial Mock Data
const INITIAL_PRODUCTS: Product[] = [
  // HONEY CATEGORY
  {
    id: 'h1',
    name: 'Raw Hill Honey',
    category: 'Honey',
    description: '100% Pure wild honey collected from the Western Ghats hills. Unprocessed and rich in antioxidants.',
    price: 850,
    discountPrice: 799,
    imageUrl: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=800&q=80',
    stock: 50,
    isSeasonal: false,
    status: 'active'
  },
  {
    id: 'h2',
    name: 'Spiced Gulkand Honey',
    category: 'Honey',
    description: 'A unique blend of rose petals and raw honey. A natural coolant.',
    price: 600,
    imageUrl: 'https://images.unsplash.com/photo-1605208467559-9cb6524d1d0a?auto=format&fit=crop&w=800&q=80', // Rose themed honey
    stock: 15,
    isSeasonal: false,
    status: 'active'
  },
  {
    id: 'h3',
    name: 'Fig Honey',
    category: 'Honey',
    description: 'Exquisite honey infused with the richness of Dried Figs (Anjeer). Great for digestion.',
    price: 900,
    imageUrl: 'https://images.unsplash.com/photo-1569854852760-e7137a77d22b?auto=format&fit=crop&w=800&q=80', // Fig representation
    stock: 30,
    isSeasonal: false,
    status: 'active'
  },
  {
    id: 'h4',
    name: 'Amla Honey',
    category: 'Honey',
    description: 'Vitamin C rich Amla soaked in pure honey. Immunity booster.',
    price: 550,
    imageUrl: 'https://images.unsplash.com/photo-1628097748570-034c86325420?auto=format&fit=crop&w=800&q=80', // Gooseberry/Amla
    stock: 40,
    isSeasonal: false,
    status: 'active'
  },
  {
    id: 'h5',
    name: 'Mixed Nuts Honey',
    category: 'Honey',
    description: 'Premium blend of Cashews, Almonds, Walnuts, and Dry Figs in raw honey.',
    price: 1200,
    imageUrl: 'https://images.unsplash.com/photo-1546552701-2c501d09d45c?auto=format&fit=crop&w=800&q=80', // Nuts
    stock: 25,
    isSeasonal: false,
    status: 'active'
  },

  // OILS CATEGORY
  {
    id: 'o1',
    name: 'Cold Pressed Coconut Oil',
    category: 'Oils',
    description: 'Traditional wood-pressed (Chekku) coconut oil in a clear glass bottle. Pure and aromatic.',
    price: 450,
    imageUrl: 'https://images.unsplash.com/photo-1620916297397-a4a5402a3c6c?auto=format&fit=crop&w=800&q=80', // Clear glass bottle oil
    stock: 100,
    isSeasonal: false,
    status: 'active'
  },
  {
    id: 'o2',
    name: 'Sesame Oil (Gingelly)',
    category: 'Oils',
    description: 'Pure sesame oil for authentic South Indian cooking and oil pulling.',
    price: 520,
    imageUrl: 'https://images.unsplash.com/photo-1474979266404-7cadd259d3ae?auto=format&fit=crop&w=800&q=80', // Oil bottle
    stock: 40,
    isSeasonal: false,
    status: 'active'
  },
  {
    id: 'o3',
    name: 'Groundnut Oil',
    category: 'Oils',
    description: 'Cold-pressed Groundnut oil. High smoke point, perfect for frying.',
    price: 380,
    imageUrl: 'https://images.unsplash.com/photo-1599443254958-d045a870305b?auto=format&fit=crop&w=800&q=80', // Peanut oil
    stock: 60,
    isSeasonal: false,
    status: 'active'
  },
  {
    id: 'o4',
    name: "Ponivraa's Herbo Heal Oil",
    category: 'Oils',
    description: 'Special herbal blend for joint pain relief and muscle relaxation.',
    price: 750,
    imageUrl: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=800&q=80', // Herbal oil
    stock: 20,
    isSeasonal: false,
    status: 'active'
  },
  {
    id: 'o5',
    name: 'Essential Oils',
    category: 'Oils',
    description: 'Concentrated essence of nature. Perfect for aromatherapy and wellness.',
    price: 950,
    imageUrl: 'https://images.unsplash.com/photo-1608571423902-eed4a5e84e43?auto=format&fit=crop&w=800&q=80', // Essential oil
    stock: 25,
    isSeasonal: false,
    status: 'active'
  },

  // FRUITS CATEGORY
  {
    id: 'f1',
    name: 'Organic Alphonso Mangoes',
    category: 'Fruits',
    description: 'Farm fresh, chemical-free mangoes. Sold per dozen.',
    price: 1200,
    imageUrl: 'https://images.unsplash.com/photo-1601493700631-2b16ec4b4716?auto=format&fit=crop&w=800&q=80',
    stock: 20,
    isSeasonal: true,
    status: 'active'
  },
  {
    id: 'f2',
    name: 'Fresh Guavas',
    category: 'Fruits',
    description: 'Crunchy, sweet, and vitamin C packed farm-fresh guavas.',
    price: 150,
    imageUrl: 'https://images.unsplash.com/photo-1536510233921-8e50433ce6db?auto=format&fit=crop&w=800&q=80',
    stock: 35,
    isSeasonal: true,
    status: 'active'
  },
  {
    id: 'f3',
    name: 'Sweet Sapota (Chikoo)',
    category: 'Fruits',
    description: 'Naturally ripened, brown-sugar sweet Sapota.',
    price: 180,
    imageUrl: 'https://images.unsplash.com/photo-1621961048738-a89a29eb3c9f?auto=format&fit=crop&w=800&q=80',
    stock: 25,
    isSeasonal: true,
    status: 'active'
  },
  {
    id: 'f4',
    name: 'Fresh Lime & Lemon',
    category: 'Fruits',
    description: 'Zesty and juicy lemons, perfect for juice or cooking.',
    price: 80,
    imageUrl: 'https://images.unsplash.com/photo-1582126048826-e8c44803673b?auto=format&fit=crop&w=800&q=80',
    stock: 100,
    isSeasonal: false,
    status: 'active'
  },
  {
    id: 'f5',
    name: 'Seasonal Fruits Basket',
    category: 'Fruits',
    description: 'A curated basket of the seasons best harvest. Varies by month.',
    price: 999,
    imageUrl: 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?auto=format&fit=crop&w=800&q=80',
    stock: 10,
    isSeasonal: true,
    status: 'active'
  }
];

const KEYS = {
  PRODUCTS: 'ponivraa_products',
  ORDERS: 'ponivraa_orders',
  CURRENT_USER: 'ponivraa_current_user',
  ALL_USERS: 'ponivraa_all_users',
  PAYMENT_SETTINGS: 'ponivraa_payment_settings'
};

const DEFAULT_PAYMENT_SETTINGS: PaymentSettings = {
  upiEnabled: true,
  razorpayEnabled: false
};

export const StorageService = {
  init: () => {
    // Ensure products are initialized only if empty
    if (!localStorage.getItem(KEYS.PRODUCTS)) {
        localStorage.setItem(KEYS.PRODUCTS, JSON.stringify(INITIAL_PRODUCTS));
    }

    if (!localStorage.getItem(KEYS.ORDERS)) {
      localStorage.setItem(KEYS.ORDERS, JSON.stringify([]));
    }

    if (!localStorage.getItem(KEYS.ALL_USERS)) {
      // Initialize with a default user for testing password reset
      const defaultUser: User = {
        id: 'user-demo',
        username: 'user',
        password: 'user123',
        name: 'Demo User',
        email: 'user@example.com',
        phone: '9876543210',
        role: 'customer',
        address: '123 Farm Lane'
      };
      localStorage.setItem(KEYS.ALL_USERS, JSON.stringify([defaultUser]));
    }

    if (!localStorage.getItem(KEYS.PAYMENT_SETTINGS)) {
      localStorage.setItem(KEYS.PAYMENT_SETTINGS, JSON.stringify(DEFAULT_PAYMENT_SETTINGS));
    }
  },

  getProducts: (): Product[] => {
    const data = localStorage.getItem(KEYS.PRODUCTS);
    return data ? JSON.parse(data) : [];
  },

  getProductById: (id: string): Product | undefined => {
    const products = StorageService.getProducts();
    return products.find(p => p.id === id);
  },

  saveProduct: (product: Product) => {
    const products = StorageService.getProducts();
    const index = products.findIndex(p => p.id === product.id);
    if (index >= 0) {
      products[index] = product;
    } else {
      products.push(product);
    }
    localStorage.setItem(KEYS.PRODUCTS, JSON.stringify(products));
  },

  deleteProduct: (id: string): Product[] => {
    let products = StorageService.getProducts();
    const updatedProducts = products.filter(p => String(p.id) !== String(id));
    localStorage.setItem(KEYS.PRODUCTS, JSON.stringify(updatedProducts));
    return updatedProducts;
  },

  addReview: (productId: string, review: Review) => {
    const products = StorageService.getProducts();
    const index = products.findIndex(p => p.id === productId);
    if (index >= 0) {
      if (!products[index].reviews) {
        products[index].reviews = [];
      }
      products[index].reviews?.push(review);
      localStorage.setItem(KEYS.PRODUCTS, JSON.stringify(products));
    }
  },

  getOrders: (): Order[] => {
    const data = localStorage.getItem(KEYS.ORDERS);
    return data ? JSON.parse(data) : [];
  },

  getUserOrders: (userId: string): Order[] => {
    const orders = StorageService.getOrders();
    return orders.filter(o => o.userId === userId);
  },

  createOrder: (order: Order) => {
    const orders = StorageService.getOrders();
    orders.unshift(order); // Newest first
    localStorage.setItem(KEYS.ORDERS, JSON.stringify(orders));
    
    // Decrease Stock
    const products = StorageService.getProducts();
    order.items.forEach(item => {
        const pIndex = products.findIndex(p => p.id === item.id);
        if (pIndex >= 0) {
            products[pIndex].stock = Math.max(0, products[pIndex].stock - item.quantity);
        }
    });
    localStorage.setItem(KEYS.PRODUCTS, JSON.stringify(products));
  },

  updateOrder: (order: Order) => {
    const orders = StorageService.getOrders();
    const index = orders.findIndex(o => o.id === order.id);
    if (index >= 0) {
      orders[index] = order;
      localStorage.setItem(KEYS.ORDERS, JSON.stringify(orders));
    }
  },

  // --- Auth & User Management ---
  
  getAllUsers: (): User[] => {
    const data = localStorage.getItem(KEYS.ALL_USERS);
    return data ? JSON.parse(data) : [];
  },

  saveUserToDb: (user: User) => {
    const users = StorageService.getAllUsers();
    const index = users.findIndex(u => u.id === user.id || u.username === user.username);
    if (index >= 0) {
      users[index] = { ...users[index], ...user };
    } else {
      users.push(user);
    }
    localStorage.setItem(KEYS.ALL_USERS, JSON.stringify(users));
  },

  findUserByUsername: (username: string): User | undefined => {
    const users = StorageService.getAllUsers();
    return users.find(u => u.username === username);
  },
  
  findUserByEmail: (email: string): User | undefined => {
    const users = StorageService.getAllUsers();
    return users.find(u => u.email === email);
  },

  resetPassword: (email: string, newPassword: string): boolean => {
    const users = StorageService.getAllUsers();
    const index = users.findIndex(u => u.email === email);
    if (index >= 0) {
      users[index].password = newPassword;
      localStorage.setItem(KEYS.ALL_USERS, JSON.stringify(users));
      return true;
    }
    return false;
  },

  login: (user: User) => {
    localStorage.setItem(KEYS.CURRENT_USER, JSON.stringify(user));
    // Ensure user is also updated/saved in the main DB
    StorageService.saveUserToDb(user);
  },
  
  logout: () => {
    localStorage.removeItem(KEYS.CURRENT_USER);
  },

  getCurrentUser: (): User | null => {
    const data = localStorage.getItem(KEYS.CURRENT_USER);
    return data ? JSON.parse(data) : null;
  },
  
  updateCurrentUser: (updatedUser: User) => {
    localStorage.setItem(KEYS.CURRENT_USER, JSON.stringify(updatedUser));
    StorageService.saveUserToDb(updatedUser);
  },

  isAdmin: () => {
    const user = StorageService.getCurrentUser();
    return user?.role === 'admin';
  },

  // --- Payment Settings ---
  getPaymentSettings: (): PaymentSettings => {
    const data = localStorage.getItem(KEYS.PAYMENT_SETTINGS);
    return data ? JSON.parse(data) : DEFAULT_PAYMENT_SETTINGS;
  },

  savePaymentSettings: (settings: PaymentSettings) => {
    localStorage.setItem(KEYS.PAYMENT_SETTINGS, JSON.stringify(settings));
  }
};

// Initialize on load
StorageService.init();