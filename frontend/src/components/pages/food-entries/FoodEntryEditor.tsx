import CustomBox from "@components/atoms/CustomBox";
import CustomFlexBox from "@components/atoms/CustomFlexBox";
import CustomTextField from "@components/atoms/CustomTextField";
import NotificationManager from "@components/atoms/NotificationManager";
import { H6 } from "@components/atoms/Typography";
import { LoadingButton } from "@mui/lab";
import { Button, Grid, MenuItem } from "@mui/material";
import {
  useAddFoodEntryMutation,
  useUpdateFoodEntryMutation,
} from "@redux/food/foodApi";
import { FoodEntry } from "@shared/types";
import { Formik } from "formik";
import React, { FC } from "react";
import * as yup from "yup";

interface Props {
  foodEntry?: FoodEntry;
  closeModal: () => void;
}

const FoodEntryEditor: FC<Props> = ({ foodEntry, closeModal }) => {
  const [updateFoodEntry] = useUpdateFoodEntryMutation();
  const [addFoodEntry] = useAddFoodEntryMutation();

  const handleFormSubmit = async (values: FoodEntry) => {
    try {
      if (foodEntry?._id) {
        await updateFoodEntry(values).unwrap();
      } else {
        await addFoodEntry(values).unwrap();
      }
      NotificationManager.success("Entry saved successfully");
    } catch (error: any) {
      NotificationManager.error(error.data.message);
      console.log(error);
    }
    closeModal();
  };

  const formatDate = (date: string) => {
    const now = new Date(date);
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    return now.toISOString().slice(0, 16);
  };

  return (
    <CustomBox
      sx={{
        p: {
          xs: "1.25rem",
          md: "1.5rem",
        },
      }}
    >
      <Formik
        initialValues={foodEntry ?? (initialValues as FoodEntry)}
        enableReinitialize={true}
        validationSchema={formSchema}
        onSubmit={handleFormSubmit}
      >
        {({
          values,
          errors,
          touched,
          isSubmitting,
          handleChange,
          handleBlur,
          handleSubmit,
        }) => (
          <form onSubmit={handleSubmit} noValidate>
            <H6 mb="1.5rem" fontSize="16px" fontWeight={600}>
              Add Food Entry
            </H6>

            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <CustomTextField
                  fullWidth
                  label="Name"
                  name="name"
                  value={values.name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={Boolean(errors.name && touched.name)}
                  helperText={errors.name && touched.name && errors.name}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <CustomTextField
                  fullWidth
                  label="Calorie"
                  name="calorie"
                  type="number"
                  value={values.calorie}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={Boolean(errors.calorie && touched.calorie)}
                  helperText={
                    errors.calorie && touched.calorie && errors.calorie
                  }
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <CustomTextField
                  select
                  fullWidth
                  label="Meal"
                  name="meal"
                  value={values.meal}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={Boolean(errors.meal && touched.meal)}
                  helperText={errors.meal && touched.meal && errors.meal}
                >
                  <MenuItem value="breakfast">Breakfast</MenuItem>
                  <MenuItem value="lunch">Lunch</MenuItem>
                  <MenuItem value="dinner">Dinner</MenuItem>
                  <MenuItem value="snack">Snack</MenuItem>
                </CustomTextField>
              </Grid>
              <Grid item xs={12} md={6}>
                <CustomTextField
                  fullWidth
                  label="Date"
                  name="date"
                  type="datetime-local"
                  value={Boolean(values.date) && formatDate(values.date)}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={Boolean(errors.date && touched.date)}
                  helperText={errors.date && touched.date && errors.date}
                />
              </Grid>
            </Grid>

            <CustomFlexBox sx={{ justifyContent: "flex-end", mt: "2.5rem" }}>
              <Button
                sx={{ mr: "1.25rem", minWidth: 120 }}
                color="primary"
                variant="outlined"
                onClick={closeModal}
              >
                Cancel
              </Button>
              <LoadingButton
                sx={{ minWidth: 120 }}
                type="submit"
                color="primary"
                variant="contained"
                loading={isSubmitting}
              >
                Save
              </LoadingButton>
            </CustomFlexBox>
          </form>
        )}
      </Formik>
    </CustomBox>
  );
};

const initialValues: Partial<FoodEntry> = {
  name: "",
  calorie: "" as any,
  meal: "",
  date: new Date().toISOString(),
};

const formSchema = yup.object().shape({
  name: yup.string().required("Food name is required"),
  calorie: yup.string().required("Calorie name is required"),
  meal: yup.string().required("Meal is required"),
  date: yup.string().required("Date is required"),
});

export default FoodEntryEditor;
