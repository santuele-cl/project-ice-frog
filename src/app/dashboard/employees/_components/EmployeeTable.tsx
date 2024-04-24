import { findUser } from "@/actions/users/users";
import {
  IconButton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
} from "@mui/material";
import Link from "next/link";
import EmployeeArchiveButton from "./EmployeeArchiveButton";
import VisibilityIcon from "@mui/icons-material/Visibility";
import BorderColorIcon from "@mui/icons-material/BorderColor";
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

  return (
    <TableContainer sx={{ height: "690px" }}>
      <Table sx={{ minWidth: 650, overflow: "auto" }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell align="left">ID</TableCell>
            <TableCell align="left">Name</TableCell>
            <TableCell align="left">Email</TableCell>
            <TableCell align="left">Department</TableCell>
            <TableCell align="left">Occupation</TableCell>
            <TableCell align="left">Role</TableCell>
            <TableCell align="left">Status</TableCell>
            <TableCell align="right">Action</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {response.data && response.data.length ? (
            response.data.map((employee) => {
              const { id, email, isActive, profile, role } = employee;
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
                  <TableCell align="left">{profile?.occupation}</TableCell>
                  <TableCell align="left">{role}</TableCell>
                  <TableCell align="left">
                    {isActive ? "active" : "inactive"}
                  </TableCell>

                  <TableCell align="right">
                    <Stack
                      spacing={2}
                      direction="row-reverse"
                      sx={{ width: "100%", justifyContent: "end" }}
                    >
                      <Tooltip title="View Details">
                        <IconButton
                          component={Link}
                          href={`/dashboard/employees/${id}`}
                        >
                          <VisibilityIcon fontSize="medium" />
                        </IconButton>
                      </Tooltip>
                      <EmployeeArchiveButton id={id} />
                      <Tooltip title="Edit Details">
                        <IconButton
                          component={Link}
                          href={`/dashboard/employees/${id}/edit`}
                        >
                          <BorderColorIcon fontSize="medium" />
                        </IconButton>
                      </Tooltip>
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
        </TableBody>
      </Table>
    </TableContainer>
  );
}
