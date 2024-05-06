"use client";
import {
  Button,
  ButtonGroup,
  Divider,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import dayjs from "dayjs";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useDebouncedCallback } from "use-debounce";

export default function DateButtons() {
  const [week, setWeek] = useState(dayjs().week());
  const searchParams = useSearchParams();
  const { replace } = useRouter();
  const pathname = usePathname();
  const params = new URLSearchParams(searchParams);

  useEffect(() => {
    params.set("week", week.toString());
    replace(`${pathname}?${params.toString()}`);
  }, [week]);

  return (
    <ButtonGroup>
      <Button onClick={() => setWeek((prev) => prev - 1)}>Prev</Button>
      <Button onClick={() => setWeek(dayjs().week())}>Today</Button>
      <Button onClick={() => setWeek((prev) => prev + 1)}>Next</Button>
    </ButtonGroup>
  );
}
