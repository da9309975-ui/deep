import React from 'react';
import { Store, MapPin, Sparkles, Flame, Clock, Award, ChevronRight } from 'lucide-react';
import { OrderMode, CampusLocation } from '../types/canteen';

interface HeroBannerProps {
  orderMode: OrderMode;
  selectedCounterId: 1 | 2 | 3 | 4;
  selectedLocation: CampusLocation;
  onOpenModeSelector: () => void;
  onFilterCategory: (category: 'snacks' | 'meals' | 'beverages' | 'quick-bites') => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({
  orderMode,
  selectedCounterId,
  selectedLocation,
  onOpenModeSelector,
  onFilterCategory,
}) => {
  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-amber-900 via-orange-950 to-stone-900 text-white shadow-xl mb-8 border border-amber-500/20">
      {/* Background warm atmospheric glow */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-orange-500/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/3 -mb-20 w-80 h-80 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />

      <div className="relative p-6 sm:p-8 lg:p-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
        {/* Left Side: Brand & University Context */}
        <div className="max-w-2xl">
          <div className="flex items-center gap-2 text-xs font-semibold text-amber-300 mb-3 tracking-wide">
            <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>KITCHEN IS FIRING · FRESH BATCHES READY</span>
            <span className="text-amber-500/70">·</span>
            <span className="text-amber-200">Rohilkhand University, Bareilly</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight font-display text-white leading-tight">
            Garam Chai, Crispy Samosas &amp; <span className="text-amber-400">Desi Thalis</span>
          </h2>

          <p className="mt-3 text-sm sm:text-base text-stone-300 leading-relaxed max-w-xl">
            Authentic, subsidized campus dining for MJPRU students &amp; faculty. Order ahead for express counter token pickup or quick hostel &amp; lab delivery.
          </p>

          {/* Current Mode Status Pill / Clickable Banner */}
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <button
              onClick={onOpenModeSelector}
              className="group flex items-center gap-3 px-4 py-2.5 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/15 backdrop-blur-md text-xs sm:text-sm transition-all text-left"
            >
              <div className="w-8 h-8 rounded-xl bg-orange-500 text-white flex items-center justify-center shrink-0 shadow-sm">
                {orderMode === 'pickup' ? <Store className="w-4 h-4" /> : <MapPin className="w-4 h-4" />}
              </div>
              <div>
                <div className="text-[10px] text-amber-300 font-semibold uppercase tracking-wider">
                  Active Mode: {orderMode === 'pickup' ? 'Counter Pickup' : 'Campus Delivery'}
                </div>
                <div className="font-bold text-white flex items-center gap-1.5">
                  <span>
                    {orderMode === 'pickup'
                      ? `Counter ${selectedCounterId}: Food Counter Pickup`
                      : `${selectedLocation.name}`}
                  </span>
                  <span className="text-amber-400 text-xs font-normal group-hover:underline">
                    (Change)
                  </span>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-stone-400 group-hover:text-white transition-colors ml-1" />
            </button>

            <div className="hidden sm:flex items-center gap-4 text-xs text-stone-300 border-l border-white/15 pl-4">
              <div className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-amber-400" />
                <span>Avg 3-7 min prep</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Award className="w-4 h-4 text-amber-400" />
                <span>100% Pure Veg</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Quick Highlight Badges for Required Items */}
        <div className="lg:w-80 shrink-0 bg-stone-900/60 backdrop-blur-md rounded-2xl p-5 border border-white/10">
          <div className="flex items-center justify-between text-xs font-bold text-amber-300 mb-3 uppercase tracking-wider">
            <span className="flex items-center gap-1">
              <Flame className="w-3.5 h-3.5 text-orange-400" /> Canteen Bestsellers
            </span>
            <span className="text-[10px] text-stone-400">Subsidized Rates</span>
          </div>

          <div className="space-y-2.5">
            <div
              onClick={() => onFilterCategory('snacks')}
              className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 transition-colors cursor-pointer flex items-center justify-between"
            >
              <div>
                <div className="text-xs font-bold text-white">Crispy Samosa</div>
                <div className="text-[11px] text-stone-400">Kadhai fresh · Tangy chutney</div>
              </div>
              <span className="text-sm font-extrabold text-amber-400 font-display">₹10</span>
            </div>

            <div
              onClick={() => onFilterCategory('snacks')}
              className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 transition-colors cursor-pointer flex items-center justify-between"
            >
              <div>
                <div className="text-xs font-bold text-white">Khasta Kachori with Sabzi</div>
                <div className="text-[11px] text-stone-400">2 pcs + Bareilly hing aloo</div>
              </div>
              <span className="text-sm font-extrabold text-amber-400 font-display">₹20</span>
            </div>

            <div
              onClick={() => onFilterCategory('meals')}
              className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 transition-colors cursor-pointer flex items-center justify-between"
            >
              <div>
                <div className="text-xs font-bold text-white">Mini Veg Thali</div>
                <div className="text-[11px] text-stone-400">Subzi, Dal, 3 Rotis, Jeera Rice</div>
              </div>
              <span className="text-sm font-extrabold text-amber-400 font-display">₹60</span>
            </div>

            <div
              onClick={() => onFilterCategory('beverages')}
              className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 transition-colors cursor-pointer flex items-center justify-between"
            >
              <div>
                <div className="text-xs font-bold text-white">Masala Chai / Kulhad Tea</div>
                <div className="text-[11px] text-stone-400">Adrak elaichi kadak sip</div>
              </div>
              <span className="text-sm font-extrabold text-amber-400 font-display">₹10 / ₹15</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
