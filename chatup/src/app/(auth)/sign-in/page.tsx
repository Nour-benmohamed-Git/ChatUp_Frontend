import Logo from "@/app/components/logo/Logo";
import AuthPrompt from "@/features/authSection/authPrompt/AuthPrompt";
import SignInForm from "@/features/authSection/signInForm/SignInForm";
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
