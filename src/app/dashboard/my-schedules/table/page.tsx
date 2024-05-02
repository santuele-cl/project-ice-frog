import { Divider, Paper, Box, Typography, Stack } from "@mui/material";
import { auth } from "@/auth";
import MySchedulesTable from "./_component/MySchedulesTable";
import MySchedulesSearch from "./_component/MySchedulesSearch";
import MySchedulesTableHeader from "./_component/MySchedulesTableHeader";

export default async function MySchedulesTablePage({
  searchParams: { jobOrder, page, name, location },
}: {
  searchParams: {
    jobOrder: string;
    page: string;
    name: string;
    location: string;
  };
}) {
  const session = await auth();

  return (
    <Stack sx={{ gap: 2 }}>
      <Box>
        <Typography variant="h5">My Schedules</Typography>
      </Box>
      <Paper elevation={1} sx={{ p: 2 }}>
        <MySchedulesTableHeader>
          <MySchedulesSearch />
        </MySchedulesTableHeader>
        <Divider sx={{ my: 1 }} />
        <MySchedulesTable
          employeeId={session?.user.id!}
          name={name}
          page={Number(page)}
          location={location}
          jobOrder={jobOrder}
        />
      </Paper>
    </Stack>
  );
}
