import NotificationManager from "@components/atoms/NotificationManager";
import {
  MutationDefinition,
  QueryDefinition,
} from "@reduxjs/toolkit/dist/query";
import {
  UseMutation,
  UseQuery,
} from "@reduxjs/toolkit/dist/query/react/buildHooks";
import { BaseQueryFunction } from "@shared/types";
import { selectHandler } from "@utils/utils";
import React, { useEffect, useState } from "react";

interface UseSortableTableProps<T> {
  test?: string;
  defaultOrderKey: keyof T;
  getItemsQuery: UseQuery<
    QueryDefinition<void, BaseQueryFunction, string, any, string>
  >;
  deleteItemsMutation?: UseMutation<
    MutationDefinition<string[], BaseQueryFunction, string, any, string>
  >;
}

const useSortableTable = <T,>(props: UseSortableTableProps<T>) => {
  const { defaultOrderKey, getItemsQuery, deleteItemsMutation } = props;

  const [order, setOrder] = useState<"asc" | "desc">("asc");
  const [orderBy, setOrderBy] = useState<keyof T>(defaultOrderKey);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [isEditModalOpen, setisEditModalOpen] = useState(false);
  const [editableItem, setEditableItem] = useState<T>();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [ItemList, setItemList] = useState<T[]>([]);

  const [deleteItems] = deleteItemsMutation?.() || [];
  const { data, isLoading } = getItemsQuery();

  const handleRequestSort = (
    event: React.MouseEvent<unknown>,
    property: keyof T,
  ) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelecteds = ItemList.map((n: any) => n._id);
      setSelectedItems(newSelecteds);
      return;
    }
    setSelectedItems([]);
  };

  const handleSelectionChange = (selected: string[], id: string) => () => {
    setSelectedItems(selectHandler(selected, id));
  };

  const handlePageChange = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setRowsPerPage(parseInt(event.target.value));
    setPage(0);
  };

  const createSortHandler =
    (property: any) => (event: React.MouseEvent<unknown>) => {
      handleRequestSort(event, property);
    };

  const toggleEditModal = () => {
    setEditableItem(isEditModalOpen ? undefined : editableItem);
    setisEditModalOpen(!isEditModalOpen);
  };

  const handleEditClick = (product: T) => () => {
    setEditableItem(product);
    setisEditModalOpen(true);
  };

  const handleDeleteItems = (idList: string[]) => async () => {
    try {
      await deleteItems?.(idList).unwrap();
      NotificationManager.success("Items deleted successfully");
    } catch (error: any) {
      console.log(error);
      NotificationManager.error(error.data.message);
    }
  };

  useEffect(() => {
    setItemList(data || []);
  }, [data]);

  return {
    parentList: data || [],
    list: ItemList,
    isLoading,
    page,
    rowsPerPage,
    order,
    orderBy,
    editableItem,
    selectedItems,
    isEditModalOpen,
    handleDeleteItems,
    handleEditClick,
    handlePageChange,
    handleRowsPerPageChange,
    handleSelectAllClick,
    handleSelectionChange,
    createSortHandler,
    toggleEditModal,
    setItemList,
    setSelectedItems,
  };
};

export default useSortableTable;
