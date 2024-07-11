import { paths } from "@/utils/constants/paths";
import Link from "next/link";
import { FC } from "react";
import { IoHome } from "react-icons/io5";
import Background from "./components/background/Background";
const NotFound: FC = () => {
  return (
    <div className="flex items-center justify-center h-screen w-full bg-gradient-to-r from-gray-700 via-gray-900 to-black">
      <div className="hidden md:block h-80 w-96">
        <Background />
      </div>

      <div className="flex flex-col justify-center items-center h-full md:h-auto w-full md:w-3/4 lg:w-1/2 p-6 md:p-10 rounded-md shadow-2xl gap-6 md:gap-10">
        <h2 className="text-9xl font-extrabold text-gold-900 animate-bounce">
          404
        </h2>
        <p className="text-3xl md:text-4xl font-semibold text-gold-600 text-center">
          Oops! Page Not Found!
        </p>
        <p className="text-lg md:text-xl text-center text-slate-100">
          Explore more on our homepage to discover new connections and features.
        </p>
        <Link
          href={paths.protectedRoutes.conversations}
          className="w-full md:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-md bg-gold-900 text-gray-900 text-sm font-medium uppercase transition duration-150 ease-in-out hover:bg-gold-600"
        >
          <IoHome className="text-xl font-bold" />
          Go to Home
        </Link>
      </div>

      <div className="hidden md:block h-80 w-96">
        <Background />
      </div>
    </div>
  );
};

export default NotFound;
