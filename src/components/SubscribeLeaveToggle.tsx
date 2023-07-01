"use client";
import { FC, startTransition } from "react";
import { Button } from "./ui/Button";
import { useMutation } from "@tanstack/react-query";
import { SubscribeToSlicePayload } from "@/lib/validators/slice";
import { toast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

interface SubscribeLeaveToggleProps {
  sliceId: string;
  isSubscribed: boolean;
  sliceName: string;
}

const SubscribeLeaveToggle: FC<SubscribeLeaveToggleProps> = ({
  sliceId,
  isSubscribed,
  sliceName,
}) => {
  const router = useRouter();

  const { mutate: subscribe, isLoading: isSubscribing } = useMutation({
    mutationFn: async () => {
      const payload: SubscribeToSlicePayload = {
        sliceId,
      };

      const response = await fetch("/api/slice/subscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      return data as string;
    },
    onError: (error) => {
      return toast({
        title: "There was a problem.",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    },
    onSuccess: () => {
      startTransition(() => {
        router.refresh();
      });

      return toast({
        title: "Subscribed!",
        description: `You are now subscribed to s/${sliceName}`,
      });
    },
  });

  const { mutate: unsubscribe, isLoading: isUnsubscribing } = useMutation({
    mutationFn: async () => {
      const payload: SubscribeToSlicePayload = {
        sliceId,
      };

      const response = await fetch("/api/slice/unsubscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      return data as string;
    },
    onError: (error) => {
      return toast({
        title: "There was a problem.",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    },
    onSuccess: () => {
      startTransition(() => {
        router.refresh();
      });

      return toast({
        title: "Unsubscribed!",
        description: `You are now unsubscribed from s/${sliceName}`,
      });
    },
  });

  return isSubscribed ? (
    <Button
      isLoading={isUnsubscribing}
      onClick={() => unsubscribe()}
      className="w-full mt-1 mb-4"
    >
      {" "}
      Leave community{" "}
    </Button>
  ) : (
    <Button
      isLoading={isSubscribing}
      onClick={() => subscribe()}
      className="w-full mt-1 mb-4"
    >
      Join to post
    </Button>
  );
};

export default SubscribeLeaveToggle;
