import React, { useEffect, useState } from "react";

export default function CheckoutButton() {
  const [productQuantity, setProductQuantity] = useState(null);

  useEffect(() => {
    // Fetch the product quantity from your Express.js server
    fetch("http://localhost:3001/api/product-quantity")
      .then((response) => response.json())
      .then((data) => {
        setProductQuantity(data.productQuantity);
      })
      .catch((error) => {
        console.error("Error fetching product quantity:", error);
      });
  }, []);

  return (
    <form action="api/checkout_sessions" method="GET">
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
