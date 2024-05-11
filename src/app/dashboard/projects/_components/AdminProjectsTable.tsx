"use client";
import { Fragment, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import dayjs from "dayjs";
import * as XLSX from "xlsx";
import {
  Button,
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
} from "@mui/material";
import {
  exportProjects,
  getProjects,
} from "@/actions/projects/projects-action";
import VisibilityIcon from "@mui/icons-material/Visibility";
import BorderColorIcon from "@mui/icons-material/BorderColor";
import ProjectDeleteModal from "./ProjectDeleteModal";
import ProjectsTablePagination from "./ProjectsTablePagination";
import { Project } from "@prisma/client";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import TableNoRecord from "@/app/_ui/TableNoRecord";

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

export default function AdminProjectsTable(props: Props) {
  const { name, page, location, jobOrder } = props;
  const params = useSearchParams();
  const [data, setData] = useState<Project[]>([]);
  const [pagination, setPagination] = useState<PaginationProps>();

  const handleExport = async () => {
    const projects = await exportProjects({
      ...(name && { name }),
      ...(location && { location }),
      ...(jobOrder && { jobOrder }),
    });

    if (projects.success && projects.data) {
      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.json_to_sheet(projects.data);

      XLSX.utils.book_append_sheet(wb, ws, "sheet 1");
      XLSX.writeFile(wb, "projects.xlsx");
    }
  };

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
      <Stack
        sx={{ my: 1, flexDirection: "row", justifyContent: "space-between" }}
      >
        <ProjectsTablePagination
          pagination={
            pagination ?? { totalCount: 0, totalPages: 0, itemsPerPage: 0 }
          }
        />
        <Button
          startIcon={<FileDownloadIcon />}
          variant="outlined"
          color="success"
          onClick={handleExport}
        >
          Export
        </Button>
      </Stack>
      <Divider sx={{ my: 1 }} />
      <TableContainer sx={{ minHeight: "690px", position: "relative" }}>
        <Table
          sx={{ minWidth: 650, overflow: "auto" }}
          aria-label="simple table"
        >
          <TableHead sx={{ color: "white" }}>
            <TableRow sx={{ backgroundColor: "rgba(124,35,216,255)" }}>
              <TableCell
                sx={{ fontWeight: "bold", color: "#F5F6FA" }}
                align="left"
              >
                Job Order
              </TableCell>
              <TableCell
                sx={{ fontWeight: "bold", color: "#F5F6FA" }}
                align="left"
              >
                Project
              </TableCell>
              <TableCell
                sx={{ fontWeight: "bold", color: "#F5F6FA" }}
                align="left"
              >
                Location
              </TableCell>
              <TableCell
                sx={{ fontWeight: "bold", color: "#F5F6FA" }}
                align="left"
              >
                Start Date
              </TableCell>
              <TableCell
                sx={{ fontWeight: "bold", color: "#F5F6FA" }}
                align="left"
              >
                End Date
              </TableCell>
              <TableCell
                sx={{ fontWeight: "bold", color: "#F5F6FA" }}
                align="right"
              >
                Action
              </TableCell>
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
                      {dayjs(startDate).format("MMM DD, YYYY")}
                    </TableCell>
                    <TableCell>
                      {dayjs(endDate).format("MMM DD, YYYY")}
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

                        <Tooltip title="Edit Details">
                          <IconButton
                            component={Link}
                            href={`/dashboard/projects/${id}/edit`}
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
              <TableNoRecord />
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Divider sx={{ my: 1 }} />
      <ProjectsTablePagination
        pagination={
          pagination ?? { totalCount: 0, totalPages: 0, itemsPerPage: 0 }
        }
      />
    </Fragment>
  );
}
