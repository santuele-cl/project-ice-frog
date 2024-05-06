import { findUser } from "@/actions/users/users";
import {
  Divider,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import ArchivedRestore from "./ArchivedRestore";
import TablePagination from "@/app/_ui/TablePagination";
import TableNoRecord from "@/app/_ui/TableNoRecord";
import ArchivedEmployeeDelete from "./ArchivedEmployeeDelete";

export default async function ArchivedEmployeeTable({
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
    isArchived: true,
  });

  return (
    <Stack>
      <TableContainer sx={{ minHeight: "690px", position: "relative" }}>
        <Table
          sx={{ minWidth: 650, overflow: "auto" }}
          aria-label="simple table"
        >
          <TableHead>
            <TableRow sx={{ backgroundColor: "rgba(124,35,216,255)" }}>
              <TableCell
                sx={{ fontWeight: "bold", color: "#F5F6FA" }}
                align="left"
              >
                ID
              </TableCell>
              <TableCell
                sx={{ fontWeight: "bold", color: "#F5F6FA" }}
                align="left"
              >
                Name
              </TableCell>
              <TableCell
                sx={{ fontWeight: "bold", color: "#F5F6FA" }}
                align="left"
              >
                Email
              </TableCell>
              <TableCell
                sx={{ fontWeight: "bold", color: "#F5F6FA" }}
                align="left"
              >
                Department
              </TableCell>
              <TableCell
                sx={{ fontWeight: "bold", color: "#F5F6FA" }}
                align="left"
              >
                Status
              </TableCell>
              <TableCell
                sx={{ fontWeight: "bold", color: "#F5F6FA" }}
                align="right"
              >
                Actions
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {response.data && response.data.length ? (
              response.data.map((employee) => {
                const { id, email, isActive, profile } = employee;
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
                    <TableCell align="left">
                      <Stack
                        spacing={2}
                        direction="row"
                        sx={{ width: "100%", justifyContent: "flex-end" }}
                      >
                        <ArchivedEmployeeDelete id={id} />
                        <ArchivedRestore id={id} />
                      </Stack>
                    </TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableNoRecord />
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <Divider sx={{ my: 1 }} />

      {response.pagination && (
        <TablePagination pagination={response.pagination} />
      )}
    </Stack>
  );
}
