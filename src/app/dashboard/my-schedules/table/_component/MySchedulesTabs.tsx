"use client";
import { Tab, Tabs } from "@mui/material";
import { usePathname, useRouter } from "next/navigation";

export default function MySchedulesTabs() {
  const pathname = usePathname();
  const router = useRouter();
  return (
    <Tabs
      value={pathname}
      onChange={(_e, newValue) => router.push(newValue)}
      textColor="secondary"
      indicatorColor="secondary"
      aria-label="secondary tabs example"
      sx={{ bgcolor: "white", borderRadius: 1 }}
      
    >
      <Tab value="/dashboard/my-schedules/table" label="Table" />
      <Tab value="/dashboard/my-schedules/calendar" label="Calendar" />
    </Tabs>
  );
}
