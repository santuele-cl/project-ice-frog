import { Box, Button, Stack, Typography } from "@mui/material";
import Link from "next/link";
import Logo from "../../dashboard/Logo";
import { FaAlignJustify } from "react-icons/fa";

const SideLogo = () => {
  return (
    <Stack
    // sx={{
    //   justifyContent: "left",
    //   alignItems: "left",
    //   textAlign: "center",
    //   height: "100%",
    //   // height: { sm: "100%" },
    // }}
    // spacing={2}
    >
      <Stack sx={{ flexDirection: "row", gap: "2", marginBottom: "250px" }}>
        <Link href="/" style={{ lineHeight: 0, transition: "all 2s ease" }}>
          <Logo size={45} />
        </Link>

        <Typography
          component={Link}
          href="/"
          mt="4px"
          fontSize={25}
          textAlign={"center"}
          variant="h6"
          textTransform="capitalize"
          sx={{ textDecoration: "none", color: "common.black" }}
          fontWeight={900}
        >
          Synx
        </Typography>
      </Stack>

      <Stack sx={{ textAlign: "center" }}>
        <Stack sx={{ marginBottom: "50px" }}>
          <Typography fontSize={35} fontWeight={900}>
            Create your account now!
          </Typography>
        </Stack>

        <Stack>
          <Typography sx={{ fontSize: "18px" }}>
            Step into a More Organized Tomorrow.
          </Typography>
        </Stack>

        <Stack spacing={1} alignItems="center">
          <Typography sx={{ fontSize: "18px" }}>
            Elevate your productivity with our advanced scheduling tools
            dedicated to efficiency — Login Now!
          </Typography>
        </Stack>

        <Stack sx={{ alignItems: "center" }}>
          <Button
            variant="contained"
            LinkComponent={Link}
            href="/dashboard/auth/login"
            sx={{
              padding: "15px 10px",
              margin: "30px 20px",
              width: "300px",
              border: "2px solid ",
            }}
          >
            Sign in
          </Button>
        </Stack>
      </Stack>
    </Stack>
  );
};
export default SideLogo;
