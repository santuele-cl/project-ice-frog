import dayjs from "dayjs";
import weekOfTheYear from "dayjs/plugin/weekOfYear";

dayjs.extend(weekOfTheYear);

// interface GetWeekParamsType {
//   week?: number;
// }

export function getWeek(week = dayjs().week()) {
  //   console.log("default week (current week) : ", week);

  const year = dayjs().year();
  const date = dayjs().year(year).week(week).day(0);
  const month = date.month();

  const weekDates = new Array(7).fill(null).map((_, i) => {
    return dayjs().year(year).month(month).week(week).day(i);
  });

  console.log(
    "year : ",
    year,
    " month : ",
    month,
    " week : ",
    week,
    " start date: ",
    date.format("MMMM DD, YYYY"),
    " dates : ",
    weekDates
  );

  return weekDates;
}
