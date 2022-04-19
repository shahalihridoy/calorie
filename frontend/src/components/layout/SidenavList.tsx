import CustomBox from "@components/atoms/CustomBox";
import NextLink from "@components/atoms/NextLink";
import { H6 } from "@components/atoms/Typography";
import { StyledListItemButton } from "@components/layout/LayoutStyles";
import { useAppSelector } from "@hooks/reduxHooks";
import { List } from "@mui/material";
import { AuthRoles } from "@shared/enums";
import { SidenavItem, sidenavItems } from "@shared/sidenavItems";
import { useRouter } from "next/router";
import { FC, useEffect, useState } from "react";

const SidebarNavList: FC = () => {
  const { pathname } = useRouter();
  const [navList, setNavList] = useState<SidenavItem[]>([]);
  const { user } = useAppSelector((state) => state.auth);

  useEffect(() => {
    const filteredNavList = sidenavItems.filter((nav) =>
      nav.allowedRoles.includes(user?.role as AuthRoles),
    );
    setNavList(filteredNavList);
  }, [user?.role]);

  return (
    <CustomBox>
      <List sx={{ height: "100%", padding: 2 }}>
        {navList.map((item, index) => (
          <NextLink href={item.path ?? "/"} key={index}>
            <StyledListItemButton
              disableRipple
              active={pathname == item.path ? "active" : ""}
            >
              <item.Icon
                sx={{ color: "inherit", fontSize: 20, opacity: 0.5 }}
              />
              <H6 ml={1} lineHeight={1}>
                {item.title}
              </H6>
            </StyledListItemButton>
          </NextLink>
        ))}
      </List>
    </CustomBox>
  );
};

export default SidebarNavList;
