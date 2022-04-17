import CustomBox from "@components/atoms/CustomBox";
import CustomFlexBox from "@components/atoms/CustomFlexBox";
import { H4, Paragraph } from "@components/atoms/Typography";
import TrendingDown from "@mui/icons-material/TrendingDown";
import TrendingUp from "@mui/icons-material/TrendingUp";
import React, { FC } from "react";

interface ReportCardProps {
  count: number;
  title: string;
  bgcolor?: string;
  hasIncreased?: boolean;
}

const ReportCard: FC<ReportCardProps> = ({
  title,
  hasIncreased,
  count,
  bgcolor,
}) => {
  return (
    <CustomFlexBox
      sx={{
        maxWidth: 250,
        width: "100%",
        padding: "10px 12px",
        borderRadius: "8px",
        bgcolor,
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <CustomBox sx={{ color: "grey.100" }}>
        <Paragraph fontSize="11px">{title}</Paragraph>
        <H4 mt="4px" fontSize="18px" fontWeight={600}>
          {count}
        </H4>
      </CustomBox>
      {hasIncreased !== undefined &&
        (hasIncreased ? (
          <TrendingUp sx={{ color: "grey.100" }} />
        ) : (
          <TrendingDown sx={{ color: "grey.100" }} />
        ))}
    </CustomFlexBox>
  );
};

export default ReportCard;
