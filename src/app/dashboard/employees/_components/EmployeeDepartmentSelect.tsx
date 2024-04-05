"use client";
import { getDepartments } from "@/actions/departments/department";
import { Autocomplete, Chip, TextField } from "@mui/material";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function EmployeeDepartmentSelect() {
  const searchParams = useSearchParams();
  const { replace } = useRouter();
  const pathname = usePathname();
  const params = new URLSearchParams(searchParams);
  const [departments, setDepartments] = useState<string[]>([]);

  const hanldeDepartmentChange = (department: any) => {
    if (department && !!department.length)
      params.set("department", department.toString());
    else params.delete("department");
    replace(`${pathname}?${params.toString()}`);
  };

  useEffect(() => {
    async function fetchDepartments() {
      const res = await getDepartments();
      if (res?.data) setDepartments(res.data.map((dept) => dept.name));
    }
    fetchDepartments();
  }, []);

  return (
    <Autocomplete
      multiple
      limitTags={2}
      filterSelectedOptions
      id="checkboxes-tags-demo"
      options={departments}
      loading={departments.length < 0}
      disableCloseOnSelect
      value={
        searchParams.get("department")
          ? searchParams.get("department")?.split(",") ?? []
          : []
      }
      onChange={(e, value) => {
        console.log("new value : ", value);
        console.log("string value : ", value.toString());
        hanldeDepartmentChange(value);
      }}
      renderOption={(props, option) => {
        return (
          <li {...props} key={option}>
            {option}
          </li>
        );
      }}
      renderTags={(tagValue, getTagProps) => {
        return tagValue.map((option, index) => (
          <Chip {...getTagProps({ index })} key={option} label={option} />
        ));
      }}
      style={{ width: 500 }}
      renderInput={(params) => (
        <TextField {...params} label="Department" placeholder="select..." />
      )}
    />
  );
}
