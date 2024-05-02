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
      <TableContainer sx={{ height: "690px" }}>
        <Table
          sx={{ minWidth: 650, overflow: "auto" }}
          aria-label="simple table"
        >
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
