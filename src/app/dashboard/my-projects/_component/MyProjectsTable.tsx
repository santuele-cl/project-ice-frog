"use client";
import {
  Box,
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
  Typography,
} from "@mui/material";
import Link from "next/link";
import { getProjects } from "@/actions/projects/projects-action";
import dayjs from "dayjs";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { Fragment, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Project } from "@prisma/client";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import * as XLSX from "xlsx";
import ProjectsTablePagination from "../../projects/_components/ProjectsTablePagination";

type PaginationProps = {
  totalCount: number;
  itemsPerPage: number;
  totalPages: number;
};

type Props = {
  employeeId: string;
  name: string;
  page: number;
  location: string;
  jobOrder: string;
};

export default function MyProjectsTable(props: Props) {
  const { name, page, location, jobOrder, employeeId } = props;
  const params = useSearchParams();
  const [data, setData] = useState<Project[]>([]);
  const [pagination, setPagination] = useState<PaginationProps>();

  const handleExport = async () => {
    const projects = await getProjects({
      page: 0,
      ...(name && { name }),
      ...(location && { location }),
      ...(jobOrder && { jobOrder }),
    });

    if (projects.success && projects.data) {
      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.json_to_sheet(projects.data);

      XLSX.utils.book_append_sheet(wb, ws, "sheet 1");
      XLSX.writeFile(wb, "book.xlsx");
    }
  };

  useEffect(() => {
    const fetchProjects = async () => {
      const response = await getProjects({
        employeeId,
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
      <TableContainer sx={{ minHeight: "540px", position: "relative" }}>
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
                  <Typography
                    variant="h5"
                    color="#9FA6B2"
                    sx={{
                      position: "absolute",
                      top: "50%",
                      left: "50%",
                      transform: "translate(-50%, -50%)",
                    }}
                  >
                    NO RECORD(S)
                  </Typography>
                </TableCell>
              </TableRow>
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
