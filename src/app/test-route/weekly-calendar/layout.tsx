import CalendarContextProvider from "./_context/CalendarContext";

export default function CalendarLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <CalendarContextProvider>{children}</CalendarContextProvider>;
}
