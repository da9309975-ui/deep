import React from 'react';
import { ShoppingBag, Clock, MapPin, Store, ReceiptText, Sparkles, Phone, Search } from 'lucide-react';
import { OrderMode, CampusLocation } from '../types/canteen';

interface HeaderProps {
  orderMode: OrderMode;
  selectedLocation: CampusLocation;
  selectedCounterId: 1 | 2 | 3 | 4;
  cartCount: number;
  cartSubtotal: number;
  onOpenModeSelector: () => void;
  onOpenCart: () => void;
  onOpenHistory: () => void;
  onOpenCounters: () => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  hasActiveOrder: boolean;
  onOpenActiveOrder: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  orderMode,
  selectedLocation,
  selectedCounterId,
  cartCount,
  cartSubtotal,
  onOpenModeSelector,
  onOpenCart,
  onOpenHistory,
  onOpenCounters,
  searchQuery,
  onSearchChange,
  hasActiveOrder,
  onOpenActiveOrder,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-amber-100/80 shadow-xs">
      {/* Top University Announcement Bar */}
      <div className="bg-gradient-to-r from-amber-700 via-orange-600 to-amber-700 text-amber-50 px-4 py-1.5 text-xs font-medium">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 truncate">
            <span className="font-semibold text-white tracking-wide uppercase text-[11px]">
              MJPRU Bareilly
            </span>
            <span className="hidden sm:inline opacity-70">·</span>
            <span className="hidden sm:inline text-amber-100">
              महात्मा ज्योतिबा फुले रुहेलखंड विश्वविद्यालय ऑन-कैंपस कैंटीन
            </span>
            <span className="opacity-70">·</span>
            <span className="flex items-center gap-1 text-amber-200">
              <Clock className="w-3 h-3 text-amber-300" /> Open Today: 8:00 AM – 9:00 PM
            </span>
          </div>

          <div className="flex items-center gap-3 shrink-0 text-[11px]">
            <button
              onClick={onOpenCounters}
              className="hover:text-white transition-colors cursor-pointer flex items-center gap-1 font-medium"
            >
              <Store className="w-3 h-3 text-amber-300" />
              <span>4 Campus Counters</span>
            </button>
            <span className="opacity-60">|</span>
            <a
              href="tel:+915812527261"
              className="hover:text-white transition-colors flex items-center gap-1"
              title="Canteen Helpline"
            >
              <Phone className="w-3 h-3 text-amber-300" />
              <span className="hidden md:inline">Helpline: +91 581 2527261</span>
              <span className="md:hidden">Help</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Nav Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3">
        <div className="flex items-center justify-between gap-4">
          {/* Logo & Identity */}
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-amber-500 via-orange-500 to-amber-600 flex items-center justify-center text-white shadow-md shadow-orange-500/20 font-bold text-xl border border-amber-400/30">
              ☕
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-stone-900 font-display">
                  MJPRU <span className="text-orange-600">Campus Canteen</span>
                </h1>
              </div>
              <p className="text-xs text-stone-500 font-medium hidden sm:block">
                Express Food Counters & Campus Delivery · Bareilly (U.P.)
              </p>
            </div>
          </div>

          {/* Center Mode Selector Pill (Interactive Segmented Button) */}
          <div className="hidden lg:flex items-center bg-stone-100 p-1 rounded-xl border border-stone-200/80">
            <button
              type="button"
              onClick={onOpenModeSelector}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                orderMode === 'pickup'
                  ? 'bg-white text-orange-700 shadow-xs border border-stone-200/60'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <Store className="w-3.5 h-3.5 text-orange-600" />
              <span>Self-Pickup: Counter {selectedCounterId}</span>
            </button>
            <button
              type="button"
              onClick={onOpenModeSelector}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                orderMode === 'delivery'
                  ? 'bg-white text-orange-700 shadow-xs border border-stone-200/60'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <MapPin className="w-3.5 h-3.5 text-orange-600" />
              <span className="max-w-[150px] truncate">Delivery: {selectedLocation.name.split('-')[0]}</span>
            </button>
          </div>

          {/* Action Buttons: Active Order, Orders History, Cart */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Quick Mode Toggle for Mobile / Small screens */}
            <button
              onClick={onOpenModeSelector}
              className="lg:hidden flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-amber-50 text-amber-900 border border-amber-200 hover:bg-amber-100 transition-colors"
            >
              {orderMode === 'pickup' ? (
                <>
                  <Store className="w-3.5 h-3.5 text-orange-600" />
                  <span className="hidden xs:inline">Counter Pickup</span>
                  <span className="xs:hidden">Pickup</span>
                </>
              ) : (
                <>
                  <MapPin className="w-3.5 h-3.5 text-orange-600" />
                  <span className="hidden xs:inline">Campus Delivery</span>
                  <span className="xs:hidden">Delivery</span>
                </>
              )}
            </button>

            {hasActiveOrder && (
              <button
                onClick={onOpenActiveOrder}
                className="relative flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-300 hover:bg-emerald-100 transition-colors animate-pulse"
                title="View Active Token"
              >
                <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                <span>Live Token</span>
              </button>
            )}

            <button
              onClick={onOpenHistory}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold text-stone-700 hover:bg-stone-100 transition-colors border border-transparent hover:border-stone-200"
              title="View Previous Orders & Tokens"
            >
              <ReceiptText className="w-4 h-4 text-stone-500" />
              <span className="hidden md:inline">Tokens & History</span>
            </button>

            <button
              onClick={onOpenCart}
              className="relative flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 shadow-sm shadow-orange-600/20 active:scale-95 transition-all"
            >
              <ShoppingBag className="w-4 h-4" />
              <span className="hidden sm:inline">Tray</span>
              {cartCount > 0 ? (
                <span className="flex items-center gap-1 bg-amber-900/40 px-1.5 py-0.5 rounded-md text-[11px]">
                  <span>{cartCount}</span>
                  <span className="opacity-70">·</span>
                  <span>₹{cartSubtotal}</span>
                </span>
              ) : (
                <span className="text-[11px] opacity-80">(0)</span>
              )}
            </button>
          </div>
        </div>

        {/* Search & Quick Bar */}
        <div className="mt-3 flex items-center gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search Samosa, Khasta Kachori, Mini Thali, Kulhad Chai, Maggi..."
              className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 placeholder:text-stone-400 transition-all text-stone-800"
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 text-xs font-medium"
              >
                Clear
              </button>
            )}
          </div>

          {/* Quick Counter Info Trigger */}
          <button
            onClick={onOpenCounters}
            className="hidden sm:flex items-center gap-1.5 px-3 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold rounded-xl transition-colors whitespace-nowrap"
          >
            <Store className="w-3.5 h-3.5 text-stone-500" />
            <span>Counter Queues</span>
          </button>
        </div>
      </div>
    </header>
  );
};
