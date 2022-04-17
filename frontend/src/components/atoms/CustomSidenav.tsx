import { Drawer } from "@mui/material";
import clsx from "clsx";
import React, { cloneElement, Fragment, useEffect, useState } from "react";

export interface CustomSidenavProps {
  position?: "left" | "right";
  open?: boolean;
  width?: number | string;
  handle: React.ReactElement;
  toggleSidenav?: () => void;
}

const CustomSidenav: React.FC<CustomSidenavProps> = ({
  position,
  open,
  width,
  handle,
  children,
  toggleSidenav,
}) => {
  const [sidenavOpen, setCustomSidenavOpen] = useState(open);

  const handleToggleSidenav = () => {
    setCustomSidenavOpen(!sidenavOpen);
  };

  useEffect(() => {
    setCustomSidenavOpen(open);
  }, [open]);

  return (
    <Fragment>
      <Drawer
        open={sidenavOpen}
        anchor={position}
        onClose={toggleSidenav || handleToggleSidenav}
        SlideProps={{ style: { width: width || 280 }, unmountOnExit: true }}
        PaperProps={{ sx: { borderRadius: 0 } }}
      >
        {children}
      </Drawer>

      {handle &&
        cloneElement(handle, {
          className: clsx({
            [handle.props?.className]: handle.props?.className,
          }),
          onClick: toggleSidenav || handleToggleSidenav,
        })}
    </Fragment>
  );
};

CustomSidenav.defaultProps = {
  width: 260,
  position: "left",
  open: false,
};

export default CustomSidenav;
