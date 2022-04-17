import CustomBox from "@components/atoms/CustomBox";
import { CircularProgress } from "@mui/material";
import React, { VFC } from "react";

const DataLoader: VFC = () => {
  return (
    <CustomBox sx={{ display: "flex", justifyContent: "center", my: "1rem" }}>
      <CircularProgress size={24} />
    </CustomBox>
  );
};

export default DataLoader;
