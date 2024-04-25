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
import { getProjects } from "@/actions/projects/projects-action";
import dayjs from "dayjs";
import VisibilityIcon from "@mui/icons-material/Visibility";
import BorderColorIcon from "@mui/icons-material/BorderColor";
import DeleteIcon from "@mui/icons-material/Delete";
import ProjectDeleteModal from "./ProjectDeleteModal";

export default async function ProjectsTable({
  name,
  page = 1,
  location,
  jobOrder,
}: {
  name: string;
  page: number;
  location: string;
  jobOrder: string;
}) {
  const response = await getProjects({
    ...(name && { name }),
    ...(page && { page }),
    ...(location && { location }),
    ...(jobOrder && { jobOrder }),
  });

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

            <TableCell align="left">Start Date</TableCell>
            <TableCell align="left">End Date</TableCell>
            <TableCell align="right">Action</TableCell>
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
                createdAt,
                updatedAt,
                startDate,
                endDate,
              } = project;
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
                    {dayjs(startDate).format("MMM DD, YYYY hh:mm a")}
                  </TableCell>
                  <TableCell>
                    {dayjs(endDate).format("MMM DD, YYYY hh:mm a")}
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
                      <ProjectDeleteModal id={id} />
                      {/* <Tooltip title="Delete Project">
                        <IconButton
                          component={Link}
                          href="#delete"
                          color="error"
                        >
                          <DeleteIcon fontSize="medium" />
                        </IconButton>
                      </Tooltip> */}

                      <Tooltip title="Edit Details">
                        <IconButton
                          component={Link}
                          href={`/dashboard/projects/${id}/edit`}
                        >
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
