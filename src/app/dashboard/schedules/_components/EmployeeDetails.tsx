"use client";
import { Prisma, Profile, User } from "@prisma/client";
import { useState } from "react";

import {
  Avatar,
  Box,
  Divider,
  Grid,
  IconButton,
  Paper,
  Stack,
  SxProps,
  Typography,
} from "@mui/material";
import ExpandLessOutlinedIcon from "@mui/icons-material/ExpandLessOutlined";
import ExpandMoreOutlinedIcon from "@mui/icons-material/ExpandMoreOutlined";
import dayjs from "dayjs";
import AssignmentOutlinedIcon from "@mui/icons-material/AssignmentOutlined";
import Grid2 from "@mui/material/Unstable_Grid2/Grid2";

type UserWithProfile = Prisma.UserGetPayload<{
  select: {
    id: true;
    role: true;
    email: true;
    isActive: true;
    emailVerified: true;
    createdAt: true;
    profile: { include: { department: true } };
    schedules: { include: { project: true } };
  };
}>;

type Props = {
  details: UserWithProfile;
};

const SectionHeaderStyle: SxProps = {
  fontWeight: "bold",
};

export default function EmployeeDetails({ details }: Props) {
  const [showDetails, setShowDetails] = useState(false);

  const {
    email,
    profile,
    role,
    createdAt,
    emailVerified,
    id,
    isActive,
    schedules,
  } = details;
  return (
    <Stack>
      <Stack sx={{ flexDirection: "row", gap: 2 }}>
        <Stack sx={{ flexDirection: "row" }}>
          <Avatar
            alt={`${profile?.fname} ${profile?.lname} avatar`}
            sx={{
              bgcolor: "secondary.main",
              fontSize: 30,
              height: 70,
              width: 70,
            }}
          >
            {`${profile?.fname[0]}${profile?.lname[0]}`}
          </Avatar>
        </Stack>
        <Stack
          sx={{ flexDirection: "row", flex: "1 1", alignItems: "flex-end" }}
        >
          <Stack>
            <Stack sx={{ flexDirection: "row", gap: 1 }}>
              <Typography component="span" variant="h5" sx={SectionHeaderStyle}>
                {profile?.fname}
              </Typography>
              <Typography component="span" variant="h5" sx={SectionHeaderStyle}>
                {profile?.lname}
              </Typography>
            </Stack>
            <Stack sx={{ flexDirection: "row", gap: 1 }}>
              <Typography>{profile?.occupation}</Typography>
              <Typography>{" | " + profile?.contactNumber}</Typography>
              <Typography>{" | " + profile?.departmentId}</Typography>
            </Stack>
          </Stack>
          <Box sx={{ ml: "auto" }}>
            <IconButton
              onClick={() => setShowDetails((prevState) => !prevState)}
            >
              {showDetails ? (
                <ExpandLessOutlinedIcon />
              ) : (
                <ExpandMoreOutlinedIcon />
              )}
            </IconButton>
          </Box>
        </Stack>
      </Stack>

      {showDetails && (
        <Stack sx={{ my: 2 }}>
          <Divider />

          <Stack sx={{ p: 2 }}>
            <Grid2 container spacing={2}>
              <Grid2 xs={6}>
                <Typography>
                  <b>Gender: </b>
                  {" " +
                    (profile?.gender
                      ? profile.gender.charAt(0).toUpperCase() +
                        profile.gender.slice(1).toLowerCase()
                      : "")}
                </Typography>
                <Typography>
                  <b>Birthday:</b>
                  {" " +
                    (profile?.bdate
                      ? profile.bdate
                          .toLocaleDateString("en-US", {
                            month: "long",
                            day: "numeric",
                            year: "numeric",
                          })
                          .replace(/\d{1,2}\s/, (match) => match.trim() + ", ")
                      : "")}
                </Typography>
                <Typography>
                  <b>Email:</b>
                  {" " + details.email}
                </Typography>
              </Grid2>
              <Grid2 xs={6}>
                <Typography>
                  <b>Department: </b>
                  {" " +
                    (profile?.department?.name
                      ? profile.department.name.charAt(0).toUpperCase() +
                        profile.department.name.slice(1).toLowerCase()
                      : "")}
                </Typography>
                <Typography>
                  <b>Role:</b>
                  {" " +
                    (details?.role
                      ? details.role.charAt(0).toUpperCase() +
                        details.role.slice(1).toLowerCase()
                      : "")}
                </Typography>
              </Grid2>
            </Grid2>
          </Stack>
        </Stack>
      )}
    </Stack>
  );
}
