import { ScheduleSchema } from "@/app/_schemas/zod/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Button,
  Divider,
  IconButton,
  MenuItem,
  Modal,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useForm } from "react-hook-form";
import { z } from "zod";

export default function AddMultipleScheduleForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    control,
  } = useForm<z.infer<typeof ScheduleSchema>>({
    resolver: zodResolver(ScheduleSchema),
    defaultValues: {
      projectId: "",
      userId: "",
      notes: "",
      startDate: new Date(),
      endDate: new Date(),
    },
  });

  const onSubmit = async (data: z.infer<typeof ScheduleSchema>) => {
    // console.log(data)
    // setPending(true);
    // setError("");
    // setSuccess("");
    // try {
    //   const res = await createAppointment(data);
    //   //   console.log("res", res);
    //   if (res?.error) {
    //     reset();
    //     setError(res.error);
    //   }
    //   if (res?.success) {
    //     reset();
    //     setSuccess(res.success);
    //     setSelectStartDate(dayjs()), setSelectEndDate(dayjs());
    //   }
    // } catch {
    //   setError("Something went asd wrong!");
    // } finally {
    //   setPending(false);
    // }
  };

  return (
    <Stack
      component="form"
      spacing={2}
      sx={{ p: 2 }}
      onSubmit={handleSubmit(onSubmit)}
    >
      <Stack sx={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
        <PersonOutlinedIcon sx={{ color: "rgba(0,0,0,0.3)" }} />
        <TextField
          placeholder="Title"
          sx={{ flex: "1" }}
          size="small"
          {...register("title")}
          error={errors.title ? true : false}
          helperText={errors.title?.message}
          disabled={pending}
        />
      </Stack>
      <Stack sx={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
        <PersonOutlinedIcon sx={{ color: "rgba(0,0,0,0.3)" }} />
        <TextField
          placeholder="patient id or email"
          sx={{ flex: "1" }}
          size="small"
          {...register("patientId")}
          error={errors.patientId ? true : false}
          helperText={errors.patientId?.message}
          disabled={pending}
        />
      </Stack>
      <Stack sx={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
        <AssignmentIndOutlinedIcon sx={{ color: "rgba(0,0,0,0.3)" }} />
        <TextField
          placeholder="Physician id or email"
          sx={{ flex: "1" }}
          size="small"
          {...register("employeeId")}
          error={errors.employeeId ? true : false}
          helperText={errors.employeeId?.message}
          disabled={pending}
        />
      </Stack>
      <Stack sx={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
        <AutorenewOutlinedIcon sx={{ color: "rgba(0,0,0,0.3)" }} />
        <TextField
          select
          fullWidth
          label="Select"
          {...register("status")}
          error={errors.status ? true : false}
          helperText={errors.status?.message}
          disabled={pending}
        >
          {AppointmentStatusOption.map((option) => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          ))}
        </TextField>
      </Stack>
      <Stack sx={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
        <BadgeOutlinedIcon sx={{ color: "rgba(0,0,0,0.3)" }} />
        <TextField
          placeholder="room number"
          sx={{ flex: "1" }}
          {...register("room")}
          error={errors.room ? true : false}
          helperText={errors.room?.message}
          disabled={pending}
          size="small"
        />
      </Stack>
      <Stack sx={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
        <AccessTimeOutlinedIcon sx={{ color: "rgba(0,0,0,0.3)" }} />

        <Controller
          control={control}
          name="startDate"
          rules={{ required: true }}
          render={({ field }) => {
            return (
              <DateTimePicker
                slotProps={{
                  textField: {
                    size: "small",
                    fullWidth: true,
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
      </Stack>
      <Stack sx={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
        <AccessTimeOutlinedIcon
          sx={{ color: "rgba(0,0,0,0.3)", opacity: "0" }}
        />

        <Controller
          control={control}
          name="endDate"
          rules={{ required: true }}
          render={({ field }) => {
            return (
              <DateTimePicker
                slotProps={{
                  textField: {
                    size: "small",
                    fullWidth: true,
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
      </Stack>
      <Stack sx={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
        <DescriptionOutlinedIcon sx={{ color: "rgba(0,0,0,0.3)" }} />
        <TextField
          multiline
          label="Reason for appointment"
          variant="standard"
          sx={{ flex: "1" }}
          {...register("reason")}
          error={errors.reason ? true : false}
          helperText={errors.reason?.message}
          disabled={pending}
          size="small"
        />
      </Stack>
      <Stack>
        <Button
          type="submit"
          variant="contained"
          disabled={pending}
          sx={{ marginLeft: "auto" }}
        >
          Create
        </Button>
      </Stack>
    </Stack>
  );
}
