import { findDepartment } from "@/actions/departments/department-action";
import {
  Button,
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
import dayjs from "dayjs";
import Link from "next/link";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import VisibilityIcon from "@mui/icons-material/Visibility";
import BorderColorIcon from "@mui/icons-material/BorderColor";
import DeleteIcon from "@mui/icons-material/Delete";
import DepartmentDeleteForm from "./DepartmentDeleteForm";
import DepartmentEditFormModal from "./DepartmentEditFormModal";
import TableNoRecord from "@/app/_ui/TableNoRecord";

export default async function DepartmentTable({
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
  const response = await findDepartment({});

  if (response.error || !response.data) throw new Error(response.error);

  const departments = response.data;

  return (
    <TableContainer sx={{ height: "690px" }}>
      <Table sx={{ minWidth: 650, overflow: "auto" }} aria-label="simple table">
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
              Department
            </TableCell>
            <TableCell
              sx={{ fontWeight: "bold", color: "#F5F6FA" }}
              align="left"
            >
              Department Head
            </TableCell>
            <TableCell
              sx={{ fontWeight: "bold", color: "#F5F6FA" }}
              align="left"
            >
              Date Created
            </TableCell>
            <TableCell
              sx={{ fontWeight: "bold", color: "#F5F6FA" }}
              align="left"
            >
              Last update
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
          {departments && departments.length ? (
            departments.map((department) => {
              const { id, name, head, createdAt, updatedAt } = department;
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
                  <TableCell align="left">{name}</TableCell>
                  <TableCell align="left">{head}</TableCell>
                  <TableCell align="left">
                    {dayjs(createdAt).format("MMM DD, YYYY hh:mm a")}
                  </TableCell>
                  <TableCell align="left">
                    {dayjs(updatedAt).format("MMM DD, YYYY hh:mm a")}
                  </TableCell>

                  <TableCell align="right">
                    <Stack
                      spacing={2}
                      direction="row-reverse"
                      sx={{ width: "100%" }}
                    >
                      <DepartmentDeleteForm id={id} />
                      <DepartmentEditFormModal department={department} />
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
  );
}
