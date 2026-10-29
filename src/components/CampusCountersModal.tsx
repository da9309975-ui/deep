import React from 'react';
import { X, Store, Users, Clock, ChefHat, CheckCircle2 } from 'lucide-react';
import { CAMPUS_COUNTERS } from '../data/canteenData';

interface CampusCountersModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedCounterId: 1 | 2 | 3 | 4;
  onSelectCounter: (id: 1 | 2 | 3 | 4) => void;
}

export const CampusCountersModal: React.FC<CampusCountersModalProps> = ({
  isOpen,
  onClose,
  selectedCounterId,
  onSelectCounter,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-stone-200 text-stone-900"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-5 border-b border-stone-100 flex items-center justify-between bg-stone-50">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-orange-600 text-white flex items-center justify-center font-bold">
              🏪
            </div>
            <div>
              <h3 className="font-bold text-stone-900 text-base font-display">
                MJPRU Canteen Food Counters
              </h3>
              <p className="text-xs text-stone-500">
                Live queue status and specialized kitchen sections
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {CAMPUS_COUNTERS.map((counter) => {
              const isSelected = selectedCounterId === counter.id;
              return (
                <div
                  key={counter.id}
                  className={`p-4 rounded-xl border transition-all ${
                    isSelected
                      ? 'border-orange-500 bg-orange-50/40 ring-1 ring-orange-500'
                      : 'border-stone-200 hover:border-stone-300 bg-white'
                  }`}
                >
                  <div className="flex items-start justify-between mb-1.5">
                    <div>
                      <h4 className="font-bold text-stone-900 text-sm">
                        {counter.name}
                      </h4>
                      <p className="text-[11px] font-medium text-stone-500">
                        {counter.hindiTitle}
                      </p>
                    </div>
                    {isSelected && (
                      <span className="text-[10px] font-bold text-orange-700 bg-orange-100 px-2 py-0.5 rounded-md">
                        Active
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-stone-600 mb-3">{counter.description}</p>

                  <div className="space-y-1.5 text-xs text-stone-500 pt-3 border-t border-stone-100">
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1.5">
                        <Users className="w-3.5 h-3.5 text-stone-400" />
                        <span>Current Line</span>
                      </span>
                      <span className="font-bold text-stone-800">
                        {counter.currentQueue} students
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-stone-400" />
                        <span>Average Wait</span>
                      </span>
                      <span className="font-bold text-amber-700">
                        ~{counter.avgWaitMins} minutes
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1.5">
                        <ChefHat className="w-3.5 h-3.5 text-stone-400" />
                        <span>Counter Lead</span>
                      </span>
                      <span className="text-stone-700 font-medium">
                        {counter.chefInCharge}
                      </span>
                    </div>
                  </div>

                  <div className="mt-4">
                    <button
                      onClick={() => {
                        onSelectCounter(counter.id);
                        onClose();
                      }}
                      className={`w-full py-2 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
                        isSelected
                          ? 'bg-orange-600 text-white'
                          : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
                      }`}
                    >
                      {isSelected ? 'Currently Selected' : `Select Counter ${counter.id}`}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="p-3 bg-stone-100 rounded-xl text-xs text-stone-600">
            <strong>Tip for MJPRU Students:</strong> Tokens called on the main digital LED board at the canteen center. Keep your token number handy.
          </div>
        </div>
      </div>
    </div>
  );
};
