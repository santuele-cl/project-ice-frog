import * as React from "react";
import Slider, { SliderProps } from "@mui/material/Slider";
import { alpha, styled } from "@mui/material/styles";
import {
  Button,
  ListItemButton,
  ListItemButtonProps,
  lighten,
} from "@mui/material";

export const NewListItemButton = styled(ListItemButton)<ListItemButtonProps>(
  ({ theme, selected }) => {
    return {
      transition: [
        theme.transitions.create(["background", "color"], {
          easing: theme.transitions.easing.easeIn,
          duration: "15ms",
        }),
      ],
      borderRadius: 0,
      "&:hover": {
        backgroundColor: "unset",
        color: "unset",
      },
      ...(selected && {
        "&.Mui-selected, &.Mui-selected:hover": {
          backgroundColor: lighten(theme.palette.secondary.main, 0.1),
          color: theme.palette.common.white,
        },
      }),
    };
  }
);
