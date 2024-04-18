"use client";
import { HTMLInputTypeAttribute, useEffect, useState } from "react";
import {
  Stepper,
  Step,
  StepLabel,
  Typography,
  Button,
  Stack,
  Box,
  TextField,
  Paper,
  MenuItem,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Autocomplete,
} from "@mui/material";
import Grid2 from "@mui/material/Unstable_Grid2/Grid2";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { AdminRegisterSchema } from "@/app/_schemas/zod/schema";
import { STEPS } from "@/app/_data/constant";
import { createUser } from "@/actions/auth";
import { z } from "zod";
import FormStatusText from "@/app/_ui/auth/FormStatusText";
import { Department, Gender, Role } from "@prisma/client";
import { getDepartments } from "@/actions/departments/department";
import AutoComplete from "@/app/_ui/AutoComplete";
import { DatePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";

type OptionType = { value: string; label: string };

type FieldType = {
  id: keyof z.infer<typeof AdminRegisterSchema>;
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
  } = useForm<z.infer<typeof AdminRegisterSchema>>({
    resolver: zodResolver(AdminRegisterSchema),
  });

  const onSubmit = async (values: z.infer<typeof AdminRegisterSchema>) => {
    console.log("values", values);
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
    <Paper
      elevation={3}
      sx={{
        height: "100%",
      }}
    >
      <Stack height="100%">
        {/* FORM */}
        <Stack
          component="form"
          onSubmit={handleSubmit(onSubmit)}
          p={4}
          pt={1}
          spacing={2}
          flexGrow="1"
          flexShrink="1"
          // sx={{
          // overflowY: "auto",
          // }}
          // overflowY="auto"
          height="450px"
          justifyContent="space-between"
        >
          <Box
            sx={{
              // maxHeight: "320px",
              overflowY: "auto",
              p: 2,
            }}
          >
            <Stack gap={4}>
              <Grid2 container direction="row" spacing={3}>
                {departments &&
                  fields.map((field,index) => {
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
                                  value={dayjs(field.value)}
                                  inputRef={field.ref}
                                  onChange={(date) => {
                                    field.onChange(date?.toDate());
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
            </Stack>
          </Box>
          <Button type="submit">Add</Button>
          {(error || success) && (
            <FormStatusText
              message={error ? error : success}
              status={error ? "error" : "success"}
            />
          )}
        </Stack>
      </Stack>
    </Paper>
  );
}
