"use client";

import { DepartmentSchema } from "@/app/_schemas/zod/schema";
import FormStatusText from "@/app/_ui/auth/FormStatusText";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Button,
  Divider,
  IconButton,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { Dispatch, SetStateAction, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import { addDepartment } from "@/actions/departments/department-action";

export default function DepartmentAddForm({
  setShow,
}: {
  setShow: Dispatch<SetStateAction<boolean>>;
}) {
  const [pending, setPending] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    resolver: zodResolver(DepartmentSchema),
    defaultValues: { name: "", head: "" },
  });

  const onSubmit = async (data: z.infer<typeof DepartmentSchema>) => {
    setPending(true);
    setError("");
    setSuccess("");
    try {
      const res = await addDepartment({ data });
      if (res?.error) {
        reset();
        setError(res.error);
      }
      if (res?.success) {
        reset();
        setSuccess(res.success);
      }
    } catch {
      setError("Something went asd wrong!");
    } finally {
      setPending(false);
    }
  };
  return (
    <Paper sx={{ p: 3, width: 450 }}>
      <Stack
        sx={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "flex-start",
        }}
      >
        <Typography variant="h6">New Department</Typography>
        <IconButton onClick={() => setShow(false)} color="error" size="small">
          <CloseOutlinedIcon fontSize="medium" />
        </IconButton>
      </Stack>

      <Divider sx={{ my: 2 }} />
      <Stack component="form" onSubmit={handleSubmit(onSubmit)} spacing={2}>
        <TextField
          label="Department Name"
          {...register("name")}
          error={errors.name ? true : false}
          helperText={errors.name?.message}
          // placeholder="123456"
          disabled={isSubmitting}
        />
        <TextField
          label="Department Head"
          {...register("head")}
          error={errors.head ? true : false}
          helperText={errors.head?.message}
          disabled={isSubmitting}
        />
        {error && <FormStatusText message={error} status="error" />}
        {success && <FormStatusText message={success} status="success" />}
        <Button
          variant="outlined"
          disabled={isSubmitting}
          sx={{ p: 2 }}
          onClick={() => setShow(false)}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          variant="contained"
          disabled={isSubmitting}
          sx={{ p: 2 }}
        >
          Add
        </Button>
      </Stack>
    </Paper>
  );
}
