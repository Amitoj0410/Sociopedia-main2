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

// const loginSchema = yup.object().shape({
//   email: yup.string().email("invalid email").required("required"),
//   password: yup.string().required("required"),
// });
const resetPasswordSchema = yup.object().shape({
  email: yup.string().email("invalid email").required("required"),
  password: yup.string().required("required"),
});

// const initialValuesLogin = {
//   email: "",
//   password: "",
// };
const initialValuesResetPassword = {
  newPassword: "",
  confirmPassword: "",
};

const Form = () => {
  //   const [pageType, setPageType] = useState("login");
  const { palette } = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isNonMobile = useMediaQuery("(min-width: 600px)");
  //   const isLogin = pageType === "login";
  //   const isRegister = pageType === "register";

  const [alert, setAlert] = useState("");

  //   const login = async (values, onSubmitProps) => {
  //     const loggedInResponse = await fetch(
  //       "https://socialpedia-server-main-v2.onrender.com/auth/login",
  //       {
  //         method: "POST",
  //         headers: { "Content-type": "application/json" },
  //         body: JSON.stringify(values),
  //       }
  //     );
  //     const loggedIn = await loggedInResponse.json();
  //     onSubmitProps.resetForm();
  //     // console.log(loggedIn.user);
  //     if (loggedIn.user && loggedIn.token) {
  //       //   console.log("yaha tak reached");
  //       dispatch(
  //         setLogin({
  //           user: loggedIn.user,
  //           token: loggedIn.token,
  //         })
  //       );
  //       navigate("/home");
  //       console.log("Login Success");
  //     } else {
  //       console.error(loggedIn.msg);
  //       setAlert(loggedIn.msg);
  //     }
  //   };
  const resetPassword = async (values, onSubmitProps) => {
    const resetPasswordResponse = await fetch(
      //   "https://socialpedia-server-main-v2.onrender.com/auth/login",
      "https://socialpedia-server-main-v2.onrender.com/auth/reset_password/eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1Y2RiODRmNzljOTZkYmNlNDhjZTBkOCIsImlhdCI6MTcwNzk4NTU1NCwiZXhwIjoxNzA3OTg5MTU0fQ.cl5laGS5Af_eZ_tymUVTecdrtOUdx04AxIoomrs_yDc",
      {
        method: "POST",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify(values),
      }
    );
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
  };

  const handleFormSubmit = async (values, onSubmitProps) => {
    // if (isLogin) await login(values, onSubmitProps);
    // if (isRegister) await register(values, onSubmitProps);
    await resetPassword(values, onSubmitProps);
  };

  return (
    <Formik
      onSubmit={handleFormSubmit}
      //   initialValues={isLogin ? initialValuesLogin : initialValuesRegister}
      initialValues={initialValuesResetPassword}
      // validationSchema={isLogin ? loginSchema : registerSchema}
      validationSchema={resetPasswordSchema}
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
            <TextField
              label="newPassword"
              type="password"
              onBlur={handleBlur}
              onChange={handleChange}
              value={values.newPassword}
              name="newPassword"
              error={
                Boolean(touched.newPassword) && Boolean(errors.newPassword)
              }
              helperText={touched.newPassword && errors.newPassword}
              sx={{ gridColumn: "span 4" }}
            />

            <TextField
              label="confirmPassword"
              type="password"
              onBlur={handleBlur}
              onChange={handleChange}
              value={values.confirmPassword}
              name="confirmPassword"
              error={
                Boolean(touched.confirmPassword) &&
                Boolean(errors.confirmPassword)
              }
              helperText={touched.confirmPassword && errors.confirmPassword}
              sx={{ gridColumn: "span 4" }}
            />
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
                backgroundColor: palette.primary.main,
                color: palette.background.alt,
                "&:hover": { color: palette.primary.main },
              }}
            >
              {/* {isLogin ? "LOGIN" : "REGISTER"} */}
              RESET PASSWORD
            </Button>
            {/* <Typography
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
            </Typography> */}
          </Box>
        </form>
      )}
    </Formik>
  );
};

export default Form;
