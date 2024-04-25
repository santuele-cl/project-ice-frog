import { TextField } from "@mui/material";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";

export default function EmployeeSearchByEmail() {
  const searchParams = useSearchParams();
  const { replace } = useRouter();
  const pathname = usePathname();

  const handleEmailFilter = useDebouncedCallback((email: string) => {
    const params = new URLSearchParams(searchParams);

    if (email) params.set("email", email);
    else params.delete("email");

    replace(`${pathname}?${params.toString()}`);
  }, 300);

  return (
    <TextField
      onChange={(e) => handleEmailFilter(e.target.value)}
      defaultValue={searchParams.get("email")?.toString()}
      label="Email"
    />
  );
}
