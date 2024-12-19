import { Tab, Tabs } from "@mui/material";
import { useValueWithTimezone } from "@mui/x-date-pickers/internals/hooks/useValueWithTimezone";

const scheduleTabs = [
  { label: "Systems" },
  { label: "Customized" },
  { label: "Technology" },
];

export default function ScheduleTab() {
  return (
    <Tabs indicatorColor="primary" textColor="primary">
      {scheduleTabs.map((tab, i) => {
        const { label } = tab;
        return <Tab label={label} key={i} />;
      })}
    </Tabs>
  );
}
