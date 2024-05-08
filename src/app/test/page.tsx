"use client";
import { Button, Stack } from "@mui/material";
import { DataGrid, GridRowsProp, GridColDef } from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import Loading from "../_ui/Loading";
import RootLoadingPage from "../loading";
import Error from "../dashboard/projects/error";

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
  // "http://192.168.0.43/api/method/login"
  // "http://192.168.0.43/api/resource/User"

  const handleLogin = async () => {
    try {
      const response = await fetch("http://192.168.0.43/api/method/login", {
        method: "POST",
        body: JSON.stringify({
          usr: "csan@gmail.com",
          pwd: "comfac123",
        }),
        headers: {
          "Content-Type": "application/json",
          Accept: " application/json",
        },
      });

      console.log(response);
    } catch (error) {
      console.log("error : ", error);
    }
  };

  const handleFetch = async () => {
    try {
      const response = await fetch("http://192.168.0.43/api/resource/User", {
        method: "GET",
      });

      console.log(response);
    } catch (error) {
      console.log("error : ", error);
    }
  };

  const handleGetUserInfo = async () => {
    try {
      const response = await fetch(
        "http://192.168.0.43/api/method/frappe.auth.get_logged_user",
        { method: "GET" }
      );
      console.log(response);
    } catch (error) {
      console.log(error);
    }
  };

  const handleLogout = async () => {
    try {
      const response = await fetch("http://192.168.0.43/api/method/logout", {
        method: "POST",
      });

      console.log(response);
    } catch (error) {
      console.log("error : ", error);
    }
  };

  // useEffect(() => {
  //   const handleRefresh = async () => {
  //     try {
  //       const response = await axios.get(
  //         "http://192.168.0.43/api/method/frappe.auth.get_logged_user"
  //       );
  //       console.log("refresh res : ", response);
  //     } catch (error) {
  //       console.log(Error);
  //     }
  //   };
  //   handleRefresh();
  // }, []);

  return (
    <Stack>
      <RootLoadingPage />
      <Loading />
      <div>
        <pre>{JSON.stringify(state, null, 4)}</pre>
        <Button onClick={handleLogin} variant="contained">
          Login
        </Button>
        <Button onClick={handleFetch} variant="contained">
          Fetch
        </Button>
        <Button onClick={handleGetUserInfo} variant="contained">
          Get info
        </Button>
        <Button onClick={handleLogout} variant="contained">
          Logout
        </Button>
        <DataGrid rows={rows} columns={columns} />
      </div>
    </Stack>
  );
}
