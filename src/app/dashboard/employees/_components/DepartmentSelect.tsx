// "use client";
// import {
//   Autocomplete,
//   FormControl,
//   InputLabel,
//   MenuItem,
//   Select,
//   Stack,
//   TextField,
// } from "@mui/material";

// import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
// import { useDebouncedCallback } from "use-debounce";
// import { usePathname, useRouter, useSearchParams } from "next/navigation";
// import { LoadingButton } from "@mui/lab";
// import EmployeeDepartmentSelect from "./EmployeeDepartmentSelect";
// import { useState } from "react";

// export default function DepartmentSelect() {
//   const hanldeDepartmentChange = (department: string | null) => {
//     if (department) params.set("department", department);
//     else params.delete("department");

//     replace(`${pathname}?${params.toString()}`);
//   };

//   const searchParams = useSearchParams();
//   const { replace } = useRouter();
//   const pathname = usePathname();
//   const params = new URLSearchParams(searchParams);
//   return (
//     <Autocomplete
//       disablePortal
//       id="combo-box-demo"
//       options={top100Films}
//       sx={{ width: 300 }}
//       value={searchParams.get("department")?.toString()}
//       onChange={(_, newValue) => {
//         hanldeDepartmentChange(newValue), console.log(newValue);
//       }}
//       renderInput={(params) => (
//         <TextField
//           {...params}
//           label="Departments"
//           onChange={(e) => hanldeDepartmentChange(e.target.value)}
//         />
//       )}
//     />
//   );
// }
