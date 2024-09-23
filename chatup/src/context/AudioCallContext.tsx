"use client";
import CallWindow from "@/app/components/callControlWindow/CallWindow";
import { useSocket } from "@/context/SocketContext";
import { ConversationCombinedType } from "@/types/ConversationCombinedType";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { SignalData } from "simple-peer";

export interface ICallInfo {
  status?:
    | "calling"
    | "incoming"
    | "accepted"
    | "rejected"
    | "ended"
    | "recall";
  signal?: SignalData;
  peerId?: number;
  chatSessionId?: number;
  title?: string;
  image?: string | string[];
}

interface AudioCallContextType {
  startCall: (combinedData?: ConversationCombinedType) => void;
}

const AudioCallContext = createContext<AudioCallContextType | undefined>(
  undefined
);

export const AudioCallProvider = ({ children }: { children: ReactNode }) => {
  const { socket } = useSocket();
  const [modal, setModal] = useState(false);
  const [callInfo, setCallInfo] = useState<ICallInfo>();

  const startCall = async (combinedData?: ConversationCombinedType) => {
    setCallInfo({
      chatSessionId: combinedData?.conversationId as number,
      image: combinedData?.image,
      title: combinedData?.title,
    });
    setModal(true);
    socket?.emit("join_media_room", `${combinedData?.conversationId}`);
    socket?.emit("audio_call_notification", {
      action: "start_call",
      chatSessionId: combinedData?.conversationId,
    });
  };
  const acceptCall = () => {
    socket?.emit("join_media_room", `${callInfo?.chatSessionId}`);
  };
  useEffect(() => {
    const handleStream = (data: ICallInfo) => {
      if (data.status === "incoming") {
        setCallInfo(data);
        setModal(true);
      } else if (data.status === "calling") {
        setCallInfo((prev) => ({
          ...prev,
          status: data.status,
        }));
      }
    };
    socket?.on("call_started", handleStream);
    return () => {
      socket?.off("call_started", handleStream);
    };
  }, [socket]);
  return (
    <AudioCallContext.Provider
      value={{
        startCall,
      }}
    >
      {children}
      {modal && (
        <CallWindow
          socket={socket}
          callInfo={callInfo}
          setCallInfo={setCallInfo}
          onAccept={acceptCall}
          handleRecall={() => {}}
          handleDismiss={() => {}}
          onEnd={() => {}}
          isMuted={false}
          onMuteToggle={() => {}}
          onReject={() => {}}
        />
      )}
    </AudioCallContext.Provider>
  );
};
export const useAudioCall = () => {
  const context = useContext(AudioCallContext);
  if (context === undefined) {
    throw new Error("useAudioCall must be used within an AudioCallProvider");
  }
  return context;
};
