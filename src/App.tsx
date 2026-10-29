/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { Header } from './components/Header';
import { HeroBanner } from './components/HeroBanner';
import { CategoryNav } from './components/CategoryNav';
import { MenuItemCard } from './components/MenuItemCard';
import { OrderModeSelector } from './components/OrderModeSelector';
import { CustomizationModal } from './components/CustomizationModal';
import { CartDrawer } from './components/CartDrawer';
import { OrderTrackerModal } from './components/OrderTrackerModal';
import { OrderHistoryModal } from './components/OrderHistoryModal';
import { CampusCountersModal } from './components/CampusCountersModal';
import { ActiveOrderBanner } from './components/ActiveOrderBanner';
import { CheckoutModal } from './components/CheckoutModal';
import { Footer } from './components/Footer';

import {
  MenuItem,
  MenuCategory,
  CartItem,
  OrderMode,
  CampusLocation,
  Order,
  OrderStatus,
  CartItemCustomization,
} from './types/canteen';
import {
  CANTEEN_MENU,
  CAMPUS_COUNTERS,
  CAMPUS_LOCATIONS,
  CANTEEN_NOTICES,
} from './data/canteenData';
import { playClickSound, playChimeSound } from './utils/audio';
import {
  Store,
  MapPin,
  Clock,
  Sparkles,
  Info,
  SlidersHorizontal,
  Flame,
  CheckCircle,
} from 'lucide-react';

export default function App() {
  // --- Persistent & Core States ---
  const [orderMode, setOrderMode] = useState<OrderMode>(() => {
    return (localStorage.getItem('mjpru_order_mode') as OrderMode) || 'pickup';
  });

  const [selectedCounterId, setSelectedCounterId] = useState<1 | 2 | 3 | 4>(() => {
    const saved = localStorage.getItem('mjpru_counter_id');
    return saved ? (parseInt(saved, 10) as 1 | 2 | 3 | 4) : 1;
  });

  const [selectedLocation, setSelectedLocation] = useState<CampusLocation>(() => {
    const savedId = localStorage.getItem('mjpru_location_id');
    const found = CAMPUS_LOCATIONS.find((l) => l.id === savedId);
    return found || CAMPUS_LOCATIONS[0];
  });

  const [roomDetails, setRoomDetails] = useState<string>(() => {
    return localStorage.getItem('mjpru_room_details') || '';
  });

  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('mjpru_canteen_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem('mjpru_canteen_orders');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [activeOrderId, setActiveOrderId] = useState<string | null>(() => {
    return localStorage.getItem('mjpru_active_order_id') || null;
  });

  // Filter & Search states
  const [activeCategory, setActiveCategory] = useState<MenuCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [bestsellerOnly, setBestsellerOnly] = useState(false);
  const [maxPrice, setMaxPrice] = useState<number>(100);

  // Modals
  const [isModeSelectorOpen, setIsModeSelectorOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isTrackerOpen, setIsTrackerOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isCountersOpen, setIsCountersOpen] = useState(false);
  const [customizingItem, setCustomizingItem] = useState<MenuItem | null>(null);

  // Toast message
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem('mjpru_order_mode', orderMode);
  }, [orderMode]);

  useEffect(() => {
    localStorage.setItem('mjpru_counter_id', selectedCounterId.toString());
  }, [selectedCounterId]);

  useEffect(() => {
    localStorage.setItem('mjpru_location_id', selectedLocation.id);
  }, [selectedLocation]);

  useEffect(() => {
    localStorage.setItem('mjpru_room_details', roomDetails);
  }, [roomDetails]);

  useEffect(() => {
    localStorage.setItem('mjpru_canteen_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('mjpru_canteen_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    if (activeOrderId) {
      localStorage.setItem('mjpru_active_order_id', activeOrderId);
    } else {
      localStorage.removeItem('mjpru_active_order_id');
    }
  }, [activeOrderId]);

  // Active order object
  const activeOrder = useMemo(() => {
    return orders.find((o) => o.id === activeOrderId) || null;
  }, [orders, activeOrderId]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2500);
  };

  // Cart operations
  const cartCount = cart.reduce((acc, curr) => acc + curr.quantity, 0);
  const cartSubtotal = cart.reduce((acc, curr) => {
    return acc + (curr.menuItem.price + curr.customizationExtraCost) * curr.quantity;
  }, 0);

  const handleAddToCart = (
    item: MenuItem,
    customizations?: CartItemCustomization,
    extraCost: number = 0,
    specialInstructions?: string
  ) => {
    playClickSound();

    // build deterministic key
    const customKey = customizations ? JSON.stringify(customizations) : 'standard';
    const cartItemId = `${item.id}-${customKey}`;

    setCart((prev) => {
      const existing = prev.find((i) => i.id === cartItemId);
      if (existing) {
        return prev.map((i) =>
          i.id === cartItemId ? { ...i, quantity: i.quantity + 1 } : i
        );
      } else {
        return [
          ...prev,
          {
            id: cartItemId,
            menuItem: item,
            quantity: 1,
            customizations,
            customizationExtraCost: extraCost,
            specialInstructions,
          },
        ];
      }
    });

    showToast(`Added ${item.name} to Tray`);
  };

  const handleRemoveFromCart = (item: MenuItem) => {
    playClickSound();
    setCart((prev) => {
      // Find the first matching cart item for this menu item
      const index = prev.findIndex((i) => i.menuItem.id === item.id);
      if (index === -1) return prev;

      const target = prev[index];
      if (target.quantity > 1) {
        return prev.map((i, idx) =>
          idx === index ? { ...i, quantity: i.quantity - 1 } : i
        );
      } else {
        return prev.filter((_, idx) => idx !== index);
      }
    });
  };

  const handleUpdateCartQuantity = (cartItemId: string, delta: number) => {
    playClickSound();
    setCart((prev) => {
      return prev
        .map((i) => {
          if (i.id === cartItemId) {
            const newQ = i.quantity + delta;
            return newQ > 0 ? { ...i, quantity: newQ } : null;
          }
          return i;
        })
        .filter(Boolean) as CartItem[];
    });
  };

  const handleRemoveCartItem = (cartItemId: string) => {
    playClickSound();
    setCart((prev) => prev.filter((i) => i.id === cartItemId));
  };

  const handleClearCart = () => {
    setCart([]);
  };

  // Place Order Handler
  const handlePlaceOrder = (orderData: Partial<Order>) => {
    playChimeSound();

    // Generate readable campus token: e.g. "MJP-142"
    const randomNum = Math.floor(100 + Math.random() * 900);
    const tokenNumber = `MJP-${randomNum}`;
    const orderId = `ord-${Date.now()}`;

    const newOrder: Order = {
      id: orderId,
      tokenNumber,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      items: [...cart],
      orderMode: orderData.orderMode || orderMode,
      counterId: orderData.counterId || selectedCounterId,
      deliveryLocation: orderData.deliveryLocation || selectedLocation,
      departmentOrHostel: orderData.departmentOrHostel || selectedLocation.name,
      roomDetails: orderData.roomDetails || roomDetails,
      studentName: orderData.studentName || 'Student',
      contactNumber: orderData.contactNumber || '',
      studentRollNumber: orderData.studentRollNumber || 'MJPRU-STUDENT',
      isBulkOrder: orderData.isBulkOrder || false,
      subtotal: orderData.subtotal || cartSubtotal,
      discount: orderData.discount || 0,
      packagingFee: orderData.packagingFee || 0,
      total: orderData.total || cartSubtotal,
      paymentMethod: 'counter_upi_qr', // 'Pay at Counter / UPI QR on Pickup'
      status: 'placed',
      estimatedCompletionTime: orderData.orderMode === 'delivery' ? '~14 mins' : '~6 mins',
    };

    setOrders((prev) => [newOrder, ...prev]);
    setActiveOrderId(newOrder.id);
    setCart([]);
    setIsCartOpen(false);
    setIsCheckoutOpen(false);
    setIsTrackerOpen(true);
  };

  const handleUpdateOrderStatus = (orderId: string, nextStatus: OrderStatus) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: nextStatus } : o))
    );
  };

  // Reorder past order
  const handleReorder = (pastOrder: Order) => {
    pastOrder.items.forEach((item) => {
      handleAddToCart(
        item.menuItem,
        item.customizations,
        item.customizationExtraCost,
        item.specialInstructions
      );
    });
    setIsCartOpen(true);
    showToast(`Items from token ${pastOrder.tokenNumber} added to tray!`);
  };

  // Filtering calculations
  const categoryCounts = useMemo(() => {
    const counts: Record<MenuCategory, number> = {
      all: CANTEEN_MENU.length,
      snacks: 0,
      meals: 0,
      beverages: 0,
      'quick-bites': 0,
      combos: 0,
    };
    CANTEEN_MENU.forEach((item) => {
      if (counts[item.category] !== undefined) {
        counts[item.category]++;
      }
    });
    return counts;
  }, []);

  const filteredMenuItems = useMemo(() => {
    return CANTEEN_MENU.filter((item) => {
      // Category filter
      if (activeCategory !== 'all' && item.category !== activeCategory) {
        return false;
      }
      // Bestseller filter
      if (bestsellerOnly && !item.isBestseller) {
        return false;
      }
      // Price filter
      if (item.price > maxPrice) {
        return false;
      }
      // Search filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = item.name.toLowerCase().includes(q);
        const matchesHindi = item.hindiName?.toLowerCase().includes(q);
        const matchesDesc = item.description.toLowerCase().includes(q);
        const matchesTags = item.tags?.some((t) => t.toLowerCase().includes(q));
        if (!matchesName && !matchesHindi && !matchesDesc && !matchesTags) {
          return false;
        }
      }
      return true;
    });
  }, [activeCategory, bestsellerOnly, maxPrice, searchQuery]);

  return (
    <div className="min-h-screen bg-[#faf8f5] text-stone-900 flex flex-col font-sans selection:bg-orange-500 selection:text-white">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-4 z-50 bg-stone-900 text-white px-4 py-2.5 rounded-xl shadow-xl border border-stone-700 text-xs font-semibold flex items-center gap-2 animate-in fade-in slide-in-from-top duration-200">
          <CheckCircle className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Header */}
      <Header
        orderMode={orderMode}
        selectedLocation={selectedLocation}
        selectedCounterId={selectedCounterId}
        cartCount={cartCount}
        cartSubtotal={cartSubtotal}
        onOpenModeSelector={() => setIsModeSelectorOpen(true)}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenHistory={() => setIsHistoryOpen(true)}
        onOpenCounters={() => setIsCountersOpen(true)}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        hasActiveOrder={!!activeOrder && activeOrder.status !== 'completed'}
        onOpenActiveOrder={() => setIsTrackerOpen(true)}
      />

      {/* Campus Notice Ticker */}
      <div className="bg-amber-100/70 border-b border-amber-200/80 px-4 py-2 text-xs text-amber-900">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 overflow-x-auto whitespace-nowrap scrollbar-none">
          <div className="flex items-center gap-4">
            {CANTEEN_NOTICES.map((notice) => (
              <div key={notice.id} className="flex items-center gap-1.5 font-medium">
                <span className="font-bold text-orange-800">{notice.title}:</span>
                <span className="text-stone-700">{notice.detail}</span>
                <span className="text-amber-400 font-bold ml-3" aria-hidden="true">·</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Page Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6">
        {/* Hero Section */}
        <HeroBanner
          orderMode={orderMode}
          selectedCounterId={selectedCounterId}
          selectedLocation={selectedLocation}
          onOpenModeSelector={() => setIsModeSelectorOpen(true)}
          onFilterCategory={(cat) => {
            setActiveCategory(cat);
            window.scrollTo({ top: 320, behavior: 'smooth' });
          }}
        />

        {/* Category Navigation Bar */}
        <CategoryNav
          activeCategory={activeCategory}
          onSelectCategory={(cat) => {
            setActiveCategory(cat);
          }}
          categoryCounts={categoryCounts}
        />

        {/* Quick Filter Controls Bar */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3 text-xs bg-white p-3.5 rounded-2xl border border-stone-200/80 shadow-xs">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-bold text-stone-700 flex items-center gap-1 mr-1">
              <SlidersHorizontal className="w-3.5 h-3.5 text-stone-400" />
              Quick Filters:
            </span>

            <button
              onClick={() => setBestsellerOnly((prev) => !prev)}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
                bestsellerOnly
                  ? 'bg-amber-500 text-stone-900 shadow-xs'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              🔥 Student Bestsellers Only
            </button>

            <button
              onClick={() => {
                if (orderMode === 'pickup') {
                  setIsCountersOpen(true);
                } else {
                  setIsModeSelectorOpen(true);
                }
              }}
              className="px-3 py-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 font-semibold transition-colors flex items-center gap-1"
            >
              <Store className="w-3.5 h-3.5 text-orange-600" />
              <span>
                {orderMode === 'pickup'
                  ? `Counter ${selectedCounterId} Menu Focus`
                  : `Delivery to ${selectedLocation.name.split('-')[0]}`}
              </span>
            </button>
          </div>

          {/* Result Count and Reset */}
          <div className="flex items-center gap-3 text-stone-500">
            <span>
              Showing <strong className="text-stone-900">{filteredMenuItems.length}</strong> items
            </span>
            {(bestsellerOnly || searchQuery || activeCategory !== 'all') && (
              <button
                onClick={() => {
                  setBestsellerOnly(false);
                  setSearchQuery('');
                  setActiveCategory('all');
                }}
                className="text-orange-700 font-bold hover:underline"
              >
                Reset filters
              </button>
            )}
          </div>
        </div>

        {/* Menu Items Grid */}
        {filteredMenuItems.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-stone-200 max-w-md mx-auto my-8">
            <div className="text-4xl mb-3">🔍</div>
            <h3 className="text-base font-bold text-stone-800">No canteen items found</h3>
            <p className="text-xs text-stone-500 mt-1">
              Try searching for "Samosa", "Chai", "Thali", or select "All Canteen Items".
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setActiveCategory('all');
                setBestsellerOnly(false);
              }}
              className="mt-4 px-4 py-2 bg-orange-600 text-white rounded-xl text-xs font-bold shadow-xs hover:bg-orange-700"
            >
              Show Full Campus Menu
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filteredMenuItems.map((item) => {
              // Calculate how many of this item is in the cart
              const quantityInCart = cart
                .filter((cartItem) => cartItem.menuItem.id === item.id)
                .reduce((s, it) => s + it.quantity, 0);

              return (
                <MenuItemCard
                  key={item.id}
                  item={item}
                  quantityInCart={quantityInCart}
                  onAddToCart={(it) => handleAddToCart(it)}
                  onRemoveFromCart={(it) => handleRemoveFromCart(it)}
                  onOpenCustomization={(it) => setCustomizingItem(it)}
                />
              );
            })}
          </div>
        )}

        {/* Campus Canteen Highlights / Guide Section */}
        <section className="mt-14 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-amber-50 via-orange-50 to-amber-50 border border-amber-200/60">
          <div className="max-w-3xl">
            <span className="text-xs font-bold text-orange-700 uppercase tracking-wider">
              Student Guide · MJPRU Bareilly
            </span>
            <h3 className="text-xl sm:text-2xl font-black text-stone-900 font-display mt-1 mb-2">
              How the Campus Express Ordering Works
            </h3>
            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed mb-6">
              During exam weeks and lunch intervals (1:00 PM – 2:30 PM), the central canteen encounters heavy rushes. Our express token system saves you 15-20 minutes of queue time.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div className="p-4 rounded-2xl bg-white border border-stone-200/80 shadow-xs">
                <div className="w-7 h-7 rounded-lg bg-orange-600 text-white flex items-center justify-center font-bold text-xs mb-2">
                  1
                </div>
                <div className="font-bold text-stone-900 mb-1">Choose Mode</div>
                <p className="text-stone-500 text-[11px] leading-relaxed">
                  Select your food counter for self-pickup or pick your hostel / FET department for runner delivery.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-white border border-stone-200/80 shadow-xs">
                <div className="w-7 h-7 rounded-lg bg-orange-600 text-white flex items-center justify-center font-bold text-xs mb-2">
                  2
                </div>
                <div className="font-bold text-stone-900 mb-1">Get Digital Token</div>
                <p className="text-stone-500 text-[11px] leading-relaxed">
                  Your token (#MJP-xxx) is immediately allocated and dispatched to the respective kitchen counter display.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-white border border-stone-200/80 shadow-xs">
                <div className="w-7 h-7 rounded-lg bg-orange-600 text-white flex items-center justify-center font-bold text-xs mb-2">
                  3
                </div>
                <div className="font-bold text-stone-900 mb-1">Buzzer Alert &amp; Eat</div>
                <p className="text-stone-500 text-[11px] leading-relaxed">
                  Receive a live chime and on-screen buzzer when food is ready. Show token to collect piping hot food!
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Active Order Float Widget */}
      <ActiveOrderBanner
        order={activeOrder}
        onOpenTracker={() => setIsTrackerOpen(true)}
      />

      {/* Footer */}
      <Footer />

      {/* Modals & Drawers */}
      <OrderModeSelector
        isOpen={isModeSelectorOpen}
        onClose={() => setIsModeSelectorOpen(false)}
        currentMode={orderMode}
        onSelectMode={setOrderMode}
        selectedCounterId={selectedCounterId}
        onSelectCounter={setSelectedCounterId}
        selectedLocation={selectedLocation}
        onSelectLocation={setSelectedLocation}
        roomDetails={roomDetails}
        onRoomDetailsChange={setRoomDetails}
      />

      <CustomizationModal
        item={customizingItem}
        isOpen={!!customizingItem}
        onClose={() => setCustomizingItem(null)}
        onConfirm={(item, customizations, extraCost, instructions) => {
          handleAddToCart(item, customizations, extraCost, instructions);
          setCustomizingItem(null);
        }}
      />

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cart}
        orderMode={orderMode}
        selectedCounterId={selectedCounterId}
        selectedLocation={selectedLocation}
        roomDetails={roomDetails}
        onOpenModeSelector={() => {
          setIsCartOpen(false);
          setIsModeSelectorOpen(true);
        }}
        onOpenCheckout={() => {
          setIsCartOpen(false);
          setIsCheckoutOpen(true);
        }}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveCartItem}
        onClearCart={handleClearCart}
      />

      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        items={cart}
        currentOrderMode={orderMode}
        selectedCounterId={selectedCounterId}
        selectedLocation={selectedLocation}
        roomDetails={roomDetails}
        onPlaceOrder={handlePlaceOrder}
      />

      <OrderTrackerModal
        order={activeOrder}
        isOpen={isTrackerOpen}
        onClose={() => setIsTrackerOpen(false)}
        onUpdateStatus={handleUpdateOrderStatus}
      />

      <OrderHistoryModal
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        orders={orders}
        onSelectOrder={(ord) => {
          setActiveOrderId(ord.id);
          setIsTrackerOpen(true);
        }}
        onReorder={handleReorder}
      />

      <CampusCountersModal
        isOpen={isCountersOpen}
        onClose={() => setIsCountersOpen(false)}
        selectedCounterId={selectedCounterId}
        onSelectCounter={(id) => {
          setSelectedCounterId(id);
          setOrderMode('pickup');
        }}
      />
    </div>
  );
}
