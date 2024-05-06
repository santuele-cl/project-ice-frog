"use client";

import { Pagination } from "@mui/material";
import { ChangeEvent, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

type Props = {
  pagination: { totalCount: number; itemsPerPage: number; totalPages: number };
};

export default function EmployeeTablePagination({
  pagination: { totalCount, totalPages, itemsPerPage },
}: Props) {
  const searchParams = useSearchParams();
  const { replace } = useRouter();
  const pathname = usePathname();
  const params = new URLSearchParams(searchParams);

  const handleChange = (event: ChangeEvent<unknown>, value: number) => {
    params.set("page", value.toString());
    replace(`${pathname}?${params.toString()}`);
  };

  return (
    <Pagination
      sx={{ justifyContent: "center", alignItems: "center" }}
      count={totalPages}
      page={Number(searchParams.get("page")) || 1}
      onChange={handleChange}
      variant="outlined"
      shape="rounded"
      showFirstButton
      showLastButton
    />
  );
}
