import { SvgIcon, SvgIconProps } from "@mui/material";
import React from "react";

const SearchIcon = (props: SvgIconProps) => {
  return (
    <SvgIcon {...props} viewBox="0 0 24 24">
      <circle
        cx="11.7659"
        cy="11.7659"
        r="8.98856"
        fill="none"
        stroke="#5660B2"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M18.0176 18.4844L21.5416 21.9992"
        stroke="#5660B2"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </SvgIcon>
  );
};

export default SearchIcon;
