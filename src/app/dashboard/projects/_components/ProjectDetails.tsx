"use client";
import { Profile, Project } from "@prisma/client";
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
type Props = {
  details: Project;
};

const SectionHeaderStyle: SxProps = {
  fontWeight: "bold",
};

export default function ProjectDetails({ details }: Props) {
  const [showDetails, setShowDetails] = useState(false);

  const {
    id,
    jobOrder,
    building,
    street,
    barangay,
    city,
    name,
    notes,
    createdAt,
    updatedAt,
    startDate,
    endDate,
  } = details;
  return (
    <Stack>
      <Stack sx={{ flexDirection: "row", gap: 2 }}>
        <Stack
          sx={{
            flexDirection: "row",
            flex: "1 1",
            alignItems: "center",
            gap: 2,
          }}
        >
          <AssignmentOutlinedIcon />

          <Stack>
            <Stack sx={{ flexDirection: "row", gap: 1 }}>
              <Typography component="span" variant="h5" sx={SectionHeaderStyle}>
                {name}
              </Typography>
              <Typography component="span" variant="h5" sx={SectionHeaderStyle}>
                {jobOrder}
              </Typography>
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
          <Grid2 container spacing={2}>
            <Grid2 xs={6}>
              <Typography>
                <b>Project Name: </b>
                {name}
              </Typography>
              <Typography>
                <b>Start Date:</b>{" "}
                {dayjs(startDate).format("MMM DD, YYYY hh:mm a")}
              </Typography>
              <Typography>
                <b>Date Created:</b>{" "}
                {dayjs(createdAt).format("MMM DD, YYYY hh:mm a")}
              </Typography>
            </Grid2>

            <Grid2 xs={6}>
              <Typography>
                <b>Location: </b>
                {`${building} ${street} ${barangay}, ${city}`}
              </Typography>
              <Typography>
                <b>End Date:</b> {dayjs(endDate).format("MMM DD, YYYY hh:mm a")}
              </Typography>
              <Typography>
                <b>Date Updated:</b>{" "}
                {dayjs(updatedAt).format("MMM DD, YYYY hh:mm a")}
              </Typography>
            </Grid2>
          </Grid2>
        </Stack>
      )}
    </Stack>
  );
}
