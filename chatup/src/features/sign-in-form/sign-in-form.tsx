"use client";
import InputField from "@/components/input-field/input-field";
import { useSignInMutation } from "@/redux/apis/auth/authApi";
import { UserSignInRequest } from "@/types/UserSignIn";
import { globals } from "@/utils/constants/globals";
import { paths } from "@/utils/constants/paths";
import { storeItem } from "@/utils/helpers/cookies-helpers";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { FC } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { ImSpinner9 } from "react-icons/im";
import { z } from "zod";

const schema = z.object({
  email: z.string().min(1,"Email is required.").email("Email is invalid."),
  password: z.string().min(1,"Password is invalid."),
});
const SignInForm: FC = () => {
  const [signIn, { isLoading }] = useSignInMutation();
  const router = useRouter();
  const methods = useForm<UserSignInRequest>({
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "all",
    shouldFocusError: true,
    resolver: zodResolver(schema),
  });
  const onSubmit = (data: UserSignInRequest) => {
    signIn(data)
      .unwrap()
      .then((data) => {
        storeItem(
          [
            { key: globals.tokenKey, value: data?.data?.token },
            { key: globals.currentUserId, value: data?.data?.id },
          ],
          globals.expireIn
        );
        router.replace(paths.protectedRoutes.home);
      })
      .catch((error: any) => {
        // toast.clearWaitingQueue();
        // toast.error(signInError?.data?.message, {
        //   position: "top-right",
        // });
      });
  };
  return (
    <FormProvider {...methods}>
      <div className="w-full max-w-lg">
        <InputField
          id="email"
          name="email"
          type="email"
          placeholder="Email"
          autoComplete="email"
        />
        <InputField
          id="password"
          name="password"
          type="password"
          placeholder="Password"
          autoComplete="password"
        />
      </div>
      <button
        type="button"
        onClick={methods.handleSubmit(onSubmit)}
        disabled={isLoading}
        data-te-ripple-init
        data-te-ripple-color="light"
        className="w-full flex justify-center items-center rounded-md bg-gold-900 px-6 py-2.5 text-sm font-medium uppercase text-gray-900 transition duration-150 ease-in-out hover:bg-gold-600"
      >
        {isLoading ? (
          <ImSpinner9 size={20} className="animate-spin" />
        ) : (
          "LOGIN"
        )}
      </button>
    </FormProvider>
  );
};
export default SignInForm;
