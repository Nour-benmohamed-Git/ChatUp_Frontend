"use client";
import InputField from "@/components/input-field/input-field";
import { useSignInMutation } from "@/redux/apis/auth/authApi";
import { UserSignIn } from "@/types/UserSignIn";
import { zodResolver } from "@hookform/resolvers/zod";
import { FC } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { z } from "zod";
const schema = z.object({
  email: z.string().nonempty("Email is required.").email("Email is invalid."),
  password: z.string().nonempty("Password is invalid."),
});
const SignInForm: FC = () => {
  const [signIn, { isLoading, error }] = useSignInMutation();
  const methods = useForm<UserSignIn>({
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "all",
    shouldFocusError: true,
    resolver: zodResolver(schema),
  });
  const onSubmit = (data: UserSignIn) => {
    signIn(data)
      .unwrap()
      .then((newData) => {
        console.log(newData);
        // localStorage.setItem(globalVariables.TOKEN, newData?.token);
        // localStorage.setItem(globalVariables.EMAIL, newData?.user?.email);
        // localStorage.setItem(globalVariables.PROFILE, newData?.user?.profile);
        // localStorage.setItem(
        //   globalVariables.PERMISSIONS,
        //   JSON.stringify(newData?.user.permissions)
        // );
        // translation.i18n.changeLanguage("gb");
        // PersistSelectedLanguage("gb");
        // navigate(getDefaultRoute(newData?.user.permissions), { replace: true });
      })
      .catch((signInError: any) => {
        // toast.clearWaitingQueue();
        // toast.error(signInError?.data?.message, {
        //   position: "top-right",
        // });
      });
  };
  return (
    <FormProvider {...methods}>
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
      <div>
        <button
          type="button"
          data-te-ripple-init
          data-te-ripple-color="light"
          className="w-full rounded-md bg-gold-900 px-6 py-2.5 text-sm font-medium uppercase  text-gray-900 transition duration-150 ease-in-out hover:bg-gold-700"
        >
          LOGIN
        </button>
      </div>
    </FormProvider>
  );
};
export default SignInForm;
