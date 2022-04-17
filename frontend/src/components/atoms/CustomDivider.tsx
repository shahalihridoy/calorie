import { Divider, DividerProps } from "@mui/material";
import { styled } from "@mui/material/styles";

const CustomDivider = styled(Divider)<DividerProps>({
  margin: "2.5rem 0",
  span: {
    fontWeight: 600,
    fontSize: "1rem",
    px: "1.5rem",
  },
});

CustomDivider.defaultProps = {
  children: "Report",
};

export default CustomDivider;
