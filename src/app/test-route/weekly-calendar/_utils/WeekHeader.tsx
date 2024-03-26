import { useState } from "react";
import dayjs from "dayjs";
import { Box, Button, Stack, Typography } from "@mui/material";

export default function WeekHeader({
  weekDates,
}: {
  weekDates: dayjs.Dayjs[];
}) {
  return (
    <Stack
      sx={{
        p: 4,
        flexDirection: "row",
      }}
    >
      {weekDates.map((date) => (
        <Box
          key={date.toISOString()}
          sx={{
            py: 2,
            px: 4,
            flex: "1",
            border: "1px solid rgba(0,0,0,0.1)",
          }}
        >
          <Typography sx={{ textAlign: "center" }}>
            {date.format("ddd, MMM D")}
          </Typography>
        </Box>
      ))}
    </Stack>
  );
}
