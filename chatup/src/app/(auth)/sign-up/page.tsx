import Logo from "@/components/logo/logo";
import AuthPrompt from "@/features/auth-prompt/auth-prompt";
import SignUpForm from "@/features/sign-up-form/sign-up-form";
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
