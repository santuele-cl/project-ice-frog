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
  Checkbox,
  Divider,
  FormControlLabel,
  FormHelperText,
  Paper,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { DateTimePicker } from "@mui/x-date-pickers";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";

import { RefinedMultipleScheduleSchema } from "@/app/_schemas/zod/schema";
import { Project, Schedule } from "@prisma/client";

import { getProjects } from "@/actions/projects/projects-action";
import { addMultipleScheduleByEmployeeId } from "@/actions/schedules/schedule-action";
import FormStatusText from "@/app/_ui/auth/FormStatusText";
import WarningIcon from "@mui/icons-material/Warning";

export default function EmployeeScheduleAddForm({
  setShow,
}: {
  setShow: Dispatch<SetStateAction<boolean>>;
}) {
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
    setError: setFormError,
    setValue,
  } = useForm<z.infer<typeof RefinedMultipleScheduleSchema>>({
    resolver: zodResolver(RefinedMultipleScheduleSchema),
    defaultValues: {
      schedules: [
        {
          projectId: "",
          userId: params.id as string,
          id: "",
          startDate: dayjs().toDate(),
          endDate: dayjs().add(8, "hour").toDate(),
          notes: "",
          isOvertime: false,
        },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "schedules",
  });

  const onSubmit = async (
    data: z.infer<typeof RefinedMultipleScheduleSchema>
  ) => {
    setPending(true);
    setError("");
    setSuccess("");
    setOverlappingSchedules([]);

    try {
      const res = await addMultipleScheduleByEmployeeId(
        params?.id as string,
        data
      );

      if (res?.error) {
        setFormError("root", { type: "Custom", message: res.error });
      }

      if (res?.overlaps) setOverlappingSchedules(res.overlaps);

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
          New Schedule for{" "}
          <Typography
            component="span"
            variant="h6"
            sx={{ fontWeight: 700 }}
            color="secondary"
          >
            Christia "Roy" Sarguet-Castro
          </Typography>
        </Typography>
      </Stack>

      <Divider sx={{ my: 2 }} />
      <Stack component="form" onSubmit={handleSubmit(onSubmit)} sx={{ gap: 2 }}>
        <Stack sx={{ maxHeight: 350, overflowY: "auto", gap: 2, p: 2 }}>
          {fields.map((field, index) => {
            const hasOverlap = overlappingSchedules.find(
              (sched) => sched.id === field.id
            );

            setValue(`schedules.${index}.id`, field.id);

            return (
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
                  name={`schedules.${index}.projectId`}
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
                <Controller
                  name={`schedules.${index}.isOvertime`}
                  control={control}
                  render={({ field }) => {
                    return (
                      <FormControlLabel
                        control={
                          <Checkbox
                            disableRipple
                            checked={field.value}
                            onChange={(e) => {
                              field.onChange(e.target.checked);
                            }}
                          />
                        }
                        label="OT"
                      />
                    );
                  }}
                />
                {fields.length > 1 && (
                  <Button onClick={() => remove(index)}>
                    <DeleteOutlinedIcon color="error" />
                  </Button>
                )}
                {!!hasOverlap && (
                  <Tooltip title="This schedule overlaps with another schedule">
                    <WarningIcon color="error" />
                  </Tooltip>
                )}
              </Stack>
            );
          })}
        </Stack>
        <Button
          onClick={() =>
            append({
              projectId: "",
              userId: params.id as string,
              notes: "",
              id: "",
              startDate: dayjs().toDate(),
              endDate: dayjs().add(8, "hour").toDate(),
              isOvertime: false,
            })
          }
          sx={{ bgcolor: "rgba(0,0,255,0.1)" }}
        >
          <AddOutlinedIcon />
        </Button>
        {errors &&
          errors.schedules &&
          errors.schedules.root &&
          errors.schedules.root.message && (
            <FormStatusText
              message={errors.schedules.root.message}
              status="error"
            />
          )}
        {errors && errors.root && errors.root.message && (
          <FormStatusText message={errors.root.message} status="error" />
        )}

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
