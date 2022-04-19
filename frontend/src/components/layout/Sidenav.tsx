import CustomFlexBox from "@components/atoms/CustomFlexBox";
import CustomImage from "@components/atoms/CustomImage";
import CustomScrollbar from "@components/atoms/CustomScrollbar";
import NextLink from "@components/atoms/NextLink";
import { H2 } from "@components/atoms/Typography";
import { CustomDrawer } from "@components/layout/LayoutStyles";
import SidenavList from "@components/layout/SidenavList";
import DoubleArrowLeftIcon from "@mui/icons-material/KeyboardDoubleArrowLeft";
import { IconButton } from "@mui/material";
import React from "react";

interface SideNavProps {
  open?: boolean;
  isTablet?: boolean;
  toggleSidenav?: () => void;
}

const Sidenav: React.VFC<SideNavProps> = ({
  open,
  isTablet,
  toggleSidenav = () => null,
}) => {
  return (
    <CustomDrawer
      variant={isTablet ? "temporary" : "permanent"}
      open={open}
      onClose={toggleSidenav}
      elevation={3}
    >
      <CustomScrollbar sx={{ maxHeight: "100vh" }}>
        <CustomFlexBox
          sx={{
            my: "10px",
            height: "70px",
            p: "0 24px 0 28px",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <NextLink
            href="/"
            locale="en-US"
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <CustomImage width="32px" src="/vendup.png" sx={{ mr: "8px" }} />
            <H2 fontSize="18px" fontWeight={700}>
              Calorie
            </H2>
          </NextLink>
          {isTablet && (
            <IconButton onClick={toggleSidenav}>
              <DoubleArrowLeftIcon />
            </IconButton>
          )}
        </CustomFlexBox>

        <SidenavList />
      </CustomScrollbar>
    </CustomDrawer>
  );
};

export default Sidenav;
