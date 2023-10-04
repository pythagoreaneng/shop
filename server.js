require("dotenv").config({ path: ".env.local" });
const express = require("express");
const { DynamoDB } = require("aws-sdk");
const cors = require("cors");

const awsKeyId = process.env.AWS_ACCESS_KEY_ID;
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;
const awsRegion = process.env.AWS_REGION;

const AWS = require("aws-sdk");

const app = express();
const port = 3001;
app.use(express.json());

app.use(cors());

AWS.config.update({
  accessKeyId: awsKeyId,
  secretAccessKey: secretAccessKey,
  region: awsRegion,
});

app.get("/backend/product-quantity", async (req, res) => {
  const dynamoDB = new DynamoDB();
  const selectedSize = req.query.size || "Medium"; // Default to "M" if no size is provided
  const params = {
    TableName: "testDB",
    FilterExpression: "product_size = :size",
    ExpressionAttributeValues: {
      ":size": { S: selectedSize },
    },
  };

  try {
    dynamoDB.scan(params, (err, data) => {
      if (err) {
        console.error("Error scanning table:", err);
        res.status(500).json({ error: "Error scanning table" });
      } else {
        console.log("test", data.Items[0]?.product_price?.N);
        // Assuming there is only one item with the selected size
        const quantity = data.Items[0]?.product_quantity?.N;
        const price = data.Items[0]?.product_price?.N;
        console.log(quantity);
        res.json({ productQuantity: quantity, productPrice: price });
      }
    });
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
