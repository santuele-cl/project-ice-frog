import { Box, Stack, Typography } from "@mui/material";

export default function NoDataComponent() {
  return (
    <Box
      sx={{
        height: "100%",
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
      }}
    >
      <Typography variant="h5" color="#9FA6B2" sx={{ p: 3 }}>
        NO SCHEDULE YET
      </Typography>
    </Box>
  );
}
