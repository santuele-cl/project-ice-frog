import { getScheduleByEmployeeId } from "@/actions/schedules/schedule-action";
import { findUser } from "@/actions/users/users";
import {
  Box,
  Button,
  Divider,
  Pagination,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
// import EmployeeTablePagination from "./EmployeeTablePagination";
import { Department } from "@prisma/client";
import dayjs from "dayjs";
import Link from "next/link";

export default async function EmployeeSchedulesTable({
  employeeId,
}: {
  employeeId: string;
}) {
  const response = await getScheduleByEmployeeId(employeeId);

  if (response.error) throw new Error(response.error);

  console.log("data ", response.data);

  return (
    <TableContainer>
      <Table sx={{ minWidth: 650, overflow: "auto" }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell align="left">No</TableCell>
            <TableCell align="left">Project</TableCell>
            <TableCell align="left">Location</TableCell>
            <TableCell align="left">Start</TableCell>
            <TableCell align="left">End</TableCell>
            <TableCell align="left">Notes</TableCell>
            <TableCell align="right">Details</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {response.data && response.data.length ? (
            response.data.map((schedule, i) => {
              const { project, endDate, startDate, notes } = schedule;
              //   const { id, email, isActive, ,emailVerified, role } = employee;
              return (
                <TableRow
                  key={i}
                  sx={{
                    "&:last-child td, &:last-child th": { border: 0 },
                  }}
                >
                  <TableCell component="th" scope="row" align="left">
                    {i + 1}
                  </TableCell>
                  <TableCell align="left">
                    <Link href={`/dashboard/projects/${project?.id}`}>
                      {project?.name}
                    </Link>
                    <Typography>{project?.jobOrder}</Typography>
                  </TableCell>
                  <TableCell component="th" scope="row" align="left">
                    {project?.location}
                  </TableCell>
                  <TableCell align="left">
                    {dayjs(startDate).format("MMMM DD, YYYY hh:mm a")}
                  </TableCell>
                  <TableCell align="left">
                    {dayjs(endDate).format("MMMM DD, YYYY hh:mm a")}
                  </TableCell>
                  <TableCell align="left">{notes}</TableCell>

                  <TableCell align="right">
                    <Stack
                      spacing={2}
                      direction="row-reverse"
                      sx={{ width: "100%" }}
                    >
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
            })
          ) : (
            <TableRow
              sx={{
                "&:last-child td, &:last-child th": { border: 0 },
              }}
            >
              <TableCell component="th" scope="row">
                -
              </TableCell>
              <TableCell align="left">-</TableCell>
              <TableCell align="left">-</TableCell>
              <TableCell align="left">-</TableCell>
              <TableCell align="left">-</TableCell>
              <TableCell align="left">-</TableCell>
            </TableRow>
          )}
          {/* <TableRow
            sx={{
              "&:last-child td, &:last-child th": { border: 0 },
            }}
          >
            <TableCell component="th" scope="row">
              -
            </TableCell>
            <TableCell align="left">-</TableCell>
            <TableCell align="left">-</TableCell>
            <TableCell align="left">-</TableCell>
            <TableCell align="left">-</TableCell>
            <TableCell align="left">-</TableCell>
          </TableRow> */}
        </TableBody>
      </Table>
    </TableContainer>
  );
}