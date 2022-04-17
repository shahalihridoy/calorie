import { styled } from "@mui/material/styles";
import LinearProgress, {
  linearProgressClasses,
} from "@mui/material/LinearProgress";
import { FC } from "react";

interface Props {
  width?: number | string;
  height: number | string;
  borderRadius?: number | string;
  progressColor: string;
  progressValue: number;
}
const CustomProgress: FC<Props> = (props) => {
  const { height, width, borderRadius, progressColor, progressValue } = props;

  const BorderLinearProgress = styled(LinearProgress)(({ theme }) => ({
    height: height,
    borderRadius: borderRadius || 5,
    [`&.${linearProgressClasses.colorPrimary}`]: {
      backgroundColor:
        theme.palette.grey[theme.palette.mode === "light" ? 200 : 800],
    },
    [`& .${linearProgressClasses.bar}`]: {
      borderRadius: 5,
      backgroundColor:
        theme.palette.mode === "light" ? progressColor : "#308fe8",
    },
  }));

  return (
    <BorderLinearProgress
      sx={{ width: width || "100%" }}
      variant="determinate"
      value={progressValue}
    />
  );
};

export default CustomProgress;
