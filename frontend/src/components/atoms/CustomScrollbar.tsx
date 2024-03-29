import { SxProps } from "@mui/material";
import { styled } from "@mui/material/styles";
import { FC, ReactNode } from "react";
import Simplebar from "simplebar-react";
import "simplebar/dist/simplebar.min.css";

const ScrollBar = styled(Simplebar, {
  shouldForwardProp: (props) => props !== "barcolor",
})<{ barcolor?: string }>(({ theme, barcolor }) => ({
  "& .simplebar-track.simplebar-vertical .simplebar-scrollbar:before": {
    backgroundColor: barcolor && theme.palette.primary.main,
  },
  "& .simplebar-track.simplebar-horizontal .simplebar-scrollbar:before": {
    backgroundColor: barcolor && theme.palette.primary.main,
  },
}));

interface Props {
  children: ReactNode;
  barColor?: string;
  sx?: SxProps;
}
const CustomScrollbar: FC<Props> = (props) => {
  const { children, barColor, sx } = props;
  return (
    <ScrollBar sx={sx} barcolor={barColor}>
      {children}
    </ScrollBar>
  );
};

export default CustomScrollbar;
