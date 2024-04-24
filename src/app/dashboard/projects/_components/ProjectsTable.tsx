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
  Tooltip,
  Typography,
} from "@mui/material";
import ProjectsTablePagination from "./ProjectsTablePagination";
import { Department } from "@prisma/client";
import Link from "next/link";
import { getProjects } from "@/actions/projects/projects-action";
import dayjs from "dayjs";
import VisibilityIcon from "@mui/icons-material/Visibility";
import BorderColorIcon from "@mui/icons-material/BorderColor";
import DeleteIcon from "@mui/icons-material/Delete";

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
  const response = await getProjects();

  if (response.error) throw new Error(response.error);

  console.log("data ", response.data);

  return (
    <TableContainer sx={{ height: "690px" }}>
      <Table sx={{ minWidth: 650, overflow: "auto" }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell align="left">Job Order</TableCell>
            <TableCell align="left">Project</TableCell>

            <TableCell align="left">Location</TableCell>

            <TableCell align="left">Created At</TableCell>
            <TableCell align="left">Last Updated</TableCell>
            <TableCell align="center">Action</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {response.data && response.data.length ? (
            response.data.map((project) => {
              const {
                id,
                name,
                jobOrder,
                building,
                street,
                barangay,
                city,
                notes,
                createdAt,
                updatedAt,
              } = project;
              // const { id, email, isActive, ,emailVerified, role } = employee;
              return (
                <TableRow
                  key={id}
                  sx={{
                    "&:last-child td, &:last-child th": { border: 0 },
                  }}
                >
                  <TableCell component="th" scope="row" align="left">
                    {jobOrder}
                  </TableCell>
                  <TableCell align="left">{name}</TableCell>

                  <TableCell align="left">{`${building} ${street} ${barangay}, ${city}`}</TableCell>

                  <TableCell>
                    {dayjs(createdAt).format("MMM DD, YYYY hh:mm a")}
                  </TableCell>
                  <TableCell>
                    {dayjs(updatedAt).format("MMM DD, YYYY hh:mm a")}
                  </TableCell>

                  <TableCell align="center">
                    <Stack
                      spacing={2}
                      direction="row-reverse"
                      sx={{ width: "100%" }}
                    >
                      <Tooltip title="View Details">
                        <IconButton
                          component={Link}
                          href={`/dashboard/projects/${id}`}
                        >
                          <VisibilityIcon fontSize="medium" />
                        </IconButton>
                      </Tooltip>

                      <Tooltip title="Delete Project">
                        <IconButton component={Link} href="#delete">
                          <DeleteIcon fontSize="medium" />
                        </IconButton>
                      </Tooltip>

                      <Tooltip title="Edit Details">
                        <IconButton component={Link} href="#edit">
                          <BorderColorIcon fontSize="medium" />
                        </IconButton>
                      </Tooltip>

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
