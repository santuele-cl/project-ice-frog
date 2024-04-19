"use client";
import { useState } from "react";
import { Button, IconButton, Stack, TextField, Tooltip } from "@mui/material";
import Grid2 from "@mui/material/Unstable_Grid2/Grid2";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { NewEmployeeSchema } from "@/app/_schemas/zod/schema";
import { z } from "zod";
import FormStatusText from "@/app/_ui/auth/FormStatusText";
import { Gender, Role } from "@prisma/client";
import AutoComplete from "@/app/_ui/AutoComplete";
import { DatePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import { createUserByAdminAcc } from "@/actions/users/users-action";
import ClearOutlinedIcon from "@mui/icons-material/ClearOutlined";
import DepartmentSelect from "./DepartmentSelect";
import { getErrorMessage } from "@/actions/action-utils";
import { enqueueSnackbar } from "notistack";

type OptionType = { value: string; label: string };

type FieldType = {
  required?: boolean;
  id: keyof z.infer<typeof NewEmployeeSchema>;
  label: string;
} & (
  | { type?: "select"; options: OptionType[] }
  | { type?: "text" | "number" | "date" | "password" }
);

const fields: FieldType[] = [
  { id: "fname", label: "First Name" },
  { id: "mname", label: "Middle Name", required: false },
  { id: "lname", label: "Last Name" },
  { id: "suffix", label: "Suffix", required: false },
  {
    id: "gender",
    label: "Gender",
    type: "select",
    options: [
      { value: Gender.MALE, label: "Male" },
      { value: Gender.FEMALE, label: "Female" },
    ],
  },
  { id: "bdate", label: "Birthday", type: "date" },
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

  const {
    handleSubmit,
    reset,
    control,
    watch,
    resetField,
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

      if (res?.error) enqueueSnackbar(res.error, { variant: "error" });
      if (res?.success) {
        reset();
        enqueueSnackbar(res.success, { variant: "success" });
      }
    } catch (error) {
      console.log(error);
      enqueueSnackbar(getErrorMessage(error), { variant: "error" });
    }
    setPending(false);
  };

  return (
    <Stack
      component="form"
      onSubmit={handleSubmit(onSubmit)}
      sx={{ gap: 2 }}
      noValidate
    >
      <Grid2 container direction="row" spacing={3}>
        {fields.map((field, index) => {
          const { type, required, label, id } = field;
          if (type === "select") {
            const { options } = field;
            if (id === "department") {
              return (
                <Grid2 xs={12} sm={6} key={id}>
                  <DepartmentSelect
                    required={required ?? true}
                    control={control}
                  />
                </Grid2>
              );
            }
            return (
              <Grid2 xs={12} sm={6} key={id}>
                <AutoComplete
                  required={required}
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
                            InputLabelProps: { required: required ?? true },
                            fullWidth: true,
                            error: errors[id] ? true : false,
                            helperText: errors[id]?.message,
                          },
                        }}
                        label={label}
                        value={field.value ? dayjs(field.value) ?? null : null}
                        inputRef={field.ref}
                        onChange={(date) => {
                          field.onChange(date ? date?.toDate() ?? null : null);
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
              <Controller
                defaultValue={""}
                name={id}
                control={control}
                render={({ field: { value, onChange } }) => (
                  <TextField
                    {...field}
                    sx={{
                      "&:hover .MuiIconButton-root": {
                        display: watch(id) ? "block" : "none",
                      },
                    }}
                    InputLabelProps={{ required: required ?? true }}
                    InputProps={{
                      endAdornment: (
                        <IconButton
                          onClick={(e) => resetField(id)}
                          sx={{
                            display: "none",
                          }}
                          size="small"
                        >
                          <ClearOutlinedIcon fontSize="small" color="inherit" />
                        </IconButton>
                      ),
                    }}
                    value={value}
                    onChange={(event) => onChange(event.target.value)}
                    type={type}
                    label={label}
                    error={errors[id] ? true : false}
                    helperText={errors[id]?.message as string}
                    fullWidth
                  />
                )}
              />
            </Grid2>
          );
        })}
      </Grid2>
      <Stack sx={{ ml: "auto", gap: 1, flexDirection: "row" }}>
        <Tooltip title="Double click to clear form" placement="top">
          <Button
            onDoubleClick={() => reset()}
            variant="outlined"
            color="error"
          >
            Clear form
          </Button>
        </Tooltip>
        <Button type="submit" variant="contained">
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
