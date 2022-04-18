import AgreementDialog from "@components/atoms/AgreementDialog";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import SearchIcon from "@mui/icons-material/Search";
import { Button } from "@mui/material";
import Toolbar from "@mui/material/Toolbar";
import { Box } from "@mui/system";
import React, { useState } from "react";
import CustomTextField from "./CustomTextField";
import { Span } from "./Typography";

interface Props<T> {
  selectedItems?: string[];
  buttonText?: string;
  mainTableData: T[];
  searchFields?: string[];
  buttonClick?: () => void;
  onDelete?: () => void;
  setFilteredItem: (value: any[]) => void;
  setSelectedItems?: (value: string[]) => void;
}

const SortedTableToolbar = <T,>(props: Props<T>) => {
  const [isAgreementOpen, setIsAgreementOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    selectedItems = [],
    buttonText,
    searchFields,
    mainTableData,
    onDelete,
    buttonClick,
    setFilteredItem,
    setSelectedItems,
  } = props;

  const toggleAgreementDialog = () => {
    setIsAgreementOpen(!isAgreementOpen);
  };

  const handleDelete = async () => {
    setIsLoading(true);
    await onDelete?.();
    setIsLoading(false);
    toggleAgreementDialog();
    setSelectedItems?.([]);
  };

  const handleSearch = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchTerm = e.target.value.trim().toLowerCase();
    if (searchTerm.length > 0) {
      const searchResult = mainTableData.filter((item: Record<string, any>) =>
        searchFields?.some((field) =>
          item[field]?.toLowerCase().includes(searchTerm),
        ),
      );
      setFilteredItem(searchResult);
    } else {
      setFilteredItem(mainTableData);
    }
  };

  return (
    <Toolbar
      sx={{
        mb: "12px",
        p: "0px !important",
        display: "flex",
        justifyContent: "space-between",
      }}
    >
      <CustomTextField
        fullWidth
        placeholder="Search"
        sx={{ maxWidth: 300 }}
        onChange={handleSearch}
        InputProps={{
          startAdornment: (
            <SearchIcon
              fontSize="small"
              sx={{
                mr: "0.5rem",
                fontSize: "22px",
                color: "grey.800",
              }}
            />
          ),
        }}
      />
      {selectedItems?.length > 0 ? (
        <Box display="flex" alignItems="center">
          <Span sx={{ mr: "20px" }} color="inherit">
            {selectedItems?.length} selected
          </Span>
          <Button
            variant="contained"
            color="error"
            onClick={toggleAgreementDialog}
          >
            <DeleteIcon sx={{ mr: "4px", fontSize: 20 }} />
            Delete
          </Button>
        </Box>
      ) : (
        <div>
          {buttonText && (
            <Button
              color="primary"
              variant="contained"
              sx={{ ml: "20px" }}
              onClick={buttonClick}
            >
              <AddIcon sx={{ mr: "8px", fontSize: "20px" }} />
              {buttonText}
            </Button>
          )}
        </div>
      )}

      {isAgreementOpen && (
        <AgreementDialog
          open={isAgreementOpen}
          isLoading={isLoading}
          text={`Are you sure you to delete ${selectedItems?.length} items?`}
          onAgree={handleDelete}
          onDisagree={toggleAgreementDialog}
        />
      )}
    </Toolbar>
  );
};

export default SortedTableToolbar;
