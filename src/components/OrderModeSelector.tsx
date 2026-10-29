import React from 'react';
import { Store, MapPin, X, Check, Users, Clock, ArrowRight, ShieldCheck } from 'lucide-react';
import { OrderMode, CampusLocation } from '../types/canteen';
import { CAMPUS_COUNTERS, CAMPUS_LOCATIONS } from '../data/canteenData';

interface OrderModeSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  currentMode: OrderMode;
  onSelectMode: (mode: OrderMode) => void;
  selectedCounterId: 1 | 2 | 3 | 4;
  onSelectCounter: (id: 1 | 2 | 3 | 4) => void;
  selectedLocation: CampusLocation;
  onSelectLocation: (loc: CampusLocation) => void;
  roomDetails: string;
  onRoomDetailsChange: (details: string) => void;
}

export const OrderModeSelector: React.FC<OrderModeSelectorProps> = ({
  isOpen,
  onClose,
  currentMode,
  onSelectMode,
  selectedCounterId,
  onSelectCounter,
  selectedLocation,
  onSelectLocation,
  roomDetails,
  onRoomDetailsChange,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-stone-200 text-stone-900"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-stone-100 bg-gradient-to-r from-amber-50 to-orange-50/50">
          <div>
            <h3 className="text-lg font-bold text-stone-900 font-display">
              Select Campus Order Method
            </h3>
            <p className="text-xs text-stone-500 mt-0.5">
              Pickup directly at specialized canteen food counters or get delivery anywhere inside MJPRU campus
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mode Switch Tabs */}
        <div className="p-5">
          <div className="grid grid-cols-2 gap-3 p-1.5 bg-stone-100 rounded-xl mb-6">
            <button
              onClick={() => onSelectMode('pickup')}
              className={`flex items-center justify-center gap-2 py-3 px-4 rounded-lg text-xs sm:text-sm font-bold transition-all ${
                currentMode === 'pickup'
                  ? 'bg-white text-orange-700 shadow-sm'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <Store className="w-4 h-4 text-orange-600" />
              <span>Self-Pickup at Counters</span>
            </button>

            <button
              onClick={() => onSelectMode('delivery')}
              className={`flex items-center justify-center gap-2 py-3 px-4 rounded-lg text-xs sm:text-sm font-bold transition-all ${
                currentMode === 'delivery'
                  ? 'bg-white text-orange-700 shadow-sm'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <MapPin className="w-4 h-4 text-orange-600" />
              <span>Hostel / Dept Delivery (Bulk)</span>
            </button>
          </div>

          {/* Mode 1: Self-Pickup Counter Options */}
          {currentMode === 'pickup' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs text-stone-500 font-medium px-1">
                <span>Select Primary Food Counter:</span>
                <span className="text-orange-700 font-semibold flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" /> Skip Long Physical Lines
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {CAMPUS_COUNTERS.map((counter) => {
                  const isSelected = selectedCounterId === counter.id;
                  return (
                    <div
                      key={counter.id}
                      onClick={() => onSelectCounter(counter.id)}
                      className={`relative p-4 rounded-xl border text-left cursor-pointer transition-all ${
                        isSelected
                          ? 'border-orange-500 bg-orange-50/40 ring-2 ring-orange-500/20'
                          : 'border-stone-200 hover:border-amber-300 hover:bg-stone-50'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-1.5">
                        <span className="font-bold text-stone-900 text-sm">
                          {counter.name}
                        </span>
                        {isSelected && (
                          <div className="w-5 h-5 rounded-full bg-orange-600 text-white flex items-center justify-center shrink-0">
                            <Check className="w-3 h-3 stroke-[3]" />
                          </div>
                        )}
                      </div>

                      <div className="text-[11px] font-medium text-stone-500 mb-2">
                        {counter.hindiTitle}
                      </div>

                      <p className="text-xs text-stone-600 line-clamp-2 mb-3">
                        {counter.description}
                      </p>

                      <div className="flex items-center justify-between text-[11px] text-stone-500 pt-2 border-t border-stone-100">
                        <span className="flex items-center gap-1">
                          <Users className="w-3 h-3 text-stone-400" />
                          <span>Queue: {counter.currentQueue} students</span>
                        </span>
                        <span className="flex items-center gap-1 font-semibold text-amber-700">
                          <Clock className="w-3 h-3 text-amber-600" />
                          <span>~{counter.avgWaitMins} min prep</span>
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="p-3 bg-amber-50/70 border border-amber-200/60 rounded-xl text-xs text-amber-900 flex items-start gap-2.5">
                <span className="text-base">💡</span>
                <div>
                  <span className="font-semibold">Express Token System: </span>
                  Order ahead online, receive your digital token number on screen, and pick up hot fresh food directly at the designated counter without standing in the token line.
                </div>
              </div>
            </div>
          )}

          {/* Mode 2: Campus Delivery Locations */}
          {currentMode === 'delivery' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs text-stone-500 font-medium px-1">
                <span>Select Your Department, Hostel, or Campus Spot:</span>
                <span className="text-emerald-700 font-semibold flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" /> 10-18 Mins Campus Runner
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-60 overflow-y-auto pr-1">
                {CAMPUS_LOCATIONS.map((loc) => {
                  const isSelected = selectedLocation.id === loc.id;
                  return (
                    <div
                      key={loc.id}
                      onClick={() => onSelectLocation(loc)}
                      className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
                        isSelected
                          ? 'border-orange-500 bg-orange-50/40 ring-2 ring-orange-500/20'
                          : 'border-stone-200 hover:border-amber-300 hover:bg-stone-50'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="text-xs font-bold text-stone-900">
                            {loc.name}
                          </div>
                          <div className="text-[11px] text-stone-500 mt-0.5">
                            {loc.landmark}
                          </div>
                        </div>
                        {isSelected ? (
                          <div className="w-4 h-4 rounded-full bg-orange-600 text-white flex items-center justify-center shrink-0">
                            <Check className="w-2.5 h-2.5 stroke-[3]" />
                          </div>
                        ) : (
                          <span className="text-[10px] text-stone-400 font-medium">
                            ~{loc.avgDeliveryMinutes}m
                          </span>
                        )}
                      </div>
                      <div className="mt-2 text-[10px] text-orange-700 font-medium">
                        Zone: {loc.zone}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Room/Lab Detail Input */}
              <div className="pt-2">
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Room No / Department Wing / Lab / Seat Details:
                </label>
                <input
                  type="text"
                  value={roomDetails}
                  onChange={(e) => onRoomDetailsChange(e.target.value)}
                  placeholder="e.g. CS Lab 2, 2nd Floor / Hostel Room #204 / Library Lawn Bench"
                  className="w-full px-3.5 py-2 text-xs sm:text-sm bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 text-stone-900 placeholder:text-stone-400"
                />
              </div>

              <div className="p-3 bg-amber-50/80 border border-amber-200/70 rounded-xl text-xs text-amber-950 flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-orange-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold">Bulk Orders Only: </span>
                  Deliveries to college departments and hostels are dispatched for bulk orders (Min. ₹150 or 4+ items). Individual snacks and beverages can be picked up at the respective food counter.
                </div>
              </div>
            </div>
          )}

          {/* Confirm Button */}
          <div className="mt-6 pt-4 border-t border-stone-100 flex items-center justify-end gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={onClose}
              className="flex items-center gap-1.5 px-5 py-2 text-xs font-bold text-white bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 rounded-xl shadow-md shadow-orange-600/20 transition-all cursor-pointer"
            >
              <span>Confirm & Browse Menu</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
