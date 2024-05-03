import {
  Box,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import ProjectSchedulesEmployeeRow from "./ProjectSchedulesEmployeeRow";
import TableNoRecord from "@/app/_ui/TableNoRecord";
import AddProjectSchedulesFormModal from "./AddProjectSchedulesFormModal";

type Props = {
  employeeIds: { userId: string }[];
  projectId: string;
};

export default async function ProjectSchedulesTableBody({
  employeeIds,
  projectId,
}: Props) {
  return (
    <Stack sx={{ gap: 2 }}>
      <Stack
        sx={{ mb: 1, justifyContent: "space-between", flexDirection: "row" }}
      >
        <Typography variant="h6">Employee Schedules</Typography>
        <AddProjectSchedulesFormModal />
      </Stack>
      <TableContainer sx={{ minHeight: "690px", position: "relative" }}>
        <Table
          sx={{ minWidth: 650, overflow: "auto" }}
          aria-label="simple table"
        >
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
                />
              ))
            ) : (
              <TableNoRecord />
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Stack>
  );
}
