"use server";

export const getErrorMessage = (error: unknown): string => {
  let errMesssage: string;

  if (error instanceof Error) {
    errMesssage = error.message;
  } else if (error && typeof error === "object" && "message" in error) {
    errMesssage = String(error.message);
  } else if (typeof error === "string") {
    errMesssage = error;
  } else {
    errMesssage = "Something went wrong";
  }

  return errMesssage;
};
