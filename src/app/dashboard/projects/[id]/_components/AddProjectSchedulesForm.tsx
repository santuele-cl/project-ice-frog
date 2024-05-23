"use client";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
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
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import FormStatusText from "@/app/_ui/auth/FormStatusText";
import dayjs from "dayjs";
import { RefinedMultipleScheduleSchema } from "@/app/_schemas/zod/schema";
import { useParams } from "next/navigation";
import { Prisma, Schedule } from "@prisma/client";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import { DateTimePicker } from "@mui/x-date-pickers";
import { addMultipleScheduleByProject } from "@/actions/schedules/schedule-action";
import { getEmployeeIds } from "@/actions/users/users-action";
import WarningIcon from "@mui/icons-material/Warning";

type UserWithName = Prisma.UserGetPayload<{
  select: {
    id: true;
    profile: { select: { fname: true; lname: true } };
  };
}>;

export default function AddProjectSchedulesForm({
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
    setValue,
  } = useForm<z.infer<typeof RefinedMultipleScheduleSchema>>({
    resolver: zodResolver(RefinedMultipleScheduleSchema),
    defaultValues: {
      schedules: [
        {
          projectId: params.id as string,
          userId: "",
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
      const res = await addMultipleScheduleByProject(data);
      console.log("res : ", res);
      if (res?.error) {
        setError(res.error);
        if (res.overlaps) setOverlappingSchedules(res.overlaps);
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
        <Typography variant="h6">
          <Typography
            component="span"
            variant="h6"
            sx={{ fontWeight: 700 }}
            color="secondary"
          >
            New Schedules
          </Typography>
        </Typography>
      </Stack>

      <Divider sx={{ my: 2 }} />
      <Stack component="form" onSubmit={handleSubmit(onSubmit)} sx={{ gap: 2 }}>
        <Stack
          sx={{
            maxHeight: 350,
            overflowY: "auto",
            gap: 2,
            p: 2,
          }}
        >
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
                      (!!errors.schedules &&
                        !!errors.schedules[index]?.notes) ||
                      !!hasOverlap
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
                          sx={{ ml: "3px" }}
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
                    <Button
                      onClick={() => remove(index)}
                      sx={{ color: "gray.main" }}
                    >
                      <DeleteOutlinedIcon color="inherit" />
                    </Button>
                  )}
                  {!!hasOverlap && (
                    <Tooltip title="This schedule overlaps with another schedule">
                      <WarningIcon color="error" />
                    </Tooltip>
                  )}

                  {/* {((errors.schedules &&
                    errors.schedules[index]?.root?.message?.startsWith(
                      "Schedule overlap"
                    )) ||
                    (hasOverlap && hasOverlap.length > 0)) && (
                    <Tooltip title="Overlapping schedule">
                      <WarningIcon color="error" />
                    </Tooltip>
                  )} */}
                </Stack>
                {/* {hasOverlap && (
                  <FormHelperText
                    sx={{
                      // margin: 0,
                      ml: 3,
                      color: "error.main",
                    }}
                  >
                    This schedule overlaps with other schedule(s)
                  </FormHelperText>
                )} */}
              </Stack>
            );
          })}
        </Stack>
        <Button
          onClick={() =>
            append({
              projectId: params.id as string,
              userId: "",
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
        {error && <FormStatusText message={error} status="error" />}
        {errors.root && errors.root.message && (
          <FormStatusText message={errors.root.message} status="error" />
        )}
        {errors.schedules &&
          errors.schedules.root &&
          errors.schedules?.root.message && (
            <FormStatusText
              message={errors.schedules.root.message}
              status="error"
            />
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
