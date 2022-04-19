import withAuth from "@auth/withAuth";
import CustomCard from "@components/atoms/CustomCard";
import DataLoader from "@components/atoms/DataLoader";
import SortedTableToolbar from "@components/atoms/SortedTableToolbar";
import DashboardLayout from "@components/layout/DashboardLayout";
import useSortableTable from "@hooks/useSortableTable";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import TableSortLabel from "@mui/material/TableSortLabel";
import { useGetFoodEntriesThresholdQuery } from "@redux/food/foodApi";
import { AuthRoles } from "@shared/enums";
import { ellipsis } from "@shared/styles";
import { getComparator, stableSort } from "@utils/utils";
import { format } from "date-fns";
import React from "react";

interface Threshold {
  date: string;
  calorie: number;
}

const Thresholds = () => {
  const {
    list,
    parentList,
    isLoading,
    order,
    orderBy,
    page,
    rowsPerPage,
    handlePageChange,
    handleRowsPerPageChange,
    createSortHandler,
    setItemList,
  } = useSortableTable<Threshold>({
    defaultOrderKey: "date",
    getItemsQuery: useGetFoodEntriesThresholdQuery,
  });

  return (
    <CustomCard sx={{ p: "20px" }}>
      <SortedTableToolbar
        mainTableData={parentList ?? []}
        searchFields={["date"]}
        setFilteredItem={setItemList}
      />

      {isLoading ? (
        <DataLoader />
      ) : (
        <TableContainer>
          <Table sx={{ minWidth: 750 }}>
            <TableHead
              sx={{
                bgcolor: "grey.100",
                height: 50,
                th: { py: "4px", border: "none" },
              }}
            >
              <TableRow>
                {tableHeadData.map((headCell) => (
                  <TableCell
                    key={headCell.id}
                    align="left"
                    padding={headCell.disablePadding ? "none" : "normal"}
                    sortDirection={orderBy === headCell.id ? order : false}
                  >
                    <TableSortLabel
                      active={orderBy === headCell.id}
                      direction={orderBy === headCell.id ? order : "asc"}
                      onClick={createSortHandler(headCell.id)}
                    >
                      {headCell.label}
                    </TableSortLabel>
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>

            <TableBody>
              {stableSort(list, getComparator(order, orderBy))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row) => {
                  return (
                    <TableRow
                      hover
                      tabIndex={-1}
                      key={row.date}
                      id="TableBodyRow"
                    >
                      <TableCell align="left" sx={ellipsis}>
                        {format(new Date(row.date), "dd MMM, yyyy")}
                      </TableCell>
                      <TableCell align="left" sx={ellipsis}>
                        {format(new Date(row.date), "hh:mm a")}
                      </TableCell>
                      <TableCell align="left" sx={ellipsis}>
                        {row.calorie}
                      </TableCell>
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {list.length > 0 && (
        <TablePagination
          page={page}
          component="div"
          rowsPerPage={rowsPerPage}
          count={list.length}
          rowsPerPageOptions={[10, 20, 50, 100]}
          onPageChange={handlePageChange}
          onRowsPerPageChange={handleRowsPerPageChange}
        />
      )}
    </CustomCard>
  );
};

export const tableHeadData = [
  {
    id: "date",
    numeric: false,
    disablePadding: false,
    label: "Date",
  },
  {
    id: "date",
    numeric: false,
    disablePadding: false,
    label: "Time",
  },
  {
    id: "calorie",
    numeric: true,
    disablePadding: false,
    label: "Calorie",
  },
];

Thresholds.Layout = DashboardLayout;
export default withAuth(Thresholds, [AuthRoles.USER]);
