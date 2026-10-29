import React from 'react';
import { MenuCategory } from '../types/canteen';
import { Sparkles, Utensils, Coffee, Zap, Layers, Flame } from 'lucide-react';

interface CategoryNavProps {
  activeCategory: MenuCategory;
  onSelectCategory: (cat: MenuCategory) => void;
  categoryCounts: Record<MenuCategory, number>;
}

export const CategoryNav: React.FC<CategoryNavProps> = ({
  activeCategory,
  onSelectCategory,
  categoryCounts,
}) => {
  const categories: { id: MenuCategory; label: string; hindi: string; icon: React.ReactNode }[] = [
    {
      id: 'all',
      label: 'All Canteen Items',
      hindi: 'सम्पूर्ण मेनू',
      icon: <Layers className="w-4 h-4" />,
    },
    {
      id: 'snacks',
      label: 'Snacks & Street Food',
      hindi: 'नाश्ता एवं कचौड़ी',
      icon: <Flame className="w-4 h-4 text-orange-500" />,
    },
    {
      id: 'meals',
      label: 'Meals & Thali',
      hindi: 'थाली एवं भोजन',
      icon: <Utensils className="w-4 h-4 text-amber-600" />,
    },
    {
      id: 'beverages',
      label: 'Beverages & Chai',
      hindi: 'चाय एवं पेय',
      icon: <Coffee className="w-4 h-4 text-amber-700" />,
    },
    {
      id: 'quick-bites',
      label: 'Quick Bites & Maggi',
      hindi: 'मैगी एवं चाइनीज़',
      icon: <Zap className="w-4 h-4 text-yellow-600" />,
    },
    {
      id: 'combos',
      label: 'Hostel Deals & Combos',
      hindi: 'स्टूडेंट कॉम्बो',
      icon: <Sparkles className="w-4 h-4 text-orange-500" />,
    },
  ];

  return (
    <div className="sticky top-[108px] z-30 bg-[#faf8f5]/95 backdrop-blur-sm py-2 mb-6 border-b border-stone-200/80">
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none scroll-smooth">
        {categories.map((cat) => {
          const isActive = activeCategory === cat.id;
          const count = categoryCounts[cat.id] ?? 0;

          return (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all shrink-0 cursor-pointer ${
                isActive
                  ? 'bg-orange-600 text-white shadow-sm shadow-orange-600/30'
                  : 'bg-white hover:bg-stone-100 text-stone-700 border border-stone-200/70 hover:border-stone-300'
              }`}
            >
              <span className={isActive ? 'text-white' : 'text-stone-500'}>
                {cat.icon}
              </span>
              <span>{cat.label}</span>
              <span
                className={`text-[11px] px-1.5 py-0.2 rounded-md ${
                  isActive ? 'bg-orange-700 text-orange-100 font-bold' : 'bg-stone-100 text-stone-500 font-medium'
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
