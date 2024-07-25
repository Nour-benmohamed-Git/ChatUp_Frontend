"use client";
import { signIn } from "@/app/_actions/authActions/signIn";
import InputField from "@/app/components/inputField/InputField";
import { signInSchema } from "@/utils/schemas/signInSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { FC, useTransition } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import SubmitButton from "../submitButton/SubmitButton";

const SignInForm: FC = () => {
  const [isPending, startTransition] = useTransition();

  const methods = useForm<z.infer<typeof signInSchema>>({
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "all",
    resolver: zodResolver(signInSchema),
  });

  const onSubmit = async (data: z.infer<typeof signInSchema>) => {
    startTransition(async () => {
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        formData.append(key, value);
      });

      const response = await signIn(null, formData);
      if (response) {
        toast.error(response?.message);
      }
    });
  };
  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)}>
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
        <SubmitButton isPending={isPending} text={"LOGIN"} />
      </form>
    </FormProvider>
  );
};
export default SignInForm;
