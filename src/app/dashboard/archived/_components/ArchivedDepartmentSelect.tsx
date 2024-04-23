"use client";
import { getDepartments } from "@/actions/departments/department";
import AutoComplete from "@/app/_ui/AutoComplete";
import { Box } from "@mui/material";
import { Department } from "@prisma/client";
import { useEffect, useState } from "react";

type DepartmentSelectProps = {
  required: boolean;
  control: any;
};

export default function ArchivedDepartmentSelect({
  required,
  control,
}: DepartmentSelectProps) {
  const [departments, setDepartments] = useState<Department[]>([]);

  useEffect(() => {
    async function fetchDepartments() {
      const res = await getDepartments();
      if (res?.success) setDepartments(res.data);
    }
    fetchDepartments();
  }, []);
  return (
    <Box>
      {departments && !!departments.length && (
        <AutoComplete
          required={required}
          control={control}
          name="departmentId"
          options={departments}
          labelIdentifier="name"
          valueIdentifier="id"
          fieldLabel="Department"
        />
      )}
    </Box>
  );
}
