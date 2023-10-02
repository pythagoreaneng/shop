"use client";

import React, { useState } from "react";
import Image from "next/image";
import CheckoutButton from "../pages/checkoutButton";
import { EB_Garamond } from "next/font/google";

const mainFont = EB_Garamond({ subsets: ["latin"], weight: "400" });
const availableSizes = ["Small", "Medium", "Large", "XLarge"];

export default function Home() {
  const [selectedSize, setSelectedSize] = useState("Small"); // State to keep track of the selected size
  const [productPrice, setProductPrice] = useState(null);

  const handleSizeClick = (size: string) => {
    setSelectedSize(size);
  };

  return (
    <main
      className={`flex min-h-screen flex-col items-center justify-between p-24 ${mainFont.className}`}
    >
      <header className="text-4xl m-10">Pythagorean</header>
      <h2 className="h-screen">
        <Image
          src="/product.png"
          width={500}
          height={500}
          alt="Picture of the author"
        />
      </h2>
      <div className="flex flex-col">
        <div className="flex space-x-7 justify-center m-4">${productPrice}</div>
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
      </div>
      <CheckoutButton
        selectedSize={selectedSize}
        setProductPrice={setProductPrice}
      />
    </main>
  );
}
