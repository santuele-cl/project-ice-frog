"use server";

import { signIn, signOut } from "@/auth";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import { AuthError } from "next-auth";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { db } from "@/app/_lib/db";
import {
  LoginSchema,
  ResetPasswordSchema,
  NewPasswordSchema,
  RegisterSchema,
} from "../../app/_schemas/zod/schema";
import { getUserByEmail } from "@/app/_data/user";
import {
  generatePasswordResetToken,
  generateVerficationToken,
  generateTwoFactorToken,
} from "@/app/_lib/tokens";
import {
  sendPasswordResetEmail,
  sendVerificationEmail,
  sendTwoFactorEmail,
} from "@/app/_lib/mail";
import { getVerificationTokenByToken } from "@/app/_data/verification-token";
import { getPasswordResetTokenByToken } from "@/app/_data/password-reset-token";
import {
  getTwoFactorConfirmationByUserId,
  getTwoFactorTokenByEmail,
} from "@/app/_data/two-factor";
import { Gender } from "@prisma/client";
import { createLoginLog, updateLoginLogStatus } from "../logs/login-logs";
import { revalidatePath, unstable_noStore } from "next/cache";
import { headers } from "next/headers";

export async function login(
  credentials: z.infer<typeof LoginSchema>,
  callbackUrl?: string | null
) {
  const headersList = headers();
  const ipAddress = headersList.get("x-forwarded-for") || "";
  const userAgent = headersList.get("user-agent") || "";

  unstable_noStore();
  const validatedCredentials = LoginSchema.safeParse(credentials);

  if (!validatedCredentials.success) return { error: "Invalid data." };

  const { email, password, code } = validatedCredentials.data;

  const existingUser = await getUserByEmail(email);

  if (!existingUser?.isActive)
    return { error: "Your account has been deactivated." };

  if (!existingUser || !existingUser.email || !existingUser.password) {
    return { error: "Email does not exist!" };
  }

  // if (!existingUser.emailVerified) {
  //   const verificationToken = await generateVerficationToken(
  //     existingUser.email
  //   );

  //   await sendVerificationEmail(
  //     verificationToken.email,
  //     verificationToken.token
  //   );

  //   return { success: "Confirmation email sent!" };
  // }

  if (existingUser.isTwoFactorEnabled && existingUser.email) {
    if (code) {
      const existingToken = await getTwoFactorTokenByEmail(existingUser.email);

      if (!existingToken?.token || existingToken.token !== code)
        return { error: "Invalid code!" };

      const hasExpired = new Date(existingToken.expires) < new Date();

      if (hasExpired) return { error: "Code expired!" };

      await db.twoFactorToken.delete({ where: { id: existingToken.id } });

      const existingConfirmation = await getTwoFactorConfirmationByUserId(
        existingUser.id
      );

      if (existingConfirmation) {
        await db.twoFactorConfirmation.delete({
          where: { id: existingConfirmation.id },
        });
      }

      await db.twoFactorConfirmation.create({
        data: {
          userId: existingUser.id,
        },
      });
    } else {
      const twoFactorToken = await generateTwoFactorToken(existingUser.email);
      await sendTwoFactorEmail(existingUser.email, twoFactorToken.token);

      return { twoFactor: true };
    }
  }

  // const loginLog = await createLoginLog({
  //   ipAddress,
  //   userAgent,
  //   userId: existingUser.id,
  //   status: "failed",
  // });

  // if (!loginLog) console.log("Database error. Log not saved!");

  try {
    await signIn("credentials", {
      email,
      password,
      // redirectTo: callbackUrl || "/",
    });
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { error: "Invalid credentials." };
        default:
          return { error: "Something went wrong." };
      }
    }
    throw error;
  }

  // const udpatedLog = await updateLoginLogStatus({
  //   logId: loginLog.data?.id,
  //   status: "success",
  // });

  // if (!udpatedLog) console.log("Database error. Log not saved!");

  revalidatePath("/dashboard/logs/login");

  return { success: "Login successful." };
}

export async function logout() {
  // Optional: Do some server stuff before logging out
  await signOut();
}

export async function createUser(registerData: z.infer<typeof RegisterSchema>) {
  console.log(registerData);
  const validatedData = RegisterSchema.safeParse(registerData);

  if (!validatedData.success) {
    return { error: "Invalid register data." };
  }

  const { email, role, password, consent, confirmPassword, ...profileData } =
    validatedData.data;

  const isEmailTaken = await getUserByEmail(email);

  if (isEmailTaken) {
    return { error: "Email already taken." };
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await db.user.create({
    data: {
      email,
      password: hashedPassword,
      role,
      consent,
      profile: {
        create: {
          ...profileData,
        },
      },
    },
  });

  if (!user) return { error: "Database error. User not created!" };

  // const verificationToken = await generateVerficationToken(email);

  // await sendVerificationEmail(verificationToken.email, verificationToken.token);

  return { success: "User created successfully." };
}

export async function verify(token: string) {
  const existingToken = await getVerificationTokenByToken(token);

  if (!existingToken) {
    return { error: "Token does not exist!" };
  }

  const hasExpired = new Date(existingToken.expires) < new Date();

  if (hasExpired) {
    return { error: "Token has expired!" };
  }

  const existingUser = await getUserByEmail(existingToken.email);

  if (!existingUser) {
    return { error: "Email does not exist!" };
  }

  await db.user.update({
    where: { id: existingUser.id },
    data: {
      emailVerified: new Date(),
      email: existingToken.email,
    },
  });

  await db.verificationToken.delete({
    where: { id: existingToken.id },
  });

  return { success: "Email verified!" };
}

export async function resetPassword(data: z.infer<typeof ResetPasswordSchema>) {
  const validatedFields = ResetPasswordSchema.safeParse(data);

  if (!validatedFields.success) {
    return { error: "Invalid email!" };
  }

  const { email } = validatedFields.data;

  const existingUser = await getUserByEmail(email);

  if (!existingUser) {
    return { error: "Email not found!" };
  }

  const passwordResetToken = await generatePasswordResetToken(email);

  await sendPasswordResetEmail(
    passwordResetToken.email,
    passwordResetToken.token
  );

  return { success: "Reset email sent!" };
}

export async function updatePassword(
  data: z.infer<typeof NewPasswordSchema>,
  token?: string | null
) {
  if (!token) {
    return { error: "Missing Token!" };
  }

  const validatedFields = NewPasswordSchema.safeParse(data);

  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }

  const { newPassword } = validatedFields.data;

  const existingToken = await getPasswordResetTokenByToken(token);

  if (!existingToken) {
    return { error: "Invalid token!" };
  }

  const hasExpired = new Date(existingToken.expires) < new Date();

  if (hasExpired) {
    return { error: "Token has expired!" };
  }

  const existingUser = await getUserByEmail(existingToken.email);

  if (!existingUser) {
    return { error: "Email not found!" };
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);

  await db.user.update({
    where: { id: existingUser.id },
    data: {
      password: hashedPassword,
    },
  });

  await db.passwordResetToken.delete({ where: { id: existingToken.id } });

  return { success: "Password updated!" };
}
