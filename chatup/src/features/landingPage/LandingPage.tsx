import Logo from "@/app/components/logo/logo";
import { FC } from "react";

const LandingPage: FC = () => {
  return (
    <div className="hidden md:flex md:flex-col md:col-span-7 lg:col-span-8 items-center justify-center h-full bg-gradient-to-r from-gray-700 via-gray-900 to-black">
      <Logo />
      <div className="text-lg text-white text-center max-w-md">
        Welcome to Chat Up! Start chatting with your family, friends and
        colleagues.
      </div>
    </div>
  );
};

/* <button className="px-6 py-3 bg-green-600 text-white text-xl font-semibold rounded-md hover:bg-green-700">
        Start Chatting
      </button> */
/* </div> */

export default LandingPage;
