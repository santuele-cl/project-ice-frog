"use client";
import {
  Button,
  ButtonGroup,
  Divider,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { getEmployeesByDepartment } from "@/actions/users/users-action";
import Date from "./Date";
import ScheduleTableHeader from "./ScheduleTableHeader";
import { getWeek } from "@/app/_utils/days";
import { useEffect, useState } from "react";
import { Prisma } from "@prisma/client";
import { findUser } from "@/actions/users/users";
import { useParams, useSearchParams } from "next/navigation";
import weekOfTheYear from "dayjs/plugin/weekOfYear";

dayjs.extend(utc);
dayjs.extend(weekOfTheYear);

type UserWithDetails = Prisma.UserGetPayload<{
  select: {
    id: true;
    email: true;
    isActive: true;
    role: true;
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

export default function ScheduleTable() {
  const searchParams = useSearchParams();
  const week = searchParams.get("week") ?? dayjs().week().toString();
  const [employees, setEmployees] = useState<UserWithDetails[]>();
  const [pagination, setPagination] = useState<PaginationProps>();
  const [weekDates, setWeekDates] = useState<dayjs.Dayjs[]>([]);
  // const weekDates = getWeek(Number(week));
  console.log("weekDates: ", weekDates);
  console.log("week: ", week);

  useEffect(() => {
    setWeekDates(getWeek(Number(week)));
  }, [week]);

  useEffect(() => {
    const fetchEmployees = async () => {
      const response = await findUser({
        ...(searchParams.get("name") && {
          name: searchParams.get("name") as string,
        }),
        ...(searchParams.get("occupation") && {
          occupation: searchParams.get("occupation") as string,
        }),
        ...(searchParams.get("page") && {
          page: Number(searchParams.get("page")),
        }),
        ...(searchParams.get("department") && {
          department: searchParams.get("department") as string,
        }),
      });
      if (response.data && response.pagination) {
        console.log("response data : ", response.data);
        setEmployees(response.data);
        setPagination(response.pagination);
      }
    };
    fetchEmployees();
  }, []);

  return (
    <Stack sx={{ p: 2 }}>
      <ScheduleTableHeader week={week} />
      <Divider sx={{ my: 2 }} />
      <TableContainer sx={{ height: "750px" }}>
        <Table
          sx={{ minWidth: 650, overflow: "auto" }}
          aria-label="simple table"
        >
          <TableHead>
            <TableRow>
              <TableCell
                sx={{
                  fontWeight: 600,
                  fontSize: "0.9rem",
                  minHeight: 150,
                }}
              >
                No
              </TableCell>
              <TableCell
                sx={{
                  fontWeight: 600,
                  fontSize: "0.9rem",
                  minHeight: 150,
                }}
              >
                Employee
              </TableCell>
              {weekDates &&
                weekDates.length > 0 &&
                weekDates.map((date) => (
                  <TableCell
                    sx={{
                      fontSize: "0.8rem",
                      textAlign: "center",
                      minWidth: 220,
                      minHeight: 150,
                    }}
                    key={date.toString()}
                  >
                    {date.format("ddd, MMM D")}
                  </TableCell>
                ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {employees && employees.length > 0 ? (
              employees.map((employee, i) => {
                const { id, profile } = employee;
                return (
                  <TableRow
                    key={id}
                    sx={{
                      "&:last-child td, &:last-child th": { border: 0 },
                      minHeight: 150,
                    }}
                  >
                    <TableCell component="th" scope="row">
                      {i + 1}
                    </TableCell>
                    <TableCell component="th" scope="row">
                      <Typography>{`${profile?.fname} ${profile?.lname}`}</Typography>
                    </TableCell>
                    {weekDates &&
                      weekDates.length > 0 &&
                      weekDates.map((date, index) => (
                        <TableCell
                          key={index}
                          align="left"
                          sx={{
                            borderRight: "1px solid rgba(0,0,0,0.2)",
                            position: "relative",
                          }}
                        >
                          <Date
                            employeeId={id}
                            endDate={date.utcOffset(0).endOf("date").toDate()}
                            startDate={date
                              .utcOffset(0)
                              .startOf("date")
                              .toDate()}
                          />
                        </TableCell>
                      ))}
                  </TableRow>
                );
              })
            ) : (
              <TableRow
                sx={{
                  "&:last-child td, &:last-child th": { border: 0, p: 0 },
                }}
              >
                <TableCell component="th" scope="row"></TableCell>
                <TableCell align="right"></TableCell>
                <TableCell align="right"></TableCell>
                <TableCell align="right"></TableCell>
                <TableCell align="right"></TableCell>
                <TableCell align="right"></TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Stack>
  );
}
