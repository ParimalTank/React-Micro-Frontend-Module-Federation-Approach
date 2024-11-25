import React, { useState } from "react";
import {
  FormControl,
  IconButton,
  InputAdornment,
  Input,
  InputLabel,
  TextField,
  Grid,
  CardContent,
  Snackbar,
  Button,
} from "@mui/material";
import MuiAlert from "@mui/material/Alert";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { Link, useNavigate } from "react-router-dom";
import { Formik, Form } from "formik";
import * as Yup from "yup";

// For Password Encrypt and decrypt
const bcrypt = require("bcryptjs-react");

// Data
const initialValues = {
  email: "",
  password: "",
};

// for password validation
const lowercaseRegEx = /(?=.*[a-z])/;
const uppercaseRegEx = /(?=.*[A-Z])/;
const numericRegEx = /(?=.*[0-9])/;
const lengthRegEx = /(?=.{8,})/;

// validation
let loginSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Email is require"),
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
});

const Login = () => {
  const [loginUserData, setLoginUserData] = useState([{}]);

  const navigate = useNavigate();

  // For Show Password Button
  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  // Error Or Success Message
  const [openError, setOpenError] = React.useState(false);

  const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  });

  const handleError = () => {
    setOpenError(true);
  };

  const handleCloseError = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenError(false);
  };

  const onSubmit = (values) => {
    // get Data from the localstorage
    const getData = JSON.parse(localStorage.getItem("userData"));

    const getLoginUserData = JSON.parse(localStorage.getItem("LoginUserData"));

    // if array is empty
    const finaldata = getLoginUserData !== null ? getLoginUserData : [];

    const userEmail = values.email;
    const userPassword = values.password;

    // Check User Credentials
    getData.map((user) => {
      if (
        user.email === userEmail &&
        bcrypt.compareSync(userPassword, user.password)
      ) {
        const userObj = {
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          mobile: user.mobile,
          password: user.password,
        };

        // set new user object
        setLoginUserData([...loginUserData, userObj]);

        // add new user object to localstorage
        const userDataArray = [...finaldata, userObj];
        localStorage.setItem("LoginUserData", JSON.stringify(userDataArray));
        navigate("/dashboard");
      } else {
        handleError();
      }
    });
  };

  return (
    <div className="main-login">
      <div className="row container m-auto flex-column justify-content-center  align-items-center login-style">
        <div className="bg-white form-style p-5">
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
            >
              Invalid Credentials
            </Alert>
          </Snackbar>

          <h2>Login</h2>

          <Formik
            initialValues={initialValues}
            validationSchema={loginSchema}
            onSubmit={onSubmit}
            validateOnChange={false} // Disable validation every field change
            validateOnBlur={false} // Disable validation every field blur
          >
            {({
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
                <Form id="login-submit">
                  <CardContent>
                    <Grid
                      container
                      className="justify-content-center"
                      spacing={1}
                    >
                      <Grid container spacing={1}>
                        <Grid item xs={12} sm={12} lg={12}>
                          <TextField
                            required
                            fullWidth
                            id="email"
                            name="email"
                            label="Email"
                            variant="standard"
                            defaultValue={values.email}
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
                          <FormControl variant="standard" fullWidth>
                            <InputLabel htmlFor="standard-adornment-password">
                              Password*
                            </InputLabel>
                            <Input
                              id="password"
                              name="password"
                              defaultValue={values.password}
                              onChange={(e) => handleInputChange(e, "password")}
                              isValid={touched.password && !errors.password}
                              type={showPassword ? "text" : "password"}
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

                        <Grid item className="my-3">
                          <Button variant="contained" type="submit">
                            Login
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
            <h5>don't have a Account?</h5>
            <Button variant="text" className="mx-3" id="signup-btn">
              <Link to="/SignUp" className="text-decoration-none">
                Sign Up
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
