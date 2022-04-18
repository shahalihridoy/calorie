import CustomBox from "@components/atoms/CustomBox";
import CustomImage from "@components/atoms/CustomImage";
import { Button } from "@mui/material";
import { useRouter } from "next/router";
import React from "react";

const Error = () => {
  const router = useRouter();

  return (
    <CustomBox
      sx={{
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: "background.paper",
      }}
    >
      <CustomBox sx={{ p: "1rem", maxWidth: 500, textAlign: "center" }}>
        <CustomImage width="100%" src="/assets/404.png" />
        <Button
          fullWidth
          color="primary"
          variant="contained"
          sx={{ mt: "8px", maxWidth: 225 }}
          onClick={() => router.push("/")}
        >
          Go Back
        </Button>
      </CustomBox>
    </CustomBox>
  );
};

export default Error;
