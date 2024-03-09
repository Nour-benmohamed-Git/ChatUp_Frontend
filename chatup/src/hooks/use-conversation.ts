import { useParams } from "next/navigation";
import { useMemo } from "react";

const useConversation = () => {
  const params = useParams();

  const conversationId = useMemo(() => {
    return params?.conversationId || "";
  }, [params?.conversationId]);

  return useMemo(
    () => ({
      isOpen: !!conversationId,
    }),
    [conversationId]
  );
};

export default useConversation;
