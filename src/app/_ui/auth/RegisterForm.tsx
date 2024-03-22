"use client";
import { Box } from "@mui/material";

import MultiStepForm from "./register/MultiStepForm";

const RegisterForm = () => {
  return (
    <Box
      sx={{
        height: "100%",
      }}
    >
      <MultiStepForm />
    </Box>
  );
};
export default RegisterForm;
