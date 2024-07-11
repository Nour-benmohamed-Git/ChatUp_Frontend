"use client";
import { paths } from "@/utils/constants/paths";
import Link from "next/link";
import { FC } from "react";
import { SlRefresh } from "react-icons/sl";
import { TbAccessPoint } from "react-icons/tb";
import Background from "./components/background/Background";
import "./globals.css";
import { IoHome } from "react-icons/io5";

type ErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

const GlobalError: FC<ErrorProps> = ({ error, reset }) => {
  let errorMessage =
    "An unexpected error occurred. Please try again or contact support.";
  let actionButton = (
    <div className="flex  justify-center flex-col md:flex-row w-full gap-4">
      <button
        onClick={reset}
        className="w-full md:w-auto flex justify-center gap-2 items-center rounded-md bg-gold-900 px-6 py-2.5 text-sm font-medium uppercase text-gray-900 transition duration-150 ease-in-out hover:bg-gold-600"
      >
        <SlRefresh className="font-bold" size={24} /> Try Again
      </button>
      <Link
        href={paths.protectedRoutes.conversations}
        className="w-full md:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-md bg-gold-900 text-gray-900 text-sm font-medium uppercase transition duration-150 ease-in-out hover:bg-gold-600"
      >
        <IoHome className="text-xl font-bold" />
        Go to Home
      </Link>
    </div>
  );

  if (
    [
      "Access denied. Your session has expired.",
      "Access denied. No token provided.",
      "Access denied.",
    ].includes(error.message)
  ) {
    errorMessage = error.message;
    actionButton = (
      <Link
        href={paths.authRoutes.signIn}
        className="w-full md:w-auto flex justify-center items-center rounded-md bg-gold-900 px-6 py-2.5 text-sm font-medium uppercase text-gray-900 transition duration-150 ease-in-out hover:bg-gold-600"
      >
        <TbAccessPoint className="mr-2 font-bold" size={24} /> Reconnect
      </Link>
    );
  }

  return (
    <html>
      <body className="flex items-center justify-center h-screen w-full bg-gradient-to-r from-gray-700 via-gray-900 to-black">
        <div className="hidden md:block h-80 w-96">
          <Background />
        </div>
        <div className="flex flex-col justify-center items-center h-full md:h-auto w-full md:w-3/4 lg:w-1/2 p-6 rounded-none md:rounded-md shadow-2xl gap-14">
          <h1 className="text-6xl text-center font-bold text-gold-900 animate-bounce">
            Oops!
          </h1>
          <div className="flex flex-col justify-center items-center gap-10">
            <p className="text-slate-100 text-center text-xl">{errorMessage}</p>
            {actionButton}
          </div>
        </div>
        <div className="hidden md:block h-96 w-96">
          <Background />
        </div>
      </body>
    </html>
  );
};

export default GlobalError;
