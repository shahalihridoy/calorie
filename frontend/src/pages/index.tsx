import withAuth from "@auth/withAuth";
import CustomCard from "@components/atoms/CustomCard";
import DataLoader from "@components/atoms/DataLoader";
import NotificationManager from "@components/atoms/NotificationManager";
import SortedTableAction from "@components/atoms/SortedTableAction";
import SortedTableToolbar from "@components/atoms/SortedTableToolbar";
import DashboardLayout from "@components/layout/DashboardLayout";
import FoodEntryEditor from "@components/pages/food-entries/FoodEntryEditor";
import { Dialog } from "@mui/material";
import Checkbox from "@mui/material/Checkbox";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import TableSortLabel from "@mui/material/TableSortLabel";
import {
  useDeleteFoodEntryMutation,
  useGetFoodEntriesQuery,
} from "@redux/food/foodApi";
import { AuthRoles } from "@shared/enums";
import { ellipsis } from "@shared/styles";
import { FoodEntry } from "@shared/types";
import {
  getComparator,
  isSelected,
  selectHandler,
  stableSort,
} from "@utils/utils";
import { format } from "date-fns";
import React, { useEffect, useState } from "react";

const FoodEntries = () => {
  const [order, setOrder] = useState<"asc" | "desc">("asc");
  const [orderBy, setOrderBy] = useState<keyof FoodEntry>("name");
  const [selectedFoodEntries, setSelectedFoodEntries] = useState<string[]>([]);
  const [isFoodEntryModalOpen, setIsFoodEntryModalOpen] = useState(false);
  const [editableFoodEntry, setEditableFoodEntry] = useState<FoodEntry>();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [foodEntryList, setFoodEntryList] = useState<FoodEntry[]>([]);

  const [deleteFoodEntries] = useDeleteFoodEntryMutation();
  const { data, isLoading } = useGetFoodEntriesQuery();

  const handleRequestSort = (
    event: React.MouseEvent<unknown>,
    property: keyof FoodEntry,
  ) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelecteds = foodEntryList.map((n) => n._id);
      setSelectedFoodEntries(newSelecteds);
      return;
    }
    setSelectedFoodEntries([]);
  };

  const handleSelectionChange = (selected: string[], id: string) => () => {
    setSelectedFoodEntries(selectHandler(selected, id));
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

  const toggleFoodEntryModal = () => {
    setEditableFoodEntry(isFoodEntryModalOpen ? undefined : editableFoodEntry);
    setIsFoodEntryModalOpen(!isFoodEntryModalOpen);
  };

  const handleEditClick = (foodEntry: FoodEntry) => () => {
    setEditableFoodEntry(foodEntry);
    setIsFoodEntryModalOpen(true);
  };

  const handleDeleteFoodEntries = (idList: string[]) => async () => {
    try {
      await deleteFoodEntries(idList).unwrap();
      NotificationManager.success("Food entries deleted successfully");
    } catch (error: any) {
      console.log(error);
      NotificationManager.error(error.data.message);
    }
  };

  useEffect(() => {
    setFoodEntryList(data || []);
  }, [data]);

  return (
    <CustomCard sx={{ p: "20px" }}>
      <SortedTableToolbar
        selectedItems={selectedFoodEntries}
        buttonText="Add FoodEntry"
        buttonClick={toggleFoodEntryModal}
        mainTableData={data ?? []}
        searchFields={["name"]}
        onDelete={handleDeleteFoodEntries(selectedFoodEntries)}
        setFilteredItem={setFoodEntryList}
        setSelectedItems={setSelectedFoodEntries}
      />

      {isLoading ? (
        <DataLoader />
      ) : (
        <TableContainer>
          <Table sx={{ minWidth: 750 }}>
            <TableHead
              sx={{
                bgcolor: "grey.100",
                th: { py: "4px", border: "none" },
              }}
            >
              <TableRow>
                <TableCell padding="checkbox">
                  <Checkbox
                    sx={{ color: "#757575" }}
                    onChange={handleSelectAllClick}
                    indeterminate={
                      selectedFoodEntries.length > 0 &&
                      selectedFoodEntries.length < foodEntryList.length
                    }
                    checked={
                      foodEntryList.length > 0 &&
                      selectedFoodEntries.length === foodEntryList.length
                    }
                  />
                </TableCell>
                {tableHeadData.map((headCell) => (
                  <TableCell
                    key={headCell.id}
                    align={(headCell.align as any) ?? "left"}
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
              {stableSort(foodEntryList, getComparator(order, orderBy))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row) => {
                  const isItemSelected = isSelected(
                    row._id,
                    selectedFoodEntries,
                  );

                  return (
                    <TableRow
                      hover
                      tabIndex={-1}
                      key={row._id}
                      selected={isItemSelected}
                      id="TableBodyRow"
                    >
                      <TableCell padding="checkbox">
                        <Checkbox
                          sx={{ color: "#757575" }}
                          checked={isItemSelected}
                          onClick={handleSelectionChange(
                            selectedFoodEntries,
                            row._id,
                          )}
                        />
                      </TableCell>
                      <TableCell align="left" sx={ellipsis}>
                        {row.name}
                      </TableCell>
                      <TableCell align="left" sx={ellipsis}>
                        {row.calorie}
                      </TableCell>
                      <TableCell align="left">
                        {row.date &&
                          format(new Date(row.date), "dd MMM, yyyy HH:mm a")}
                      </TableCell>
                      <TableCell align="left">
                        <SortedTableAction
                          onEdit={handleEditClick(row)}
                          onDelete={handleDeleteFoodEntries([row._id])}
                        />
                      </TableCell>
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {foodEntryList.length > 0 && (
        <TablePagination
          page={page}
          component="div"
          rowsPerPage={rowsPerPage}
          count={foodEntryList.length}
          rowsPerPageOptions={[10, 20, 50, 100]}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      )}

      {isFoodEntryModalOpen && (
        <Dialog
          maxWidth="sm"
          scroll="body"
          fullWidth
          open={isFoodEntryModalOpen}
          onClose={toggleFoodEntryModal}
        >
          <FoodEntryEditor
            foodEntry={editableFoodEntry}
            closeModal={toggleFoodEntryModal}
          />
        </Dialog>
      )}
    </CustomCard>
  );
};

export const tableHeadData = [
  {
    id: "name",
    numeric: false,
    disablePadding: false,
    label: "Food",
  },
  {
    id: "calorie",
    numeric: true,
    disablePadding: false,
    label: "Calorie",
  },
  {
    id: "date",
    numeric: false,
    disablePadding: false,
    label: "Date",
  },
  {
    id: "Action",
    numeric: false,
    disablePadding: false,
    label: "Action",
    align: "center",
  },
];

FoodEntries.Layout = DashboardLayout;
export default withAuth(FoodEntries, [AuthRoles.ADMIN, AuthRoles.USER]);
