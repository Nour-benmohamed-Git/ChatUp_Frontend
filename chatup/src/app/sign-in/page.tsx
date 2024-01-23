import SignInForm from "@/features/sign-in-form/sign-in-form";
import { paths } from "@/utils/constants/paths";
import Link from "next/link";
import { FC } from "react";
import { ImRocket } from "react-icons/im";
const SignIn: FC = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-gray-700 via-gray-900 to-black">
      <div className="flex flex-col justify-center w-full h-screen md:h-auto max-w-md bg-gradient-to-r from-black via-gray-900 to-gray-700 p-6 gap-2 rounded-none md:rounded-md shadow-md">
        <div className="flex w-full items-center justify-center gap-1 mb-9">
          <h3 className="text-4xl font-semibold text-center text-gold-900">
            CHAT
          </h3>
          <ImRocket size={30} className="text-gold-900" />
        </div>
        <SignInForm />

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-300">
            Ready to chat?{" "}
            <Link
              href={paths.signUp}
              className="text-sm text-gold-900 no-underline hover:text-gold-700"
            >
              Sign up now!
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
