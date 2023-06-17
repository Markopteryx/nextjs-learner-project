"use client";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { CreateSlicePayload } from "@/lib/validators/slice";
import { toast } from "@/hooks/use-toast";
import { useCustomToasts } from "@/hooks/use-custom-toasts";

const Page = () => {
  const [input, SetInput] = useState<string>("");
  const router = useRouter();
  const { loginToast } = useCustomToasts();

  const { mutate: createSlice, isLoading } = useMutation({
    mutationFn: async () => {
      const payload: CreateSlicePayload = {
        name: input,
      };

      const response = await fetch("/api/slice", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        if (response.status === 409) {
          throw new Error("Conflict");
        }
        if (response.status === 422) {
          throw new Error("Invalid");
        }
        if (response.status === 401) {
          throw new Error("Unauthorised");
        }
      }

      const data = await response.json();
      return data as string;
    },
    onError: (error) => {
      if (error instanceof Error && error.message === "Conflict") {
        return toast({
          title: "Subreddit already exists.",
          description: "Please choose a different name.",
          variant: "destructive",
        });
      }

      if (error instanceof Error && error.message === "Invalid") {
        return toast({
          title: "Subreddit name too short.",
          description: "Please choose a different name.",
          variant: "destructive",
        });
      }

      if (error instanceof Error && error.message === "Unauthorised") {
        return loginToast();
      }

      toast({
        title: "There was an error.",
        description: "Could not create subreddit.",
        variant: "destructive",
      });
    },
    onSuccess: (data) => {
      router.push(`/r/${data}`);
    },
  });

  return (
    <div className="container flex items-cener h-full max-w-3xl mx-auth">
      <div className="relative bg-white w-full h-fit p-4 rounded-lg space-y-6">
        <div className="flex justify-between items-centre">
          <h1 className="text-xl font-semibold">Create Slice</h1>{" "}
        </div>
        <hr className="bg-zinc-500 h-px" />

        <div>
          <p className="text-lg font-medium">Name</p>
          <p className="text-xs pb-2">
            Slices are communites sharing a common interest. Make one about
            anything you like!
          </p>

          <div className="relative">
            <p className="absolute text-sm left-0 w-8 inset-y-0 grid place-items-center text-zinc-400">
              ~/
            </p>
            <Input
              value={input}
              onChange={(event) => SetInput(event.target.value)}
              className="pl-6"
            />
          </div>
        </div>

        <div className="flex justify-end gap-4">
          <Button variant="subtle" onClick={() => router.back()}>
            Cancel
          </Button>
          <Button
            isLoading={isLoading}
            disabled={input.length === 0}
            onClick={() => createSlice()}
          >
            Create Slice
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Page;
