"use client";
import { Button } from "@mui/material";
import { DataGrid, GridRowsProp, GridColDef } from "@mui/x-data-grid";
import { useState } from "react";
import Loading from "../_ui/Loading";

const rows: GridRowsProp = [
  { id: 1, col1: "Hello", col2: "World" },
  { id: 2, col1: "DataGridPro", col2: "is Awesome" },
  { id: 3, col1: "MUI", col2: "is Amazing" },
];

const columns: GridColDef[] = [
  { field: "col1", headerName: "Column 1", width: 150 },
  { field: "col2", headerName: "Column 2", width: 150 },
];

export default function Test() {
  const [state, setState] = useState();

  const handleLogin = async () => {
    try {
      const response = await fetch(
        "http://115.85.30.212:8383/api/method/login",
        {
          method: "POST",
          body: JSON.stringify({ usr: "tope@gmail.com", pwd: "comfac123" }),
        }
      );
      const parsedResponse = await response.json();
      setState(parsedResponse);
    } catch (error) {
      console.log("error : ", error);
    }
  };

  const handleLogout = () => {};

  return (
    <Loading />
    // <div>
    //   <Loading />
    //   <pre>{JSON.stringify(state, null, 4)}</pre>
    //   <Button onClick={handleLogin} variant="contained">
    //     Login
    //   </Button>
    //   <Button onClick={handleLogout} variant="contained">
    //     Logout
    //   </Button>
    //   <DataGrid rows={rows} columns={columns} />
    // </div>
  );
}
