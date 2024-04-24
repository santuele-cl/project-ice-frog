"use client";
import { useEffect, useState } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import dayjs from "dayjs";
import { useParams } from "next/navigation";
import { Prisma, Project } from "@prisma/client";

import {
  Autocomplete,
  Button,
  Divider,
  IconButton,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import Grid2 from "@mui/material/Unstable_Grid2/Grid2";
import { DatePicker, DateTimePicker } from "@mui/x-date-pickers";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";

import FormStatusText from "@/app/_ui/auth/FormStatusText";
import { EditProjectSchema } from "@/app/_schemas/zod/schema";
import { addProject, editProject } from "@/actions/projects/projects-action";
import { getEmployeeIds } from "@/actions/users/users-action";
import { enqueueSnackbar } from "notistack";
import AutoComplete from "@/app/_ui/AutoComplete";
import ClearOutlinedIcon from "@mui/icons-material/ClearOutlined";

type UserWithName = Prisma.UserGetPayload<{
  select: {
    id: true;
    profile: { select: { fname: true; lname: true } };
  };
}>;
type OptionType = { value: string; label: string };
type FieldType = {
  required?: boolean;
  id: keyof z.infer<typeof EditProjectSchema>;
  label: string;
} & (
  | { type?: "select"; options: OptionType[] }
  | { type?: "text" | "number" | "date" | "password" }
);

const fieldsArr: FieldType[] = [
  { id: "name", label: "Project Name" },
  { id: "building", label: "Building No.", required: false },
  { id: "jobOrder", label: "Job order Number" },
  { id: "street", label: "Street", required: false },
  { id: "startDate", label: "Projected Start Date", type: "date" },
  { id: "barangay", label: "Barangay" },
  { id: "endDate", label: "Projected End Date", type: "date" },
  { id: "city", label: "City" },
  { id: "notes", label: "Notes", required: false },
];

export default function ProjectEditForm({
  projectDetails,
}: {
  projectDetails: Project;
}) {
  const {
    name,
    jobOrder,
    street,
    building,
    city,
    barangay,
    notes,
    endDate,
    startDate,
  } = projectDetails;
  const params = useParams();
  const [pending, setPending] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    control,
    trigger,
    watch,
    resetField,
  } = useForm<z.infer<typeof EditProjectSchema>>({
    resolver: zodResolver(EditProjectSchema),
    defaultValues: {
      name,
      jobOrder,
      street: street ?? "",
      building: building ?? "",
      city,
      barangay,
      notes: notes ?? "",
      startDate,
      endDate,
    },
  });

  const onSubmit = async (data: z.infer<typeof EditProjectSchema>) => {
    setPending(true);
    setError("");
    setSuccess("");
    try {
      const res = await editProject({ projectId: projectDetails.id, data });

      if (res?.error) enqueueSnackbar(res.error, { variant: "error" });

      if (res?.success) enqueueSnackbar(res.success, { variant: "success" });
    } catch {
      setError("Something went wrong!");
    } finally {
      setPending(false);
    }
  };

  const [employees, setEmployees] = useState<UserWithName[]>([]);

  useEffect(() => {
    async function fetchEmployees() {
      const res = await getEmployeeIds();
      if (res?.data) setEmployees(res.data);
    }
    fetchEmployees();
  }, []);

  return (
    <Stack component="form" onSubmit={handleSubmit(onSubmit)} sx={{ gap: 2 }}>
      <Typography variant="h6" sx={{ textTransform: "uppercase" }}>
        Project Details
      </Typography>
      <Grid2 container spacing={3} sx={{ maxWidth: 1290 }}>
        {fieldsArr.map((field, index) => {
          const { type, required, label, id } = field;
          if (type === "select") {
            const { options } = field;
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
                        value={
                          field.value
                            ? dayjs(field.value as Date) ?? null
                            : null
                        }
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

      <Divider sx={{ mt: 1 }} />

      <Stack sx={{ flexDirection: "row", gap: 2, justifyContent: "flex-end" }}>
        <Button
          type="submit"
          variant="contained"
          disabled={isSubmitting}
          sx={{ p: 2, width: 150 }}
        >
          Update
        </Button>
      </Stack>
    </Stack>
  );
}
