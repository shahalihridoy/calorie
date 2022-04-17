import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import { styled } from "@mui/system";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

interface Props {
  size?: string | number;
}
const CustomDialog = styled(Dialog)<Props>(({ size }) => ({
  "& .MuiDialog-paper": {
    width: "100%",
    maxWidth: size,
  },
}));

export default CustomDialog;
