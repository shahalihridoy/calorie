import CustomBox from "@components/atoms/CustomBox";
import CustomFlexBox from "@components/atoms/CustomFlexBox";
import CustomTextField from "@components/atoms/CustomTextField";
import NotificationManager from "@components/atoms/NotificationManager";
import { H6 } from "@components/atoms/Typography";
import { useAppDispatch, useAppSelector } from "@hooks/reduxHooks";
import { LoadingButton } from "@mui/lab";
import { Button, Grid, MenuItem } from "@mui/material";
import { getAllUsers } from "@redux/auth/authApi";
import {
  useAddFoodEntryMutation,
  useUpdateFoodEntryMutation,
} from "@redux/food/foodApi";
import { getMealsByUser } from "@redux/meal/mealApi";
import { AuthRoles } from "@shared/enums";
import { FoodEntry, Meal, User } from "@shared/types";
import { Formik } from "formik";
import React, { FC, useEffect, useState } from "react";
import * as yup from "yup";

interface Props {
  foodEntry?: FoodEntry;
  closeModal: () => void;
}

const FoodEntryEditor: FC<Props> = ({ foodEntry, closeModal }) => {
  const [meals, setMeals] = useState<Meal[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<string>();
  const [updateFoodEntry] = useUpdateFoodEntryMutation();
  const [addFoodEntry] = useAddFoodEntryMutation();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const foodEntryUser = foodEntry?.user;

  const handleFormSubmit = async (values: FoodEntry) => {
    const meal = meals.find((meal) => meal._id === values.meal) as Meal;
    try {
      if (foodEntry?._id) {
        await updateFoodEntry({ entry: values, meal }).unwrap();
      } else if (selectedUser) {
        values.user = selectedUser;
        await addFoodEntry({ entry: values, meal }).unwrap();
      } else return;
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

  const handleUserChange =
    (setFieldValue: any) => (e: React.ChangeEvent<HTMLInputElement>) => {
      const selectedUserId = e.target.value;
      setSelectedUser(selectedUserId);
      setFieldValue("user", selectedUserId);
      setFieldValue("meal", "");
    };

  useEffect(() => {
    if (selectedUser) {
      dispatch(getMealsByUser.initiate(selectedUser)).then(
        ({ data: meals }) => {
          setMeals(meals);
        },
      );
    }
  }, [dispatch, selectedUser]);

  useEffect(() => {
    if (user?.role === AuthRoles.USER) {
      setSelectedUser(user?._id);
    } else {
      if (foodEntryUser) {
        setSelectedUser(foodEntryUser);
      }
      dispatch(getAllUsers.initiate()).then(({ data: users }) => {
        setUsers(users);
      });
    }
  }, [user, foodEntryUser, dispatch]);

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
          setFieldValue,
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
              {user?.role === AuthRoles.ADMIN && (
                <Grid item xs={12} md={6}>
                  <CustomTextField
                    select
                    fullWidth
                    label="User"
                    name="user"
                    value={values.user}
                    onChange={handleUserChange(setFieldValue)}
                    onBlur={handleBlur}
                    error={Boolean(errors.user && touched.user)}
                    helperText={errors.user && touched.user && errors.user}
                  >
                    {users.map((user) => (
                      <MenuItem value={user._id} key={user._id}>
                        {user.name}
                      </MenuItem>
                    ))}
                  </CustomTextField>
                </Grid>
              )}
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
                  {meals.map((meal) => (
                    <MenuItem value={meal._id} key={meal._id}>
                      {meal.name}
                    </MenuItem>
                  ))}
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
