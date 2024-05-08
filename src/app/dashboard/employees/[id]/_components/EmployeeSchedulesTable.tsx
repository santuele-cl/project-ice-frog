import { getScheduleByEmployeeId } from "@/actions/schedules/schedule-action";
import { findUser } from "@/actions/users/users";
import {
  Box,
  Button,
  Divider,
  IconButton,
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
import { Department } from "@prisma/client";
import dayjs from "dayjs";
import Link from "next/link";
import EmployeeScheduleEditFormModal from "./EmployeeScheduleEditFormModal";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import NoDataComponent from "./EmployeeNoScheduleDisplay";

export default async function EmployeeSchedulesTable({
  employeeId,
}: {
  employeeId: string;
}) {
  const response = await getScheduleByEmployeeId(employeeId);

  if (response.error) throw new Error(response.error);

  // console.log("data ", response.data);

  return (
    <TableContainer sx={{ minHeight: "50vh", position: "relative" }}>
      <Table sx={{ overflow: "auto" }} aria-label="simple table">
        <TableHead>
          <TableRow sx={{ backgroundColor: "rgba(124,35,216,255)" }}>
            <TableCell
              sx={{ fontWeight: "bold", color: "#F5F6FA" }}
              align="left"
            >
              No
            </TableCell>
            <TableCell
              sx={{ fontWeight: "bold", color: "#F5F6FA" }}
              align="left"
            >
              Schedule ID
            </TableCell>
            <TableCell
              sx={{ fontWeight: "bold", color: "#F5F6FA" }}
              align="left"
            >
              Project
            </TableCell>
            <TableCell
              sx={{ fontWeight: "bold", color: "#F5F6FA" }}
              align="left"
            >
              Location
            </TableCell>
            <TableCell
              sx={{ fontWeight: "bold", color: "#F5F6FA" }}
              align="left"
            >
              Start
            </TableCell>
            <TableCell
              sx={{ fontWeight: "bold", color: "#F5F6FA" }}
              align="left"
            >
              End
            </TableCell>
            <TableCell
              sx={{ fontWeight: "bold", color: "#F5F6FA" }}
              align="left"
            >
              Date created
            </TableCell>
            <TableCell
              sx={{ fontWeight: "bold", color: "#F5F6FA" }}
              align="right"
            >
              Details
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {response.data && response.data.length ? (
            response.data.map((schedule, i) => {
              const { id, project, endDate, startDate, notes, createdAt } =
                schedule;
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
                  <TableCell component="th" scope="row" align="left">
                    {id}
                  </TableCell>
                  <TableCell align="left">
                    <Link href={`/dashboard/projects/${project?.id}`}>
                      {project?.name}
                    </Link>
                    <Typography>{project?.jobOrder}</Typography>
                  </TableCell>
                  <TableCell component="th" scope="row" align="left">
                    {`${project?.building} ${project?.street} ${project?.barangay}, ${project?.city}`}
                  </TableCell>
                  <TableCell align="left">
                    {dayjs(startDate).format("MMM DD, YYYY hh:mm a")}
                  </TableCell>
                  <TableCell align="left">
                    {dayjs(endDate).format("MMM DD, YYYY hh:mm a")}
                  </TableCell>
                  <TableCell align="left">
                    {dayjs(createdAt).format("MMM DD, YYYY hh:mm a")}
                  </TableCell>
                  <TableCell align="right">
                    <Stack
                      spacing={2}
                      direction="row-reverse"
                      sx={{ width: "100%" }}
                    >
                      <EmployeeScheduleEditFormModal schedule={schedule} />
                      {/* <IconButton onClick={() => console.log("edit me: ", id)}> */}
                      {/* <EditOutlinedIcon /> */}
                      {/* </IconButton> */}

                      {/* <Button
                        variant="contained"
                        // LinkComponent={Link}
                        // href={`/dashboard/schedules/${id}`}
                      >
                        Edit
                      </Button> */}
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
            <TableRow>
              <TableCell colSpan={8} sx={{ position: "relative" }}>
                <NoDataComponent />
              </TableCell>
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
