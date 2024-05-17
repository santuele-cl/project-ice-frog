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
  const searchParams = useSearchParams();
  const { replace } = useRouter();
  const pathname = usePathname();
  const params = new URLSearchParams(searchParams);

  const week = Number(searchParams.get("week")) || dayjs().week();

  const handlePrev = () => {
    const newWeek = week - 1;
    params.set("week", newWeek.toString());
    replace(`${pathname}?${params.toString()}`);
  };
  const handleNext = () => {
    const newWeek = week + 1;
    params.set("week", newWeek.toString());
    replace(`${pathname}?${params.toString()}`);
  };

  const handleToday = () => {
    params.set("week", dayjs().week().toString());
    replace(`${pathname}?${params.toString()}`);
  };

  return (
    <ButtonGroup>
      <Button onClick={handlePrev}>Prev</Button>
      <Button onClick={handleToday}>Today</Button>
      <Button onClick={handleNext}>Next</Button>
    </ButtonGroup>
  );
}
