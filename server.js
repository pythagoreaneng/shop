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

app.get("/api/product-quantity", async (req, res) => {
  const dynamoDB = new DynamoDB();
  const params = {
    TableName: "testDB",
    Key: {
      product_id: { S: "1" },
    },
  };

  try {
    dynamoDB.getItem(params, (err, data) => {
      if (err) {
        console.error("Error retrieving item:", err);
        res.status(500).json({ error: "Error retrieving item" });
      } else {
        const quantity = data.Item?.product_quantity?.N;
        console.log(quantity);
        res.json({ productQuantity: quantity });
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
