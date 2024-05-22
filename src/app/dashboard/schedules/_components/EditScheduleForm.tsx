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
  Tooltip,
  Typography,
} from "@mui/material";
import { TimePicker } from "@mui/x-date-pickers";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";

import { EditScheduleSchema } from "@/app/_schemas/zod/schema";
import { Project, Schedule } from "@prisma/client";

import { getProjects } from "@/actions/projects/projects-action";
import {
  addMultipleScheduleByEmployeeId,
  addSchedule,
  editSchedule,
} from "@/actions/schedules/schedule-action";
import FormStatusText from "@/app/_ui/auth/FormStatusText";
import WarningIcon from "@mui/icons-material/Warning";
import { enqueueSnackbar } from "notistack";
import { getClientError } from "@/app/_utils/getClientError";

export default function EditScheduleForm({
  setOpen,
  schedule,
  name,
}: {
  name: string;
  schedule: Schedule;
  setOpen: Dispatch<SetStateAction<boolean>>;
}) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    control,
    trigger,
    setError: setFormError,
    setValue,
  } = useForm<z.infer<typeof EditScheduleSchema>>({
    resolver: zodResolver(EditScheduleSchema),
    defaultValues: {
      userId: schedule.userId,
      startDate: schedule.startDate,
      endDate: schedule.endDate,
      projectId: schedule.projectId,
      notes: schedule.notes ?? "",
    },
  });

  const onSubmit = async (data: z.infer<typeof EditScheduleSchema>) => {
    const hasNoChanges =
      data.endDate === schedule.endDate &&
      data.startDate === schedule.startDate &&
      // data.notes === schedule.notes &&
      data.projectId === schedule.id;

    console.log("sched : ", schedule);
    console.log("data : ", data);

    if (!hasNoChanges) {
      try {
        const res = await editSchedule({ scheduleId: schedule.id, data });

        if (res?.error) {
          enqueueSnackbar(res?.error, {
            variant: "error",
          });
        }

        if (res?.success) {
          reset();
          setOpen(false);
          enqueueSnackbar(res.success, {
            variant: "success",
          });
        }
      } catch (error) {
        enqueueSnackbar(getClientError(error), {
          variant: "error",
        });
      }
    } else {
      enqueueSnackbar("No changes made", {
        variant: "info",
      });
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
    <Stack
      component="form"
      onSubmit={handleSubmit(onSubmit)}
      sx={{ gap: 2, pt: 1 }}
    >
      <TextField
        value={name}
        InputProps={{ readOnly: true, disabled: true }}
        label="Name"
        size="small"
      />
      <Controller
        control={control}
        name="projectId"
        rules={{
          required: "required field",
        }}
        render={({ field, fieldState: { error } }) => {
          const { value, onChange, ref } = field;
          return (
            <Autocomplete
              getOptionLabel={(option) => option.name}
              options={projects}
              value={
                value
                  ? projects.find((option: any) => option.id === value) ?? null
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
                  size="small"
                />
              )}
            />
          );
        }}
      />
      <Stack sx={{ flexDirection: "row", gap: 1, alignItems: "center" }}>
        <Controller
          control={control}
          name="startDate"
          rules={{ required: true }}
          render={({ field }) => {
            return (
              <TimePicker
                sx={{
                  width: 170,
                  "& .MuiSvgIcon-root": {
                    fontSize: "20px",
                  },
                }}
                slotProps={{
                  textField: {
                    size: "small",
                    error: !!errors && !!errors.startDate,
                    helperText: (
                      <FormHelperText sx={{ margin: 0 }}>
                        {!!errors && errors.startDate?.message}
                      </FormHelperText>
                    ),
                  },
                  openPickerButton: { size: "small" },
                }}
                label="Start Time"
                format="hh:mm a"
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
          name="endDate"
          render={({ field }) => {
            return (
              <TimePicker
                sx={{
                  width: 170,
                  "& .MuiSvgIcon-root": {
                    fontSize: "20px",
                  },
                }}
                slotProps={{
                  textField: {
                    size: "small",
                    error: !!errors && !!errors.endDate,
                    helperText: (
                      <FormHelperText sx={{ margin: 0 }}>
                        {!!errors &&
                          !!errors.endDate &&
                          errors.endDate?.message}
                      </FormHelperText>
                    ),
                  },
                  openPickerButton: { size: "small" },
                }}
                label="End Time"
                format="hh:mm a"
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
      </Stack>

      <TextField
        label="Notes"
        {...register("notes")}
        error={!!errors && !!errors?.notes ? true : false}
        helperText={!!errors && !!errors.notes && errors.notes?.message}
        disabled={isSubmitting}
        size="small"
      />
      <Stack sx={{ flexDirection: "row", gap: 2, justifyContent: "flex-end" }}>
        <Button
          disabled={isSubmitting}
          color="error"
          onClick={() => setOpen(false)}
        >
          Close
        </Button>
        <Button type="submit" disabled={isSubmitting} color="success">
          Save
        </Button>
      </Stack>
    </Stack>
  );
}