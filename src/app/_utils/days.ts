import dayjs from "dayjs";
import weekOfTheYear from "dayjs/plugin/weekOfYear";

dayjs.extend(weekOfTheYear);

export function getMonth(month = dayjs().month()) {
  month = Math.floor(month);
  const year = dayjs().year();
  const firstDayOfTheMonth = dayjs(new Date(year, month, 1)).day();
  let currentMonthCount = 0 - firstDayOfTheMonth;
  const daysMatrix = new Array(5).fill([]).map(() => {
    return new Array(7).fill(null).map(() => {
      currentMonthCount++;
      return dayjs(new Date(year, month, currentMonthCount));
    });
  });
  return daysMatrix;
}

export function getWeek(week = dayjs().week()) {
  const year = dayjs().year();
  const date = dayjs().year(year).week(week).day(0);
  const month = date.month();

  const weekDates = new Array(7).fill(null).map((_, i) => {
    return dayjs().year(year).month(month).week(week).day(i);
  });

  return weekDates;
}

interface GetEmployeeWeekParamsType {
  week: number;
  employee: string;
}

export function getEmployeeWeek({
  week = dayjs().week(),
  employee,
}: GetEmployeeWeekParamsType) {
  const year = dayjs().year();
  const date = dayjs().year(year).week(week).day(0);
  const month = date.month();

  const weekDates = new Array(8).fill(null).map((_, i) => {
    return i === 0
      ? employee
      : dayjs().year(year).month(month).week(week).day(i);
  });

  return weekDates;
}
