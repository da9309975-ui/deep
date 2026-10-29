export type MenuCategory = 'all' | 'snacks' | 'meals' | 'beverages' | 'quick-bites' | 'combos';

export interface MenuItem {
  id: string;
  name: string;
  hindiName?: string;
  category: 'snacks' | 'meals' | 'beverages' | 'quick-bites' | 'combos';
  price: number;
  originalPrice?: number;
  description: string;
  image: string;
  counterId: 1 | 2 | 3 | 4; // 1: Snacks, 2: Meals/Thali, 3: Beverages, 4: Quick Bites
  prepTimeMinutes: number;
  isVegetarian: boolean;
  spiceLevel?: 'Mild' | 'Medium' | 'Spicy';
  isBestseller?: boolean;
  isAvailable: boolean;
  tags?: string[];
  customizationOptions?: {
    name: string;
    choices: { label: string; extraPrice: number }[];
  }[];
}

export interface CartItemCustomization {
  [optionName: string]: string;
}

export interface CartItem {
  id: string; // unique item cart id (itemId + options serialized)
  menuItem: MenuItem;
  quantity: number;
  customizations?: CartItemCustomization;
  customizationExtraCost: number;
  specialInstructions?: string;
}

export type OrderMode = 'pickup' | 'delivery';

export interface CampusLocation {
  id: string;
  name: string;
  zone: 'Engineering' | 'Hostels' | 'Admin & Library' | 'Management & Sciences' | 'Sports & Ground';
  landmark: string;
  avgDeliveryMinutes: number;
}

export interface CampusCounter {
  id: 1 | 2 | 3 | 4;
  name: string;
  hindiTitle: string;
  description: string;
  currentQueue: number;
  avgWaitMins: number;
  chefInCharge: string;
  accentColor: string;
}

export type OrderStatus = 'placed' | 'preparing' | 'ready' | 'completed';

export interface Order {
  id: string;
  tokenNumber: string; // e.g. "MJP-108"
  timestamp: string;
  items: CartItem[];
  orderMode: OrderMode;
  counterId?: 1 | 2 | 3 | 4;
  deliveryLocation?: CampusLocation;
  departmentOrHostel: string;
  roomDetails?: string;
  contactNumber: string;
  studentName: string;
  studentRollNumber: string;
  isBulkOrder?: boolean;
  subtotal: number;
  discount: number;
  packagingFee: number;
  total: number;
  paymentMethod: 'counter_upi_qr'; // 'Pay at Counter / UPI QR on Pickup'
  status: OrderStatus;
  estimatedCompletionTime: string;
}
