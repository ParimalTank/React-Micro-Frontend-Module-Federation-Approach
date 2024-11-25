import React, { useState } from "react";
import Navbars from "../components/Navbars";
import MuiAlert from "@mui/material/Alert";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import {
  Grid,
  CardContent,
  Button,
  Snackbar,
  FormControl,
  InputLabel,
  Input,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

// For Password Encrypt and decrypt
const bcrypt = require("bcryptjs-react");

// Data
const initialValues = {
  validateOnMount: true,
  currentPassword: "",
  password: "",
  confirmPassword: "",
};

// for password validation
const lowercaseRegEx = /(?=.*[a-z])/;
const uppercaseRegEx = /(?=.*[A-Z])/;
const numericRegEx = /(?=.*[0-9])/;
const lengthRegEx = /(?=.{8,})/;

// validation
let signUpSchema = Yup.object().shape({
  currentPassword: Yup.string().required("Required!"),
  password: Yup.string()
    .matches(
      lowercaseRegEx,
      "Must contains one lowercase alphabetical character!"
    )
    .matches(
      uppercaseRegEx,
      "Must contains one uppercase alphabetical character"
    )
    .matches(numericRegEx, "Must contains one Numeric character!")
    .matches(lengthRegEx, "Must contain 8 characters!")
    .required("Required!"),

  confirmPassword: Yup.string().required("Required!"),
});

export const ChangePassword = () => {
  const navigate = useNavigate();

  const loginUserData = JSON.parse(localStorage.getItem("LoginUserData"));
  const state = loginUserData.pop();

  // For Success Or Alert Message
  const [openError, setOpenError] = React.useState(false);

  const [openSuccess, setOpenSuccess] = React.useState(false);

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

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleClickShowCurrentPassword = () =>
    setShowCurrentPassword((show) => !show);
  const handleClickShowConfirmPassword = () =>
    setShowConfirmPassword((show) => !show);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleMouseDownCurrentPassword = (event) => {
    event.preventDefault();
  };

  const handleMouseDownConfirmPassword = (event) => {
    event.preventDefault();
  };

  const onSubmit = (values) => {
    const getData = JSON.parse(localStorage.getItem("userData"));

    const index = getData.find((e) => e.email === state.email);

    // Compare Users Existing Password
    bcrypt
      .compare(values.currentPassword, index.password)
      .then((result) => {
        if (result === false) {
          handleError();
        } else {
          const salt = bcrypt.genSaltSync(10);
          const hash = bcrypt.hashSync(values.password, salt);
          index["password"] = hash;

          localStorage.setItem("userData", JSON.stringify(getData));
          handleSuccess();
          navigate("/dashboard/editprofile");
        }
      })
      .catch((error) => {
        console.log("error: ", error);
      });
  };

  return (
    <div>
      <Navbars />

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
          Current Password Not Match
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
          Password Updated Successfully
        </Alert>
      </Snackbar>

      <div className="main-sign-up">
        <div className="row container m-auto flex-column justify-content-center  align-items-center sign-up">
          <div className="d-flex flex-column justify-content-center align-items-center bg-white form-style col-lg-8 ">
            <h2>Change Password</h2>

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
                          <Grid item xs={12} sm={12} lg={12}>
                            <FormControl variant="standard" fullWidth>
                              <InputLabel htmlFor="standard-adornment-password">
                                Current Password*
                              </InputLabel>
                              <Input
                                id="currentPassword"
                                type={showCurrentPassword ? "text" : "password"}
                                name="currentPassword"
                                defaultValue={values.currentPassword}
                                onChange={(e) =>
                                  handleInputChange(e, "currentPassword")
                                }
                                isValid={
                                  touched.currentPassword &&
                                  !errors.currentPassword
                                }
                                endAdornment={
                                  <InputAdornment position="end">
                                    <IconButton
                                      aria-label="toggle password visibility"
                                      onClick={handleClickShowCurrentPassword}
                                      onMouseDown={
                                        handleMouseDownCurrentPassword
                                      }
                                    >
                                      {showCurrentPassword ? (
                                        <VisibilityOff />
                                      ) : (
                                        <Visibility />
                                      )}
                                    </IconButton>
                                  </InputAdornment>
                                }
                              />
                            </FormControl>
                            {errors.currentPassword ? (
                              <span className="text-danger error-text mb-0">
                                {errors.currentPassword}
                              </span>
                            ) : null}
                          </Grid>

                          <Grid item xs={12} sm={12} lg={12}>
                            <FormControl variant="standard" fullWidth>
                              <InputLabel htmlFor="standard-adornment-password">
                                Password*
                              </InputLabel>
                              <Input
                                id="password"
                                type={showPassword ? "text" : "password"}
                                name="password"
                                defaultValue={values.password}
                                onChange={(e) =>
                                  handleInputChange(e, "password")
                                }
                                isValid={touched.password && !errors.password}
                                endAdornment={
                                  <InputAdornment position="end">
                                    <IconButton
                                      aria-label="toggle password visibility"
                                      onClick={handleClickShowPassword}
                                      onMouseDown={handleMouseDownPassword}
                                    >
                                      {showPassword ? (
                                        <VisibilityOff />
                                      ) : (
                                        <Visibility />
                                      )}
                                    </IconButton>
                                  </InputAdornment>
                                }
                              />
                            </FormControl>
                            {errors.password ? (
                              <span className="text-danger error-text mb-0">
                                {errors.password}
                              </span>
                            ) : null}
                          </Grid>

                          <Grid item xs={12} sm={12} lg={12}>
                            <FormControl variant="standard" fullWidth>
                              <InputLabel htmlFor="standard-adornment-password">
                                Confirm Password*
                              </InputLabel>
                              <Input
                                id="confirmPassword"
                                type={showConfirmPassword ? "text" : "password"}
                                fullWidth
                                name="confirmPassword"
                                defaultValue={values.confirmPassword}
                                onChange={(e) =>
                                  handleInputChange(e, "confirmPassword")
                                }
                                isValid={
                                  touched.confirmPassword &&
                                  !errors.confirmPassword
                                }
                                endAdornment={
                                  <InputAdornment position="end">
                                    <IconButton
                                      aria-label="toggle password visibility"
                                      onClick={handleClickShowConfirmPassword}
                                      onMouseDown={
                                        handleMouseDownConfirmPassword
                                      }
                                    >
                                      {showConfirmPassword ? (
                                        <VisibilityOff />
                                      ) : (
                                        <Visibility />
                                      )}
                                    </IconButton>
                                  </InputAdornment>
                                }
                              />
                            </FormControl>
                            {values.confirmPassword &&
                            values.confirmPassword !== values.password ? (
                              <span className="text-danger error-text mb-0">
                                Password not match
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
          </div>
        </div>
      </div>
    </div>
  );
};
