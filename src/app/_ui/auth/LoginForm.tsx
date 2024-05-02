"use client";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Box,
  Button,
  Container,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useState, useTransition } from "react";
import { signIn } from "next-auth/react";

import FormStatusText from "./FormStatusText";
import { LoginSchema } from "../../_schemas/zod/schema";
import { login } from "@/actions/auth";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import Logo from "../Logo";
import { getErrorMessage } from "@/actions/action-utils";

const LoginForm = () => {
  const searchParams = useSearchParams();
  const [pending, setPending] = useState(false);
  const callbackUrl = searchParams.get("callbackUrl");
  // const [isPending, startTransistion] = useTransition();
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [showTwoFactorInput, setShowTwoFactorInput] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(LoginSchema),
    defaultValues: { email: "", password: "", code: "" },
  });

  const onSubmit = async (data: z.infer<typeof LoginSchema>) => {
    setPending(true);
    setError("");
    setSuccess("");

    try {
      const res = await login(data, callbackUrl);
      if (res?.error) setError(res.error);

      if (res?.success) {
        reset();
        setSuccess(res.success);
      }

      if (res.twoFactor) setShowTwoFactorInput(true);
    } catch (error) {
      setError(getErrorMessage(error));
    }

    setPending(false);
  };

  return (
    <Container sx={{ width: 550 }}>
      <Paper sx={{ p: 4, borderRadius: "8px", height: "600px" }}>
        <Stack spacing={3}>
          {/* HEADER */}
          <Stack spacing={3} paddingBottom={4}>
            <Stack
              direction="row"
              gap={1}
              alignItems="center"
              justifyContent="center"
            >
              <Link
                href="/"
                style={{ lineHeight: 0, transition: "all 2s ease" }}
              >
                <Logo size={50} />
              </Link>
              {/* <Typography
                component={Link}
                href="/"
                mt="4px"  
                variant="h4"
                textTransform="capitalize"
                sx={{ textDecoration: "none", color: "common.black" }}
                fontWeight={800}
              >
                Synxchronize 
              </Typography>*/}
            </Stack>
            <Stack sx={{ textAlign: "center" }}>
              <Typography variant="h4" fontWeight={800}>
                Welcome to Synx!
              </Typography>
              <Typography variant="subtitle1">
                Please sign-in to your account
              </Typography>
            </Stack>
          </Stack>
          {/* FORM */}
          <Stack component="form" onSubmit={handleSubmit(onSubmit)} spacing={2}>
            {showTwoFactorInput && (
              <TextField
                label="Two Factor Code"
                {...register("code")}
                error={errors.code ? true : false}
                helperText={errors.code?.message}
                placeholder="123456"
                disabled={pending}
              />
            )}
            {!showTwoFactorInput && (
              <>
                <TextField
                  type="email"
                  label="Email"
                  {...register("email")}
                  error={errors.email ? true : false}
                  helperText={errors.email?.message}
                  placeholder="example@email.com"
                  disabled={pending}
                />
                <TextField
                  type="password"
                  label="Password"
                  {...register("password")}
                  error={errors.password ? true : false}
                  helperText={errors.password?.message}
                  placeholder="********"
                  disabled={pending}
                />
              </>
            )}
            <Stack direction="row" justifyContent="flex-end" paddingBottom={4}>
              <Link href="/auth/reset-password">Forgot Password?</Link>
            </Stack>
            <Button
              type="submit"
              variant="contained"
              disabled={pending}
              sx={{ p: 2 }}
            >
              {showTwoFactorInput ? "Confirm" : "Login"}
            </Button>
          </Stack>

          {/* FOOTER */}
          <Stack
            direction="row"
            spacing={1}
            alignItems="center"
            justifyContent="center"
          >
            <Typography>Don&apos;t have an account yet?</Typography>

            <Link href="/auth/register">Sign up</Link>
          </Stack>

          {/* FORM STATUS */}
          {success && (
            <FormStatusText message={success || "Success"} status="success" />
          )}
          {error && (
            <FormStatusText message={error || "Error"} status="error" />
          )}
        </Stack>
      </Paper>
    </Container>
  );
};
export default LoginForm;
