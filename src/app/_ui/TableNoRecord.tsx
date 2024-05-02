import { TableCell, TableRow, Typography } from "@mui/material";

export default function TableNoRecord() {
  return (
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
  );
}
