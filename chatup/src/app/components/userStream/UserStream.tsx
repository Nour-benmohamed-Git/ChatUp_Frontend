import { FC, memo, useEffect, useRef } from "react";
import Avatar from "../avatar/Avatar";
import { UserStreamProps } from "./UserStream.types";

const UserStream: FC<UserStreamProps> = ({
  mediaStream,
  isVideoEnabled,
  isCurrentUser,
  profilePicture,
  username,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (isVideoEnabled && videoRef.current) {
      videoRef.current.srcObject = mediaStream;
    } else if (audioRef.current) {
      audioRef.current.srcObject = mediaStream;
    }
  }, [mediaStream, isVideoEnabled]);

  return (
    <div className="relative h-full w-full md:w-1/2 rounded-2xl overflow-hidden bg-gray-900 transition-transform transform hover:scale-105 hover:shadow-[0_10px_30px_rgba(0,0,0,0.7)] shadow-[0_4px_12px_rgba(0,0,0,0.5)]">
      {isVideoEnabled ? (
        <video
          ref={videoRef}
          className="w-full h-full object-cover"
          autoPlay
          playsInline
        />
      ) : (
        <>
          <audio ref={audioRef} autoPlay style={{ display: "none" }} />
          <Avatar
            additionalClasses="h-full w-full"
            rounded="rounded-2xl shadow-[0_0_10px_5px_rgba(255,_165,_0,_0.4)] border-2 border-gold-900"
            fileName={profilePicture}
          />
        </>
      )}
      <div className="absolute bottom-2 left-2 bg-gradient-to-tr from-gray-800 to-gray-600 text-white font-semibold px-2 py-1 rounded-md capitalize">
        {isCurrentUser ? "You" : username}
      </div>
    </div>
  );
};

export default memo(UserStream);
