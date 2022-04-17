import withAuth from "@auth/withAuth";
import CustomCard from "@components/atoms/CustomCard";
import DataLoader from "@components/atoms/DataLoader";
import NotificationManager from "@components/atoms/NotificationManager";
import SortedTableAction from "@components/atoms/SortedTableAction";
import SortedTableToolbar from "@components/atoms/SortedTableToolbar";
import DashboardLayout from "@components/layout/DashboardLayout";
import MealEditor from "@components/pages/meal/MealEditor";
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
import { useDeleteMealMutation, useGetMealsQuery } from "@redux/meal/mealApi";
import { AuthRoles } from "@shared/enums";
import { ellipsis } from "@shared/styles";
import { Meal } from "@shared/types";
import {
  getComparator,
  isSelected,
  selectHandler,
  stableSort,
} from "@utils/utils";
import React, { useEffect, useState } from "react";

const Meals = () => {
  const [order, setOrder] = useState<"asc" | "desc">("asc");
  const [orderBy, setOrderBy] = useState<keyof Meal>("name");
  const [selectedMeals, setSelectedMeals] = useState<string[]>([]);
  const [isMealModalOpen, setIsMealModalOpen] = useState(false);
  const [editableMeal, setEditableMeal] = useState<Meal>();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [mealList, setMealList] = useState<Meal[]>([]);

  const [deleteMeals] = useDeleteMealMutation();
  const { data, isLoading } = useGetMealsQuery();

  const handleRequestSort = (
    event: React.MouseEvent<unknown>,
    property: keyof Meal,
  ) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelecteds = mealList.map((n) => n._id);
      setSelectedMeals(newSelecteds);
      return;
    }
    setSelectedMeals([]);
  };

  const handleSelectionChange = (selected: string[], id: string) => () => {
    setSelectedMeals(selectHandler(selected, id));
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

  const toggleMealModal = () => {
    setEditableMeal(isMealModalOpen ? undefined : editableMeal);
    setIsMealModalOpen(!isMealModalOpen);
  };

  const handleEditClick = (product: Meal) => () => {
    setEditableMeal(product);
    setIsMealModalOpen(true);
  };

  const handleDeleteMeals = (idList: string[]) => async () => {
    try {
      await deleteMeals(idList).unwrap();
      NotificationManager.success("Meals deleted successfully");
    } catch (error: any) {
      console.log(error);
      NotificationManager.error(error.data.message);
    }
  };

  useEffect(() => {
    setMealList(data || []);
  }, [data]);

  return (
    <CustomCard sx={{ p: "20px" }}>
      <SortedTableToolbar
        selectedItems={selectedMeals}
        buttonText="Add Meal"
        buttonClick={toggleMealModal}
        mainTableData={data ?? []}
        searchFields={["name"]}
        onDelete={handleDeleteMeals(selectedMeals)}
        setFilteredItem={setMealList}
        setSelectedItems={setSelectedMeals}
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
                      selectedMeals.length > 0 &&
                      selectedMeals.length < mealList.length
                    }
                    checked={
                      mealList.length > 0 &&
                      selectedMeals.length === mealList.length
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
              {stableSort(mealList, getComparator(order, orderBy))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row) => {
                  const isItemSelected = isSelected(row._id, selectedMeals);

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
                            selectedMeals,
                            row._id,
                          )}
                        />
                      </TableCell>
                      <TableCell align="left" sx={ellipsis}>
                        {row.name}
                      </TableCell>
                      <TableCell align="left" sx={ellipsis}>
                        {row.maxFoodItemCount}
                      </TableCell>
                      <TableCell align="left">
                        <SortedTableAction
                          onEdit={handleEditClick(row)}
                          onDelete={handleDeleteMeals([row._id])}
                        />
                      </TableCell>
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {mealList.length > 0 && (
        <TablePagination
          page={page}
          component="div"
          rowsPerPage={rowsPerPage}
          count={mealList.length}
          rowsPerPageOptions={[10, 20, 50, 100]}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      )}

      {isMealModalOpen && (
        <Dialog
          maxWidth="sm"
          scroll="body"
          fullWidth
          open={isMealModalOpen}
          onClose={toggleMealModal}
        >
          <MealEditor meal={editableMeal} closeModal={toggleMealModal} />
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
    label: "Meal",
  },
  {
    id: "maxFoodItemCount",
    numeric: true,
    disablePadding: false,
    label: "Max Food Items",
  },
  {
    id: "Action",
    numeric: false,
    disablePadding: false,
    label: "Action",
    align: "center",
  },
];

Meals.Layout = DashboardLayout;
export default withAuth(Meals, [AuthRoles.USER]);
