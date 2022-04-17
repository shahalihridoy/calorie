import AgreementDialog from "@components/atoms/AgreementDialog";
import NextLink from "@components/atoms/NextLink";
import { RemoveRedEye } from "@mui/icons-material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/ModeEditOutline";
import { IconButton } from "@mui/material";
import React, { FC, useCallback, useState } from "react";
import CustomFlexBox from "./CustomFlexBox";

interface Props {
  viewUrl?: string;
  onEdit?: () => void;
  onDelete?: () => void;
}

const SortedTableAction: FC<Props> = (props) => {
  const { viewUrl, onEdit, onDelete } = props;
  const [agreementOpen, setAgreementOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleDelete = useCallback(async () => {
    setIsLoading(true);
    await onDelete?.();
    setIsLoading(false);
    setAgreementOpen(false);
  }, [onDelete]);

  const toggleAgreement = useCallback(() => {
    setAgreementOpen((open) => !open);
  }, []);

  return (
    <>
      <CustomFlexBox sx={{ ml: "-5px", justifyContent: "center" }}>
        {viewUrl && (
          <NextLink href={viewUrl}>
            <IconButton>
              <RemoveRedEye sx={{ fontSize: "20px", color: "grey.700" }} />
            </IconButton>
          </NextLink>
        )}
        {onEdit && (
          <IconButton onClick={onEdit}>
            <EditIcon sx={{ fontSize: "20px", color: "grey.700" }} />
          </IconButton>
        )}
        {onDelete && (
          <IconButton onClick={toggleAgreement}>
            <DeleteIcon sx={{ fontSize: "20px", color: "grey.700" }} />
          </IconButton>
        )}
      </CustomFlexBox>

      {agreementOpen && (
        <AgreementDialog
          open={agreementOpen}
          text="Are you sure you to delete it?"
          isLoading={isLoading}
          onAgree={handleDelete}
          onDisagree={toggleAgreement}
        />
      )}
    </>
  );
};

export default SortedTableAction;
