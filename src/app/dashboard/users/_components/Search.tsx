"use client";
import { Stack, TextField } from "@mui/material";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import { useDebouncedCallback } from "use-debounce";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export default function Search() {
  const searchParams = useSearchParams();
  const { replace } = useRouter();
  const pathname = usePathname();
  const params = new URLSearchParams(searchParams);

  const handleSearch = useDebouncedCallback((term: string) => {
    params.set("page", "1");

    if (term) {
      params.set("query", term);
    } else {
      params.delete("query");
    }
    replace(`${pathname}?${params.toString()}`);
  }, 300);

  const handleEmailFilter = useDebouncedCallback((email: string) => {
    if (email) params.set("email", email);
    else params.delete("email");

    replace(`${pathname}?${params.toString()}`);
  }, 300);
  return (
    <Stack>
      <TextField
        fullWidth
        onChange={(e) => handleSearch(e.target.value)}
        defaultValue={searchParams.get("query")?.toString()}
        label="Name"
        InputProps={{ endAdornment: <SearchOutlinedIcon /> }}
        size="small"
      />
      <TextField
        fullWidth
        onChange={(e) => handleEmailFilter(e.target.value)}
        defaultValue={searchParams.get("query")?.toString()}
        label="Email"
        InputProps={{ endAdornment: <SearchOutlinedIcon /> }}
        size="small"
      />
      <TextField
        fullWidth
        onChange={(e) => handleSearch(e.target.value)}
        defaultValue={searchParams.get("query")?.toString()}
        label="Department"
        InputProps={{ endAdornment: <SearchOutlinedIcon /> }}
        size="small"
      />
      <TextField
        fullWidth
        onChange={(e) => handleSearch(e.target.value)}
        defaultValue={searchParams.get("query")?.toString()}
        label="Status"
        InputProps={{ endAdornment: <SearchOutlinedIcon /> }}
        size="small"
      />
      <TextField
        fullWidth
        onChange={(e) => handleSearch(e.target.value)}
        defaultValue={searchParams.get("query")?.toString()}
        label="Is Active"
        InputProps={{ endAdornment: <SearchOutlinedIcon /> }}
        size="small"
      />
    </Stack>
  );
}
