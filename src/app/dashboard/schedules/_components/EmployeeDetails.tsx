"use client";
import { Profile } from "@prisma/client";
import { useState } from "react";

import {
  Avatar,
  Box,
  Divider,
  IconButton,
  Stack,
  SxProps,
  Typography,
} from "@mui/material";
import ExpandLessOutlinedIcon from "@mui/icons-material/ExpandLessOutlined";
import ExpandMoreOutlinedIcon from "@mui/icons-material/ExpandMoreOutlined";

type Props = {
  profile: Profile;
};

const SectionHeaderStyle: SxProps = {
  fontWeight: "bold",
};

export default function EmployeeDetails({ profile }: Props) {
  const [showDetails, setShowDetails] = useState(false);
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
              <Typography>{profile.occupation}</Typography>
              <Typography>{profile.contactNumber}</Typography>
              <Typography>{profile.departmentId}</Typography>
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
        <Stack sx={{ p: 2 }}>
          <Divider />
          <Typography>More details here...</Typography>
        </Stack>
      )}
    </Stack>
  );
}
