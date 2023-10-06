require("dotenv").config({ path: ".env.local" });
const express = require("express");
const { DynamoDB } = require("aws-sdk");
const cors = require("cors");

const awsKeyId = process.env.AWS_ACCESS_KEY_ID;
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;
const awsRegion = process.env.AWS_REGION;

const app = express();
const port = 3001;

app.use(express.json());
app.use(cors());

const AWS = require("aws-sdk");
AWS.config.update({
  accessKeyId: awsKeyId,
  secretAccessKey: secretAccessKey,
  region: awsRegion,
});

app.get("/collections/dwytib/shirts/quantity", async (req, res) => {
  const dynamoDB = new DynamoDB();
  const selectedSize = req.query.size || "Medium"; // Default to "M" if no size is provided
  const getParams = {
    TableName: "shopDB",
    Key: {
      product_category: { S: "Shirt" },
      product_size: { S: selectedSize },
    },
  };

  try {
    dynamoDB.getItem(getParams, (err, data) => {
      if (err) {
        console.error("Error getting item:", err);
      } else {
        const quantity = parseInt(data.Item.product_quantity.S, 10);
        const price = parseInt(data.Item.product_price.S, 10);
        console.log("TEST", quantity);
        res.json({ productQuantity: quantity, productPrice: price });
      }
    });
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

app.get("/collections/dwytib/shirts/order/success", async (req, res) => {
  try {
    const session_id = req.query.session_id;

    // Retrieve the session details from Stripe
    const session = await stripe.checkout.sessions.retrieve(session_id);

    // Extract the selected size from the session metadata (assuming you've set it during session creation)
    const selectedSize = session.metadata.size;
    const stripe_product_id = session.metadata.price;
    const decrementValue = 1;

    console.log(stripe_product_id);

    // Decrement the quantity in DynamoDB
    const dynamoDB = new DynamoDB();

    // Step 1: Retrieve the current string value of product_quantity
    const getParams = {
      TableName: "shopDB",
      Key: {
        product_category: { S: "Shirt" },
        product_size: { S: selectedSize },
      },
    };

    dynamoDB.getItem(getParams, (err, data) => {
      if (err) {
        console.error("Error getting item:", err);
      } else {
        // Step 2: Parse the string into a numeric value
        const currentQuantity = parseInt(data.Item.product_quantity.S, 10);

        if (currentQuantity < 1) {
          console.error("Sold Out: Current quantity is less than 1.");
          throw new Error("Sold Out: Current quantity is less than 1.");
        }

        // Step 3: Subtract 1 from the numeric value
        const newQuantity = currentQuantity - decrementValue;

        // Step 4: Update the product_quantity attribute as a string
        const updateParams = {
          TableName: "shopDB",
          Key: {
            product_category: { S: "Shirt" },
            product_size: { S: selectedSize },
          },
          UpdateExpression: "SET product_quantity = :newQuantity",
          ExpressionAttributeValues: {
            ":newQuantity": { S: newQuantity.toString() },
          },
        };

        dynamoDB.updateItem(updateParams, (err, data) => {
          if (err) {
            console.error("Error updating item:", err);
          } else {
            console.log("Item updated successfully!");
            res.redirect(
              303,
              "http://localhost:3001/collections/dwytib/shirts/order/success/page"
            );
          }
        });
      }
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal server error" });
    res.send(`<html><body><h1>something went wrong</h1></body></html>`);
  }
});

app.get("/collections/dwytib/shirts/order/success/page", async (req, res) => {
  res.send(`<html><body><h1>Thanks for your order!</h1></body></html>`);
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
