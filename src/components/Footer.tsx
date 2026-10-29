import React from 'react';
import { Store, Clock, Phone, MapPin, Heart, ShieldCheck, Award } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="mt-16 bg-stone-900 text-stone-300 border-t border-stone-800">
      {/* Top Value Banner */}
      <div className="border-b border-stone-800/80 bg-stone-950/60 py-6 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-xs">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-orange-600/20 text-orange-400 flex items-center justify-center shrink-0">
              <Store className="w-4 h-4" />
            </div>
            <div>
              <div className="font-bold text-white mb-0.5">4 Dedicated Counters</div>
              <p className="text-stone-400 text-[11px] leading-relaxed">
                Separate stations for Hot Snacks, Thalis, Chai Tapri &amp; Quick Chinese Bites.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-600/20 text-emerald-400 flex items-center justify-center shrink-0">
              <Award className="w-4 h-4" />
            </div>
            <div>
              <div className="font-bold text-white mb-0.5">100% Subsidized Veg</div>
              <p className="text-stone-400 text-[11px] leading-relaxed">
                Affordable student tariff: Samosa at ₹10, Mini Thali at ₹60, Masala Chai at ₹10.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-amber-600/20 text-amber-400 flex items-center justify-center shrink-0">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <div className="font-bold text-white mb-0.5">Express Digital Token</div>
              <p className="text-stone-400 text-[11px] leading-relaxed">
                Order online from classroom or hostel and pick up directly when your token buzzes.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-600/20 text-blue-400 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <div className="font-bold text-white mb-0.5">FSSAI Certified Campus Kitchen</div>
              <p className="text-stone-400 text-[11px] leading-relaxed">
                Hygiene audited by MJPRU Student Welfare &amp; University Food Committee.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Info */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-2xl">☕</span>
              <span className="font-black text-white text-lg tracking-tight font-display">
                MJPRU <span className="text-orange-500">Campus Canteen</span>
              </span>
            </div>
            <p className="text-xs text-stone-400 leading-relaxed mb-4">
              Official food service portal of Mahatma Jyotiba Phule Rohilkhand University, Bareilly. Fresh, hygienic, and affordable culinary delight for students, faculty, and research scholars.
            </p>
            <div className="text-xs text-stone-500 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-orange-500 shrink-0" />
              <span>Pilibhit Bypass Road, Bareilly, Uttar Pradesh 243006</span>
            </div>
          </div>

          <div>
            <div className="text-xs font-bold text-white uppercase tracking-wider mb-3">
              Canteen Operational Hours
            </div>
            <div className="space-y-2 text-xs text-stone-400">
              <div className="flex justify-between">
                <span>Monday – Saturday</span>
                <span className="text-white font-semibold">8:00 AM – 9:00 PM</span>
              </div>
              <div className="flex justify-between">
                <span>Sunday &amp; University Holidays</span>
                <span className="text-white font-semibold">9:00 AM – 7:30 PM</span>
              </div>
              <div className="flex justify-between">
                <span>Lunch Thali Counter Hours</span>
                <span className="text-amber-400 font-semibold">11:30 AM – 3:30 PM</span>
              </div>
              <div className="flex justify-between">
                <span>Evening Chai &amp; Snacks</span>
                <span className="text-amber-400 font-semibold">4:00 PM – 8:30 PM</span>
              </div>
            </div>
          </div>

          <div>
            <div className="text-xs font-bold text-white uppercase tracking-wider mb-3">
              Campus Support &amp; Kitchen Help
            </div>
            <p className="text-xs text-stone-400 mb-3">
              For bulk department seminar tea snacks, special hostel tiffin packs, or lost tokens:
            </p>
            <div className="space-y-1.5 text-xs">
              <div className="flex items-center gap-2 text-stone-300">
                <Phone className="w-3.5 h-3.5 text-orange-500" />
                <span>Canteen Manager: +91 581 2527261</span>
              </div>
              <div className="flex items-center gap-2 text-stone-300">
                <span className="text-orange-500 font-bold">@</span>
                <span>canteen@mjpru.ac.in</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-stone-800 text-xs text-stone-500 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div>
            © {new Date().getFullYear()} Mahatma Jyotiba Phule Rohilkhand University, Bareilly. All rights reserved.
          </div>
          <div className="flex items-center gap-1 text-stone-400">
            <span>Crafted for MJPRU students &amp; faculty</span>
            <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500 inline" />
          </div>
        </div>
      </div>
    </footer>
  );
};
