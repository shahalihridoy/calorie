import React, { FC, ReactNode } from "react";
import { SxProps } from "@mui/material";
import { styled } from "@mui/material/styles";
import { ListItem } from "@mui/material";

const StyledList = styled(ListItem)(() => ({
  padding: "14px 16px",
}));

interface Props {
  children: ReactNode;
  sx?: SxProps;
}
const CustomListItem: FC<Props> = (props) => {
  const { children, sx } = props;

  return <StyledList sx={sx}>{children}</StyledList>;
};

export default CustomListItem;
