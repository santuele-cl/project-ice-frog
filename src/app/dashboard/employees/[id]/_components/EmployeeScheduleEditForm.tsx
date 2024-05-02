"use client";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { useParams } from "next/navigation";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import dayjs from "dayjs";

import {
  Autocomplete,
  Button,
  Divider,
  FormHelperText,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { DateTimePicker } from "@mui/x-date-pickers";

import { EditScheduleSchema } from "@/app/_schemas/zod/schema";
import { Project, Schedule } from "@prisma/client";

import { getProjects } from "@/actions/projects/projects-action";
import { editSchedule } from "@/actions/schedules/schedule-action";
import FormStatusText from "@/app/_ui/auth/FormStatusText";
import { enqueueSnackbar } from "notistack";

export default function EmployeeScheduleEditForm({
  schedule,
  setShow,
}: {
  schedule: Schedule;
  setShow: Dispatch<SetStateAction<boolean>>;
}) {
  const { endDate, startDate, projectId, userId, id } = schedule;
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
    setError: setFormError,
  } = useForm<z.infer<typeof EditScheduleSchema>>({
    resolver: zodResolver(EditScheduleSchema),
    defaultValues: {
      endDate,
      startDate,
      projectId,
    },
  });

  const onSubmit = async (data: z.infer<typeof EditScheduleSchema>) => {
    setPending(true);
    setError("");
    setSuccess("");

    try {
      const res = await editSchedule({ scheduleId: id, data: data });

      if (res?.error) {
        enqueueSnackbar(res.error, { variant: "error" });
        // setFormError("root", { type: "Custom", message: res.error });
      }
      if (res?.success) {
        // reset();
        enqueueSnackbar(res.success, { variant: "success" });
        // setShow(false);
        // setSuccess(res.success);
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
      const res = await getProjects({ page: 0 });
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
          Edit Schedule{" "}
          <Typography
            component="span"
            variant="h6"
            sx={{ fontWeight: 700 }}
            color="secondary"
          >
            {id}
          </Typography>
        </Typography>

        {/* <IconButton onClick={() => setShow(false)} color="error" size="small">
          <CloseOutlinedIcon fontSize="medium" />
        </IconButton> */}
      </Stack>

      <Divider sx={{ my: 2 }} />
      <Stack component="form" onSubmit={handleSubmit(onSubmit)} sx={{ gap: 2 }}>
        <Stack sx={{ maxHeight: 350, overflowY: "auto", gap: 2, p: 2 }}>
          <Stack direction="row" sx={{ gap: 2, alignItems: "center" }}>
            <Controller
              control={control}
              name={`projectId`}
              rules={{
                required: "required field",
              }}
              render={({ field, fieldState: { error } }) => {
                const { value, onChange, ref } = field;
                return (
                  <Autocomplete
                    sx={{ width: 250 }}
                    getOptionLabel={(option) => option.name}
                    options={projects}
                    value={
                      value
                        ? projects.find((option: any) => option.id === value) ??
                          null
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
              name={`startDate`}
              // rules={{ required: true }}
              render={({ field }) => {
                return (
                  <DateTimePicker
                    minDate={dayjs()}
                    slotProps={{
                      textField: {
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
                    label="Start Date"
                    format="MMM DD, YYYY hh:mm a"
                    value={dayjs(field.value)}
                    inputRef={field.ref}
                    onChange={(date) => {
                      field.onChange(date?.toDate());
                      trigger(`endDate`);
                      trigger(`startDate`);
                    }}
                  />
                );
              }}
            />
            <Controller
              control={control}
              name={`endDate`}
              rules={{ required: true }}
              render={({ field }) => {
                return (
                  <DateTimePicker
                    minDate={dayjs()}
                    slotProps={{
                      textField: {
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
                    label="End Date"
                    format="MMM DD, YYYY hh:mm a"
                    value={dayjs(field.value)}
                    inputRef={field.ref}
                    onChange={(date) => {
                      field.onChange(date?.toDate());
                      trigger(`endDate`);
                      trigger(`startDate`);
                    }}
                  />
                );
              }}
            />
            <Stack sx={{ flexDirection: "row", gap: 2, ml: "auto" }}>
              <Button
                variant="outlined"
                disabled={isSubmitting}
                onClick={() => setShow(false)}
                size="large"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                disabled={isSubmitting}
                size="large"
              >
                Update
              </Button>
            </Stack>
          </Stack>
        </Stack>

        {errors && errors.root && errors.root.message && (
          <FormStatusText message={errors.root.message} status="error" />
        )}

        {/* {success && <FormStatusText message={success} status="success" />} */}
      </Stack>
    </Paper>
  );
}
