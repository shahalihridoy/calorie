import { Card, SvgIconProps } from "@mui/material";
import { SxProps } from "@mui/material";
import React from "react";
import CustomBox from "./CustomBox";
import CustomFlexBox from "./CustomFlexBox";
import { H5 } from "./Typography";

interface FormCardProps {
  title: string;
  icon?: (props: SvgIconProps) => JSX.Element;
  sx?: SxProps;
  contentSx?: SxProps;
  headerSx?: SxProps;
}

const FormCard: React.FC<FormCardProps> = ({
  title,
  icon: Icon,
  sx,
  contentSx,
  headerSx,
  children,
}) => {
  return (
    <Card sx={sx}>
      <CustomFlexBox
        sx={{
          py: 2,
          px: 3,
          alignItems: "center",
          bgcolor: "primary.main",
          ...headerSx,
        }}
      >
        <H5 color="white" fontWeight={600} mr={1}>
          {title}
        </H5>
        {Icon && <Icon fontSize="small" sx={{ color: "background.paper" }} />}
      </CustomFlexBox>
      <CustomBox sx={{ padding: 3, ...contentSx }}>{children}</CustomBox>
    </Card>
  );
};

export default FormCard;
