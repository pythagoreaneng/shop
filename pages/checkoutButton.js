import React, { useEffect, useState } from "react";

export default function CheckoutButton({ selectedSize, productQuantity }) {
  return (
    <form action={`/api/checkout_sessions?size=${selectedSize}`} method="POST">
      <p>Quantity: {productQuantity}</p>
      <button
        className="mt-3 rounded-lg focus:bg-gray-900 bg-white px-4 py-2 text-black hover:bg-gray-500"
        type="submit"
        role="link"
      >
        Checkout
      </button>
    </form>
  );
}
