"use client";
import { findUser } from "@/actions/users/users";
import {
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
import Link from "next/link";
import VisibilityIcon from "@mui/icons-material/Visibility";
import BorderColorIcon from "@mui/icons-material/BorderColor";
import EmployeeArchiveButton from "./EmployeeArchiveButton";
import { Fragment, useEffect, useState } from "react";
import { Prisma } from "@prisma/client";
import EmployeeTablePagination from "./EmployeeTablePagination";
import { useParams, useSearchParams } from "next/navigation";
import TableNoRecord from "@/app/_ui/TableNoRecord";

type UserWithDetails = Prisma.UserGetPayload<{
  include: {
    profile: {
      select: {
        contactNumber: true;
        department: true;
        fname: true;
        lname: true;
        occupation: true;
      };
    };
  };
}>;

type PaginationProps = {
  totalCount: number;
  itemsPerPage: number;
  totalPages: number;
};

type Props = {
  name: string;
  page: number;
  department: string;
  occupation: string;
};

export default function EmployeeTable(props: Props) {
  const { name, page, department, occupation } = props;
  const params = useSearchParams();

  const [data, setData] = useState<UserWithDetails[]>();
  const [pagination, setPagination] = useState<PaginationProps>();

  useEffect(() => {
    const fetchEmployees = async () => {
      const response = await findUser({
        ...(name && { name }),
        ...(occupation && { occupation }),
        ...(page && { page }),
        ...(department && { department }),
      });
      if (response.data && response.pagination) {
        setData(response.data);
        setPagination(response.pagination);
      }
    };
    fetchEmployees();
  }, [props]);

  return (
    <Fragment>
      <TableContainer sx={{ minHeight: "690px", position: "relative" }}>
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
              <TableCell align="left">Occupation</TableCell>
              <TableCell align="left">Role</TableCell>
              <TableCell align="left">Status</TableCell>
              <TableCell align="right">Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data && data.length ? (
              data.map((employee) => {
                const { id, email, isActive, profile, role } = employee;
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
                    <TableCell align="left">{profile?.occupation}</TableCell>
                    <TableCell align="left">{role}</TableCell>
                    <TableCell align="left">
                      {isActive ? "active" : "inactive"}
                    </TableCell>
                    <TableCell align="right">
                      <Stack
                        spacing={2}
                        direction="row-reverse"
                        sx={{ width: "100%", justifyContent: "end" }}
                      >
                        <Tooltip title="View Details">
                          <IconButton
                            component={Link}
                            href={`/dashboard/employees/${id}`}
                          >
                            <VisibilityIcon fontSize="medium" />
                          </IconButton>
                        </Tooltip>
                        <EmployeeArchiveButton id={id} />
                        <Tooltip title="Edit Details">
                          <IconButton
                            component={Link}
                            href={`/dashboard/employees/${id}/edit`}
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
      {pagination && <EmployeeTablePagination pagination={pagination} />}
    </Fragment>
  );
}
