import React from "react";
import { EB_Garamond } from "next/font/google";
import { useRouter } from "next/router";
import Link from "next/link";
import "../app/globals.css";

const mainFont = EB_Garamond({ subsets: ["latin"], weight: "400" });

export default function OrderStatus() {
  const router = useRouter();
  const { status } = router.query;

  const buttonClasses =
    "bg-white text-black px-4 py-2 rounded-lg hover:bg-gray-500";

  return (
    <div
      className={`min-h-screen flex items-center justify-center bg-black text-white ${mainFont.className}`}
    >
      <div className="text-center">
        {status === "success" ? (
          <>
            <h1 className="mb-10">Thanks for your order!</h1>
            <a
              href="/"
              className="bg-white text-black px-4 py-2 rounded-lg hover:bg-gray-500"
            >
              Return to Home
            </a>
          </>
        ) : status === "failed" ? (
          <>
            <h1 className="mb-10">Something went wrong!</h1>
            <a
              href="/"
              className="bg-white text-black px-4 py-2 rounded-lg hover:bg-gray-500"
            >
              Return to Home
            </a>
          </>
        ) : (
          <p>Invalid status.</p>
        )}
      </div>
    </div>
  );
}
