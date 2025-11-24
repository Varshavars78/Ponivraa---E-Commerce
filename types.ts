export interface Product {
  id: string;
  name: string;
  category: 'Honey' | 'Oils' | 'Fruits' | 'Other';
  description: string;
  price: number;
  discountPrice?: number;
  imageUrl: string;
  stock: number;
  isSeasonal: boolean;
  status: 'active' | 'inactive';
  reviews?: Review[];
}

export interface Review {
  id: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface UserDetails {
  name: string;
  email: string;
  phone: string;
  address: string;
  pincode: string;
}

export interface User {
  id: string;
  username: string;
  password?: string;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  role: 'admin' | 'customer';
}

export interface Order {
  id: string;
  userId?: string;
  userDetails: UserDetails;
  items: CartItem[];
  totalAmount: number;
  transactionId: string;
  paymentMethod: 'UPI' | 'Razorpay';
  paymentStatus: 'Pending' | 'Verified' | 'Failed';
  orderStatus: 'Pending' | 'Processing' | 'Packed' | 'Shipped' | 'Delivered' | 'Cancelled';
  adminNotes?: string;
  createdAt: string;
}

export interface PaymentSettings {
  upiEnabled: boolean;
  razorpayEnabled: boolean;
}

export interface AdminStats {
  totalSales: number;
  totalOrders: number;
  pendingOrders: number;
  lowStockItems: number;
}

export enum Category {
    HONEY = 'Honey',
    OILS = 'Oils',
    FRUITS = 'Fruits',
    OTHER = 'Other'
}