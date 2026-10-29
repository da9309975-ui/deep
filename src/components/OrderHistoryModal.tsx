import React from 'react';
import { X, Receipt, RotateCcw, Clock, Store, MapPin, ChevronRight } from 'lucide-react';
import { Order } from '../types/canteen';

interface OrderHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  orders: Order[];
  onSelectOrder: (order: Order) => void;
  onReorder: (order: Order) => void;
}

export const OrderHistoryModal: React.FC<OrderHistoryModalProps> = ({
  isOpen,
  onClose,
  orders,
  onSelectOrder,
  onReorder,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-2xl max-w-xl w-full max-h-[85vh] overflow-y-auto shadow-2xl border border-stone-200 text-stone-900"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-4 sm:p-5 border-b border-stone-100 flex items-center justify-between bg-stone-50">
          <div className="flex items-center gap-2">
            <Receipt className="w-5 h-5 text-orange-600" />
            <div>
              <h3 className="font-bold text-stone-900 text-base font-display">
                Your Campus Tokens &amp; Orders
              </h3>
              <p className="text-xs text-stone-500">
                Track active tokens or re-order your favorite campus meals
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 space-y-4">
          {orders.length === 0 ? (
            <div className="text-center py-10">
              <div className="text-3xl mb-2">🎟️</div>
              <p className="text-sm font-bold text-stone-700">No previous orders found</p>
              <p className="text-xs text-stone-400 mt-1">
                Once you place an order, your digital tokens and receipts will be saved here.
              </p>
            </div>
          ) : (
            orders.map((order) => {
              const isReady = order.status === 'ready';
              const isCompleted = order.status === 'completed';

              return (
                <div
                  key={order.id}
                  className="p-4 rounded-xl border border-stone-200 hover:border-amber-300 bg-stone-50/50 transition-all flex flex-col justify-between"
                >
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-base font-extrabold text-stone-900 font-display">
                          {order.tokenNumber}
                        </span>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider ${
                            isReady
                              ? 'bg-emerald-100 text-emerald-800 animate-pulse'
                              : isCompleted
                              ? 'bg-stone-200 text-stone-700'
                              : 'bg-orange-100 text-orange-800'
                          }`}
                        >
                          {order.status}
                        </span>
                      </div>
                      <div className="text-[11px] text-stone-400 flex items-center gap-1.5 mt-0.5">
                        <Clock className="w-3 h-3" />
                        <span>{order.timestamp}</span>
                        <span>·</span>
                        <span>{order.orderMode === 'pickup' ? 'Counter Pickup' : 'Delivery'}</span>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-sm font-extrabold text-stone-900 font-display">
                        ₹{order.total}
                      </div>
                      <div className="text-[10px] text-stone-500 font-medium">
                        Pay at Counter / UPI QR
                      </div>
                    </div>
                  </div>

                  {/* Items summary */}
                  <div className="text-xs text-stone-600 my-2 line-clamp-1">
                    {order.items.map((i) => `${i.quantity}× ${i.menuItem.name}`).join(', ')}
                  </div>

                  {/* Actions */}
                  <div className="pt-2 border-t border-stone-100 flex items-center justify-between">
                    <button
                      onClick={() => {
                        onSelectOrder(order);
                        onClose();
                      }}
                      className="text-xs font-bold text-orange-700 hover:text-orange-800 flex items-center gap-1"
                    >
                      <span>Track Token Live</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => {
                        onReorder(order);
                        onClose();
                      }}
                      className="flex items-center gap-1 px-3 py-1 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
                    >
                      <RotateCcw className="w-3 h-3" />
                      <span>Re-order Tray</span>
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
