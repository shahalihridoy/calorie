import CustomBox from "@components/atoms/CustomBox";
import CustomFlexBox from "@components/atoms/CustomFlexBox";
import CustomTextField from "@components/atoms/CustomTextField";
import NotificationManager from "@components/atoms/NotificationManager";
import { H6, Span } from "@components/atoms/Typography";
import { useAppDispatch } from "@hooks/reduxHooks";
import { LoadingButton } from "@mui/lab";
import { Button, Dialog, Grid } from "@mui/material";
import { inviteUser } from "@redux/auth/authApi";
import { Formik } from "formik";
import React, { useState, VFC } from "react";
import * as yup from "yup";

const InviteUser: VFC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dispatch = useAppDispatch();

  const toggleModal = () => {
    setIsOpen(!isOpen);
  };

  const handleFormSubmit = async (values: any) => {
    try {
      const user = await dispatch(inviteUser.initiate(values)).unwrap();
      console.log(user);
      NotificationManager.success("User was invited successfully");
      toggleModal();
    } catch (error: any) {
      NotificationManager.error(error.data.message);
      console.log(error);
      toggleModal();
    }
  };

  return (
    <>
      <Button
        variant="outlined"
        color="primary"
        sx={{ ml: "1rem" }}
        onClick={toggleModal}
      >
        <Span>Invite</Span>
      </Button>
      <Dialog
        maxWidth="sm"
        scroll="body"
        fullWidth
        open={isOpen}
        onClose={toggleModal}
      >
        <Formik
          initialValues={initialValues}
          validationSchema={formSchema}
          onSubmit={handleFormSubmit}
        >
          {({
            values,
            touched,
            errors,
            isSubmitting,
            handleChange,
            handleBlur,
            handleSubmit,
          }) => (
            <CustomBox
              sx={{
                p: {
                  xs: "1.25rem",
                  md: "1.5rem",
                },
              }}
            >
              <form noValidate onSubmit={handleSubmit}>
                <H6 mb="1.5rem" fontSize="16px" fontWeight={600}>
                  Invite User
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
                      label="Email"
                      name="email"
                      value={values.email}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={Boolean(errors.email && touched.email)}
                      helperText={errors.email && touched.email && errors.email}
                    />
                  </Grid>
                </Grid>

                <CustomFlexBox
                  sx={{ justifyContent: "flex-end", mt: "2.5rem" }}
                >
                  <Button
                    sx={{ mr: "1.25rem", minWidth: 120 }}
                    color="primary"
                    variant="outlined"
                    onClick={toggleModal}
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
                    Invite
                  </LoadingButton>
                </CustomFlexBox>
              </form>
            </CustomBox>
          )}
        </Formik>
      </Dialog>
    </>
  );
};

const initialValues = {
  name: "",
  email: "",
};

const formSchema = yup.object().shape({
  name: yup.string().required("User name is required"),
  email: yup.string().email("Invalid email").required("Email name is required"),
});

export default InviteUser;
