"use client";
import { logout } from "@/app/_actions/auth-actions/logout";
import { addFriendRequest } from "@/app/_actions/friend-request-actions/add-friend-request";
import InputField from "@/app/components/input-field/input-field";
import { useSocket } from "@/context/socket-context";
import { sideBarMenuActions } from "@/utils/constants/action-lists/sidebar-actions";
import { emitFriendRequest } from "@/utils/helpers/socket-helpers";
import { addFriendRequestSchema } from "@/utils/schemas/add-friend-request-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAction } from "next-safe-action/hooks";
import { FC, useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { ImSpinner9 } from "react-icons/im";
import { toast } from "sonner";
import { z } from "zod";
import BlocContainer from "../bloc-container/bloc-container";

const SendFriendRequest: FC = () => {
  const { socket } = useSocket();
  const { execute, result, status } = useAction(addFriendRequest);
  useEffect(() => {
    if (socket && result.data) {
      emitFriendRequest(socket, {
        action: "send",
        friendRequest: result.data.data,
      });
      toast.success("Friend request has been successfully sent.");
    }
  }, [socket, result.data]);

  const methods = useForm<z.infer<typeof addFriendRequestSchema>>({
    defaultValues: {
      email: "",
    },
    mode: "onChange",
    resolver: zodResolver(addFriendRequestSchema),
  });
  const onSubmit = (data: z.infer<typeof addFriendRequestSchema>) => {
    execute(data);
  };

  const onClickFunctions: { [key: string]: () => void } = {
    logout: logout,
  };

  const updatedSideBarMenuActions = sideBarMenuActions.map((action) => ({
    ...action,
    onClick: onClickFunctions[action.label],
  }));
  return (
    <aside
      id="sidebar"
      className="md:flex md:flex-col md:col-span-5 h-full lg:col-span-4 md:border-r md:border-slate-500"
    >
      <FormProvider {...methods}>
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
                  Please insert the E_mail address of the person you want to add
                  as a friend.
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
        </BlocContainer>
      </FormProvider>
    </aside>
  );
};
export default SendFriendRequest;
