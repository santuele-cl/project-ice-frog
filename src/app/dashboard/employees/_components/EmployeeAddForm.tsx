"use client";
import { useEffect, useState } from "react";
import { Button, Stack, TextField } from "@mui/material";
import Grid2 from "@mui/material/Unstable_Grid2/Grid2";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { NewEmployeeSchema } from "@/app/_schemas/zod/schema";
import { z } from "zod";
import FormStatusText from "@/app/_ui/auth/FormStatusText";
import { Department, Gender, Role } from "@prisma/client";
import { getDepartments } from "@/actions/departments/department";
import AutoComplete from "@/app/_ui/AutoComplete";
import { DatePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import { createUserByAdminAcc } from "@/actions/users/users-action";

type OptionType = { value: string; label: string };

type FieldType = {
  id: keyof z.infer<typeof NewEmployeeSchema>;
  label: string;
  placeholder?: string;
} & (
  | { type?: "select"; options: OptionType[] }
  | { type?: "text" | "number" | "date" | "password" }
);

const fields: FieldType[] = [
  { id: "fname", label: "First Name" },
  { id: "mname", label: "Middle Name" },
  { id: "lname", label: "Last Name" },
  { id: "suffix", label: "Suffix" },
  {
    id: "gender",
    label: "Gender",
    type: "select",
    options: [
      { value: Gender.MALE, label: "Male" },
      { value: Gender.FEMALE, label: "Female" },
    ],
  },
  { id: "bdate", label: "", type: "date" },
  { id: "contactNumber", label: "Contact Number" },
  { id: "occupation", label: "Occupation" },
  {
    id: "department",
    label: "Department",
    type: "select",
    options: [
      { value: "CUSTOMIZED", label: "Customized Department" },
      { value: "TECHNOLOGY", label: "Technology Department" },
      { value: "SYSTEMS", label: "Systems Department" },
    ],
  },
  {
    id: "role",
    label: "Role",
    type: "select",
    options: [
      { value: Role.ADMIN, label: "Admin" },
      { value: Role.EMPLOYEE, label: "Employee" },
    ],
  },
  { id: "email", label: "Email" },
  { id: "password", label: "Password", type: "password" },
  { id: "confirmPassword", label: "Confirm Password", type: "password" },
];

export default function EmployeeAddForm() {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [departments, setDepartments] = useState<Department[]>([]);

  const {
    register,
    handleSubmit,
    trigger,
    reset,
    control,
    getValues,
    formState: { errors },
  } = useForm<z.infer<typeof NewEmployeeSchema>>({
    resolver: zodResolver(NewEmployeeSchema),
  });

  const onSubmit = async (values: z.infer<typeof NewEmployeeSchema>) => {
    setPending(true);
    setError("");
    setSuccess("");

    try {
      const res = await createUserByAdminAcc(values);

      if (res?.error) setError(res.error);

      if (res?.success) {
        reset();
        setSuccess(res.success);
      }
    } catch (error) {
      console.log(error);
    }

    setPending(false);
  };

  console.log("errors", errors);

  useEffect(() => {
    async function fetchDepartments() {
      const res = await getDepartments();
      if (res?.data) setDepartments(res.data);
    }
    fetchDepartments();
  }, []);

  return (
    <Stack component="form" onSubmit={handleSubmit(onSubmit)} sx={{ gap: 2 }}>
      <Grid2 container direction="row" spacing={3}>
        {departments &&
          fields.map((field, index) => {
            const { label, id, placeholder, type } = field;
            if (type === "select") {
              const { options } = field;
              if (id === "department") {
                return (
                  <Grid2 xs={12} sm={6} key={id}>
                    <AutoComplete
                      control={control}
                      name="department"
                      options={departments}
                      labelIdentifier="name"
                      valueIdentifier="id"
                      fieldLabel="Department"
                    />
                  </Grid2>
                );
              }
              return (
                <Grid2 xs={12} sm={6} key={id}>
                  <AutoComplete
                    control={control}
                    name={id}
                    options={options}
                    labelIdentifier="label"
                    valueIdentifier="value"
                    fieldLabel={label}
                  />
                </Grid2>
              );
            } else if (type === "date") {
              return (
                <Grid2 xs={12} sm={6} key={id}>
                  <Controller
                    key={id + index}
                    control={control}
                    name={id}
                    render={({ field }) => {
                      return (
                        <DatePicker
                          slotProps={{
                            textField: {
                              fullWidth: true,
                              error: errors[id] ? true : false,
                              helperText: errors[id]?.message,
                            },
                          }}
                          label={label}
                          value={
                            field.value ? dayjs(field.value) ?? null : null
                          }
                          inputRef={field.ref}
                          onChange={(date) => {
                            field.onChange(
                              date ? date?.toDate() ?? null : null
                            );
                          }}
                        />
                      );
                    }}
                  />
                </Grid2>
              );
            }
            return (
              <Grid2 xs={12} sm={6} key={id}>
                <TextField
                  type={type ? type : "text"}
                  label={label}
                  {...register(id)}
                  error={errors[id] ? true : false}
                  helperText={errors[id]?.message as string}
                  placeholder={placeholder}
                  fullWidth
                />
              </Grid2>
            );
          })}
      </Grid2>
      <Stack>
        <Button type="submit" sx={{ ml: "auto" }} variant="contained">
          Add
        </Button>
      </Stack>
      {(error || success) && (
        <FormStatusText
          message={error ? error : success}
          status={error ? "error" : "success"}
        />
      )}
    </Stack>
  );
}
