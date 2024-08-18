"use client";
import { logout } from "@/app/_actions/authActions/logout";
import { sendFriendRequest } from "@/app/_actions/friendRequestActions/sendFriendRequest";
import InputField from "@/app/components/inputField/InputField";
import { useSocket } from "@/context/SocketContext";
import { FriendRequestResponse } from "@/types/FriendRequest";
import { sideBarMenuActions } from "@/utils/constants/actionLists/sideBarActions";
import { EnabledInput } from "@/utils/constants/globals";
import { emitFriendRequest } from "@/utils/helpers/socket-helpers";
import { sendFriendRequestSchema } from "@/utils/schemas/sendFriendRequestSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { FC, useTransition } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { AiOutlineMail, AiOutlinePhone } from "react-icons/ai";
import { ImSpinner9 } from "react-icons/im";
import { toast } from "sonner";
import { z } from "zod";
import { SendFriendRequestProps } from "./SendFriendRequest.types";
import BlocContainer from "@/features/blocContainer/BlocContainer";
import FriendSuggestionList from "../friendSuggestionList/FriendSuggestionList";

const SendFriendRequest: FC<SendFriendRequestProps> = (props) => {
  const { initialFriendSuggestions } = props;
  const { socket } = useSocket();
  const [isPending, startTransition] = useTransition();
  const methods = useForm<z.infer<typeof sendFriendRequestSchema>>({
    defaultValues: {
      email: "",
      phone: "",
      enabledInput: EnabledInput.EMAIL,
    },
    mode: "all",
    resolver: zodResolver(sendFriendRequestSchema),
  });

  const onClickFunctions: { [key: string]: () => void } = {
    logout: logout,
  };

  const updatedSideBarMenuActions = sideBarMenuActions.map((action) => ({
    ...action,
    onClick: onClickFunctions[action.label],
  }));

  const onSubmit = async (data: z.infer<typeof sendFriendRequestSchema>) => {
    startTransition(async () => {
      const formData = new FormData();
      if (data.enabledInput === EnabledInput.EMAIL) {
        if (data?.email) {
          formData.append("email", data.email);
          formData.append("enabledInput", data.enabledInput);
        }
      } else {
        if (data.phone) formData.append("phone", data.phone);
        formData.append("enabledInput", data.enabledInput);
      }
      const response = await sendFriendRequest(null, formData);
      if (response?.error) {
        toast.error(response.error.message);
      } else {
        if (
          socket &&
          (
            response?.data as {
              data: FriendRequestResponse;
            }
          ).data
        ) {
          emitFriendRequest(socket, {
            action: "send",
            friendRequest: (
              response?.data  as {
                data: FriendRequestResponse;
              }
            ).data,
          });
          toast.success("Friend request has been successfully sent.");
        }
      }
    });
  };

  const toggleEnabledInput = () => {
    const currentEnabledInput = methods.getValues("enabledInput");
    const newEnabledInput =
      currentEnabledInput === EnabledInput.EMAIL
        ? EnabledInput.PHONE
        : EnabledInput.EMAIL;
    methods.setValue("enabledInput", newEnabledInput);
    methods.setValue(
      currentEnabledInput === EnabledInput.EMAIL ? "email" : "phone",
      ""
    );
  };

  return (
    <aside
      id="sidebar"
      className="md:flex md:flex-col md:col-span-5 h-full lg:col-span-4 md:border-r md:border-slate-500 bg-gradient-to-r from-slate-600 to-gray-700"
    >
      <BlocContainer
        title="Add Friend"
        label="left_container"
        menuActionList={updatedSideBarMenuActions}
        cssClass="p-4 h-[calc(100vh-3.5rem)]"
      >
        <FormProvider {...methods}>
          <form onSubmit={methods.handleSubmit(onSubmit)}>
            <div className="flex flex-col items-center gap-6">
              <button
                type="button"
                onClick={toggleEnabledInput}
                className="rounded-full p-3 transition-colors duration-300 ease-in-out border-2 border-gray-400 bg-gray-200 hover:bg-gray-300 shadow-2xl"
              >
                {methods.watch("enabledInput") === EnabledInput.EMAIL ? (
                  <AiOutlineMail size={24} className="text-gray-700" />
                ) : (
                  <AiOutlinePhone size={24} className="text-gray-700" />
                )}
              </button>
              <div className="flex flex-col items-center gap-2 w-full">
                <p className="block text-sm text-gray-100">
                  Please insert the{" "}
                  {methods.watch("enabledInput") === EnabledInput.EMAIL
                    ? "email address"
                    : "phone number"}{" "}
                  of the person of the person you would like to add as a friend.
                </p>
              </div>
              <div className="flex items-center gap-4 w-full">
                {methods.watch("enabledInput") === EnabledInput.EMAIL ? (
                  <InputField
                    id="email"
                    name="email"
                    type="email"
                    placeholder="example@example.com"
                    autoComplete="email"
                  />
                ) : (
                  <InputField
                    id="phone"
                    name="phone"
                    type="tel"
                    placeholder="123-456-7890"
                    autoComplete="tel"
                  />
                )}
                <button
                  type="submit"
                  disabled={isPending}
                  data-te-ripple-init
                  data-te-ripple-color="light"
                  className="self-start w-24 rounded-md bg-gold-900 px-6 py-2.5 text-sm font-medium text-gray-900 transition duration-150 ease-in-out hover:bg-gold-600"
                >
                  {isPending ? (
                    <ImSpinner9 size={20} className="animate-spin" />
                  ) : (
                    "Send"
                  )}
                </button>
              </div>
            </div>
          </form>
        </FormProvider>
        <div className="flex flex-col gap-4">
          <h3 className="text-lg font-semibold text-gold-900">Quick Add</h3>
          <FriendSuggestionList
            initialFriendSuggestions={initialFriendSuggestions}
          />
        </div>
      </BlocContainer>
    </aside>
  );
};

export default SendFriendRequest;
