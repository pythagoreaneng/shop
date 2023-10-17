"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import CheckoutButton from "../components/checkoutButton";
import { EB_Garamond } from "next/font/google";

const mainFont = EB_Garamond({ subsets: ["latin"], weight: "400" });
const availableSizes = ["Small", "Medium", "Large", "XLarge"];

export default function Home() {
  const [selectedSize, setSelectedSize] = useState("Small"); // State to keep track of the selected size
  const [productPrice, setProductPrice] = useState(null);
  const [outOfStock, setOutOfStock] = useState(true);
  const [productQuantity, setProductQuantity] = useState(0);

  useEffect(() => {
    // Fetch the product quantity from your Express.js server
    fetch(`http://localhost:3001/backend/quantity?size=${selectedSize}`)
      .then((response) => response.json())
      .then((data) => {
        setProductQuantity(data.productQuantity);
        setProductPrice(data.productPrice);

        if (data.productQuantity > 0) {
          setOutOfStock(false);
        } else {
          setOutOfStock(true);
        }
      })
      .catch((error) => {
        console.error("Error fetching product quantity:", error);
      });
  }, [, selectedSize, outOfStock]);

  const handleSizeClick = (size: string) => {
    setSelectedSize(size);
  };

  return (
    <main
      className={`flex min-h-screen flex-col items-center justify-between ${mainFont.className}`}
    >
      <header className="text-4xl mt-6">PYTHAGOREAN</header>
      <h2 className="">
        <Image
          src="/product.png"
          width={500}
          height={500}
          alt="Picture of the author"
        />
      </h2>
      <div className="flex flex-col">
        <div className="text-center text-gray-500">
          <p>100% HEAVY WEIGHT COTTON.</p>
          <p>DESIGNED IN LOS ANGELES.</p>
          <p>MADE IN USA.</p> <p>11.5oz</p>
          <p>285 GSM</p> <p>PRESHRUNK (0-3%)</p>
        </div>
        <div className="flex space-x-7 justify-center m-4">
          {outOfStock ? "Sold Out." : `$${productPrice}`}
        </div>
        <div className="flex space-x-7 justify-center ">
          {availableSizes.map((size) => (
            <span
              key={size}
              onClick={() => handleSizeClick(size)}
              className={`${
                selectedSize === size ? "underline" : ""
              } cursor-pointer`}
            >
              {size}
            </span>
          ))}
        </div>
        <div className="flex justify-center p-6" style={{ minHeight: "100px" }}>
          {!outOfStock && <CheckoutButton selectedSize={selectedSize} />}
        </div>
      </div>
    </main>
  );
}
