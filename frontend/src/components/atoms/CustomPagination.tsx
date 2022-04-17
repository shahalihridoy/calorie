import React from "react";
import { Pagination } from "@mui/material";
import { styled } from "@mui/material/styles";
import { PaginationProps } from "@mui/material";

const CustomPagination = styled(Pagination)<PaginationProps>(({}) => ({
  "& li": {
    "& button": {
      border: "none",
    },
    "&:first-child, &:last-child": {
      "& button": {
        border: "1px solid rgba(0, 0, 0, 0.23)",
      },
    },
  },
}));

export default CustomPagination;
