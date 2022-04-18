import CustomFlexBox from "@components/atoms/CustomFlexBox";
import CustomTextField from "@components/atoms/CustomTextField";
import { Span } from "@components/atoms/Typography";
import InviteUser from "@components/layout/InviteUser";
import { useAppSelector } from "@hooks/reduxHooks";
import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import { Button, Container, IconButton } from "@mui/material";
import { CustomAppBar } from "./NavbarStyles";

interface TopbarProps {
  open?: boolean;
  isTablet?: boolean;
  toggleSidenav?: () => void;
}

const Topbar: React.VFC<TopbarProps> = ({
  open,
  isTablet,
  toggleSidenav = () => null,
}) => {
  const { user } = useAppSelector((state) => state.auth);

  return (
    <CustomAppBar sx={{ px: 0 }} isTablet={isTablet} open={open} elevation={0}>
      <Container
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          py: "1.5rem",
        }}
      >
        {isTablet && (
          <IconButton onClick={toggleSidenav}>
            <MenuIcon />
          </IconButton>
        )}
        <CustomFlexBox sx={{ alignItems: "center", flex: "1 1 0" }}>
          <CustomTextField
            fullWidth
            placeholder="Search"
            sx={{ maxWidth: 300, ml: "0.25rem" }}
            InputProps={{
              startAdornment: (
                <SearchIcon
                  fontSize="small"
                  sx={{
                    mr: "0.5rem",
                    fontSize: "22px",
                    color: "grey.800",
                  }}
                />
              ),
            }}
          />
        </CustomFlexBox>

        <CustomFlexBox sx={{ alignItems: "center" }}>
          <InviteUser />
          <Button
            variant="outlined"
            sx={{
              borderRadius: 300,
              px: "1rem",
              ml: "1rem",
              display: {
                sm: "inline-block",
                xs: "none",
              },
            }}
          >
            <Span>{user?.name}</Span>
          </Button>
        </CustomFlexBox>
      </Container>
    </CustomAppBar>
  );
};

export default Topbar;
