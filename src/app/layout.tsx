import type { Metadata } from "next";
import { SessionProvider } from "next-auth/react";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v13-appRouter";
import { Inter } from "next/font/google";
import { ThemeProvider } from "@mui/material/styles";
import theme from "@/theme";
import { CssBaseline } from "@mui/material";
import { auth } from "@/auth";

import "react-big-calendar/lib/css/react-big-calendar.css";
import MuiXDateProvider from "@/app/_context/MuiXDateProvider";
import SnackbarContextProvider from "@/app/_context/SnackbarProvider";
import TanstackProvider from "./_context/TanstackProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Synx",
  description: "the best scheduler system",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

  return (
    <SessionProvider session={session}>
      <TanstackProvider>
        <html lang="en">
          <AppRouterCacheProvider>
            <ThemeProvider theme={theme}>
              <CssBaseline />
              <MuiXDateProvider>
                <body className={inter.className}>
                  <SnackbarContextProvider>{children}</SnackbarContextProvider>
                </body>
              </MuiXDateProvider>
            </ThemeProvider>
          </AppRouterCacheProvider>
        </html>
      </TanstackProvider>
    </SessionProvider>
  );
}
