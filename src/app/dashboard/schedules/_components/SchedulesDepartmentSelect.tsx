"use client";
import { getDepartments } from "@/actions/departments/department-action";
import { Autocomplete, Chip, TextField } from "@mui/material";
import { useSession } from "next-auth/react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function SchedulesDepartmentSelect() {
  const session = useSession();
  const searchParams = useSearchParams();
  const { replace } = useRouter();
  const pathname = usePathname();
  const [departments, setDepartments] = useState<string[]>([]);

  const hanldeDepartmentChange = (department: any) => {
    const params = new URLSearchParams(searchParams);

    if (department && !!department.length) {
      params.set("department", department.toString());
    } else {
      params.delete("department");
    }

    replace(`${pathname}?${params.toString()}`);
  };

  useEffect(() => {
    async function fetchDepartments() {
      const res = await getDepartments();
      if (res?.data) setDepartments(res.data.map((dept) => dept.name));
    }
    fetchDepartments();
  }, []);

  useEffect(() => {
    if (!searchParams.get("department")) {
      console.log("department ", searchParams.get("department"));
      hanldeDepartmentChange(session.data?.user.department);
    }
  }, []);

  console.log("department ", session.data?.user.department);
  console.log("session : ", session);
  return (
    <Autocomplete
      limitTags={2}
      filterSelectedOptions
      options={departments}
      loading={departments.length < 0}
      value={
        searchParams.get("department")
          ? searchParams.get("department") ?? null
          : null
      }
      onChange={(e, value) => {
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
      style={{ width: 300 }}
      renderInput={(params) => (
        <TextField
          {...params}
          label="Department"
          placeholder="select..."
          size="small"
        />
      )}
    />
  );
}
