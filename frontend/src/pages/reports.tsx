import withAuth from "@auth/withAuth";
import CustomBox from "@components/atoms/CustomBox";
import DataLoader from "@components/atoms/DataLoader";
import DashboardLayout from "@components/layout/DashboardLayout";
import ReportCard from "@components/pages/reports/ReportCard";
import { useGetFoodEntriesAnalyticsQuery } from "@redux/food/foodApi";
import { AuthRoles } from "@shared/enums";
import React from "react";

const Index = () => {
  const { data, isLoading } = useGetFoodEntriesAnalyticsQuery();
  const hasIncreased = data?.thisWeek > data?.lastWeek;

  return isLoading ? (
    <DataLoader />
  ) : (
    <CustomBox
      sx={{
        display: "inline-grid",
        gridTemplateColumns: {
          sm: "1fr 1fr 1fr",
          xs: "1fr 1fr",
        },
        gap: "1rem",
      }}
    >
      <ReportCard
        title="This Week"
        hasIncreased={hasIncreased}
        count={data?.thisWeek}
        bgcolor="primary.main"
      />
      <ReportCard
        title="Last Week"
        hasIncreased={!hasIncreased}
        count={data?.lastWeek}
        bgcolor="primary.main"
      />
      <ReportCard
        title="This Week Average Calorie"
        count={data?.averageCalorie}
        bgcolor="warning.main"
      />
    </CustomBox>
  );
};

Index.Layout = DashboardLayout;
export default withAuth(Index, [AuthRoles.ADMIN]);
