import React, { useState } from 'react';
import {
  X,
  Store,
  MapPin,
  QrCode,
  ShieldCheck,
  AlertCircle,
  CheckCircle2,
  ArrowRight,
  GraduationCap,
  Building2,
  Phone,
  User,
  Hash,
  Sparkles,
} from 'lucide-react';
import { CartItem, OrderMode, CampusLocation, Order } from '../types/canteen';
import { CAMPUS_COUNTERS, CAMPUS_LOCATIONS } from '../data/canteenData';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  currentOrderMode: OrderMode;
  selectedCounterId: 1 | 2 | 3 | 4;
  selectedLocation: CampusLocation;
  roomDetails: string;
  onPlaceOrder: (orderData: Partial<Order>) => void;
  onQuickAddItem?: (itemId: string) => void;
}

// Bulk order criteria: Min ₹150 OR 4+ items
const BULK_MIN_AMOUNT = 150;
const BULK_MIN_ITEMS = 4;

const COMMON_DEPARTMENTS_AND_HOSTELS = [
  'FET - Computer Science & IT',
  'FET - Mechanical / Civil / Electrical',
  'FET - Chemical & Electronics',
  'Aryabhatta Boys Hostel (Hostel 1)',
  'Raman Boys Hostel (Hostel 2)',
  'Bhabha Boys Hostel (Hostel 3)',
  'Ganga Girls Hostel',
  'Yamuna Girls Hostel',
  'Saraswati Girls Hostel',
  'Faculty of Management Studies (MBA Block)',
  'Central Library & Reading Hall',
  'Science Complex (Physics/Chemistry Labs)',
  'Administrative Block & Secretariat',
  'Department of Law & Humanities',
  'University Sports Complex',
];

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  items,
  currentOrderMode,
  selectedCounterId,
  selectedLocation,
  roomDetails,
  onPlaceOrder,
}) => {
  // Mode selection inside checkout
  const [orderMode, setOrderMode] = useState<OrderMode>(currentOrderMode);
  const [counterId, setCounterId] = useState<1 | 2 | 3 | 4>(selectedCounterId);

  // Form Fields as requested
  const [studentName, setStudentName] = useState(() => {
    return localStorage.getItem('mjpru_saved_student_name') || '';
  });
  const [departmentOrHostel, setDepartmentOrHostel] = useState(() => {
    return (
      localStorage.getItem('mjpru_saved_dept_hostel') ||
      selectedLocation.name ||
      COMMON_DEPARTMENTS_AND_HOSTELS[0]
    );
  });
  const [roomOrWing, setRoomOrWing] = useState(roomDetails || '');
  const [rollNumber, setRollNumber] = useState(() => {
    return localStorage.getItem('mjpru_saved_roll_no') || '';
  });
  const [mobileNumber, setMobileNumber] = useState(() => {
    return localStorage.getItem('mjpru_saved_mobile') || '';
  });

  if (!isOpen) return null;

  // Totals & Items count
  const totalItemCount = items.reduce((s, i) => s + i.quantity, 0);
  const subtotal = items.reduce(
    (acc, curr) =>
      acc + (curr.menuItem.price + curr.customizationExtraCost) * curr.quantity,
    0
  );

  // Student discount: 10%
  const discount = Math.round(subtotal * 0.1);
  const packagingFee = orderMode === 'delivery' ? 5 : 0;
  const grandTotal = Math.max(0, subtotal - discount + packagingFee);

  // Bulk order evaluation
  const isBulkOrder = subtotal >= BULK_MIN_AMOUNT || totalItemCount >= BULK_MIN_ITEMS;
  const amountNeededForBulk = Math.max(0, BULK_MIN_AMOUNT - subtotal);
  const itemsNeededForBulk = Math.max(0, BULK_MIN_ITEMS - totalItemCount);

  // Validation
  const canSubmitDelivery = orderMode === 'pickup' || isBulkOrder;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!studentName.trim()) {
      alert('Please enter your Student Name.');
      return;
    }
    if (!departmentOrHostel.trim()) {
      alert('Please select or specify your Department / Hostel.');
      return;
    }
    if (!rollNumber.trim()) {
      alert('Please enter your University Roll Number or ID.');
      return;
    }
    if (!mobileNumber.trim() || mobileNumber.replace(/\D/g, '').length < 10) {
      alert('Please enter a valid 10-digit Mobile Number for token pickup alerts.');
      return;
    }

    if (orderMode === 'delivery' && !isBulkOrder) {
      alert(
        `Department & Hostel delivery is only available on bulk orders (Min. ₹${BULK_MIN_AMOUNT} or ${BULK_MIN_ITEMS}+ items). Please switch to Self-Pickup or add items to your tray.`
      );
      return;
    }

    // Persist details for convenience
    localStorage.setItem('mjpru_saved_student_name', studentName.trim());
    localStorage.setItem('mjpru_saved_dept_hostel', departmentOrHostel.trim());
    localStorage.setItem('mjpru_saved_roll_no', rollNumber.trim());
    localStorage.setItem('mjpru_saved_mobile', mobileNumber.trim());

    onPlaceOrder({
      orderMode,
      counterId: orderMode === 'pickup' ? counterId : undefined,
      departmentOrHostel: `${departmentOrHostel} ${roomOrWing ? `(${roomOrWing})` : ''}`.trim(),
      roomDetails: roomOrWing,
      studentName: studentName.trim(),
      studentRollNumber: rollNumber.trim(),
      contactNumber: mobileNumber.trim(),
      isBulkOrder,
      subtotal,
      discount,
      packagingFee,
      total: grandTotal,
      paymentMethod: 'counter_upi_qr', // As requested: 'Pay at Counter / UPI QR on Pickup'
    });

    onClose();
  };

  const counter = CAMPUS_COUNTERS.find((c) => c.id === counterId);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-2xl sm:rounded-3xl max-w-xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-stone-200 text-stone-900 flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-stone-100 flex items-center justify-between bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-white rounded-t-2xl sm:rounded-t-3xl">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center font-bold text-base">
              📋
            </div>
            <div>
              <h3 className="font-bold text-white text-base sm:text-lg font-display">
                MJPRU Canteen Express Checkout
              </h3>
              <p className="text-[11px] text-amber-100">
                Enter your student details to generate your digital pickup token
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/20 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-5 flex-1">
          {/* Order Mode & Bulk Delivery Notice */}
          <div>
            <label className="block text-xs font-bold text-stone-800 uppercase tracking-wider mb-2">
              Fulfilment Method
            </label>
            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => setOrderMode('pickup')}
                className={`flex flex-col items-center justify-center p-3 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                  orderMode === 'pickup'
                    ? 'border-orange-500 bg-orange-50/70 text-orange-950 ring-2 ring-orange-500/30'
                    : 'border-stone-200 text-stone-600 hover:bg-stone-50'
                }`}
              >
                <div className="flex items-center gap-1.5 mb-1">
                  <Store className="w-4 h-4 text-orange-600" />
                  <span>Self-Pickup at Counter</span>
                </div>
                <span className="text-[10px] font-normal text-stone-500">
                  All order sizes · Zero wait
                </span>
              </button>

              <button
                type="button"
                onClick={() => setOrderMode('delivery')}
                className={`relative flex flex-col items-center justify-center p-3 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                  orderMode === 'delivery'
                    ? 'border-orange-500 bg-orange-50/70 text-orange-950 ring-2 ring-orange-500/30'
                    : 'border-stone-200 text-stone-600 hover:bg-stone-50'
                }`}
              >
                <div className="flex items-center gap-1.5 mb-1">
                  <MapPin className="w-4 h-4 text-orange-600" />
                  <span>Hostel / Dept Delivery</span>
                </div>
                <span className="text-[10px] font-medium text-orange-700">
                  Bulk Orders Only (Min ₹150)
                </span>
              </button>
            </div>

            {/* Bulk Order Explanation & Status Banner */}
            {orderMode === 'delivery' && (
              <div
                className={`mt-2.5 p-3 rounded-xl border text-xs ${
                  isBulkOrder
                    ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                    : 'bg-amber-50 border-amber-300 text-amber-950'
                }`}
              >
                {isBulkOrder ? (
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold">Qualified for Campus Bulk Delivery! </span>
                      Your order meets the bulk threshold ({totalItemCount} items, ₹{subtotal}). A campus runner will deliver straight to your hostel or department wing.
                    </div>
                  </div>
                ) : (
                  <div className="space-y-1.5">
                    <div className="flex items-start gap-2">
                      <AlertCircle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold">Delivery is available only on Bulk Orders: </span>
                        College departments and hostels require a minimum of ₹{BULK_MIN_AMOUNT} or {BULK_MIN_ITEMS}+ items for runner delivery.
                      </div>
                    </div>
                    <div className="text-[11px] text-amber-800 bg-amber-100/70 p-2 rounded-lg flex items-center justify-between">
                      <span>
                        Need <strong>₹{amountNeededForBulk}</strong> more (or {itemsNeededForBulk} more items).
                      </span>
                      <button
                        type="button"
                        onClick={() => setOrderMode('pickup')}
                        className="text-xs font-bold text-orange-700 hover:underline cursor-pointer"
                      >
                        Switch to Counter Pickup
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Counter Selection when in Pickup mode */}
            {orderMode === 'pickup' && (
              <div className="mt-2.5 p-2.5 bg-stone-50 rounded-xl border border-stone-200">
                <div className="text-[11px] font-semibold text-stone-600 mb-1.5">
                  Select Pickup Food Counter:
                </div>
                <div className="grid grid-cols-2 gap-1.5">
                  {CAMPUS_COUNTERS.map((c) => (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => setCounterId(c.id)}
                      className={`text-left p-2 rounded-lg text-xs font-medium transition-all ${
                        counterId === c.id
                          ? 'bg-orange-600 text-white font-bold shadow-xs'
                          : 'bg-white border border-stone-200 text-stone-700 hover:bg-stone-100'
                      }`}
                    >
                      <div className="truncate">{c.name.split(':')[0]}</div>
                      <div className={`text-[10px] ${counterId === c.id ? 'text-amber-100' : 'text-stone-400'}`}>
                        {c.name.split(':')[1]?.trim() || c.hindiTitle}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Student Required Fields */}
          <div className="p-4 rounded-2xl border border-stone-200 bg-stone-50/60 space-y-3.5">
            <div className="text-xs font-bold text-stone-900 flex items-center gap-1.5">
              <GraduationCap className="w-4 h-4 text-orange-600" />
              <span>Student / Scholar Information</span>
            </div>

            {/* 1. Student Name */}
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Student Name *
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  placeholder="e.g. Rahul Sharma / Ananya Verma"
                  className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-white border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 text-stone-900"
                />
              </div>
            </div>

            {/* 2. Department / Hostel */}
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Department / Hostel *
              </label>
              <div className="relative mb-2">
                <Building2 className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <select
                  value={departmentOrHostel}
                  onChange={(e) => setDepartmentOrHostel(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-white border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 text-stone-900"
                >
                  {COMMON_DEPARTMENTS_AND_HOSTELS.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>

              {/* Room / Wing detail */}
              <input
                type="text"
                value={roomOrWing}
                onChange={(e) => setRoomOrWing(e.target.value)}
                placeholder="Specific Room No / Lab / Floor / Wing (e.g. Room #302, CS Lab 1)"
                className="w-full px-3 py-1.5 text-xs bg-white border border-stone-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-500 text-stone-800 placeholder:text-stone-400"
              />
            </div>

            {/* 3. Roll Number & 4. Mobile Number */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-semibold text-stone-700">
                    Roll Number *
                  </label>
                  <span className="text-[10px] text-emerald-600 font-bold">10% Subsidy</span>
                </div>
                <div className="relative">
                  <Hash className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={rollNumber}
                    onChange={(e) => setRollNumber(e.target.value)}
                    placeholder="e.g. 21CS042 / MJPRU2024"
                    className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 uppercase placeholder:normal-case text-stone-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Mobile Number *
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    required
                    maxLength={10}
                    value={mobileNumber}
                    onChange={(e) => setMobileNumber(e.target.value.replace(/\D/g, ''))}
                    placeholder="10-digit Mobile No"
                    className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 text-stone-900"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Payment Option: Specified as 'Pay at Counter / UPI QR on Pickup' */}
          <div className="p-4 rounded-2xl border border-orange-200 bg-orange-50/40">
            <div className="text-xs font-bold text-stone-900 mb-2 flex items-center justify-between">
              <span>Payment Option</span>
              <span className="text-[11px] text-orange-700 font-semibold flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> Official Canteen Billing
              </span>
            </div>

            {/* Exactly: 'Pay at Counter / UPI QR on Pickup' */}
            <div className="p-3 bg-white rounded-xl border-2 border-orange-500 flex items-start gap-3 shadow-xs">
              <div className="w-9 h-9 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center shrink-0 mt-0.5">
                <QrCode className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <div className="text-xs sm:text-sm font-bold text-stone-900">
                  Pay at Counter / UPI QR on Pickup
                </div>
                <p className="text-[11px] text-stone-500 leading-relaxed mt-0.5">
                  Scan the Canteen UPI QR (Google Pay / PhonePe / Paytm / BHIM) or pay cash when collecting food with your digital token.
                </p>
              </div>
            </div>
          </div>

          {/* Bill Summary */}
          <div className="p-3.5 rounded-xl border border-stone-200 bg-stone-50 space-y-1.5 text-xs">
            <div className="flex justify-between text-stone-600">
              <span>Items Total ({totalItemCount} items)</span>
              <span>₹{subtotal}</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-emerald-700 font-semibold">
                <span className="flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-emerald-600" />
                  MJPRU Student 10% Subsidy
                </span>
                <span>-₹{discount}</span>
              </div>
            )}
            {packagingFee > 0 && (
              <div className="flex justify-between text-stone-600">
                <span>Eco Delivery Container</span>
                <span>₹{packagingFee}</span>
              </div>
            )}
            <div className="pt-2 border-t border-stone-200 flex justify-between text-sm font-extrabold text-stone-900">
              <span>Total Payable</span>
              <span className="text-base text-orange-700 font-display">
                ₹{grandTotal}
              </span>
            </div>
          </div>

          {/* Action CTA */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={!canSubmitDelivery}
              className={`w-full flex items-center justify-between px-5 py-3.5 rounded-xl font-bold text-white shadow-md transition-all text-xs sm:text-sm cursor-pointer ${
                canSubmitDelivery
                  ? 'bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 shadow-orange-600/30 active:scale-98'
                  : 'bg-stone-300 text-stone-500 cursor-not-allowed shadow-none'
              }`}
            >
              <div className="flex items-center gap-2">
                <span>
                  {orderMode === 'pickup'
                    ? `Confirm & Get Counter ${counterId} Token`
                    : 'Confirm Bulk Order & Get Token'}
                </span>
                <ArrowRight className="w-4 h-4" />
              </div>
              <span className="bg-black/20 px-2.5 py-1 rounded-lg font-display">
                ₹{grandTotal}
              </span>
            </button>

            {!canSubmitDelivery && (
              <p className="text-center text-[11px] text-amber-700 mt-2 font-medium">
                Please add items to reach bulk order threshold or switch to Counter Pickup.
              </p>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};
