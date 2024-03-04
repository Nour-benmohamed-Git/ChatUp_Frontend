"use client";
import { signIn } from "@/app/_actions/auth-actions/sign-in";
import InputField from "@/components/input-field/input-field";
import { schema } from "@/utils/schemas/sign-in-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAction } from "next-safe-action/hooks";
import { FC } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { ImSpinner9 } from "react-icons/im";
import { z } from "zod";

const SignInForm: FC = () => {
  const { execute, status } = useAction(signIn);
  const methods = useForm<z.infer<typeof schema>>({
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "all",
    shouldFocusError: true,
    resolver: zodResolver(schema),
  });
  const onSubmit = async (data: z.infer<typeof schema>) => {
    execute(data);
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
        disabled={status === "executing"}
        data-te-ripple-init
        data-te-ripple-color="light"
        className="w-full flex justify-center items-center rounded-md bg-gold-900 px-6 py-2.5 text-sm font-medium uppercase text-gray-900 transition duration-150 ease-in-out hover:bg-gold-600"
      >
        {status === "executing" ? (
          <ImSpinner9 size={20} className="animate-spin" />
        ) : (
          "LOGIN"
        )}
      </button>
    </FormProvider>
  );
};
export default SignInForm;
