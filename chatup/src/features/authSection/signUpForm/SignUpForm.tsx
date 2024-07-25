"use client";
import { signUp } from "@/app/_actions/authActions/signUp";
import InputField from "@/app/components/inputField/InputField";
import { signUpSchema } from "@/utils/schemas/signUpSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { FC, useTransition } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import SubmitButton from "../submitButton/SubmitButton";

const SignUpForm: FC = () => {
  const [isPending, startTransition] = useTransition();

  const methods = useForm<z.infer<typeof signUpSchema>>({
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
    },
    mode: "all",
    resolver: zodResolver(signUpSchema),
  });

  const onSubmit = async (data: z.infer<typeof signUpSchema>) => {
    startTransition(async () => {
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        formData.append(key, value);
      });

      const response = await signUp(null, formData);
      if (response) {
        toast.error(response?.message);
      } else {
        toast.success("Registration successful");
      }
    });
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)}>
        <div className="w-full max-w-lg">
          <div className="grid grid-cols-2 gap-4">
            <InputField
              id="firstName"
              name="firstName"
              type="text"
              placeholder="First Name"
              autoComplete="given-name"
            />
            <InputField
              id="lastName"
              name="lastName"
              type="text"
              placeholder="Last Name"
              autoComplete="family-name"
            />
          </div>
          <div className="grid grid-cols-1">
            <InputField
              id="email"
              name="email"
              type="email"
              placeholder="Email"
              autoComplete="email"
            />
            <InputField
              id="phone"
              name="phone"
              type="tel"
              placeholder="Phone Number"
              autoComplete="tel"
            />
          </div>
          <div className="grid grid-cols-1">
            <InputField
              id="password"
              name="password"
              type="password"
              placeholder="Password"
              autoComplete="new-password"
            />
            <InputField
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              placeholder="Confirm Password"
              autoComplete="new-password"
            />
          </div>
          <SubmitButton isPending={isPending} text={"REGISTER"} />
        </div>
      </form>
    </FormProvider>
  );
};
export default SignUpForm;
