"use client";
import { getDepartments } from "@/actions/departments/department";
import AutoComplete from "@/app/_ui/AutoComplete";
import { Department } from "@prisma/client";
import { useEffect, useState } from "react";
import { Control, FieldValues } from "react-hook-form";

type DepartmentSelectProps = {
  required: boolean;
  control: any;
};

export default function DepartmentSelect({
  required,
  control,
}: DepartmentSelectProps) {
  const [departments, setDepartments] = useState<Department[]>([]);

  useEffect(() => {
    async function fetchDepartments() {
      const res = await getDepartments();
      if (res?.data) setDepartments(res.data);
    }
    fetchDepartments();
  }, []);
  return (
    <AutoComplete
      required={required}
      control={control}
      name="department"
      options={departments}
      labelIdentifier="name"
      valueIdentifier="id"
      fieldLabel="Department"
    />
  );
}
