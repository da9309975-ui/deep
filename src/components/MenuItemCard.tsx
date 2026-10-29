import React from 'react';
import { Plus, Minus, Clock, Flame, SlidersHorizontal, Check } from 'lucide-react';
import { MenuItem } from '../types/canteen';
import { CAMPUS_COUNTERS } from '../data/canteenData';

interface MenuItemCardProps {
  item: MenuItem;
  quantityInCart: number;
  onAddToCart: (item: MenuItem) => void;
  onRemoveFromCart: (item: MenuItem) => void;
  onOpenCustomization: (item: MenuItem) => void;
}

export const MenuItemCard: React.FC<MenuItemCardProps> = ({
  item,
  quantityInCart,
  onAddToCart,
  onRemoveFromCart,
  onOpenCustomization,
}) => {
  const counter = CAMPUS_COUNTERS.find((c) => c.id === item.counterId);

  return (
    <div className="group bg-white rounded-2xl border border-stone-200/80 hover:border-amber-300 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between">
      {/* Top Image & Badge Section */}
      <div className="relative h-44 w-full overflow-hidden bg-stone-100">
        <img
          src={item.image}
          alt={item.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
          onError={(e) => {
            // fallback if unsplash image fails
            (e.target as HTMLImageElement).src =
              'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=700&q=80';
          }}
        />
        {/* Soft overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-stone-900/60 via-transparent to-black/20" />

        {/* Veg Mark & Bestseller tag */}
        <div className="absolute top-3 left-3 flex items-center gap-1.5">
          {/* Authentic Indian Veg Symbol (Green circle inside green border square) */}
          <div className="w-5 h-5 bg-white rounded-sm p-0.5 border border-stone-200 flex items-center justify-center shadow-xs">
            <div className="w-3.5 h-3.5 border border-emerald-600 rounded-[2px] flex items-center justify-center">
              <div className="w-2 h-2 rounded-full bg-emerald-600" />
            </div>
          </div>

          {item.isBestseller && (
            <span className="text-[10px] font-bold bg-amber-500 text-stone-900 px-2 py-0.5 rounded-md shadow-xs uppercase tracking-wider">
              Student Fav
            </span>
          )}
        </div>

        {/* Counter Tag */}
        <div className="absolute top-3 right-3">
          <span className="text-[11px] font-medium bg-black/60 text-white backdrop-blur-xs px-2 py-0.5 rounded-md">
            Counter {item.counterId}
          </span>
        </div>

        {/* Bottom Metadata in Image */}
        <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-xs text-white/90">
          <span className="flex items-center gap-1 font-medium text-[11px]">
            <Clock className="w-3 h-3 text-amber-300" />
            <span>{item.prepTimeMinutes}m prep</span>
          </span>

          {item.spiceLevel && (
            <span className="flex items-center gap-1 font-medium text-[11px] text-amber-200">
              <Flame className="w-3 h-3 text-orange-400" />
              <span>{item.spiceLevel}</span>
            </span>
          )}
        </div>
      </div>

      {/* Content Section */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Title & Hindi Title */}
          <div className="flex items-start justify-between gap-2 mb-1">
            <h3 className="font-bold text-stone-900 text-base leading-snug group-hover:text-orange-700 transition-colors">
              {item.name}
            </h3>
          </div>

          {item.hindiName && (
            <div className="text-xs font-medium text-amber-700/80 mb-2">
              {item.hindiName}
            </div>
          )}

          <p className="text-xs text-stone-500 line-clamp-2 leading-relaxed mb-3">
            {item.description}
          </p>

          {/* Clean metadata without pill clutter */}
          {item.tags && item.tags.length > 0 && (
            <div className="text-[11px] text-stone-400 mb-3 flex items-center gap-1.5 flex-wrap">
              {item.tags.map((tag, idx) => (
                <React.Fragment key={tag}>
                  <span>{tag}</span>
                  {idx < item.tags!.length - 1 && <span aria-hidden="true">·</span>}
                </React.Fragment>
              ))}
            </div>
          )}
        </div>

        {/* Price & Action Section */}
        <div className="pt-3 border-t border-stone-100 flex items-center justify-between gap-2 mt-auto">
          {/* Price */}
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-lg font-extrabold text-stone-900 font-display">
                ₹{item.price}
              </span>
              {item.originalPrice && (
                <span className="text-xs text-stone-400 line-through">
                  ₹{item.originalPrice}
                </span>
              )}
            </div>
            <div className="text-[10px] text-stone-400">Subsidized rate</div>
          </div>

          {/* Add / Stepper Button */}
          <div>
            {quantityInCart === 0 ? (
              <div className="flex items-center gap-1">
                {item.customizationOptions && item.customizationOptions.length > 0 && (
                  <button
                    onClick={() => onOpenCustomization(item)}
                    className="p-2 rounded-xl text-stone-600 bg-stone-100 hover:bg-stone-200 transition-colors"
                    title="Customize item options"
                  >
                    <SlidersHorizontal className="w-3.5 h-3.5" />
                  </button>
                )}
                <button
                  onClick={() => {
                    if (item.customizationOptions && item.customizationOptions.length > 0) {
                      onOpenCustomization(item);
                    } else {
                      onAddToCart(item);
                    }
                  }}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold text-orange-700 bg-orange-50 hover:bg-orange-600 hover:text-white border border-orange-200 hover:border-orange-600 shadow-xs active:scale-95 transition-all cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>ADD</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-1 bg-orange-600 text-white rounded-xl p-1 shadow-sm shadow-orange-600/30">
                <button
                  onClick={() => onRemoveFromCart(item)}
                  className="w-6 h-6 rounded-lg flex items-center justify-center hover:bg-orange-700 active:scale-90 transition-all cursor-pointer"
                  title="Decrease quantity"
                >
                  <Minus className="w-3 h-3 stroke-[2.5]" />
                </button>
                <span className="w-5 text-center text-xs font-extrabold">
                  {quantityInCart}
                </span>
                <button
                  onClick={() => onAddToCart(item)}
                  className="w-6 h-6 rounded-lg flex items-center justify-center hover:bg-orange-700 active:scale-90 transition-all cursor-pointer"
                  title="Increase quantity"
                >
                  <Plus className="w-3 h-3 stroke-[2.5]" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
