import withAuth from "@auth/withAuth";
import CustomCard from "@components/atoms/CustomCard";
import DataLoader from "@components/atoms/DataLoader";
import SortedTableAction from "@components/atoms/SortedTableAction";
import SortedTableToolbar from "@components/atoms/SortedTableToolbar";
import DashboardLayout from "@components/layout/DashboardLayout";
import FoodEntryEditor from "@components/pages/food-entries/FoodEntryEditor";
import useSortableTable from "@hooks/useSortableTable";
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
import { FoodEntry, Meal } from "@shared/types";
import { getComparator, isSelected, stableSort } from "@utils/utils";
import { format } from "date-fns";
import React from "react";

const FoodEntries = () => {
  const {
    list,
    parentList,
    isLoading,
    order,
    orderBy,
    page,
    isEditModalOpen,
    rowsPerPage,
    selectedItems,
    editableItem,
    toggleEditModal,
    handleDeleteItems,
    handleSelectAllClick,
    handlePageChange,
    handleEditClick,
    handleRowsPerPageChange,
    handleSelectionChange,
    createSortHandler,
    setItemList,
    setSelectedItems,
  } = useSortableTable<FoodEntry>({
    defaultOrderKey: "name",
    deleteItemsMutation: useDeleteFoodEntryMutation,
    getItemsQuery: useGetFoodEntriesQuery,
  });

  return (
    <CustomCard sx={{ p: "20px" }}>
      <SortedTableToolbar
        selectedItems={selectedItems}
        buttonText="Add FoodEntry"
        buttonClick={toggleEditModal}
        mainTableData={parentList}
        searchFields={["name"]}
        onDelete={handleDeleteItems(selectedItems)}
        setFilteredItem={setItemList}
        setSelectedItems={setSelectedItems}
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
                      selectedItems.length > 0 &&
                      selectedItems.length < list.length
                    }
                    checked={
                      list.length > 0 && selectedItems.length === list.length
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
              {stableSort(list, getComparator(order, orderBy))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row) => {
                  const isItemSelected = isSelected(row._id, selectedItems);

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
                            selectedItems,
                            row._id,
                          )}
                        />
                      </TableCell>
                      <TableCell align="left" sx={ellipsis}>
                        {row.name}
                      </TableCell>
                      <TableCell align="left">
                        {(row.meal as Meal)?.name}
                      </TableCell>
                      <TableCell align="left">{row.calorie}</TableCell>
                      <TableCell align="left">
                        {row.date &&
                          format(new Date(row.date), "dd MMM, yyyy HH:mm a")}
                      </TableCell>
                      <TableCell align="left">
                        <SortedTableAction
                          onEdit={handleEditClick({
                            ...row,
                            meal: (row.meal as Meal)?._id,
                          })}
                          onDelete={handleDeleteItems([row._id])}
                        />
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

      {isEditModalOpen && (
        <Dialog
          maxWidth="sm"
          scroll="body"
          fullWidth
          open={isEditModalOpen}
          onClose={toggleEditModal}
        >
          <FoodEntryEditor
            foodEntry={editableItem}
            closeModal={toggleEditModal}
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
    id: "meal.name",
    numeric: false,
    disablePadding: false,
    label: "Meal",
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
