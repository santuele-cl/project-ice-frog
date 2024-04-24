"use client";

import { Pagination } from "@mui/material";
import { ChangeEvent, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export default function ArchivedEmployeeTablePagination() {
  const searchParams = useSearchParams();
  const { replace } = useRouter();
  const pathname = usePathname();
  const params = new URLSearchParams(searchParams);
  const [page, setPage] = useState(1);

  const handleChange = (event: ChangeEvent<unknown>, value: number) => {
    params.set("page", value.toString());
    // setPage(value);
    replace(`${pathname}?${params.toString()}`);
  };

  return (
    <Pagination
      sx={{ justifyContent: "center", alignItems: "center" }}
      count={10}
      page={Number(searchParams.get("page")) || 1}
      onChange={handleChange}
      variant="outlined"
      shape="rounded"
      showFirstButton
      showLastButton
    />
  );
}
