"use client";
import InputField from "@/components/input-field/input-field";
import { zodResolver } from "@hookform/resolvers/zod";
import { FC } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { z } from "zod";

const schema = z.object({
  firstName: z.string().min(1, "First Name is required."),
  lastName: z.string().min(1, "Last Name is required."),
  email: z.string().min(1, "Email is required.").email("Email is invalid."),
  phone: z.string().min(1, "Phone number is required."),
  password: z.string().min(6, "Password must be at least 6 characters."),
  //   confirmPassword: z
  //     .string()
  //     .refine((data) => data === methods.watch("password"), {
  //       message: "Passwords do not match",
  //     }),
  birthDate: z.string().min(1, "Birth Date is required."),
});
const SignUpForm: FC = () => {
  const methods = useForm({
    resolver: zodResolver(schema),
    mode: "all",
    shouldFocusError: true,
  });

  const onSubmit = (data: any) => {
    console.log("Sign-up data:", data);
  };

  return (
    <FormProvider {...methods}>
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
        <button
          type="submit"
          onSubmit={methods.handleSubmit(onSubmit)}
          className="w-full rounded-md bg-gold-900 px-6 py-2.5 text-sm font-medium uppercase text-gray-900 transition duration-150 ease-in-out hover:bg-gold-600"
        >
          REGISTER
        </button>
      </div>
    </FormProvider>
  );
};
export default SignUpForm;
