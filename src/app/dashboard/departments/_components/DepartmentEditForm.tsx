"use client";

import { Dispatch, SetStateAction, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import { editDepartment } from "@/actions/departments/department-action";
import { Department } from "@prisma/client";
import { enqueueSnackbar } from "notistack";
import { DepartmentSchema } from "@/app/_schemas/zod/schema";
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

export default function DepartmentEditForm({
  department,
  setShow,
}: {
  department: Department;
  setShow: Dispatch<SetStateAction<boolean>>;
}) {
  const [pending, setPending] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    resolver: zodResolver(DepartmentSchema),
    defaultValues: { name: department.name, head: department.head },
  });

  const onSubmit = async (data: z.infer<typeof DepartmentSchema>) => {
    setPending(true);
    if (department.head === data.head && department.name === data.name) {
      enqueueSnackbar("Nothing has changed", {
        variant: "warning",
      });
    } else {
      try {
        const res = await editDepartment({ id: department.id, data });
        if (res?.error) {
          enqueueSnackbar(res?.error, {
            variant: "error",
          });
        }
        if (res?.success) {
          setShow(false);
          enqueueSnackbar(res.success, {
            variant: "success",
          });
        }
      } catch (error) {
        enqueueSnackbar(JSON.stringify(error), {
          variant: "error",
        });
      } finally {
        setPending(false);
      }
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
        <Typography variant="h6">Edit Department</Typography>
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
          disabled={isSubmitting}
        />
        <TextField
          label="Department Head"
          {...register("head")}
          error={errors.head ? true : false}
          helperText={errors.head?.message}
          disabled={isSubmitting}
        />

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
