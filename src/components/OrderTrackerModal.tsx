import React, { useEffect } from 'react';
import {
  X,
  CheckCircle2,
  Clock,
  Store,
  MapPin,
  Sparkles,
  Volume2,
  Share2,
  Receipt,
  RotateCcw,
  ChefHat,
  Bike,
} from 'lucide-react';
import { Order, OrderStatus } from '../types/canteen';
import { CAMPUS_COUNTERS } from '../data/canteenData';
import { playChimeSound } from '../utils/audio';

interface OrderTrackerModalProps {
  order: Order | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdateStatus: (orderId: string, nextStatus: OrderStatus) => void;
}

export const OrderTrackerModal: React.FC<OrderTrackerModalProps> = ({
  order,
  isOpen,
  onClose,
  onUpdateStatus,
}) => {
  if (!isOpen || !order) return null;

  const counter = CAMPUS_COUNTERS.find((c) => c.id === order.counterId);

  // Status mapping
  const steps: { key: OrderStatus; label: string; desc: string; icon: React.ReactNode }[] = [
    {
      key: 'placed',
      label: 'Order Confirmed',
      desc: 'Token generated & sent to canteen display screen',
      icon: <Receipt className="w-4 h-4" />,
    },
    {
      key: 'preparing',
      label: 'Cooking at Counter',
      desc:
        order.orderMode === 'pickup'
          ? `Chef preparing fresh at ${counter?.name || 'Counter'}`
          : 'Kitchen packaging for runner dispatch',
      icon: <ChefHat className="w-4 h-4" />,
    },
    {
      key: 'ready',
      label: order.orderMode === 'pickup' ? 'Ready for Pickup!' : 'Out with Campus Runner',
      desc:
        order.orderMode === 'pickup'
          ? `Show token ${order.tokenNumber} at ${counter?.name || 'Counter'}`
          : `Delivering to ${order.deliveryLocation?.name || 'Campus Spot'}`,
      icon: order.orderMode === 'pickup' ? <Store className="w-4 h-4" /> : <Bike className="w-4 h-4" />,
    },
    {
      key: 'completed',
      label: 'Handed Over',
      desc: 'Enjoy your hot meal at MJPRU Bareilly!',
      icon: <CheckCircle2 className="w-4 h-4" />,
    },
  ];

  const currentStepIndex = steps.findIndex((s) => s.key === order.status);

  // Trigger chime when reaching 'ready'
  useEffect(() => {
    if (order.status === 'ready') {
      playChimeSound();
    }
  }, [order.status]);

  const handleNextStep = () => {
    if (order.status === 'placed') onUpdateStatus(order.id, 'preparing');
    else if (order.status === 'preparing') onUpdateStatus(order.id, 'ready');
    else if (order.status === 'ready') onUpdateStatus(order.id, 'completed');
  };

  const handleReset = () => {
    onUpdateStatus(order.id, 'placed');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-3xl max-w-lg w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-stone-200 text-stone-900"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="p-5 border-b border-stone-100 flex items-center justify-between bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-white rounded-t-3xl">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center font-bold">
              🎟️
            </div>
            <div>
              <div className="text-[11px] font-semibold text-amber-100 uppercase tracking-wider">
                Live Kitchen Token
              </div>
              <h3 className="text-xl font-black font-display tracking-tight text-white">
                {order.tokenNumber}
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/20 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Token Flash Card */}
        <div className="p-6">
          <div className="text-center p-5 rounded-2xl bg-gradient-to-b from-orange-50/70 to-amber-50/40 border border-orange-200/80 mb-6">
            <div className="text-xs font-bold text-orange-700 uppercase tracking-widest mb-1">
              MJPRU Digital Canteen Token
            </div>
            <div className="text-4xl sm:text-5xl font-black tracking-tight text-stone-900 font-display my-2">
              {order.tokenNumber}
            </div>
            <div className="text-xs text-stone-600 font-medium space-y-1">
              <div>
                Student: <span className="font-bold text-stone-900">{order.studentName}</span>
                {order.studentRollNumber && (
                  <span className="text-stone-500"> · Roll: {order.studentRollNumber}</span>
                )}
              </div>
              <div className="text-[11px] text-stone-500">
                📍 {order.departmentOrHostel || 'MJPRU Campus'} · 📞 {order.contactNumber}
              </div>
              {order.isBulkOrder && (
                <div className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md inline-block">
                  ✨ Campus Bulk Order
                </div>
              )}
            </div>

            {/* Ready Buzzer Alert */}
            {order.status === 'ready' && (
              <div className="mt-3 p-3 bg-emerald-600 text-white rounded-xl flex items-center justify-center gap-2 shadow-md animate-bounce">
                <Volume2 className="w-5 h-5 animate-pulse" />
                <span className="text-xs sm:text-sm font-extrabold uppercase tracking-wide">
                  🔔 Order is Ready! Collect at {counter?.name.split(':')[0] || 'Counter'}
                </span>
              </div>
            )}
          </div>

          {/* Location / Counter Highlight */}
          <div className="mb-6 p-4 rounded-xl border border-stone-200 bg-stone-50 flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-orange-100 text-orange-700 flex items-center justify-center shrink-0 mt-0.5">
              {order.orderMode === 'pickup' ? <Store className="w-5 h-5" /> : <MapPin className="w-5 h-5" />}
            </div>
            <div className="flex-1">
              <div className="text-[11px] font-bold text-orange-700 uppercase tracking-wider">
                {order.orderMode === 'pickup'
                  ? 'Counter Collection Point'
                  : 'Hostel / Department Bulk Delivery'}
              </div>
              <div className="text-sm font-bold text-stone-900">
                {order.orderMode === 'pickup'
                  ? counter?.name || `Counter ${order.counterId}`
                  : order.departmentOrHostel}
              </div>
              {order.orderMode === 'pickup' && counter && (
                <p className="text-xs text-stone-500 mt-0.5">
                  Chef in charge: {counter.chefInCharge} · {counter.hindiTitle}
                </p>
              )}
              {order.orderMode === 'delivery' && (
                <p className="text-xs text-stone-500 mt-0.5">
                  Delivery Point: {order.departmentOrHostel}
                </p>
              )}
            </div>
          </div>

          {/* Progress Stepper */}
          <div className="space-y-4 mb-6">
            <div className="flex items-center justify-between text-xs font-bold text-stone-800">
              <span>Live Order Status</span>
              <span className="text-stone-400 font-normal">{order.timestamp}</span>
            </div>

            <div className="space-y-3">
              {steps.map((step, idx) => {
                const isPassed = idx <= currentStepIndex;
                const isCurrent = idx === currentStepIndex;

                return (
                  <div key={step.key} className="flex items-start gap-3">
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 transition-colors ${
                        isCurrent
                          ? 'bg-orange-600 text-white ring-4 ring-orange-100'
                          : isPassed
                          ? 'bg-emerald-600 text-white'
                          : 'bg-stone-200 text-stone-400'
                      }`}
                    >
                      {isPassed && !isCurrent ? (
                        <CheckCircle2 className="w-4 h-4" />
                      ) : (
                        <span>{idx + 1}</span>
                      )}
                    </div>
                    <div className="flex-1 pb-1">
                      <div
                        className={`text-xs font-bold ${
                          isCurrent
                            ? 'text-orange-700'
                            : isPassed
                            ? 'text-stone-900'
                            : 'text-stone-400'
                        }`}
                      >
                        {step.label}
                      </div>
                      <div className="text-[11px] text-stone-500 leading-tight">
                        {step.desc}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Items Summary list */}
          <div className="p-3.5 rounded-xl border border-stone-200 bg-stone-50/50 mb-6 text-xs space-y-2">
            <div className="font-bold text-stone-800 flex justify-between">
              <span>Items in this Order</span>
              <span>Total: ₹{order.total}</span>
            </div>
            {order.items.map((it) => (
              <div key={it.id} className="flex justify-between text-stone-600">
                <span>
                  {it.quantity}× {it.menuItem.name}
                </span>
                <span>
                  ₹{(it.menuItem.price + it.customizationExtraCost) * it.quantity}
                </span>
              </div>
            ))}
            <div className="pt-2 border-t border-stone-200 flex justify-between items-center text-[11px] text-stone-500 font-medium">
              <span>Payment Option</span>
              <span className="font-bold text-orange-700 bg-orange-100/70 px-2 py-0.5 rounded-md">
                Pay at Counter / UPI QR on Pickup
              </span>
            </div>
          </div>

          {/* Interactive Simulation Controls */}
          <div className="p-3 bg-amber-50/70 border border-amber-200/80 rounded-xl flex items-center justify-between gap-2">
            <div className="text-[11px] text-amber-900">
              <span className="font-bold">Live Simulation:</span> Step through kitchen progress
            </div>
            <div className="flex items-center gap-1.5">
              {order.status !== 'completed' ? (
                <button
                  onClick={handleNextStep}
                  className="px-3 py-1.5 bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold rounded-lg shadow-xs transition-colors cursor-pointer"
                >
                  Advance Stage →
                </button>
              ) : (
                <button
                  onClick={handleReset}
                  className="flex items-center gap-1 px-3 py-1.5 bg-stone-200 hover:bg-stone-300 text-stone-700 text-xs font-bold rounded-lg transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Restart Status</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-stone-100 flex items-center justify-between bg-stone-50 rounded-b-3xl">
          <button
            onClick={() => playChimeSound()}
            className="flex items-center gap-1.5 text-xs font-semibold text-stone-600 hover:text-stone-900"
          >
            <Volume2 className="w-3.5 h-3.5 text-orange-600" />
            <span>Test Token Chime</span>
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-stone-900 text-white text-xs font-bold rounded-xl hover:bg-stone-800 transition-colors cursor-pointer"
          >
            Keep Exploring Menu
          </button>
        </div>
      </div>
    </div>
  );
};
