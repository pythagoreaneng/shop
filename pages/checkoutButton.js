import React from "react";
import { loadStripe } from "@stripe/stripe-js";

// Make sure to call `loadStripe` outside of a component’s render to avoid
// recreating the `Stripe` object on every render.
const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
);

export default function CheckoutButton() {
  React.useEffect(() => {
    // Check to see if this is a redirect back from Checkout
    const query = new URLSearchParams(window.location.search);
    if (query.get("success")) {
      console.log("Order placed! You will receive an email confirmation.");
    }

    if (query.get("canceled")) {
      console.log(
        "Order canceled -- continue to shop around and checkout when you’re ready."
      );
    }
  }, []);

  return (
    <form action="api/checkout_sessions" method="POST">
      <button
        className=" mt-3 rounded-lg focus:bg-gray-900 bg-white px-4 py-2 text-black hover:bg-gray-500"
        type="submit"
        role="link"
      >
        Checkout
      </button>
    </form>
  );
}
