import Razorpay from 'razorpay';
import { NextResponse } from 'next/server';

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export async function POST(request) {
  try {
    const cartItems = await request.json();

    const totalAmount = cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );

    const SHIPPING_COST = 5000; // ₹50 in paise

    const options = {
      amount: Math.round(totalAmount * 100) + SHIPPING_COST,
      currency: 'INR',
      receipt: `receipt_${Date.now()}`,
      notes: {
        cartItems: JSON.stringify(
          cartItems.map((item) => {
            const img = item.image[0].asset._ref;
            const newImage = img
              .replace('image-', 'https://cdn.sanity.io/images/rdjvn1kc/ecommerce/')
              .replace('-webp', '.webp');
            return {
              name: item.name,
              image: newImage,
              quantity: item.quantity,
              price: item.price,
            };
          })
        ),
      },
    };

    const order = await razorpay.orders.create(options);

    return NextResponse.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
    });

  } catch (err) {
    console.error('Razorpay Order Error:', err);
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}