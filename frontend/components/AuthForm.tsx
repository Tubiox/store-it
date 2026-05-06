"use client";

import { useRouter } from "next/navigation";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import Link from "next/link";


type FormType = "sign-in" | "sign-up";

const formSchema = z.object({
  email: z.string().email(),
  password: z.string().min(4),
  fullName: z.string().optional(),
});

const AuthForm = ({ type }: { type: FormType }) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      fullName: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (isLoading) return;

    setIsLoading(true);
    setErrorMessage("");

    try {
      const BASE_URL = "/api";

      const url =
        type === "sign-up"
          ? `${BASE_URL}/auth/signup`
          : `${BASE_URL}/auth/login`;

      const res = await fetch(url, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: values.email,
          password: values.password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.detail || "Something went wrong");
      }

      if (type === "sign-in") {
        window.location.replace("/");
      } else {
        window.location.replace("/sign-in");
      }

    } catch (err: any) {
      setErrorMessage(err.message || "Error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full max-w-md mx-auto space-y-5">
        <h1 className="text-3xl font-semibold text-gray-900">
          {type === "sign-in" ? "Sign In" : "Sign Up"}
        </h1>

        {type === "sign-up" && (
          <FormField
            control={form.control}
            name="fullName"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm text-gray-600">Full Name</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    className="bg-white border-gray-300 focus:ring-2 focus:ring-red-400 focus:border-red-400"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm text-gray-600">Email</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  className="bg-white border-gray-300 focus:ring-2 focus:ring-red-400 focus:border-red-400"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm text-gray-600">Password</FormLabel>
              <FormControl>

                <Input type="password"
                  {...field}
                  className="bg-white border-gray-300 focus:ring-2 focus:ring-red-400 focus:border-red-400"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          disabled={isLoading}
          className="w-full h-11 text-sm font-medium"
        >
          {isLoading
            ? "Loading..."
            : type === "sign-in"
              ? "Sign In"
              : "Sign Up"}
        </Button>

        {errorMessage && <p className="text-sm text-red-500 text-center">{errorMessage}</p>}

        <div className="text-sm text-gray-600 space-y-1">          
          <p>
          {type === "sign-in"
            ? "Don't have an account?"
            : "Already have an account?"}
        </p>
          <Link href={type === "sign-in" ? "/sign-up" : "/sign-in"}>
            {type === "sign-in" ? "Sign Up" : "Sign In"}
          </Link>
        </div>
      </form>
    </Form>
  );
};

export default AuthForm;