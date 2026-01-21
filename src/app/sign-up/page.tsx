"use client";

import Image from "next/image";
import logo from "@/public/images/logo.png";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import bgImage from "@/public/images/signup-bg-img.png";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/src/components/shadcn/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/src/components/shadcn/form";
import { Input } from "@/src/components/shadcn/input";
import { useForm } from "react-hook-form";
import { Spinner } from "@/src/components/shadcn/spinner";
import { useState } from "react";
import { useSignIn, useSignUp } from "@clerk/nextjs";
import { OAuthStrategy } from "@clerk/types";
import { useRouter } from "next/navigation";
import Link from "next/link";

const formSchema = z.object({
  email: z.string().email(),
  verificationCode: z
    .string()
    .nonempty({ message: "Please enter verification code" }),
});

export default function SignUp() {
  const { isLoaded: signUpLoaded, signUp, setActive } = useSignUp();
  const { isLoaded: signInLoaded, signIn } = useSignIn();
  const [isEmailSubmitted, setIsEmailSubmitted] = useState(false);
  const [email, setEmail] = useState("");
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { email: "", verificationCode: "" },
  });

  if (!signUpLoaded || !signInLoaded) return null;

  const signInWith = (strategy: OAuthStrategy) => {
    signIn
      .authenticateWithRedirect({
        strategy,
        redirectUrl: "/sign-in/sso-callback",
        redirectUrlComplete: "/onboarding",
      })
      .catch((err) => {
        console.error("OAuth sign-in error:", err);
      });
  };

  // this function sends a OTP to the user email
  const handleSendVerificationCode = async () => {
    if (!signUp) return;

    try {
      await signUp.create({ emailAddress: email });
      await signUp.prepareEmailAddressVerification();
      setIsEmailSubmitted(true);
    } catch (error: unknown) {
      console.error("Error during create + prepare verification:", error);
      let message = "Something went wrong";
      if (error instanceof Error && error.message) {
        message = error.message;
      } else if (typeof error === "string") {
        message = error;
      }
      form.setError("email", {
        type: "custom",
        message,
      });
    }
  };

  // this function verifies the OTP entered and redirect the user to the home page
  const handleVerification = async (values: z.infer<typeof formSchema>) => {
    if (!signUp) return;

    try {
      const signUpAttempt = await signUp.attemptEmailAddressVerification({
        code: values.verificationCode,
      });

      if (signUpAttempt.status === "complete") {
        await setActive({
          session: signUpAttempt.createdSessionId,
          navigate: async ({ session }) => {
            if (session?.currentTask) {
              console.log("Session task:", session.currentTask);
              // optionally handle extra tasks here
              return;
            }
            await router.push("/");
          },
        });
      } else {
        console.error("Verification not complete:", signUpAttempt);
      }
    } catch (err) {
      console.error("Verification error:", err);
    }
  };

  return (
    <div className="flex h-screen">
      <div className="flex flex-col justify-between h-full p-5 w-full lg:max-w-[540px] lg:w-1/2">
        <div className="flex gap-2 items-center">
          <Image src={logo} width={30} height={60} alt="logo" />
          <h1 className="text-4xl">
            Easy<span className="text-primary-blue">Flow</span>
          </h1>
        </div>
        <div>
          <div className="flex flex-col gap-5 mt-5">
            <button
              onClick={() => signInWith("oauth_google")}
              className="relative text-center border rounded-2xl py-2 cursor-pointer px-6"
            >
              <FcGoogle size={23} className="absolute left-4" />
              Sign up with Google
            </button>
            <button
              onClick={() => signInWith("oauth_github")}
              className="relative text-center border rounded-2xl py-2 cursor-pointer px-6"
            >
              <FaGithub size={23} className="absolute left-4" />
              Sign up with GitHub
            </button>

            <div className="flex items-center gap-2">
              <span className="h-px bg-white w-full"></span>
              <span>OR</span>
              <span className="h-px bg-white w-full"></span>
            </div>
          </div>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleVerification)}
              className="space-y-8 mt-5"
            >
              {isEmailSubmitted ? (
                <>
                  <p className="text-gray-100 font-medium">
                    A code has been sent to your email: {email}
                  </p>
                  <FormField
                    control={form.control}
                    name="verificationCode"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Enter 6-digit code</FormLabel>
                        <FormControl>
                          <Input placeholder="******" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button
                    className="w-full bg-primary-blue text-white font-bold"
                    type="submit"
                  >
                    {form.formState.isSubmitting ? (
                      <Spinner className="size-6" />
                    ) : (
                      "Verify"
                    )}
                  </Button>
                </>
              ) : (
                <>
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder="Enter your email"
                            {...field}
                            onChange={(e) => {
                              field.onChange(e);
                              setEmail(e.target.value);
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button
                    type="button"
                    onClick={handleSendVerificationCode}
                    className="w-full bg-primary-blue text-white font-bold hover:bg-primary-blue/50"
                  >
                    Continue
                  </Button>
                </>
              )}
              <p className="text-sm">
                Already have an account?
                <Link className="text-primary-blue ml-1" href="/sign-in">
                  Sign in
                </Link>
              </p>
            </form>
          </Form>
        </div>

        <h1 className="text-center text-h1">
          Powered by{" "}
          <a href="https://devworks.agency" className="text-primary-blue">
            Devworks
          </a>
        </h1>
      </div>

      <div className="relative hidden lg:grid place-content-center w-full min-h-screen overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat blur-lg"
          style={{ backgroundImage: `url(${bgImage.src})` }}
        />
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative text-center text-white">
          <h1 className="text-[64px] leading-tight font-bold">
            Simplify work. Maximize <br />
            productivity
          </h1>
          <span className="block h-px bg-white w-[90%] mx-auto my-6"></span>
          <p>
            Get started with <span className="text-primary-blue">easyflow</span>{" "}
            today
          </p>
        </div>
      </div>
    </div>
  );
}
