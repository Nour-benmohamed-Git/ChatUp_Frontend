import Logo from "@/app/components/logo/Logo";
import AuthPrompt from "@/features/authSection/authPrompt/AuthPrompt";
import SignUpForm from "@/features/authSection/signUpForm/SignUpForm";
import { paths } from "@/utils/constants/paths";
import { FC } from "react";

const SignUp: FC = () => {
  return (
    <>
      <Logo />
      <SignUpForm />
      <AuthPrompt
        chatPromptText="Already have an account?"
        path={paths.authRoutes.signIn}
        linkTitle="Sign in here"
      />
    </>
  );
};

export default SignUp;
