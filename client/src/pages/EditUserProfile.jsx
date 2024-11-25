import React, { useState } from "react";
import Navbars from "../components/Navbars";

import { Link, useLocation } from "react-router-dom";
import MuiAlert from "@mui/material/Alert";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { TextField, Grid, CardContent, Button, Snackbar } from "@mui/material";

// validation
let signUpSchema = Yup.object().shape({
  firstName: Yup.string().required("FirstName is require"),
  lastName: Yup.string().required("LastName is require"),
  email: Yup.string().email("Invalid email").required("Email is require"),
  mobile: Yup.string()
    .min(10, "Mobile number should be at least 10 Digit")
    .required("Required"),
});

const EditUserProfile = () => {
  const loginUserData = JSON.parse(localStorage.getItem("LoginUserData"));
  const state = loginUserData.pop();

  // For Success Or Alert Message
  const [openError, setOpenError] = useState(false);

  const [openSuccess, setOpenSuccess] = useState(false);

  const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  });

  const handleError = () => {
    setOpenError(true);
  };

  const handleSuccess = () => {
    setOpenSuccess(true);
  };

  const handleCloseError = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenError(false);
  };

  const handleCloseSuccess = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenSuccess(false);
  };

  const getData = JSON.parse(localStorage.getItem("userData"));

  const updatedUserValues = getData.filter((user) => {
    return user.email === state.email;
  })[0];

  // Data
  const initialValues = {
    validateOnMount: true,
    firstName: updatedUserValues.firstName || "",
    lastName: updatedUserValues.lastName || "",
    email: updatedUserValues.email || "",
    mobile: updatedUserValues.mobile || "",
  };

  const onSubmit = (values) => {
    const getData = JSON.parse(localStorage.getItem("userData"));

    // Check Existing Users email id Index
    let getIndex;
    getData.map((user, index) => {
      if (user.email === state.email) {
        getIndex = index;
      }
    });

    getData.map((user, index) => {
      // Case 1: If the Entered Email id and local storage email and also compare index of this email
      if (user.email === values.email && index === getIndex) {
        user["firstName"] = values.firstName;
        user["lastName"] = values.lastName;
        user["email"] = values.email;
        user["mobile"] = values.mobile;

        // add updated user information object to localStorage
        localStorage.setItem("userData", JSON.stringify(getData));
        handleSuccess();
      } else if (user.email === values.email && index !== getIndex) {
        handleError();
      } else if (user.email !== values.email) {
        // Check If Email is Already Exist with Entered Email
        let userExistOrNot = false;
        getData.map((result) => {
          if (result.email === values.email) {
            userExistOrNot = true;
          }
        });

        if (userExistOrNot) {
          handleError();
        } else {
          user["firstName"] = values.firstName;
          user["lastName"] = values.lastName;
          user["email"] = values.email;
          user["mobile"] = values.mobile;

          // add updated user information object to localStorage
          localStorage.setItem("userData", JSON.stringify(getData));

          const getLoginUserData = JSON.parse(
            localStorage.getItem("LoginUserData")
          );

          // Updated Value Store into a Object
          getLoginUserData[0]["firstName"] = values.firstName;
          getLoginUserData[0]["lastName"] = values.lastName;
          getLoginUserData[0]["email"] = values.email;
          getLoginUserData[0]["mobile"] = values.mobile;

          // add new user object to localStorage
          localStorage.setItem(
            "LoginUserData",
            JSON.stringify(getLoginUserData)
          );
          handleSuccess();
        }
      }
    });
  };

  return (
    <div>
      <Snackbar
        open={openError}
        autoHideDuration={2000}
        onClose={handleCloseError}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={handleCloseError}
          severity="error"
          sx={{ width: "100%" }}
          className="my-5"
        >
          Email Id is Already in Used
        </Alert>
      </Snackbar>

      <Snackbar
        open={openSuccess}
        autoHideDuration={2000}
        onClose={handleCloseSuccess}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={handleCloseSuccess}
          severity="success"
          sx={{ width: "100%" }}
          className="my-5"
        >
          User Updated Successfully
        </Alert>
      </Snackbar>

      <Navbars />

      <div className="main-sign-up">
        <div className="row container m-auto flex-column justify-content-center  align-items-center sign-up">
          <div className="d-flex flex-column justify-content-center align-items-center bg-white form-style col-lg-8 ">
            <h2>Edit Profile</h2>

            <Formik
              initialValues={initialValues}
              validationSchema={signUpSchema}
              onSubmit={onSubmit}
              validateOnChange={false} // Disable validation every field change
              validateOnBlur={false} // Disable validation every field blur
            >
              {({
                dirty,
                isValid,
                values,
                touched,
                errors,
                handleChange,
                validateField,
                handleBlur,
              }) => {
                // Avoid a race condition to allow each field to be validated on change
                const handleInputChange = async (e, fieldName) => {
                  await handleChange(e);
                  validateField(fieldName);
                };

                return (
                  <Form>
                    <CardContent>
                      <Grid
                        container
                        className="justify-content-center"
                        spacing={1}
                      >
                        <Grid container md={8} spacing={1}>
                          <Grid item xs={12} sm={12} lg={6}>
                            <TextField
                              fullWidth
                              id="firstName"
                              label="FirstName"
                              variant="standard"
                              name="firstName"
                              value={values.firstName}
                              onChange={(e) =>
                                handleInputChange(e, "firstName")
                              }
                              isValid={touched.firstName && !errors.firstName}
                              isInvalid={!!errors.firstName}
                            />
                            {errors.firstName ? (
                              <span className="text-danger error-text mb-0">
                                {errors.firstName}
                              </span>
                            ) : null}
                          </Grid>
                          <Grid item xs={12} sm={12} lg={6}>
                            <TextField
                              fullWidth
                              id="lastName"
                              label="LastName"
                              variant="standard"
                              name="lastName"
                              value={values.lastName}
                              onChange={(e) => handleInputChange(e, "lastName")}
                              isValid={touched.lastName && !errors.lastName}
                            />
                            {errors.lastName ? (
                              <span className="text-danger error-text mb-0">
                                {errors.lastName}
                              </span>
                            ) : null}
                          </Grid>

                          <Grid item xs={12} sm={12} lg={12}>
                            <TextField
                              fullWidth
                              id="email"
                              label="Email"
                              variant="standard"
                              name="email"
                              value={values.email}
                              onChange={(e) => handleInputChange(e, "email")}
                              isValid={touched.email && !errors.email}
                            />
                            {errors.email ? (
                              <span className="text-danger error-text mb-0">
                                {errors.email}
                              </span>
                            ) : null}
                          </Grid>

                          <Grid item xs={12} sm={12} lg={12}>
                            <TextField
                              fullWidth
                              id="mobile"
                              label="MobileNumber"
                              variant="standard"
                              name="mobile"
                              type="number"
                              value={values.mobile}
                              onChange={(e) => handleInputChange(e, "mobile")}
                              handleBlur={handleBlur}
                              isValid={touched.mobile && !errors.mobile}
                            />
                            {errors.mobile ? (
                              <span className="text-danger error-text mb-0">
                                {errors.mobile}
                              </span>
                            ) : null}
                          </Grid>
                          <Grid item>
                            <Button
                              disabled={!isValid}
                              variant="contained"
                              type="submit"
                            >
                              SUBMIT
                            </Button>
                          </Grid>
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Form>
                );
              }}
            </Formik>
            <div className="d-flex align-items-center justify-content-center">
              <h6 className="p-0 mb-0">Want to change your password?</h6>
              <Button variant="text" className="mx-3">
                <Link
                  to="/dashboard/editprofile/changepassword"
                  className="text-decoration-none"
                  id="change-password"
                >
                  Change Password
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditUserProfile;
