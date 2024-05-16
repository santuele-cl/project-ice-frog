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
import { useSearchParams } from "next/navigation";

dayjs.extend(utc);

type UserWithProfileAndSchedules = Prisma.UserGetPayload<{
  include: { schedules: true; profile: true };
}>;

interface Props {
  employees: UserWithProfileAndSchedules[];
  week: number;
  weekDates: dayjs.Dayjs[];
}

export default function ScheduleTable({ employees, week, weekDates }: Props) {
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
              {weekDates.map((date) => (
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
            {employees && employees.length ? (
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
                          align="left"
                          height={150}
                          width={220}
                          key={index}
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
