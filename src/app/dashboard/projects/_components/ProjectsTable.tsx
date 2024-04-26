"use client";
import {
  Box,
  Divider,
  IconButton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from "@mui/material";
import Link from "next/link";
import { getProjects } from "@/actions/projects/projects-action";
import dayjs from "dayjs";
import VisibilityIcon from "@mui/icons-material/Visibility";
import BorderColorIcon from "@mui/icons-material/BorderColor";
import DeleteIcon from "@mui/icons-material/Delete";
import ProjectDeleteModal from "./ProjectDeleteModal";
import ProjectsTablePagination from "./ProjectsTablePagination";
import { Fragment, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Project } from "@prisma/client";
import NoDataComponent from "../../employees/[id]/_components/EmployeeNoScheduleDisplay";

type PaginationProps = {
  totalCount: number;
  itemsPerPage: number;
  totalPages: number;
};

type Props = {
  name: string;
  page: number;
  location: string;
  jobOrder: string;
};

export default function ProjectsTable(props: Props) {
  const { name, page, location, jobOrder } = props;
  const params = useSearchParams();
  const [data, setData] = useState<Project[]>([]);
  const [pagination, setPagination] = useState<PaginationProps>();

  useEffect(() => {
    const fetchProjects = async () => {
      const response = await getProjects({
        ...(name && { name }),
        ...(page && { page }),
        ...(location && { location }),
        ...(jobOrder && { jobOrder }),
      });
      if (response.data && response.pagination) {
        setData(response.data);
        setPagination(response.pagination);
      }
    };
    fetchProjects();
  }, [props]);

  return (
    <Fragment>
      <Stack sx={{ my: 1, flexDirection: "row", justifyContent: "flex-end" }}>
        {pagination && <ProjectsTablePagination pagination={pagination} />}
        <Typography></Typography>
      </Stack>
      <Divider sx={{ my: 1 }} />
      <TableContainer sx={{ height: "690px", position: "relative" }}>
        <Table
          sx={{ minWidth: 650, overflow: "auto" }}
          aria-label="simple table"
        >
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
            {data && data.length ? (
              data.map((project) => {
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
              <TableRow sx={{ height: "100%" }}>
                <TableCell
                  colSpan={8}
                  sx={{
                    height: "100%",
                    border: "none",
                  }}
                >
                  <Box
                    sx={{
                      height: "100%",
                      position: "absolute",
                      top: "50%",
                      left: "50%",
                      transform: "translate(-50%, -50%)",
                    }}
                  >
                    <Typography variant="h5" color="#9FA6B2" sx={{ p: 2 }}>
                      NO RECORD(S)
                    </Typography>
                  </Box>
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

      <Divider sx={{ my: 1 }} />
      {pagination && <ProjectsTablePagination pagination={pagination} />}
    </Fragment>
  );
}
