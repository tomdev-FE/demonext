"use client";

import { AiFillGithub } from "react-icons/ai";
import { signIn } from "next-auth/react";
import { FcGoogle } from "react-icons/fc";
import { useCallback, useState } from "react";
import { toast } from "react-hot-toast";
import { SubmitHandler, useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import useLoginModal from "@/app/hooks/useLoginModal";
import useRegisterModal from "@/app/hooks/useRegisterModal";
import Heading from "../Heading";
import Modal from "./Modal";
import Input from "../inputs/Input";
import PasswordInput from "../inputs/PasswordInput";
import Button from "../Button";
import { type RegisterRequest } from "@/types";
import { z } from "zod";
const RegisterModal = () => {
  const registerModal = useRegisterModal();
  const loginModal = useLoginModal();
  const [isLoading, setIsLoading] = useState(false);

  const defaultValues: RegisterRequest = {
    name: "",
    email: "",
    password: "",
  };

  const schema = z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string().min(3).max(20),
  });

  const methods = useForm<RegisterRequest>({
    defaultValues: defaultValues,
    resolver: zodResolver(schema),
  });

  const { handleSubmit } = methods;
  const onSubmit: SubmitHandler<RegisterRequest> = async (data) => {
    setIsLoading(true);
    await fetch("/api/register", {
      method: "POST",
      body: JSON.stringify(data),
    })
      .then(() => {
        toast.success("Registered!");
        registerModal.onClose();
        loginModal.onOpen();
      })
      .catch((error) => {
        toast.error(error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const onToggle = useCallback(() => {
    registerModal.onClose();
    loginModal.onOpen();
  }, [registerModal, loginModal]);

  const bodyContent = (
    <div className="flex flex-col gap-4">
      <Heading title="Welcome to Airbnb" subtitle="Create an account!" />

      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Input id="email" label="Email" disabled={isLoading} required />
          <Input id="name" label="Name" disabled={isLoading} required />
          <PasswordInput
            id="password"
            label="Password"
            type="password"
            disabled={isLoading}
            required
          />
        </form>
      </FormProvider>
    </div>
  );

  const footerContent = (
    <div className="flex flex-col gap-4 mt-3">
      <hr />
      <Button
        outline
        label="Continue with Google"
        icon={FcGoogle}
        onClick={() => signIn("google")}
      />
      <Button
        outline
        label="Continue with Github"
        icon={AiFillGithub}
        onClick={() => signIn("github")}
      />
      <div
        className="
          text-neutral-500 
          text-center 
          mt-4 
          font-light
        "
      >
        <p>
          Already have an account?
          <span
            onClick={onToggle}
            className="
              text-neutral-800
              cursor-pointer 
              hover:underline
            "
          >
            {" "}
            Log in
          </span>
        </p>
      </div>
    </div>
  );

  return (
    <Modal
      disabled={isLoading}
      isOpen={registerModal.isOpen}
      title="Register"
      actionLabel="Continue"
      onClose={registerModal.onClose}
      onSubmit={handleSubmit(onSubmit)}
      body={bodyContent}
      footer={footerContent}
    />
  );
};

export default RegisterModal;
