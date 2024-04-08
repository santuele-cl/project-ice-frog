"use client";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import {
  Autocomplete,
  Box,
  Button,
  Divider,
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
import { SchedulesSchema } from "@/app/_schemas/zod/schema";
import { useParams } from "next/navigation";
import { Department, Project } from "@prisma/client";
import { getDepartments } from "@/actions/departments/department";
import { getProjects } from "@/actions/projects/projects-action";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import { DateTimePicker } from "@mui/x-date-pickers";
import { addMultipleScheduleByEmployeeId } from "@/actions/schedules/schedule-action";

export default function EmployeeScheduleAddForm({
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
  } = useForm<z.infer<typeof SchedulesSchema>>({
    resolver: zodResolver(SchedulesSchema),
    defaultValues: {
      projects: [
        {
          projectId: "",
          // userId: "",
          startDate: dayjs().toDate(),
          endDate: dayjs().add(8, "hour").toDate(),
          notes: "",
        },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "projects",
  });

  console.log("form erros : ", errors);

  const onSubmit = async (data: z.infer<typeof SchedulesSchema>) => {
    // console.log("data", data);
    // const res = await addMultipleScheduleByEmployeeId(
    //   params?.employeeId as string,
    //   data
    // );
    // console.log(res);

    setPending(true);
    setError("");
    setSuccess("");
    try {
      const res = await addMultipleScheduleByEmployeeId(
        params?.employeeId as string,
        data
      );

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

  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    async function fetchProjects() {
      const res = await getProjects();
      if (res?.data) setProjects(res.data);
    }
    fetchProjects();
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
        <Typography variant="h6">
          New Schedule for{" "}
          <Typography
            component="span"
            variant="h6"
            sx={{ fontWeight: 700 }}
            color="secondary"
          >
            Roy Castro
          </Typography>
        </Typography>
        {/* <IconButton onClick={() => setShow(false)} color="error" size="small">
          <CloseOutlinedIcon fontSize="medium" />
        </IconButton> */}
      </Stack>

      <Divider sx={{ my: 2 }} />
      <Stack component="form" onSubmit={handleSubmit(onSubmit)} sx={{ gap: 2 }}>
        <Stack sx={{ maxHeight: 350, overflowY: "auto", gap: 2, p: 2 }}>
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
                  name={`projects.${index}.projectId`}
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
                        getOptionLabel={(option) => option.name}
                        options={projects}
                        value={
                          value
                            ? projects.find(
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
                            label="Project"
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
                  name={`projects.${index}.startDate`}
                  rules={{ required: true }}
                  render={({ field }) => {
                    return (
                      <DateTimePicker
                        slotProps={{
                          textField: {
                            // size: "small",
                            // fullWidth: true,
                          },
                        }}
                        label="Start Date"
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
                  name={`projects.${index}.endDate`}
                  rules={{ required: true }}
                  render={({ field }) => {
                    return (
                      <DateTimePicker
                        slotProps={{
                          textField: {
                            // size: "small",
                            // fullWidth: true,
                          },
                        }}
                        label="End Date"
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
                  {...register(`projects.${index}.notes` as const)}
                  error={
                    !!errors.projects && !!errors.projects[index]?.notes
                      ? true
                      : false
                  }
                  helperText={
                    !!errors.projects &&
                    !!errors.projects[index] &&
                    errors.projects[index]!.notes?.message
                  }
                  disabled={isSubmitting}
                />
                {index !== 0 && (
                  <Button onClick={() => remove(index)}>
                    <DeleteOutlinedIcon color="error" />
                  </Button>
                )}
              </Stack>
            );
          })}
        </Stack>
        <Button
          onClick={() =>
            append({
              projectId: "",
              // userId: params.employeeId as string,
              notes: "",
              startDate: dayjs().toDate(),
              endDate: dayjs().add(8, "hour").toDate(),
            })
          }
          sx={{ bgcolor: "rgba(0,0,255,0.1)" }}
        >
          <AddOutlinedIcon />
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
