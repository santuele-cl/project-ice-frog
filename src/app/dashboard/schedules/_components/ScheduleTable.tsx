"use client";
import { getWeek } from "@/app/test-route/weekly-calendar/_utils/utils";
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
import { useState } from "react";

interface ScheduleTableProps {
  weekDates: dayjs.Dayjs[];
  data: any;
}

export default function ScheduleTable() {
  const [week, setWeek] = useState(dayjs().week());
  const weekDates = getWeek(week);
  return (
    <Stack sx={{ p: 2 }}>
      <Stack
        sx={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography sx={{ fontWeight: 600 }}>{`Week ${week}`}</Typography>
        <ButtonGroup>
          <Button onClick={() => setWeek((prev) => prev - 1)}>Prev</Button>
          <Button onClick={() => setWeek(dayjs().week())}>Today</Button>
          <Button onClick={() => setWeek((prev) => prev + 1)}>Next</Button>
        </ButtonGroup>
      </Stack>
      <Divider sx={{ my: 2 }} />
      <TableContainer>
        <Table
          sx={{ minWidth: 650, overflow: "auto" }}
          aria-label="simple table"
        >
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 600, fontSize: "0.9rem" }}>
                Employee
              </TableCell>
              {weekDates.map((date) => (
                <TableCell sx={{ fontSize: "0.8rem" }} align="left">
                  {date.format("ddd, MMM D")}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          {/* <TableBody>
              {response && response.data && response.data.length ? (
                response.data.map((clinicalDepartment) => {
                  const { id, description, createdAt, updatedAt, head, name } =
                    clinicalDepartment;
                  return (
                    <TableRow
                      key={id}
                      sx={{
                        "&:last-child td, &:last-child th": { border: 0 },
                      }}
                    >
                      <TableCell component="th" scope="row">
                        {id}
                      </TableCell>
                      <TableCell align="left">{name}</TableCell>
                      <TableCell align="left">{head}</TableCell>
                      <TableCell align="left">{description}</TableCell>
                      <TableCell align="left">{`${dayjs(createdAt).format(
                        "MMMM d, YYYY"
                      )}`}</TableCell>
                      <TableCell align="left">{`${dayjs(updatedAt).format(
                        "MMMM d, YYYY"
                      )}`}</TableCell>
                      <TableCell align="right">
                        <Stack
                          sx={{
                            flexDirection: "row",
                            justifyContent: "flex-end",
                            gap: 1,
                          }}
                        >
                          <DeleteClinicalDepartment
                            clinicalDepartmentId={id}
                            clinicalDepartmentName={name}
                          />
                          <EditClinicalDepartmentFormModal
                            clinicalDepartment={clinicalDepartment}
                          />
                        </Stack>
                      </TableCell>
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
            </TableBody> */}
        </Table>
      </TableContainer>
    </Stack>
  );
}
