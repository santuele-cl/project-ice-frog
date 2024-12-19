import { Typography } from "@mui/material";
import HomeNavbar from "./_ui/home/HomeNavbar";
import { redirect } from "next/navigation";
import LoginPage from "./auth/login/page";

export default async function Home() {
  return <LoginPage />;
}
