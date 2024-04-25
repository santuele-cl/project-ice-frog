import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import ProjectSchedulesEmployeeRow from "./ProjectSchedulesEmployeeRow";

type Props = {
  employeeIds: { userId: string }[];
  projectId: string;
  // notes:string;
};

export default async function ProjectSchedulesTableBody({
  employeeIds,
  projectId,
}: // notes,
Props) {
  return (
    <TableContainer>
      <Table sx={{ minWidth: 650, overflow: "auto" }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell align="left">No</TableCell>
            <TableCell align="left">Employee</TableCell>
            <TableCell align="left">Start Date</TableCell>
            <TableCell align="left">Start Time</TableCell>
            <TableCell align="left">End Date</TableCell>
            <TableCell align="left">End Time</TableCell>
            <TableCell align="right">Action</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {employeeIds && !!employeeIds.length ? (
            employeeIds.map((employee, index) => (
              <ProjectSchedulesEmployeeRow
                key={index}
                index={index}
                userId={employee.userId}
                projectId={projectId}
                // notes={notes}
              />
            ))
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
              <TableCell align="left">-</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
