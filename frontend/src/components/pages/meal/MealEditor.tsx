import CustomBox from "@components/atoms/CustomBox";
import CustomFlexBox from "@components/atoms/CustomFlexBox";
import CustomTextField from "@components/atoms/CustomTextField";
import NotificationManager from "@components/atoms/NotificationManager";
import { H6 } from "@components/atoms/Typography";
import { LoadingButton } from "@mui/lab";
import { Button, Grid } from "@mui/material";
import { useAddMealMutation, useUpdateMealMutation } from "@redux/meal/mealApi";
import { Meal } from "@shared/types";
import { Formik } from "formik";
import React, { FC } from "react";
import * as yup from "yup";

interface Props {
  meal?: Meal;
  closeModal: () => void;
}

const MealEditor: FC<Props> = ({ meal, closeModal }) => {
  const [updateMeal] = useUpdateMealMutation();
  const [addMeal] = useAddMealMutation();

  const handleFormSubmit = async (values: Meal) => {
    try {
      if (meal?._id) {
        await updateMeal(values).unwrap();
      } else {
        await addMeal(values).unwrap();
      }
      NotificationManager.success("Entry saved successfully");
    } catch (error: any) {
      NotificationManager.error(error.data.message);
      console.log(error);
    }
    closeModal();
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
        initialValues={meal ?? (initialValues as Meal)}
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
              Add Meal
            </H6>

            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <CustomTextField
                  fullWidth
                  label="Meal Name"
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
                  label="Maximum Number of Food"
                  name="maxFoodItemCount"
                  value={values.maxFoodItemCount}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={Boolean(
                    errors.maxFoodItemCount && touched.maxFoodItemCount,
                  )}
                  helperText={
                    errors.maxFoodItemCount &&
                    touched.maxFoodItemCount &&
                    errors.maxFoodItemCount
                  }
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

const initialValues: Partial<Meal> = {
  name: "",
  maxFoodItemCount: 1,
};

const formSchema = yup.object().shape({
  name: yup.string().required("Meal name is required"),
  maxFoodItemCount: yup.number().required("Maximum food number is required"),
});

export default MealEditor;
