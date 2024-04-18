"use client";
import {
  Box,
  Breadcrumbs,
  Button,
  Stack,
  Typography,
  Link,
} from "@mui/material";
import NextLink from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const links = [
  { label: "Employee", path: "/dashboard/employees" },
  { label: "Create", path: "/dashboard/employees/create" },
];

export default function EmployeesLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const [breadcrumbs, setBreadcrumbs] = useState<
    {
      breadcrumb: string;
      href: string;
    }[]
  >([]);

  useEffect(() => {
    if (pathname) {
      const segments = pathname.split("/").slice(2);
      const pathArray = segments.map((path, i) => {
        return {
          breadcrumb: path,
          href: "/dashboard/" + segments.slice(0, i + 1).join("/"),
        };
      });
      setBreadcrumbs(pathArray);
    }
  }, [pathname]);

  return (
    <Stack sx={{ gap: 2 }}>
      <Breadcrumbs aria-label="breadcrumb">
        {breadcrumbs.map((item, i) => {
          const { breadcrumb, href } = item;
          return (
            <Link
              href={href}
              key={href + i}
              component={NextLink}
              underline={href === pathname ? "always" : "hover"}
              color={href === pathname ? "primary" : "common.black"}
              sx={{ textTransform: "capitalize", fontSize: "1rem" }}
            >
              {breadcrumb}
            </Link>
          );
        })}
      </Breadcrumbs>

      <Box>{children}</Box>
    </Stack>
  );
}
