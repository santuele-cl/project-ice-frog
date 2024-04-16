import { Divider, Paper } from "@mui/material";
import EmployeeSchedulesTable from "../../employees/[id]/_components/EmployeeSchedulesTable";
import { Suspense } from "react";
import TableSkeleton from "@/app/_ui/TableSkeleton";
import EmployeeScheduleTableHeader from "../../employees/[id]/_components/EmployeeScheduleTableHeader";
import EmployeeSearch from "../../employees/_components/EmployeeSearch";
import EmployeeAdd from "../../employees/_components/EmployeeAdd";
import EmployeeScheduleSearch from "../../employees/[id]/_components/EmployeeScheduleSearch";
import EmployeeScheduleAddFormModal from "../../employees/[id]/_components/EmployeeScheduleAddFormModal";

export default function page({
  params: { employeeId },
}: {
  params: { employeeId: string };
}) {
  return (
    <Paper elevation={1} sx={{ p: 2 }}>
      <EmployeeScheduleTableHeader>
        <EmployeeScheduleSearch />
        <EmployeeScheduleAddFormModal />
      </EmployeeScheduleTableHeader>
      <Divider sx={{ my: 1 }} />
      <Suspense fallback={<TableSkeleton />}>
        <EmployeeSchedulesTable employeeId={employeeId} />
      </Suspense>

      {/* <Divider sx={{ my: 1 }} />
      <EmployeeTablePagination /> */}
    </Paper>
  );
}
