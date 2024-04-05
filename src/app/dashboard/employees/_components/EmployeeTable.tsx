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
import EmployeeTablePagination from "./EmployeeTablePagination";
import { Department } from "@prisma/client";

export default async function EmployeeTable({
  email,
  page = 1,
  department,
  status,
}: {
  email: string;
  page: number;
  department: string;
  status: string;
}) {
  const response = await findUser({
    ...(email && { email }),
    ...(page && { page }),
    ...(department && { department }),
  });

  console.log("data ", response.data);

  return (
    <TableContainer>
      <Table sx={{ minWidth: 650, overflow: "auto" }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell align="left">ID</TableCell>
            <TableCell align="left">Name</TableCell>
            <TableCell align="left">Email</TableCell>
            <TableCell align="left">Department</TableCell>
            <TableCell align="left">Status</TableCell>
            <TableCell align="right">Details</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {response.data && response.data.length ? (
            response.data.map((employee) => {
              const { id, email, isActive, profile } = employee;
              //   const { id, email, isActive, ,emailVerified, role } = employee;
              return (
                <TableRow
                  key={id}
                  sx={{
                    "&:last-child td, &:last-child th": { border: 0 },
                  }}
                >
                  <TableCell component="th" scope="row" align="left">
                    {id}
                  </TableCell>
                  <TableCell align="left">{`${profile?.fname} ${profile?.lname}`}</TableCell>
                  <TableCell align="left">{email}</TableCell>
                  <TableCell align="left">
                    {profile?.department?.name}
                  </TableCell>
                  <TableCell align="left">
                    {isActive ? "active" : "inactive"}
                  </TableCell>

                  <TableCell align="right">
                    <Stack
                      spacing={2}
                      direction="row-reverse"
                      sx={{ width: "100%" }}
                    >
                      <Button
                        variant="contained"
                        // LinkComponent={Link}
                        // href={`${pathname}/${id}`}
                      >
                        View Schedules
                      </Button>
                      <Button
                        variant="outlined"
                        //   LinkComponent={Link}
                        //   href={`${pathname}/${id}`}
                        // onClick={async () => await toggleUserIsActive(id)}
                      >
                        {isActive ? "Deactivate" : "Activate"}
                      </Button>
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
