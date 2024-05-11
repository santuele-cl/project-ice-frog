"use client";
import { getSchedulesByUserIdAndProjectId } from "@/actions/schedules/schedule-action";
import { Stack, TableCell, TableRow, Typography } from "@mui/material";
import { Prisma } from "@prisma/client";
import dayjs from "dayjs";
import Link from "next/link";
import ProjectSchedulesEmployeeRowEditModal from "./ProjectSchedulesEmployeeRowEditModal";
import ProjectScheduleEmployeeRowDeleteModal from "./ProjectScheduleEmployeeRowDeleteModal";
import { Fragment, useEffect, useState } from "react";

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

export default function ProjectSchedulesEmployeeRow({
  index,
  userId,
  projectId,
}: Props) {
  const [data, setData] = useState<ScheduleWithUserProfile[]>([]);

  useEffect(() => {
    const fetchSchedules = async () => {
      const res = await getSchedulesByUserIdAndProjectId({
        projectId,
        userId,
      });
      if (res.data) setData(res.data);
    };
    fetchSchedules();
  }, []);

  return (
    <TableRow
      sx={{
        "&:last-chindexld td, &:last-child th": { border: 0 },
      }}
    >
      {data && data.length > 0 && (
        <Fragment>
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
              {data
                .map(({ startDate }) => (
                  <Stack
                    sx={{
                      p: 1,
                      flexDirection: "row",
                      gap: 1,
                      bgcolor: "rgba(166,174,255, 0.2)",
                      borderRadius: 1,
                    }}
                  >
                    <Typography>
                      {dayjs(startDate).format("MMM DD, YYYY")}
                    </Typography>
                  </Stack>
                ))
                .reverse()}
            </Stack>
          </TableCell>

          <TableCell align="left">
            <Stack sx={{ gap: 1 }}>
              {data
                .map(({ endDate }) => (
                  <Stack
                    sx={{
                      p: 1,
                      flexDirection: "row",
                      gap: 1,
                      bgcolor: "rgba(166,174,255, 0.2)",
                      borderRadius: 1,
                    }}
                  >
                    <Typography>
                      {dayjs(endDate).format("MMM DD, YYYY")}
                    </Typography>
                  </Stack>
                ))
                .reverse()}
            </Stack>
          </TableCell>

          <TableCell align="left">
            <Stack sx={{ gap: 1 }}>
              {data
                .map(({ startDate }) => (
                  <Stack
                    sx={{
                      p: 1,
                      flexDirection: "row",
                      gap: 1,
                      bgcolor: "rgba(166,174,255, 0.2)",
                      borderRadius: 1,
                    }}
                  >
                    <Typography>
                      {dayjs(startDate).format("hh:mm a")}
                    </Typography>
                  </Stack>
                ))
                .reverse()}
            </Stack>
          </TableCell>

          <TableCell align="left">
            <Stack sx={{ gap: 1 }}>
              {data
                .map(({ endDate }, i) => (
                  <Stack
                    key={i}
                    sx={{
                      p: 1,
                      flexDirection: "row",
                      gap: 1,
                      bgcolor: "rgba(166,174,255, 0.2)",
                      borderRadius: 1,
                    }}
                  >
                    <Typography>{dayjs(endDate).format("hh:mm a")}</Typography>
                  </Stack>
                ))
                .reverse()}
            </Stack>
          </TableCell>

          <TableCell align="right">
            {/* <Stack sx={{ gap: 1 }}> */}
            {data
              .map(({ startDate, id }, i) => (
                <Stack
                  key={i}
                  sx={{ flexDirection: "row", justifyContent: "flex-end" }}
                >
                  <ProjectSchedulesEmployeeRowEditModal scheduleId={id} />
                  <ProjectScheduleEmployeeRowDeleteModal id={id} />
                  {/* <Tooltip title="Edit Schedule">
              <IconButton component={Link} href="#edit">
                <BorderColorIcon fontSize="medium" />
              </IconButton>
            </Tooltip> */}
                  {/* <Tooltip title="Delete Project">
                <IconButton component={Link} href="#delete">
                  <DeleteIcon fontSize="medium" />
                </IconButton>
              </Tooltip> */}
                </Stack>
              ))
              .reverse()}
            {/* </Stack> */}
          </TableCell>
        </Fragment>
      )}
    </TableRow>
  );
}
