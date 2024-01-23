
import SignUpForm from "@/features/sign-up-form/sign-up-form";
import { paths } from "@/utils/constants/paths";
import Link from "next/link";
import { FC } from "react";
import { ImRocket } from "react-icons/im";

const SignUp: FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-gray-700 via-gray-900 to-black">
      <div className="flex items-center justify-center mb-9 gap-2">
        <h3 className="text-4xl font-semibold text-gold-900">CHAT</h3>
        <ImRocket size={30} className="text-gold-900" />
      </div>
      <SignUpForm />
      <div className="mt-6 text-center">
        <p className="text-sm text-gray-300">
          Already have an account?{" "}
          <Link
            href={paths.signIn}
            className="text-gold-900 hover:text-gold-700"
          >
            Sign in here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignUp;
