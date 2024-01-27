import Logo from "@/components/logo/logo";
import AuthPrompt from "@/features/auth-prompt/auth-prompt";
import SignInForm from "@/features/sign-in-form/sign-in-form";
import { paths } from "@/utils/constants/paths";
import { FC } from "react";
const SignIn: FC = () => {
  return (
    <>
      <Logo />
      <SignInForm />
      <AuthPrompt
        chatPromptText="Ready to chat?"
        path={paths.authRoutes.signUp}
        linkTitle="Sign up now!"
      />
    </>
  );
};

export default SignIn;
