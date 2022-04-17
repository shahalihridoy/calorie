import { Alert } from "@mui/material";
import { styled } from "@mui/material/styles";

const CustomAlert = styled(Alert)(({ severity, theme }) => ({
  borderLeft: "3px solid",
  borderColor: !!severity ? theme.palette[severity].main : "transparent",
  "& ul": {
    margin: 0,
    paddingLeft: "1.5rem",
  },
}));

export default CustomAlert;
