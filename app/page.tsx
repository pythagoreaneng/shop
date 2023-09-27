"use client";
import Image from "next/image";
import { EB_Garamond } from "next/font/google";
import CheckoutButton from "../pages/checkoutButton";

// If loading a variable font, you don't need to specify the font weight
const mainFont = EB_Garamond({ subsets: ["latin"], weight: "400" });

export default function Home() {
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
        <div className="flex space-x-7 justify-center m-4">$69</div>
        <div className="flex space-x-7 justify-center ">
          <div>S</div>
          <div>M</div>
          <div>L</div>
          <div>XL</div>
        </div>
      </div>
      <CheckoutButton />
    </main>
  );
}
