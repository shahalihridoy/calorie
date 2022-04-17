import withAuth from "@auth/withAuth";
import CustomCard from "@components/atoms/CustomCard";
import DataLoader from "@components/atoms/DataLoader";
import SortedTableToolbar from "@components/atoms/SortedTableToolbar";
import DashboardLayout from "@components/layout/DashboardLayout";
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
import React, { useEffect, useState } from "react";

interface Threshold {
  date: string;
  calorie: number;
}

const Thresholds = () => {
  const [order, setOrder] = useState<"asc" | "desc">("asc");
  const [orderBy, setOrderBy] = useState<keyof Threshold>("date");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [thresholdList, setThresholdList] = useState<Threshold[]>([]);

  const { data, isLoading } = useGetFoodEntriesThresholdQuery();

  const handleRequestSort = (
    event: React.MouseEvent<unknown>,
    property: keyof Threshold,
  ) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setRowsPerPage(parseInt(event.target.value));
    setPage(0);
  };

  const createSortHandler =
    (property: any) => (event: React.MouseEvent<unknown>) => {
      handleRequestSort(event, property);
    };

  useEffect(() => {
    setThresholdList(data ?? []);
  }, [data]);

  return (
    <CustomCard sx={{ p: "20px" }}>
      <SortedTableToolbar
        mainTableData={data ?? []}
        searchFields={["date"]}
        setFilteredItem={setThresholdList}
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
              {stableSort(thresholdList, getComparator(order, orderBy))
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

      {thresholdList.length > 0 && (
        <TablePagination
          page={page}
          component="div"
          rowsPerPage={rowsPerPage}
          count={thresholdList.length}
          rowsPerPageOptions={[10, 20, 50, 100]}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
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
