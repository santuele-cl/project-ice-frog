"use client";
import { useContext, useState } from "react";
import { getWeek } from "./_utils/utils";
import dayjs from "dayjs";
import { Box, Button, Stack, Typography } from "@mui/material";
import Grid2 from "@mui/material/Unstable_Grid2/Grid2";
import WeekHeader from "./_utils/WeekHeader";
import DayHeader from "./_utils/DayHeader";
import { CalendarContext } from "./_context/CalendarContext";

const WeekTestPage = () => {
  const calendarContext = useContext(CalendarContext);
  console.log(calendarContext);
  const [week, setWeek] = useState(dayjs().week());
  const weekDates = getWeek(week);

  console.log(weekDates);
  return (
    <div>
      <Button onClick={() => setWeek((prev) => prev - 1)}>Prev</Button>
      <Button onClick={() => setWeek(dayjs().week())}>Today</Button>
      <Button onClick={() => setWeek((prev) => prev + 1)}>Next</Button>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(8, 1fr)",
          textAlign: "center",
        }}
      >
        {/* {weekDates.map((date, i) => (
          // <DayHeader day={date} week={week} />
          // <Box
          //   key={date.toString()}
          //   sx={{
          //     py: 2,
          //     px: 4,
          //     flex: "1",
          //     border: "1px solid rgba(0,0,0,0.1)",
          //   }}
          // >
          //   <Typography sx={{ textAlign: "center" }}>
          //     {typeof date === "number"
          //       ? `Week ${date}`
          //       : date.format("ddd, MMM D")}
          //   </Typography>
          // </Box>
        ))} */}
        {weekDates.map((date, i) => (
          <Box
            key={date.toString()}
            sx={{
              py: 2,
              px: 4,
              flex: "1",
              border: "1px solid rgba(0,0,0,0.1)",
            }}
          >
            <Typography sx={{ textAlign: "center" }}>
              {typeof date === "number"
                ? `Week ${date}`
                : date.format("ddd, MMM D")}
            </Typography>
          </Box>
        ))}
      </Box>
    </div>
  );
};

export default WeekTestPage;

// <Stack
//   sx={{
//     p: 4,
//     flexDirection: "row",
//   }}
// >
//   {weekDates.map((date, i) => (
//     <Box
//       key={date.toString()}
//       sx={{
//         py: 2,
//         px: 4,
//         flex: "1",
//         border: "1px solid rgba(0,0,0,0.1)",
//       }}
//     >
//       <Typography sx={{ textAlign: "center" }}>
//         {typeof date === "number" ? `Week ${date}` : date.format("ddd, MMM D")}
//       </Typography>
//     </Box>
//   ))}
// </Stack>;
