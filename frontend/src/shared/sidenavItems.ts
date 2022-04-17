import { TrendingUp } from "@mui/icons-material";
import DataThresholding from "@mui/icons-material/DataThresholding";
import LocalDining from "@mui/icons-material/LocalDining";
import SetMeal from "@mui/icons-material/SetMeal";
import { SvgIconTypeMap } from "@mui/material";
import { OverridableComponent } from "@mui/material/OverridableComponent";
import { AuthRoles } from "@shared/enums";

export interface SidenavItem {
  Icon: OverridableComponent<SvgIconTypeMap<any, "svg">>;
  title: string;
  path?: string;
  allowedRoles: AuthRoles[];
}

export const sidenavItems: SidenavItem[] = [
  {
    Icon: LocalDining,
    title: "Food Entries",
    path: "/",
    allowedRoles: [AuthRoles.USER, AuthRoles.ADMIN],
  },
  {
    Icon: TrendingUp,
    title: "Reports",
    path: "/reports",
    allowedRoles: [AuthRoles.ADMIN],
  },
  {
    Icon: DataThresholding,
    title: "Thresholds",
    path: "/thresholds",
    allowedRoles: [AuthRoles.USER],
  },
  {
    Icon: SetMeal,
    title: "Meals",
    path: "/meals",
    allowedRoles: [AuthRoles.USER],
  },
];
