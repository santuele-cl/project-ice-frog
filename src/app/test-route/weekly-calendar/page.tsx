"use client";
import { useState } from "react";
import { getWeek } from "./_utils/utils";
import dayjs from "dayjs";
import { Box, Button, Stack, Typography } from "@mui/material";

const WeekTestPage = () => {
  const [week, setWeek] = useState(dayjs().week());
  const weekDates = getWeek(week);
  console.log(weekDates);
  return (
    <div>
      <Button onClick={() => setWeek((prev) => prev - 1)}>Prev</Button>
      <Button onClick={() => setWeek(dayjs().week())}>Today</Button>
      <Button onClick={() => setWeek((prev) => prev + 1)}>Next</Button>
      {/* <Box sx={{ p: 4, m: 2 }}>{JSON.stringify(week)}</Box> */}
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
              {date.format("ddd")}
            </Typography>
            <Typography sx={{ textAlign: "center" }}>
              {date.format("MMM D")}
            </Typography>
          </Box>
        ))}
      </Stack>
    </div>
  );
};

export default WeekTestPage;
