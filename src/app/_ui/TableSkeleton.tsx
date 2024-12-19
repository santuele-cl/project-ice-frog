import {
  Skeleton,
  Table,
  TableCell,
  TableContainer,
  TableRow,
} from "@mui/material";
import React from "react";

const TableSkeleton = () => {
  return (
    <TableContainer>
      <Table>
        <TableRow
          sx={{
            "&:last-child td, &:last-child th": { border: 0, p: 0 },
          }}
        >
          <TableCell component="th" scope="row">
            <Skeleton variant="rectangular" width={210} height={60} />
          </TableCell>
          <TableCell align="right">
            <Skeleton variant="rectangular" width={210} height={60} />
          </TableCell>
          <TableCell align="right">
            <Skeleton variant="rectangular" width={210} height={60} />
          </TableCell>
          <TableCell align="right">
            <Skeleton variant="rectangular" width={210} height={60} />
          </TableCell>
          <TableCell align="right">
            <Skeleton variant="rectangular" width={210} height={60} />
          </TableCell>
          <TableCell align="right">
            <Skeleton variant="rectangular" width={210} height={60} />
          </TableCell>
        </TableRow>
      </Table>
    </TableContainer>
  );
};

export default TableSkeleton;
