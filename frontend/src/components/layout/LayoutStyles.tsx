import { ListItemButton } from "@mui/material";
import MuiAppBar, { AppBarProps as MuiAppBarProps } from "@mui/material/AppBar";
import MuiDrawer from "@mui/material/Drawer";
import { CSSObject, styled, Theme } from "@mui/material/styles";
import { SIDENAV_WIDTH, TOPBAR_HEIGHT } from "@shared/constants";

const openedMixin = (theme: Theme): CSSObject => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  borderRadius: 0,
  overflowX: "hidden",
  width: SIDENAV_WIDTH,
  boxShadow: theme.shadows[2],
});

const closedMixin = (theme: Theme): CSSObject => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  borderRadius: 0,
  overflowX: "hidden",
  width: 0,
});

export const CustomDrawer = styled(MuiDrawer)(({ theme, open }) => ({
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  width: open ? SIDENAV_WIDTH : 0,
  ...(open && {
    ...openedMixin(theme),
    "& .MuiDrawer-paper": openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    "& .MuiDrawer-paper": closedMixin(theme),
  }),
}));

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
  isTablet?: boolean;
}

export const CustomAppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "isTablet",
})<AppBarProps>(({ theme, open, isTablet }) => ({
  borderRadius: 0,
  padding: "0px 24px",
  height: TOPBAR_HEIGHT,
  justifyContent: "space-between",
  background: isTablet ? theme.palette.background.paper : "transparent",
  width: `calc(100% - ${isTablet ? 0 : open ? SIDENAV_WIDTH : 0}px)`,
  marginLeft: `${isTablet ? 0 : open ? SIDENAV_WIDTH : 0}px`,
  boxShadow: isTablet ? theme.shadows[1] : "none",
  color: "inherit",
  transition: theme.transitions.create(["margin", "width"], {
    easing: theme.transitions.easing.easeInOut,
    duration: "300ms",
  }),
}));

export const StyledListItemButton = styled(ListItemButton)<{ active: string }>(
  ({ active, theme }) => ({
    marginBottom: 8,
    padding: "12px 12px",
    borderRadius: "6px",
    color: active ? "#fff" : "inherit",
    background: active ? theme.palette.primary.main : "inherit",
    "&:hover": {
      background: theme.palette.primary.main,
      color: "#fff",
    },
  }),
);
