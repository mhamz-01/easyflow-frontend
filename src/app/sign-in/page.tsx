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
import { useEffect, useState } from "react";
import { useAuth, useSignIn, useSignUp } from "@clerk/nextjs";
import { EmailCodeFactor, OAuthStrategy } from "@clerk/types";
import { useRouter, useSearchParams } from "next/navigation";
import { SignInFirstFactor } from "@clerk/types";
import Link from "next/link";
import GlobalLoader from "@/src/components/custom/global-loader";
import {
  consumePendingInviteReturn,
  storePendingInviteReturn,
} from "@/src/lib/pending-invite";

const formSchema = z.object({
  email: z.string().email(),
  verificationCode: z
    .string()
    .nonempty({ message: "Please enter verification code" }),
});

export default function SignUp() {
  const { isLoaded: signUpLoaded, signUp, setActive } = useSignUp();
  const { isLoaded: signInLoaded, signIn } = useSignIn();
  const { isLoaded: authLoaded, isSignedIn } = useAuth();
  const [isEmailSubmitted, setIsEmailSubmitted] = useState<boolean>(false);
  const [isSendingOTP, setIsSendingOTP] = useState<boolean>(false); // show loader when submitting email for verification
  const [email, setEmail] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { email: "", verificationCode: "" },
  });

  // See sign-up/page.tsx for why this checks both the query param and
  // sessionStorage — this is how a pending workspace invite survives the
  // trip through Clerk auth and back.
  const resolvePostAuthTarget = (fallback: string) =>
    searchParams.get("redirect_url") || consumePendingInviteReturn() || fallback;

  // Already signed in (e.g. another account is active in this browser) —
  // bounce to the home gate instead of showing the sign-in form again.
  useEffect(() => {
    if (authLoaded && isSignedIn) {
      router.replace(resolvePostAuthTarget("/home"));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authLoaded, isSignedIn, router]);

  if (!signUpLoaded || !signInLoaded || !authLoaded) return null;
  if (isSignedIn) return <GlobalLoader />;

  const signInWith = (strategy: OAuthStrategy) => {
    const target = resolvePostAuthTarget("/onboarding");
    storePendingInviteReturn(target);
    signIn
      .authenticateWithRedirect({
        strategy,
        redirectUrl: "/sign-in/sso-callback",
        redirectUrlComplete: target,
      })
      .catch((err) => {
        console.error("OAuth sign-in error:", err);
      });
  };

  // this function sends a OTP to the user email
  const handleSendVerificationCode = async () => {
    if (!signUp) return;

    try {
      setIsSendingOTP(true);
      // Start the sign-in process using the phone number method
      const { supportedFirstFactors } = await signIn.create({
        identifier: email,
      });

      // Filter the returned array to find the 'phone_code' entry
      const isEmailCodeFactor = (
        factor: SignInFirstFactor
      ): factor is EmailCodeFactor => {
        return factor.strategy === "email_code";
      };
      const phoneCodeFactor = supportedFirstFactors?.find(isEmailCodeFactor);

      if (phoneCodeFactor) {
        // Grab the phoneNumberId
        const { emailAddressId } = phoneCodeFactor;

        // Send the OTP code to the user
        await signIn.prepareFirstFactor({
          strategy: "email_code",
          emailAddressId,
        });

        // Set IsEmailSubmitted to true to display second form
        // and capture the OTP code
        setIsEmailSubmitted(true);
        setIsSendingOTP(false);
      }
    } catch (err) {
      // See https://clerk.com/docs/guides/development/custom-flows/error-handling
      // for more info on error handling
      setIsSendingOTP(false);
      console.error("Error:", JSON.stringify(err, null, 2));
    }
  };

  // this function verifies the OTP entered and redirect the user to the home page
  const handleVerification = async (values: z.infer<typeof formSchema>) => {
    if (!signUp) return;
    try {
      // Use the code provided by the user and attempt verification
      const signInAttempt = await signIn.attemptFirstFactor({
        strategy: "email_code",
        code: values.verificationCode,
      });

      // If verification was completed, set the session to active
      // and redirect the user
      if (signInAttempt.status === "complete") {
        await setActive({
          session: signInAttempt.createdSessionId,
          navigate: async ({ session }) => {
            if (session?.currentTask) {
              // Check for tasks and navigate to custom UI to help users resolve them
              // See https://clerk.com/docs/guides/development/custom-flows/overview#session-tasks
              console.log(session?.currentTask);
              return;
            }

            router.push(resolvePostAuthTarget("/home"));
          },
        });
      } else {
        // If the status is not complete, check why. User may need to
        // complete further steps.
        console.error(signInAttempt);
      }
    } catch (err) {
      // See https://clerk.com/docs/guides/development/custom-flows/error-handling
      // for more info on error handling
      console.error("Error:", JSON.stringify(err, null, 2));
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
              Sign in with Google
            </button>
            <button
              onClick={() => signInWith("oauth_github")}
              className="relative text-center border rounded-2xl py-2 cursor-pointer px-6"
            >
              <FaGithub size={23} className="absolute left-4" />
              Sign in with GitHub
            </button>

            <div className="flex items-center gap-2">
              <span className="h-px bg-border w-full"></span>
              <span>OR</span>
              <span className="h-px bg-border w-full"></span>
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
                    {isSendingOTP ? <Spinner className="size-6" /> : "Continue"}
                  </Button>
                </>
              )}
              <p className="text-sm">
                Don't have an account?
                <Link className="text-primary-blue ml-1" href="/sign-up">
                  Sign up
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
            Sign in and pick up right
            <br />
            where you left off.
          </h1>
          <span className="block h-px bg-white w-[90%] mx-auto my-6"></span>
          <p>
            Organize, prioritize, and finish your work, all from one simple
            dashboard
          </p>
        </div>
      </div>
    </div>
  );
}
