const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      const size = req.query.size || "Medium";
      const priceId = getPriceIdBySize(size);
      // Create Checkout Sessions from body params.
      const session = await stripe.checkout.sessions.create({
        line_items: [
          {
            price: priceId,
            quantity: 1,
          },
        ],
        mode: "payment",
        success_url: `${req.headers.origin}/?success=true`,
        cancel_url: `${req.headers.origin}/?canceled=true`,
      });
      res.redirect(303, session.url);
    } catch (err) {
      res.status(err.statusCode || 500).json(err.message);
    }
  } else {
    res.setHeader("Allow", "POST");
    res.status(405).end("Method Not Allowed");
  }
}

function getPriceIdBySize(size) {
  // Define a mapping of size to price ID or product ID
  const sizeToPriceId = {
    Small: "price_1NwWHyJj2art1ipkwbcVHR0u", // Replace with your actual price IDs
    Medium: "price_1NswjzJj2art1ipkfAfUH5kb",
    Large: "price_1NwWKYJj2art1ipkqiEm1isb",
    XLarge: "price_1NwWLnJj2art1ipknxU5cuLy",
  };

  return sizeToPriceId[size];
}
