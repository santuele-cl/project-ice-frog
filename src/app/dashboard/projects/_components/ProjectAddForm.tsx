"use client";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import {
  Autocomplete,
  Box,
  Button,
  Divider,
  FormHelperText,
  IconButton,
  Paper,
  Stack,
  TextField,
  Typography,
  formControlClasses,
} from "@mui/material";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import FormStatusText from "@/app/_ui/auth/FormStatusText";
import dayjs from "dayjs";
import { ProjectSchema } from "@/app/_schemas/zod/schema";
import { useParams } from "next/navigation";
import { Department, Prisma, Project, User } from "@prisma/client";
import { getDepartments } from "@/actions/departments/department";
import { addProject, getProjects } from "@/actions/projects/projects-action";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import { DateTimePicker } from "@mui/x-date-pickers";
import { addMultipleScheduleByEmployeeId } from "@/actions/schedules/schedule-action";
import { getEmployeeIds } from "@/actions/users/users-action";
import Grid2 from "@mui/material/Unstable_Grid2/Grid2";

type UserWithName = Prisma.UserGetPayload<{
  select: {
    id: true;
    profile: { select: { fname: true; lname: true } };
  };
}>;

export default function ProjectAddForm({
  setShow,
}: {
  setShow: Dispatch<SetStateAction<boolean>>;
}) {
  const params = useParams();
  console.log("params", params);
  const [pending, setPending] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    control,
  } = useForm<z.infer<typeof ProjectSchema>>({
    resolver: zodResolver(ProjectSchema),
    defaultValues: {
      name: "",
      jobOrder: "",
      location: "",
      notes: "",
      // startDate: undefined,
      // endDate: undefined,
      schedules: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "schedules",
  });

  console.log("project add form errors : ", errors);

  const onSubmit = async (data: z.infer<typeof ProjectSchema>) => {
    console.log("project add data", data);

    setPending(true);
    setError("");
    setSuccess("");
    try {
      const res = await addProject(data);

      if (res?.error) {
        reset();
        setError(res.error);
      }
      if (res?.success) {
        reset();
        setSuccess(res.success);
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
    <Paper sx={{ p: 3 }}>
      <Stack
        sx={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "flex-start",
        }}
      >
        <Typography variant="h6">New Project</Typography>
        {/* <IconButton onClick={() => setShow(false)} color="error" size="small">
          <CloseOutlinedIcon fontSize="medium" />
        </IconButton> */}
      </Stack>

      <Divider sx={{ my: 2 }} />
      <Stack component="form" onSubmit={handleSubmit(onSubmit)} sx={{ gap: 2 }}>
        <Typography variant="h6" sx={{ textTransform: "uppercase" }}>
          Project Details
        </Typography>
        <Grid2 container spacing={3} sx={{ maxWidth: 1290 }}>
          <Grid2 xs={12} sm={6}>
            <TextField
              label="Project Name"
              {...register("name")}
              error={errors.name ? true : false}
              helperText={errors.name?.message}
              disabled={pending}
              fullWidth
            />
          </Grid2>
          <Grid2 xs={12} sm={6}>
            <TextField
              label="Job Order"
              {...register("jobOrder")}
              error={errors.jobOrder ? true : false}
              helperText={errors.jobOrder?.message}
              disabled={pending}
              fullWidth
            />
          </Grid2>
          <Grid2 xs={12} sm={6}>
            <TextField
              label="Location"
              {...register("location")}
              error={errors.location ? true : false}
              helperText={errors.location?.message}
              disabled={pending}
              fullWidth
            />
          </Grid2>
          <Grid2 xs={12} sm={6}>
            <TextField
              label="Notes"
              {...register("notes")}
              error={errors.notes ? true : false}
              helperText={errors.notes?.message}
              disabled={pending}
              fullWidth
            />
          </Grid2>
          <Grid2 xs={12} sm={6}>
            <Controller
              control={control}
              name="startDate"
              // rules={{ required: true }}
              render={({ field }) => {
                return (
                  <DateTimePicker
                    slotProps={{
                      textField: {
                        fullWidth: true,

                        error: !!errors && !!errors.startDate,
                        helperText: (
                          <FormHelperText sx={{ margin: 0 }}>
                            {!!errors &&
                              !!errors.startDate &&
                              errors.startDate?.message}
                          </FormHelperText>
                        ),
                      },
                    }}
                    format="MMM DD, YYYY hh:mm a"
                    label="Projected Start Date"
                    value={field.value ? dayjs(field.value) ?? null : null}
                    inputRef={field.ref}
                    onChange={(date) => {
                      field.onChange(date?.toDate());
                    }}
                  />
                );
              }}
            />
          </Grid2>
          <Grid2 xs={12} sm={6}>
            <Controller
              control={control}
              name="endDate"
              // rules={{ required: true }}
              render={({ field }) => {
                return (
                  <DateTimePicker
                    // slotProps={{
                    //   textField: {
                    //     // size: "small",
                    //     fullWidth: true,
                    //   },
                    // }}
                    slotProps={{
                      textField: {
                        fullWidth: true,

                        error: !!errors && !!errors.endDate,
                        helperText: (
                          <FormHelperText sx={{ margin: 0 }}>
                            {!!errors &&
                              !!errors.endDate &&
                              errors.endDate?.message}
                          </FormHelperText>
                        ),
                      },
                    }}
                    label="Projected End Date"
                    format="MMM DD, YYYY hh:mm a"
                    value={field.value ? dayjs(field.value) ?? null : null}
                    inputRef={field.ref}
                    onChange={(date) => {
                      field.onChange(date?.toDate());
                    }}
                  />
                );
              }}
            />
          </Grid2>
        </Grid2>

        <Stack sx={{ maxHeight: 350, overflowY: "auto", gap: 2, p: 2 }}>
          <Typography variant="h6" sx={{ textTransform: "uppercase" }}>
            Assign Employees
          </Typography>

          {fields.map((field, index) => {
            return (
              <Stack
                direction="row"
                sx={{ gap: 2, alignItems: "center" }}
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
                            error={!!error}
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
                        slotProps={{
                          textField: {
                            error:
                              !!errors.schedules &&
                              !!errors.schedules[index]?.startDate,
                            helperText: (
                              <FormHelperText sx={{ margin: 0 }}>
                                {!!errors.schedules &&
                                  !!errors.schedules[index] &&
                                  errors.schedules[index]!.startDate?.message}
                              </FormHelperText>
                            ),
                          },
                        }}
                        label="Start Date"
                        format="MMM DD, YYYY hh:mm a"
                        value={dayjs(field.value)}
                        inputRef={field.ref}
                        onChange={(date) => {
                          field.onChange(date?.toDate());
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
                        slotProps={{
                          textField: {
                            error:
                              !!errors.schedules &&
                              !!errors.schedules[index]?.endDate,
                            helperText: (
                              <FormHelperText sx={{ margin: 0 }}>
                                {!!errors.schedules &&
                                  !!errors.schedules[index] &&
                                  errors.schedules[index]!.endDate?.message}
                              </FormHelperText>
                            ),
                          },
                        }}
                        label="End Date"
                        format="MMM DD, YYYY hh:mm a"
                        value={dayjs(field.value)}
                        inputRef={field.ref}
                        onChange={(date) => {
                          field.onChange(date?.toDate());
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
                {/* {index !== 0 && ( */}
                <Button onClick={() => remove(index)}>
                  <DeleteOutlinedIcon color="error" />
                </Button>
                {/* )} */}
              </Stack>
            );
          })}
        </Stack>
        <Button
          onClick={() =>
            append({
              userId: "",
              notes: "",
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
        <Stack
          sx={{ flexDirection: "row", gap: 2, justifyContent: "flex-end" }}
        >
          <Button
            variant="outlined"
            disabled={isSubmitting}
            sx={{ p: 2, width: 150 }}
            onClick={() => setShow(false)}
          >
            Close
          </Button>
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
    </Paper>
  );
}