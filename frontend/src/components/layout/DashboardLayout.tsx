import CustomBox from "@components/atoms/CustomBox";
import CustomScrollbar from "@components/atoms/CustomScrollbar";
import Sidenav from "@components/layout/Sidenav";
import { Container, useMediaQuery, useTheme } from "@mui/material";
import { TOPBAR_HEIGHT } from "@shared/constants";
import { FC, useEffect, useState } from "react";
import Topbar from "./Topbar";

const DashboardLayout: FC = ({ children }) => {
  const [sidenavOpen, setSidenavOpen] = useState(true);
  const theme = useTheme();
  const isTablet = useMediaQuery(theme.breakpoints.down("md"));

  const toggleSidenav = () => {
    setSidenavOpen(!sidenavOpen);
  };

  useEffect(() => {
    if (isTablet) {
      setSidenavOpen(false);
    } else {
      setSidenavOpen(true);
    }
  }, [isTablet]);

  return (
    <CustomBox sx={{ display: "flex" }}>
      <Sidenav
        open={sidenavOpen}
        isTablet={isTablet}
        toggleSidenav={toggleSidenav}
      />
      <CustomBox
        sx={{
          flexGrow: 1,
          minHeight: "100vh",
          overflow: "auto",
          scrollbarColor: "dark",
        }}
      >
        <CustomScrollbar
          sx={{
            py: "1.5rem",
            mt: `${TOPBAR_HEIGHT}px`,
            maxHeight: `calc(100vh - ${TOPBAR_HEIGHT}px)`,
            outline: "none",
          }}
        >
          <Topbar
            open={sidenavOpen}
            isTablet={isTablet}
            toggleSidenav={toggleSidenav}
          />
          <Container>{children}</Container>
        </CustomScrollbar>
      </CustomBox>
    </CustomBox>
  );
};

export default DashboardLayout;
