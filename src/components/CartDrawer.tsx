import React from 'react';
import {
  X,
  Trash2,
  Plus,
  Minus,
  Store,
  MapPin,
  ArrowRight,
  ShieldCheck,
  QrCode,
  Sparkles,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';
import { CartItem, OrderMode, CampusLocation } from '../types/canteen';
import { CAMPUS_COUNTERS } from '../data/canteenData';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  orderMode: OrderMode;
  selectedCounterId: 1 | 2 | 3 | 4;
  selectedLocation: CampusLocation;
  roomDetails: string;
  onOpenModeSelector: () => void;
  onOpenCheckout: () => void;
  onUpdateQuantity: (cartItemId: string, delta: number) => void;
  onRemoveItem: (cartItemId: string) => void;
  onClearCart: () => void;
}

const BULK_MIN_AMOUNT = 150;
const BULK_MIN_ITEMS = 4;

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  orderMode,
  selectedCounterId,
  selectedLocation,
  roomDetails,
  onOpenModeSelector,
  onOpenCheckout,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
}) => {
  if (!isOpen) return null;

  const counter = CAMPUS_COUNTERS.find((c) => c.id === selectedCounterId);

  const totalItemCount = items.reduce((s, i) => s + i.quantity, 0);
  const subtotal = items.reduce((acc, curr) => {
    const itemTotal = (curr.menuItem.price + curr.customizationExtraCost) * curr.quantity;
    return acc + itemTotal;
  }, 0);

  const discount = Math.round(subtotal * 0.1);
  const packagingFee = orderMode === 'delivery' ? 5 : 0;
  const total = Math.max(0, subtotal - discount + packagingFee);

  const isBulkOrder = subtotal >= BULK_MIN_AMOUNT || totalItemCount >= BULK_MIN_ITEMS;
  const amountNeeded = Math.max(0, BULK_MIN_AMOUNT - subtotal);

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-stone-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="w-full max-w-lg bg-white h-full flex flex-col shadow-2xl text-stone-900 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drawer Header */}
        <div className="p-4 sm:p-5 border-b border-stone-100 flex items-center justify-between bg-gradient-to-r from-amber-50 to-orange-50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-orange-600 text-white flex items-center justify-center font-bold text-sm">
              🛒
            </div>
            <div>
              <h3 className="font-bold text-stone-900 text-base font-display">
                Your Food Tray ({totalItemCount} items)
              </h3>
              <p className="text-[11px] text-stone-500">
                MJPRU Campus Canteen Express Order
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-200 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Tray Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
          {/* Order Destination / Counter summary card */}
          <div className="p-3.5 rounded-xl border border-amber-200/80 bg-amber-50/60 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-amber-600/10 text-orange-700 flex items-center justify-center shrink-0">
                {orderMode === 'pickup' ? <Store className="w-4 h-4" /> : <MapPin className="w-4 h-4" />}
              </div>
              <div>
                <div className="text-[10px] font-bold uppercase tracking-wider text-amber-800">
                  {orderMode === 'pickup' ? 'Self-Pickup Counter' : 'Hostel & Dept Delivery'}
                </div>
                <div className="text-xs font-bold text-stone-900">
                  {orderMode === 'pickup'
                    ? counter?.name || `Counter ${selectedCounterId}`
                    : selectedLocation.name}
                </div>
                {orderMode === 'delivery' && roomDetails && (
                  <div className="text-[11px] text-stone-600 font-medium">
                    📍 {roomDetails}
                  </div>
                )}
              </div>
            </div>

            <button
              onClick={onOpenModeSelector}
              className="text-xs font-bold text-orange-700 hover:text-orange-800 hover:underline px-2.5 py-1 rounded-md bg-white border border-amber-300 cursor-pointer"
            >
              Change
            </button>
          </div>

          {/* Bulk Delivery Condition Notification */}
          {orderMode === 'delivery' && (
            <div
              className={`p-3 rounded-xl border text-xs ${
                isBulkOrder
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                  : 'bg-amber-50 border-amber-300 text-amber-900'
              }`}
            >
              <div className="flex items-start gap-2">
                {isBulkOrder ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                )}
                <div>
                  <div className="font-bold">
                    {isBulkOrder
                      ? 'Bulk Order Unlocked for Campus Delivery'
                      : 'Delivery to Hostels & Departments: Bulk Orders Only'}
                  </div>
                  <p className="text-[11px] text-stone-600 mt-0.5 leading-relaxed">
                    {isBulkOrder
                      ? `Great! Your order has ${totalItemCount} items (₹${subtotal}), qualifying for direct hostel/department room delivery.`
                      : `Canteen delivers to hostels & departments only on bulk orders (Min. ₹${BULK_MIN_AMOUNT} or 4+ items). Add ₹${amountNeeded} more, or switch to instant Counter Pickup.`}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Tray Items List */}
          {items.length === 0 ? (
            <div className="py-12 text-center">
              <div className="text-4xl mb-3">🍽️</div>
              <p className="text-sm font-bold text-stone-700">Your food tray is empty</p>
              <p className="text-xs text-stone-400 mt-1 max-w-xs mx-auto">
                Explore our hot snacks, thalis, kulhad tea and Maggi to add items to your tray!
              </p>
              <button
                onClick={onClose}
                className="mt-4 px-4 py-2 bg-orange-600 text-white text-xs font-bold rounded-xl shadow-xs cursor-pointer hover:bg-orange-700"
              >
                Explore Canteen Menu
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs text-stone-500 font-medium">
                <span>Selected Items ({totalItemCount})</span>
                <button
                  onClick={onClearCart}
                  className="text-stone-400 hover:text-red-600 transition-colors cursor-pointer text-xs"
                >
                  Clear all
                </button>
              </div>

              {items.map((cartItem) => {
                const itemCost =
                  (cartItem.menuItem.price + cartItem.customizationExtraCost) *
                  cartItem.quantity;

                return (
                  <div
                    key={cartItem.id}
                    className="p-3 rounded-xl border border-stone-200 bg-stone-50/50 flex items-start justify-between gap-3"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-1.5">
                        <div className="w-3.5 h-3.5 border border-emerald-600 rounded-[2px] flex items-center justify-center shrink-0">
                          <div className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                        </div>
                        <h4 className="text-xs sm:text-sm font-bold text-stone-900 leading-tight">
                          {cartItem.menuItem.name}
                        </h4>
                      </div>

                      {cartItem.customizations && (
                        <div className="mt-1 text-[11px] text-stone-500 space-y-0.5">
                          {Object.entries(cartItem.customizations).map(([key, val]) => (
                            <div key={key}>
                              <span className="text-stone-400">{key}:</span> {val}
                            </div>
                          ))}
                        </div>
                      )}

                      {cartItem.specialInstructions && (
                        <div className="mt-1 text-[11px] text-amber-700 italic">
                          "{cartItem.specialInstructions}"
                        </div>
                      )}

                      <div className="mt-2 text-xs font-extrabold text-stone-900">
                        ₹{itemCost}
                        {cartItem.quantity > 1 && (
                          <span className="text-[10px] text-stone-400 font-normal ml-1">
                            (₹{cartItem.menuItem.price + cartItem.customizationExtraCost} × {cartItem.quantity})
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1 bg-white border border-stone-300 rounded-lg p-0.5 shadow-xs">
                        <button
                          onClick={() => onUpdateQuantity(cartItem.id, -1)}
                          className="w-5 h-5 flex items-center justify-center text-stone-600 hover:text-stone-900 cursor-pointer"
                        >
                          <Minus className="w-2.5 h-2.5" />
                        </button>
                        <span className="w-4 text-center text-xs font-bold text-stone-800">
                          {cartItem.quantity}
                        </span>
                        <button
                          onClick={() => onUpdateQuantity(cartItem.id, 1)}
                          className="w-5 h-5 flex items-center justify-center text-stone-600 hover:text-stone-900 cursor-pointer"
                        >
                          <Plus className="w-2.5 h-2.5" />
                        </button>
                      </div>

                      <button
                        onClick={() => onRemoveItem(cartItem.id)}
                        className="p-1 text-stone-400 hover:text-red-600 transition-colors cursor-pointer"
                        title="Remove"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}

              {/* Payment Preview */}
              <div className="p-3 rounded-xl border border-stone-200 bg-white space-y-1.5 text-xs">
                <div className="font-bold text-stone-800 flex items-center justify-between">
                  <span>Payment Method</span>
                  <span className="text-[10px] text-emerald-700 font-semibold flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3" /> Pay on Pickup / Delivery
                  </span>
                </div>
                <div className="p-2.5 bg-orange-50/60 border border-orange-200 rounded-lg flex items-center gap-2 text-stone-800">
                  <QrCode className="w-4 h-4 text-orange-600 shrink-0" />
                  <span className="font-semibold text-[11px] sm:text-xs">
                    Pay at Counter / UPI QR on Pickup
                  </span>
                </div>
              </div>

              {/* Bill Details */}
              <div className="p-3.5 rounded-xl border border-stone-200 bg-stone-50 space-y-2 text-xs">
                <div className="font-bold text-stone-800 mb-1">Bill Summary</div>

                <div className="flex justify-between text-stone-600">
                  <span>Items Subtotal</span>
                  <span>₹{subtotal}</span>
                </div>

                {discount > 0 && (
                  <div className="flex justify-between text-emerald-700 font-semibold">
                    <span className="flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-emerald-600" />
                      MJPRU Student 10% Subsidy
                    </span>
                    <span>-₹{discount}</span>
                  </div>
                )}

                {packagingFee > 0 && (
                  <div className="flex justify-between text-stone-600">
                    <span>Hostel Delivery Packaging</span>
                    <span>₹{packagingFee}</span>
                  </div>
                )}

                <div className="pt-2 border-t border-stone-200 flex justify-between text-sm font-extrabold text-stone-900">
                  <span>Grand Total</span>
                  <span className="text-base text-orange-700 font-display">₹{total}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Drawer Footer CTA */}
        {items.length > 0 && (
          <div className="p-4 sm:p-5 border-t border-stone-200 bg-white">
            <button
              onClick={() => {
                onClose();
                onOpenCheckout();
              }}
              className="w-full flex items-center justify-between px-5 py-3.5 rounded-xl font-bold text-white bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 shadow-md shadow-orange-600/30 active:scale-98 transition-all cursor-pointer text-xs sm:text-sm"
            >
              <div className="flex items-center gap-2">
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </div>
              <span className="bg-black/20 px-2.5 py-1 rounded-lg font-display">
                ₹{total}
              </span>
            </button>
            <p className="text-center text-[10px] text-stone-400 mt-2">
              Collects Name, Dept/Hostel, Roll No &amp; Mobile · Pay at Counter / UPI QR
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
