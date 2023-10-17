const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      const size = req.query.size || "Medium";
      const priceId = getPriceIdBySize(size);
      const metadata = {
        size: size,
        priceId: priceId,
      };
      // Create Checkout Sessions from body params.
      const session = await stripe.checkout.sessions.create({
        line_items: [
          {
            price: priceId,
            quantity: 1,
          },
        ],
        mode: "payment",
        success_url: `http://localhost:3001/backend/order/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${req.headers.origin}/?canceled=true`,
        metadata: metadata,
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
  const sizeToPriceId = {
    Small: "price_1O2MlCJj2art1ipkROXhSqGZ",
    Medium: "price_1NswjzJj2art1ipkfAfUH5kb",
    Large: "price_1O2MkdJj2art1ipkyxTuaqjz",
    XLarge: "price_1Nz5LIJj2art1ipkzPCIB0dd",
  };

  return sizeToPriceId[size];
}
