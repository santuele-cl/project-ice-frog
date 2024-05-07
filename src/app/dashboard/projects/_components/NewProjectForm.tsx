"use client";
import { useEffect, useState } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import dayjs from "dayjs";
import { useParams } from "next/navigation";
import { Prisma, Schedule } from "@prisma/client";

import {
  Autocomplete,
  Button,
  Divider,
  FormHelperText,
  IconButton,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import Grid2 from "@mui/material/Unstable_Grid2/Grid2";
import { DatePicker, DateTimePicker } from "@mui/x-date-pickers";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";

import FormStatusText from "@/app/_ui/auth/FormStatusText";
import { ProjectSchema } from "@/app/_schemas/zod/schema";
import { addProject } from "@/actions/projects/projects-action";
import { getEmployeeIds } from "@/actions/users/users-action";
import { enqueueSnackbar } from "notistack";
import AutoComplete from "@/app/_ui/AutoComplete";
import ClearOutlinedIcon from "@mui/icons-material/ClearOutlined";
import WarningIcon from "@mui/icons-material/Warning";

type UserWithName = Prisma.UserGetPayload<{
  select: {
    id: true;
    profile: { select: { fname: true; lname: true } };
  };
}>;
type OptionType = { value: string; label: string };
type FieldType = {
  required?: boolean;
  id: keyof z.infer<typeof ProjectSchema>;
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

export default function NewProjectForm() {
  const params = useParams();
  const [pending, setPending] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [overlappingSchedules, setOverlappingSchedules] = useState<
    Partial<Schedule>[]
  >([]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    control,
    trigger,
    watch,
    resetField,
    setValue,
  } = useForm<z.infer<typeof ProjectSchema>>({
    resolver: zodResolver(ProjectSchema),
    defaultValues: {
      name: "",
      jobOrder: "",
      street: "",
      building: "",
      city: "",
      barangay: "",
      notes: "",
      schedules: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "schedules",
  });

  const onSubmit = async (data: z.infer<typeof ProjectSchema>) => {
    setPending(true);
    setError("");
    setSuccess("");
    try {
      const res = await addProject(data);

      if (res?.error) enqueueSnackbar(res.error, { variant: "error" });
      if (res.overlaps) setOverlappingSchedules(res.overlaps);

      if (res?.success) {
        reset();
        enqueueSnackbar(res.success, { variant: "success" });
      }
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
      <Stack sx={{ maxHeight: 350, overflowY: "auto", gap: 2 }}>
        <Typography variant="h6" sx={{ textTransform: "uppercase" }}>
          Assign Employees
        </Typography>

        {fields.map((field, index) => {
          const hasOverlap = overlappingSchedules.find(
            (sched) => sched.id === field.id
          );

          setValue(`schedules.${index}.id`, field.id);

          return (
            <Stack
              key={field.id}
              sx={{ color: hasOverlap ? "error.main" : "inherit" }}
            >
              <Stack
                direction="row"
                sx={{
                  gap: 2,
                  alignItems: "center",
                  color: hasOverlap ? "error.main" : "inherit",
                }}
                key={index}
              >
                <Typography
                  variant="h6"
                  sx={{ fontWeight: "bold", width: 30, textAlign: "center" }}
                >
                  {index + 1}
                </Typography>
                <Controller
                  control={control}
                  name={`schedules.${index}.userId`}
                  rules={{
                    required: "required field",
                  }}
                  render={({ field, fieldState: { error } }) => {
                    const { value, onChange, ref } = field;
                    return (
                      <Autocomplete
                        // defaultValue={options.find(
                        //   (option: any) =>
                        //     option[valueIdentifier] === defaultValueId
                        // )}
                        sx={{ width: 250 }}
                        getOptionLabel={(option) =>
                          `${option.profile?.fname} ${option.profile?.lname}`
                        }
                        options={employees}
                        value={
                          value
                            ? employees.find(
                                (option: any) => option.id === value
                              ) ?? null
                            : null
                        }
                        onChange={(event: any, newValue) => {
                          onChange(newValue ? newValue.id : null);
                        }}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label="Employee"
                            inputRef={ref}
                            helperText={error?.message}
                            error={!!error || !!hasOverlap}
                          />
                        )}
                      />
                    );
                  }}
                />
                <Controller
                  control={control}
                  name={`schedules.${index}.startDate`}
                  rules={{ required: true }}
                  render={({ field }) => {
                    return (
                      <DateTimePicker
                        minDate={dayjs(
                          new Date(
                            dayjs().year(),
                            dayjs().month(),
                            dayjs().date()
                          )
                        )}
                        slotProps={{
                          textField: {
                            error:
                              (!!errors.schedules &&
                                !!errors.schedules[index]?.startDate) ||
                              !!hasOverlap,
                            helperText:
                              !!errors.schedules &&
                              !!errors.schedules[index]?.startDate &&
                              errors.schedules[index]?.startDate?.message,
                          },
                        }}
                        label="Start Date"
                        format="MMM DD, YYYY hh:mm a"
                        value={dayjs(field.value)}
                        inputRef={field.ref}
                        onChange={(date) => {
                          field.onChange(date?.toDate());
                          trigger(`schedules.${index}.endDate`);
                          trigger(`schedules.${index}.startDate`);
                        }}
                      />
                    );
                  }}
                />
                <Controller
                  control={control}
                  name={`schedules.${index}.endDate`}
                  rules={{ required: true }}
                  render={({ field }) => {
                    return (
                      <DateTimePicker
                        minDate={dayjs(
                          new Date(
                            dayjs().year(),
                            dayjs().month(),
                            dayjs().date()
                          )
                        )}
                        slotProps={{
                          textField: {
                            error:
                              (!!errors.schedules &&
                                !!errors.schedules[index]?.endDate) ||
                              !!hasOverlap,
                            helperText:
                              !!errors.schedules &&
                              !!errors.schedules[index]?.endDate &&
                              errors.schedules[index]?.endDate?.message,
                          },
                        }}
                        label="End Date"
                        format="MMM DD, YYYY hh:mm a"
                        value={dayjs(field.value)}
                        inputRef={field.ref}
                        onChange={(date) => {
                          field.onChange(date?.toDate());
                          trigger(`schedules.${index}.endDate`);
                          trigger(`schedules.${index}.startDate`);
                        }}
                      />
                    );
                  }}
                />
                <TextField
                  label="Notes"
                  {...register(`schedules.${index}.notes` as const)}
                  error={
                    !!errors.schedules && !!errors.schedules[index]?.notes
                      ? true
                      : false
                  }
                  helperText={
                    !!errors.schedules &&
                    !!errors.schedules[index] &&
                    errors.schedules[index]!.notes?.message
                  }
                  disabled={isSubmitting}
                />
                <Button onClick={() => remove(index)}>
                  <DeleteOutlinedIcon color="error" />
                </Button>
                {/* {!!hasOverlap && (
                  <Tooltip title="This schedule overlaps with other schedule(s)">
                    <WarningIcon color="error" />
                  </Tooltip>
                )} */}
              </Stack>
              {hasOverlap && (
                <FormHelperText
                  sx={{
                    ml: 6,
                    color: "error.main",
                  }}
                >
                  This schedule overlaps with other schedule(s)
                </FormHelperText>
              )}
            </Stack>
          );
        })}
      </Stack>
      <Button
        onClick={() =>
          append({
            userId: "",
            notes: "",
            id: "",
            startDate: dayjs().toDate(),
            endDate: dayjs().add(8, "hour").toDate(),
          })
        }
        sx={{ bgcolor: "rgba(0,0,255,0.1)", fontSize: 14 }}
      >
        <AddOutlinedIcon /> Add Employee
      </Button>
      {error && <FormStatusText message={error} status="error" />}
      {success && <FormStatusText message={success} status="success" />}
      <Stack sx={{ flexDirection: "row", gap: 2, justifyContent: "flex-end" }}>
        <Button
          type="submit"
          variant="contained"
          disabled={isSubmitting}
          sx={{ p: 2, width: 150 }}
        >
          Add
        </Button>
      </Stack>
    </Stack>
  );
}
