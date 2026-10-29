import React, { useState } from 'react';
import { X, Check, Plus } from 'lucide-react';
import { MenuItem, CartItemCustomization } from '../types/canteen';

interface CustomizationModalProps {
  item: MenuItem | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (
    item: MenuItem,
    customizations: CartItemCustomization,
    extraCost: number,
    specialInstructions: string
  ) => void;
}

export const CustomizationModal: React.FC<CustomizationModalProps> = ({
  item,
  isOpen,
  onClose,
  onConfirm,
}) => {
  if (!isOpen || !item) return null;

  // Initialize defaults
  const [selectedChoices, setSelectedChoices] = useState<CartItemCustomization>(() => {
    const defaults: CartItemCustomization = {};
    item.customizationOptions?.forEach((opt) => {
      defaults[opt.name] = opt.choices[0]?.label || '';
    });
    return defaults;
  });

  const [instructions, setInstructions] = useState('');

  // Calculate extra cost
  let extraCost = 0;
  item.customizationOptions?.forEach((opt) => {
    const chosenLabel = selectedChoices[opt.name];
    const match = opt.choices.find((c) => c.label === chosenLabel);
    if (match) {
      extraCost += match.extraPrice;
    }
  });

  const finalItemPrice = item.price + extraCost;

  const handleSelectOption = (groupName: string, choiceLabel: string) => {
    setSelectedChoices((prev) => ({
      ...prev,
      [groupName]: choiceLabel,
    }));
  };

  const handleConfirm = () => {
    onConfirm(item, selectedChoices, extraCost, instructions);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-stone-200 text-stone-900"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-stone-100 flex items-start justify-between bg-stone-50">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold text-orange-700 uppercase tracking-wider">
                Counter {item.counterId} Customization
              </span>
            </div>
            <h3 className="text-lg font-bold text-stone-900 font-display">
              {item.name}
            </h3>
            {item.hindiName && (
              <p className="text-xs text-stone-500">{item.hindiName}</p>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Options Groups */}
        <div className="p-5 space-y-6">
          {item.customizationOptions && item.customizationOptions.length > 0 ? (
            item.customizationOptions.map((optGroup) => (
              <div key={optGroup.name} className="space-y-2">
                <label className="block text-xs font-bold text-stone-800 uppercase tracking-wide">
                  {optGroup.name}
                </label>
                <div className="grid grid-cols-1 gap-2">
                  {optGroup.choices.map((choice) => {
                    const isSelected = selectedChoices[optGroup.name] === choice.label;
                    return (
                      <button
                        key={choice.label}
                        type="button"
                        onClick={() => handleSelectOption(optGroup.name, choice.label)}
                        className={`flex items-center justify-between p-3 rounded-xl border text-left text-xs sm:text-sm font-medium transition-all ${
                          isSelected
                            ? 'border-orange-500 bg-orange-50/50 text-orange-950 ring-1 ring-orange-500/30'
                            : 'border-stone-200 hover:border-stone-300 text-stone-700 hover:bg-stone-50'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <div
                            className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                              isSelected
                                ? 'border-orange-600 bg-orange-600 text-white'
                                : 'border-stone-300 bg-white'
                            }`}
                          >
                            {isSelected && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                          </div>
                          <span>{choice.label}</span>
                        </div>
                        {choice.extraPrice > 0 ? (
                          <span className="font-bold text-orange-700">
                            +₹{choice.extraPrice}
                          </span>
                        ) : (
                          <span className="text-[11px] text-stone-400">Included</span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))
          ) : (
            <p className="text-xs text-stone-500">Standard canteen preparation.</p>
          )}

          {/* Special Instruction Note */}
          <div>
            <label className="block text-xs font-bold text-stone-800 uppercase tracking-wide mb-1.5">
              Kitchen Note (Optional)
            </label>
            <input
              type="text"
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              placeholder="e.g. Extra spicy tari, well-toasted bread, less oil..."
              className="w-full px-3.5 py-2 text-xs sm:text-sm bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 text-stone-800 placeholder:text-stone-400"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 sm:p-5 border-t border-stone-100 bg-stone-50 flex items-center justify-between">
          <div>
            <div className="text-[11px] text-stone-400">Total Item Price</div>
            <div className="text-xl font-extrabold text-stone-900 font-display">
              ₹{finalItemPrice}
            </div>
          </div>
          <button
            onClick={handleConfirm}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 shadow-md shadow-orange-600/20 active:scale-95 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add to Tray</span>
          </button>
        </div>
      </div>
    </div>
  );
};
