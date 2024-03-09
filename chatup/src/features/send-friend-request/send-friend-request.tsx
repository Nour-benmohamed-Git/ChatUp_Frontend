"use client";
import { addFriendRequest } from "@/app/_actions/friend-request-actions/add-friend-request";
import InputField from "@/components/input-field/input-field";
import { useSocket } from "@/context/socket-context";
import { emitFriendRequest } from "@/utils/helpers/socket-helpers";
import { addFriendRequestSchema } from "@/utils/schemas/add-friend-request-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAction } from "next-safe-action/hooks";
import { FC } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { ImSpinner9 } from "react-icons/im";
import { toast } from "sonner";
import { z } from "zod";

const SendFriendRequest: FC = () => {
  const { socket } = useSocket();
  const { execute, result, status } = useAction(addFriendRequest);
  const methods = useForm<z.infer<typeof addFriendRequestSchema>>({
    defaultValues: {
      email: "",
    },
    mode: "onChange",
    resolver: zodResolver(addFriendRequestSchema),
  });
  const onSubmit = async (data: z.infer<typeof addFriendRequestSchema>) => {
    execute(data);
    if (result.data) {
      socket &&
        emitFriendRequest(socket, {
          action: "send",
          friendRequest: result.data,
        });
      toast.success("Friend request has been successfully sent.");
    }
  };
  return (
    <FormProvider {...methods}>
      <div className="flex items-center justify-center  bg-gradient-to-r from-gray-700 via-gray-900 to-black order-1 lg:col-span-3 lg:order-2">
        <div className="flex flex-col justify-center md:h-auto max-w-md bg-gradient-to-r from-black via-gray-900 to-gray-700 p-6 gap-4 rounded-none md:rounded-md shadow-md">
          <h2 className="text-2xl font-semibold text-gray-400">Add Friend</h2>
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <p className="block text-sm font-medium text-gray-400">
                Please insert the E_mail address of the person you want to add
                as a friend
              </p>
            </div>
            <div className="flex items-start gap-3">
              <InputField
                id="email"
                name="email"
                type="email"
                placeholder="example@example.com"
                autoComplete="email"
              />
              <button
                type="button"
                onClick={methods.handleSubmit(onSubmit)}
                disabled={status === "executing"}
                data-te-ripple-init
                data-te-ripple-color="light"
                className="flex justify-center items-center rounded-md bg-gold-900 px-6 py-2.5 text-sm font-medium uppercase text-gray-900 transition duration-150 ease-in-out hover:bg-gold-600"
              >
                {status === "executing" ? (
                  <ImSpinner9 size={20} className="animate-spin" />
                ) : (
                  "Send"
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </FormProvider>
  );
};
export default SendFriendRequest;
