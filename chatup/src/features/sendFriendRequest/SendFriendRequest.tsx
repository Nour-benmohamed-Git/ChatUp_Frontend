"use client";
import { logout } from "@/app/_actions/authActions/logout";
import { addFriendRequest } from "@/app/_actions/friendRequestActions/addFriendRequest";
import InputField from "@/app/components/inputField/InputField";
import { useSocket } from "@/context/SocketContext";
import { FriendRequestResponse } from "@/types/FriendRequest";
import { sideBarMenuActions } from "@/utils/constants/actionLists/sideBarActions";
import { emitFriendRequest } from "@/utils/helpers/socket-helpers";
import { addFriendRequestSchema } from "@/utils/schemas/addFriendRequestSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { FC, useTransition } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { ImSpinner9 } from "react-icons/im";
import { toast } from "sonner";
import { z } from "zod";
import BlocContainer from "../blocContainer/BlocContainer";

const SendFriendRequest: FC = () => {
  const { socket } = useSocket();
  const [isPending, startTransition] = useTransition();

  const methods = useForm<z.infer<typeof addFriendRequestSchema>>({
    defaultValues: {
      email: "",
    },
    mode: "onChange",
    resolver: zodResolver(addFriendRequestSchema),
  });

  const onClickFunctions: { [key: string]: () => void } = {
    logout: logout,
  };

  const updatedSideBarMenuActions = sideBarMenuActions.map((action) => ({
    ...action,
    onClick: onClickFunctions[action.label],
  }));

  const onSubmit = async (data: z.infer<typeof addFriendRequestSchema>) => {
    startTransition(async () => {
      const formData = new FormData();
      formData.append("email", data.email);
      const response = await addFriendRequest(null, formData);
      if (response?.error) {
        toast.error(response.error.message); 
      } else {
        if (
          socket &&
          (
            response as {
              data: FriendRequestResponse;
            }
          ).data
        ) {
          emitFriendRequest(socket, {
            action: "send",
            friendRequest: (
              response as {
                data: FriendRequestResponse;
              }
            ).data,
          });
          toast.success("Friend request has been successfully sent.");
        }
      }
    });
  };
  return (
    <aside
      id="sidebar"
      className="md:flex md:flex-col md:col-span-5 h-full lg:col-span-4 md:border-r md:border-slate-500"
    >
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)}>
          <BlocContainer
            title="Add Friend"
            label="left_container"
            menuActionList={updatedSideBarMenuActions}
            cssClass="p-2 h-[calc(100vh-3.5rem)]"
          >
            <div className="md:h-auto max-w-md p-2 gap-4 rounded-none md:rounded-md">
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <p className="block text-xs font-medium text-white">
                    Please insert the E_mail address of the person you want to
                    add as a friend.
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
                    type="submit"
                    disabled={isPending}
                    data-te-ripple-init
                    data-te-ripple-color="light"
                    className="flex justify-center items-center rounded-md bg-gold-900 px-6 py-2.5 text-sm font-medium uppercase text-gray-900 transition duration-150 ease-in-out hover:bg-gold-600"
                  >
                    {isPending ? (
                      <ImSpinner9 size={20} className="animate-spin" />
                    ) : (
                      "SEND"
                    )}
                  </button>
                </div>
              </div>
            </div>
          </BlocContainer>
        </form>
      </FormProvider>
    </aside>
  );
};
export default SendFriendRequest;
