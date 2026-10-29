import React from 'react';
import { Sparkles, ArrowRight, Store, Bike, Volume2 } from 'lucide-react';
import { Order } from '../types/canteen';

interface ActiveOrderBannerProps {
  order: Order | null;
  onOpenTracker: () => void;
}

export const ActiveOrderBanner: React.FC<ActiveOrderBannerProps> = ({
  order,
  onOpenTracker,
}) => {
  if (!order || order.status === 'completed') return null;

  const isReady = order.status === 'ready';

  return (
    <aside aria-label="Active order token notification" className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:w-96 z-40 animate-in slide-in-from-bottom duration-300">
      <div
        onClick={onOpenTracker}
        className={`p-3.5 rounded-2xl shadow-xl border cursor-pointer backdrop-blur-md transition-all hover:scale-[1.02] flex items-center justify-between gap-3 ${
          isReady
            ? 'bg-emerald-600 text-white border-emerald-400 shadow-emerald-900/30 ring-2 ring-emerald-300'
            : 'bg-stone-900/95 text-white border-stone-700 shadow-stone-950/40'
        }`}
      >
        <div className="flex items-center gap-3">
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center font-extrabold text-sm ${
              isReady ? 'bg-white text-emerald-800' : 'bg-orange-600 text-white'
            }`}
          >
            {isReady ? <Volume2 className="w-5 h-5 animate-pulse" /> : <Sparkles className="w-5 h-5" />}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-300">
                Active Token: {order.tokenNumber}
              </span>
            </div>
            <div className="text-xs font-extrabold text-white">
              {isReady
                ? order.orderMode === 'pickup'
                  ? '🔔 Ready for Pickup at Counter!'
                  : '🛵 Runner Out for Delivery!'
                : order.status === 'preparing'
                ? 'Cooking in Kitchen...'
                : 'Order Confirmed'}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1 text-xs font-bold text-amber-300 bg-white/10 px-2.5 py-1.5 rounded-lg">
          <span>View</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </div>
      </div>
    </aside>
  );
};
