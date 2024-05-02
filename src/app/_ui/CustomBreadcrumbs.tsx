"use client";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import NextLink from "next/link";

import { Breadcrumbs, Link } from "@mui/material";

export default function CustomBreadcrumbs() {
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
    <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 2 }}>
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
  );
}
