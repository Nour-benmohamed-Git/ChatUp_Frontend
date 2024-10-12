import { Dispatch, MutableRefObject, SetStateAction } from "react";
import SimplePeer, { SignalData } from "simple-peer";
import { Socket } from "socket.io-client";

export const createPeer = async (
  socket: Socket | null,
  peersRef: MutableRefObject<Map<number, SimplePeer.Instance>>,
  setUserStreams: Dispatch<SetStateAction<Map<number, MediaStream | null>>>,
  peerId: number,
  stream: MediaStream
) => {
  const peer = new SimplePeer({
    initiator: true,
    trickle: false,
    stream,
    config: {
      iceServers: [
        {
          urls: [
            "stun:stun.l.google.com:19302",
            "stun:stun1.l.google.com:19302",
            "stun:stun2.l.google.com:19302",
          ],
        },
        {
          urls: "turn:127.0.0.1:3478",
          username: "root",
          credential: "root",
        },
      ],
    },
  });
  if (!peer.destroyed) {
    peer.on("signal", (signal) => {
      socket?.emit("audio_call_notification", {
        action: "send_signal",
        peerId,
        signal,
      });
    });
  }
  peer.on("stream", async (incomingStream) => {
    setUserStreams((prevUserStreams) => {
      const updatedUserStreams = new Map(prevUserStreams);
      updatedUserStreams.set(peerId, incomingStream);
      return updatedUserStreams;
    });
  });

  peer.on("connect", () => {
    console.log("Peer connection established with:", peerId);
  });

  peer.on("error", (err) => {
    console.error("createPeer===>Peer connection error:", err);
    peersRef.current.delete(peerId);
    peer.destroy();
  });

  peer.on("close", () => {
    // console.log("createPeer===>Peer connection closed.");
    peersRef.current.delete(peerId);

    peer.destroy();
  });
  return peer;
};

export const addPeer = async (
  socket: Socket | null,
  peersRef: MutableRefObject<Map<number, SimplePeer.Instance>>,
  setUserStreams: Dispatch<SetStateAction<Map<number, MediaStream | null>>>,
  incomingSignal: SignalData,
  callerId: number,
  stream: MediaStream
) => {
  const peer = new SimplePeer({
    initiator: false,
    trickle: false,
    stream,
    config: {
      iceServers: [
        {
          urls: [
            "stun:stun.l.google.com:19302",
            "stun:stun1.l.google.com:19302",
            "stun:stun2.l.google.com:19302",
          ],
        },
        {
          urls: "turn:127.0.0.1:3478",
          username: "root",
          credential: "root",
        },
      ],
    },
  });

  if (!peer.destroyed) {
    peer.on("signal", (signal) => {
      // console.log("Sending signal back to peer:", callerId, signal);
      socket?.emit("audio_call_notification", {
        action: "return_signal",
        signal,
        callerId,
      });
    });
  }

  peer.on("stream", async (incomingStream) => {
    setUserStreams((prevUserStreams) => {
      const updatedUserStreams = new Map(prevUserStreams);
      updatedUserStreams.set(callerId, incomingStream);
      return updatedUserStreams;
    });
  });

  peer.on("connect", () => {
    console.log("Peer connection established with:", callerId);
  });

  peer.on("error", (err) => {
    // console.error("addPeer===>Peer connection error:", err);
    peersRef.current.delete(callerId);
    peer.destroy();
  });

  peer.on("close", () => {
    // console.log("addPeer===>Peer connection closed.");
    peersRef.current.delete(callerId);
    peer.destroy();
  });

  peer.signal(incomingSignal);
  return peer;
};

export const replaceVideoTrackForPeers = (
  peersRef: MutableRefObject<Map<number, SimplePeer.Instance>>,
  newTrack: MediaStreamTrack
) => {
  peersRef.current.forEach((peer) => {
    peer.replaceTrack(
      peer.streams[0].getVideoTracks()[0],
      newTrack,
      peer.streams[0]
    );
  });
};
