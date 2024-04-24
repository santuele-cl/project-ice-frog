import { getSchedulesByUserIdAndProjectId } from "@/actions/schedules/schedule-action";
import ErrorComponent from "@/app/_ui/ErrorComponent";
import {
  Button,
  Paper,
  Stack,
  TableCell,
  TableRow,
  Typography,
} from "@mui/material";
import { Prisma } from "@prisma/client";
import dayjs from "dayjs";
import Link from "next/link";

type ScheduleWithUserProfile = Prisma.ScheduleGetPayload<{
  include: {
    user: {
      select: {
        profile: {
          select: {
            contactNumber: true;
            fname: true;
            lname: true;
            department: true;
            occupation: true;
          };
        };
      };
    };
  };
}>;

type Props = {
  index: number;
  userId: string;
  projectId: string;
 
};

export default async function ProjectSchedulesEmployeeRow({
  index,
  userId,
  projectId,

}: Props) {
  const { error, data, success } = await getSchedulesByUserIdAndProjectId({
    projectId,
    userId,
   
  });

  //   if (res.error || !res.data) throw new Error(res.error);
  if (error || !data)
    return (
      <Paper elevation={1} sx={{ p: 2, position: "relative", height: "100%" }}>
        <ErrorComponent errMessage={String(error)} />
      </Paper>
    );

  // console.log("data", data);

  return (
    <TableRow
      sx={{
        "&:last-chindexld td, &:last-child th": { border: 0 },
      }}
    >
      <TableCell component="th" scope="row" align="left">
        {index + 1}
      </TableCell>
      <TableCell align="left">
        <Typography>
          <Link href={`/dashboard/employees/${data[0].userId}`}>
            {`${data[0].user.profile?.fname} ${data[0].user.profile?.lname}`}
          </Link>
        </Typography>
        <Typography>{`${data[0].user.profile?.occupation}`}</Typography>
      </TableCell>

      <TableCell align="left">
        <Stack sx={{ gap: 1 }}>
          {data.map(({ startDate, endDate }) => (
            <Stack
              sx={{
                p: 1,
                flexDirection: "row",
                gap: 1,
                bgcolor: "rgba(255,255,0,0.2)",
                borderRadius: 1,
              }}
            >
              <Typography>
                {dayjs(startDate).format("MMM DD, YYYY hh:mm a")}
              </Typography>
              <Typography>
                {dayjs(endDate).format("MMM DD, YYYY hh:mm a")}
              </Typography>
            </Stack>
          ))}
        </Stack>
      </TableCell>

      

      <TableCell align="left">
        {/* <Typography>{notes || "-"}</Typography> */}
      </TableCell>
      <TableCell align="right">
        <Stack spacing={2} direction="row-reverse" sx={{ width: "100%" }}>
          <Button
            variant="contained"
            // LinkComponent={Link}
            // href={`/dashboard/schedules/${id}`}
          >
            Edit
          </Button>
          {/* <Button
                        variant="outlined"
                        //   LinkComponent={Link}
                        //   href={`${pathname}/${id}`}
                        // onClick={async () => await toggleUserIsActive(id)}
                      >
                        {isActive ? "Deactivate" : "Activate"}
                      </Button> */}
        </Stack>
      </TableCell>
    </TableRow>
  );
}
