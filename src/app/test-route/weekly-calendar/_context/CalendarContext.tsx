"use client";
import dayjs from "dayjs";
import { createContext, useState } from "react";

export const CalendarContext = createContext({});

export default function CalendarContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [week, setWeek] = useState(dayjs().week());

  return (
    <CalendarContext.Provider value={{ week, setWeek }}>
      {children}
    </CalendarContext.Provider>
  );
}
