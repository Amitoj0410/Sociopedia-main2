import { useState } from "react";
import {
  Box,
  Button,
  TextField,
  useMediaQuery,
  Typography,
  useTheme,
} from "@mui/material";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
// import { EditOutlined } from "@mui/icons-material";
import { Formik } from "formik";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setLogin } from "state";
import Dropzone from "react-dropzone";
import FlexBetween from "components/FlexBetween";
import Alert from "@mui/material/Alert";
import { ClipLoader } from "react-spinners";

// <Alert severity="error">This is an error Alert.</Alert>
const registerSchema = yup.object().shape({
  firstName: yup.string().required("required"),
  lastName: yup.string().required("required"),
  email: yup.string().email("invalid email").required("required"),
  password: yup.string().required("required"),
  location: yup.string().required("required"),
  occupation: yup.string().required("required"),
  picture: yup.string().required("required"),
});

const loginSchema = yup.object().shape({
  email: yup.string().email("invalid email").required("required"),
  password: yup.string().required("required"),
});

const forgotPasswordSchema = yup.object().shape({
  email: yup.string().email("invalid email").required("required"),
  otp: yup.string().required("required"),
});

const initialValuesRegister = {
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  location: "",
  occupation: "",
  picture: "",
};

const initialValuesLogin = {
  email: "",
  password: "",
};

const initialValuesForgotPassword = {
  email: "",
  otp: "",
};

const Form = () => {
  const [pageType, setPageType] = useState("login");
  const { palette } = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isNonMobile = useMediaQuery("(min-width: 600px)");
  const isLogin = pageType === "login";
  const isRegister = pageType === "register";
  const isForgotPassword = pageType === "forgotPassword";

  const [alert, setAlert] = useState("");

  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  // const [otp, setOtp] = useState[""];
  const register = async (values, onSubmitProps) => {
    // this allows us to send form info with image
    const formData = new FormData();
    for (let value in values) {
      formData.append(value, values[value]);
    }
    // formData.append("picturePath", values.picture.name);

    const savedUserResponse = await fetch(
      "http://localhost:3001/auth/register",
      {
        method: "POST",
        body: formData,
      }
    );
    const savedUser = await savedUserResponse.json();
    onSubmitProps.resetForm();
    // console.log(savedUser);

    if (!savedUser.msg) {
      setPageType("login");
      // console.log("User Saved");
    } else {
      // console.error("Error : User not Saved");
      setAlert(savedUser.msg);
    }
    setIsButtonDisabled(false);
  };

  const login = async (values, onSubmitProps) => {
    // console.log("hello");
    try {
      const loggedInResponse = await fetch("http://localhost:3001/auth/login", {
        method: "POST",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify(values),
      });
      // console.log("aa gya response");
      const loggedIn = await loggedInResponse.json();
      onSubmitProps.resetForm();
      // console.log(loggedIn.user);
      if (loggedIn.user && loggedIn.token) {
        //   console.log("yaha tak reached");
        dispatch(
          setLogin({
            user: loggedIn.user,
            token: loggedIn.token,
            notifications: loggedIn.user.notifications,
          })
        );
        navigate("/home");
        // console.log("Login Success");
      } else {
        // console.error(loggedIn.msg);
        setAlert(loggedIn.msg);
      }
      setIsButtonDisabled(false);
    } catch (error) {
      console.error("Error logging in: ", error.message);
    }
  };

  const forgotPassword = async (values, onSubmitProps) => {
    const loggedInResponse = await fetch("http://localhost:3001/auth/login", {
      method: "POST",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify(values),
    });
    const loggedIn = await loggedInResponse.json();
    onSubmitProps.resetForm();
    // console.log(loggedIn.user);
    if (loggedIn.user && loggedIn.token) {
      //   console.log("yaha tak reached");
      dispatch(
        setLogin({
          user: loggedIn.user,
          token: loggedIn.token,
        })
      );
      navigate("/home");
      // console.log("Login Success");
    } else {
      // console.error(loggedIn.msg);
      setAlert(loggedIn.msg);
    }
    setIsButtonDisabled(false);
  };

  const handleFormSubmit = async (values, onSubmitProps) => {
    setIsButtonDisabled(!isButtonDisabled);
    if (isLogin) await login(values, onSubmitProps);
    if (isRegister) await register(values, onSubmitProps);
    if (isForgotPassword) await forgotPassword(values, onSubmitProps);
  };

  // const handleSendOTP = async () => {
  //   const response = await fetch(`http://localhost:3001/auth/forgotPassword`, {
  //     method: "POST",
  //     body: {
  //       email: JSON.stringify(values.email),
  //     },
  //   });
  //   const res = await response.json();
  //   console.log(res);
  // };

  return (
    <Formik
      onSubmit={handleFormSubmit}
      // initialValues={isLogin ? initialValuesLogin : initialValuesRegister}
      initialValues={
        isLogin
          ? initialValuesLogin
          : isForgotPassword
          ? initialValuesForgotPassword
          : initialValuesRegister
      }
      // validationSchema={isLogin ? loginSchema : registerSchema}
      validationSchema={
        isLogin
          ? loginSchema
          : isForgotPassword
          ? forgotPasswordSchema
          : registerSchema
      }
    >
      {/* Funky syntax ahead :| */}
      {({
        values,
        errors,
        touched,
        handleBlur,
        handleChange,
        handleSubmit,
        setFieldValue,
        resetForm,
      }) => (
        <form onSubmit={handleSubmit}>
          <Box
            display="grid"
            gap="30px"
            gridTemplateColumns="repeat(4, minmax(0, 1fr))"
            sx={{
              "& > div": { gridColumn: isNonMobile ? undefined : "span 4" },
            }}
          >
            {isRegister && (
              <>
                <TextField
                  label="First Name"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.firstName}
                  name="firstName"
                  error={
                    Boolean(touched.firstName) && Boolean(errors.firstName)
                  }
                  helperText={touched.firstName && errors.firstName}
                  sx={{ gridColumn: "span 2" }}
                />
                <TextField
                  label="Last Name"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.lastName}
                  name="lastName"
                  error={Boolean(touched.lastName) && Boolean(errors.lastName)}
                  helperText={touched.lastName && errors.lastName}
                  sx={{ gridColumn: "span 2" }}
                />
                <TextField
                  label="Location"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.location}
                  name="location"
                  error={Boolean(touched.location) && Boolean(errors.location)}
                  helperText={touched.location && errors.location}
                  sx={{ gridColumn: "span 4" }}
                />
                <TextField
                  label="Occupation"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.occupation}
                  name="occupation"
                  error={
                    Boolean(touched.occupation) && Boolean(errors.occupation)
                  }
                  helperText={touched.occupation && errors.occupation}
                  sx={{ gridColumn: "span 4" }}
                />
                <Box
                  gridColumn="span 4"
                  border={`1px solid ${palette.neutral.medium}`}
                  borderRadius="5px"
                  p="1rem"
                >
                  <Dropzone
                    acceptedFiles=".jpg,.jpeg,.png"
                    multiple={false}
                    onDrop={(acceptedFiles) =>
                      setFieldValue("picture", acceptedFiles[0])
                    }
                  >
                    {({ getRootProps, getInputProps }) => (
                      <Box
                        {...getRootProps()}
                        border={`2px dashed ${palette.primary.main}`}
                        p="1rem"
                        sx={{ "&:hover": { cursor: "pointer" } }}
                      >
                        <input {...getInputProps()} />
                        {!values.picture ? (
                          <p>Add Picture Here</p>
                        ) : (
                          <FlexBetween>
                            <Typography>{values.picture.name}</Typography>
                            <EditOutlinedIcon />
                          </FlexBetween>
                        )}
                      </Box>
                    )}
                  </Dropzone>
                </Box>
              </>
            )}
            {(isRegister || isLogin || isForgotPassword) && (
              <>
                <TextField
                  label="Email"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.email}
                  name="email"
                  error={Boolean(touched.email) && Boolean(errors.email)}
                  helperText={touched.email && errors.email}
                  // sx={{ gridColumn: "span 4" }}
                  sx={{ gridColumn: isForgotPassword ? "span 3" : "span 4" }}
                />
                {isForgotPassword && (
                  <>
                    <Button
                      fullWidth
                      type="submit"
                      sx={{
                        p: "1rem",
                        backgroundColor: isButtonDisabled
                          ? palette.neutral.light
                          : palette.primary.main,
                        color: palette.background.alt,
                        "&:hover": { color: palette.primary.main },
                        gridColumn: "span 1",
                      }}
                      // onClick={handleSendOTP}
                    >
                      SEND OTP
                    </Button>
                    <TextField
                      label="Enter OTP"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.otp}
                      name="otp"
                      error={Boolean(touched.otp) && Boolean(errors.otp)}
                      helperText={touched.otp && errors.otp}
                      sx={{ gridColumn: "span 4" }}
                    />
                  </>
                )}
              </>
            )}
            {(isLogin || isRegister) && (
              <TextField
                label="Password"
                type="password"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.password}
                name="password"
                error={Boolean(touched.password) && Boolean(errors.password)}
                helperText={touched.password && errors.password}
                sx={{ gridColumn: "span 4" }}
              />
            )}
            {/* Trying create fake person credentials btn */}
            {isLogin && (
              <Button
                fullWidth
                // type="submit"
                sx={{
                  // m: "2rem 0",
                  p: "1rem",
                  backgroundColor: isButtonDisabled
                    ? palette.neutral.light
                    : "red",
                  color: palette.background.alt,
                  "&:hover": { color: "red" },
                  gridColumn: "span 4",
                }}
                disabled={isButtonDisabled}
                onClick={() => {
                  // console.log("hii amy");
                  setFieldValue("email", "fakeperson@gmail.com");
                  setFieldValue("password", "123456");
                }}
              >
                USE FAKE PERSON CREDENTIALS
              </Button>
            )}
          </Box>

          {/* ALERT */}
          {alert.length > 0 && (
            <Box sx={{ mt: "1.5rem" }}>
              <Alert
                severity="error"
                sx={{
                  backgroundColor: "#fce4e4", // Light red background
                  color: "#d32f2f", // Dark red text color
                  fontWeight: "bold",
                  border: "1px solid #f44336", // Dark red border
                  borderRadius: "8px",
                  padding: "1rem",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                {/* You can customize the content further */}
                <Typography variant="body1" sx={{ marginRight: "8px" }}>
                  {alert}
                </Typography>
                {/* You can add additional components or styling here */}
              </Alert>
            </Box>
          )}

          {/* BUTTONS */}
          <Box>
            <Button
              fullWidth
              type="submit"
              sx={{
                m: "2rem 0",
                p: "1rem",
                backgroundColor: isButtonDisabled
                  ? palette.neutral.light
                  : palette.primary.main,
                color: palette.background.alt,
                "&:hover": { color: palette.primary.main },
              }}
              disabled={isButtonDisabled}
            >
              {isButtonDisabled && (
                <>
                  <ClipLoader color={palette.primary.main} size={23} />
                </>
              )}
              {/* {isLogin ? "LOGIN" : "REGISTER"} */}
              {isLogin && !isButtonDisabled && "LOGIN"}
              {isRegister && !isButtonDisabled && "REGISTER"}
              {isForgotPassword && !isButtonDisabled && "SUBMIT OTP"}
            </Button>
            <Typography
              onClick={() => {
                setPageType(isLogin ? "register" : "login");
                setAlert("");
                resetForm();
              }}
              sx={{
                textDecoration: "underline",
                color: palette.primary.main,
                "&:hover": {
                  cursor: "pointer",
                  color: palette.primary.light,
                },
              }}
            >
              {isLogin
                ? "Dont have an account sign up here."
                : "Already have an account? Login here"}
            </Typography>

            {/* FOR FORGOT PASSWORD */}
            <Typography
              onClick={() => {
                setPageType("forgotPassword");
                setAlert("");
                resetForm();
              }}
              sx={{
                textDecoration: "underline",
                color: palette.primary.main,
                "&:hover": {
                  cursor: "pointer",
                  color: palette.primary.light,
                },
              }}
            >
              Forgot Password
            </Typography>
          </Box>
        </form>
      )}
    </Formik>
  );
};

export default Form;
