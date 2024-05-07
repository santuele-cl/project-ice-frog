import dayjs from "dayjs";
import { ScheduleSchema } from "../_schemas/zod/schema";
import { z } from "zod";

type ZodDateSchema = z.infer<typeof ScheduleSchema>;

export const EndDateMustBeGreaterThanStartDate = <T extends ZodDateSchema>(
  data: T
) => data.endDate > data.startDate;

export const CannotSetPastDateAsStartDateExcludeToday = <
  T extends ZodDateSchema
>(
  data: T
) => {
  return (
    data.startDate > new Date(dayjs().year(), dayjs().month(), dayjs().date())
  );
};
