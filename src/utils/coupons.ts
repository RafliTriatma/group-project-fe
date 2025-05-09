interface Coupon {
  code: string;
  type: 'percentage' | 'fixed';
  value: number;
  minPurchase?: number;
  maxDiscount?: number;
  expiryDate?: Date;
}

// Predefined coupon codes
export const VALID_COUPONS: Coupon[] = [
  {
    code: 'WELCOME10',
    type: 'percentage',
    value: 10,
    minPurchase: 50,
  },
  {
    code: 'SAVE20',
    type: 'percentage',
    value: 20,
    minPurchase: 100,
    maxDiscount: 50,
  },
  {
    code: 'FLAT25',
    type: 'fixed',
    value: 25,
    minPurchase: 150,
  },
  {
    code: 'SUMMER30',
    type: 'percentage',
    value: 30,
    minPurchase: 200,
    maxDiscount: 75,
    expiryDate: new Date('2024-08-31'),
  },
];

export interface CouponValidationResult {
  isValid: boolean;
  discount: number;
  message: string;
}

export const validateCoupon = (code: string, subtotal: number): CouponValidationResult => {
  // Convert code to uppercase for case-insensitive comparison
  const upperCode = code.toUpperCase();
  
  // Find matching coupon
  const coupon = VALID_COUPONS.find(c => c.code.toUpperCase() === upperCode);
  
  if (!coupon) {
    return {
      isValid: false,
      discount: 0,
      message: 'Invalid coupon code',
    };
  }

  // Check expiry date
  if (coupon.expiryDate && new Date() > coupon.expiryDate) {
    return {
      isValid: false,
      discount: 0,
      message: 'Coupon has expired',
    };
  }

  // Check minimum purchase requirement
  if (coupon.minPurchase && subtotal < coupon.minPurchase) {
    return {
      isValid: false,
      discount: 0,
      message: `Minimum purchase of $${coupon.minPurchase} required`,
    };
  }

  // Calculate discount
  let discount = 0;
  if (coupon.type === 'percentage') {
    discount = (subtotal * coupon.value) / 100;
    // Apply maximum discount if specified
    if (coupon.maxDiscount && discount > coupon.maxDiscount) {
      discount = coupon.maxDiscount;
    }
  } else {
    discount = coupon.value;
  }

  // Round discount to 2 decimal places
  discount = Math.round(discount * 100) / 100;

  return {
    isValid: true,
    discount,
    message: `Coupon applied successfully! You saved $${discount.toFixed(2)}`,
  };
}; 