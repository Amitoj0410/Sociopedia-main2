import { useState } from "react";
import {
  Box,
  Button,
  TextField,
  useMediaQuery,
  Typography,
  useTheme,
} from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import Dropzone from "react-dropzone";
import FlexBetween from "components/FlexBetween";
import Alert from "@mui/material/Alert";
import { useSelector, useDispatch } from "react-redux";
import { setUser } from "state";
import { useNavigate } from "react-router-dom";
import { ClipLoader } from "react-spinners";
import UserImage from "components/UserImage";

const editProfileSchema = yup.object().shape({
  firstName: yup.string(),
  lastName: yup.string(),
  // email: yup.string().email("invalid email").required("required"),
  location: yup.string(),
  occupation: yup.string(),
  picture: yup.string(),
});

const Form = () => {
  const { palette } = useTheme();
  const isNonMobile = useMediaQuery("(min-width: 600px)");

  const [alert, setAlert] = useState("");

  const token = useSelector((state) => state.token);
  const userId = useSelector((state) => state.user._id);
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [saveChangesBtnClicked, setSaveChangesBtnClicked] = useState(false);
  const initialValuesEdit = {
    firstName: user.firstName,
    lastName: user.lastName,
    // email: "",
    location: user.location,
    occupation: user.occupation,
    picture: user.picture, //changed at 1:34PM 16 Feb 2024
  };

  const { picturePath } = useSelector((state) => state.user);

  const saveChanges = async (values, onSubmitProps) => {
    setSaveChangesBtnClicked(true);
    // console.log("hello");
    const formData = new FormData();
    // console.log(values.firstName);
    // console.log(values.lastName);
    formData.append("firstName", values.firstName);
    formData.append("lastName", values.lastName);
    formData.append("location", values.location);
    formData.append("occupation", values.occupation);
    formData.append("picture", values.picture); // changed at 1:39 pm same day
    // formData.append("picturePath", values.picture.name); // changed at 1:39 pm same day

    // Append the picture file if it exists
    // if (values.picturePath) {
    // }
    // console.log(formData.get("firstName"));
    try {
      const savedChangesResponse = await fetch(
        `https://socialpedia-serverr.onrender.com/auth/${userId}/editProfile`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      const savedChanges2 = await savedChangesResponse.json();
      // console.log(savedChanges2);
      if (savedChanges2.user) {
        dispatch(
          setUser({
            user: savedChanges2.user,
          })
        );
        navigate("/home");
        // console.log("Profile Updated");
      } else {
        // console.error(savedChanges2.msg);
        setAlert(savedChanges2.msg);
      }
    } catch (error) {
      // console.error("Error while saving changes:", error);
      setAlert("Error while saving changes. Please try again.");
    }

    // Reset the form if onSubmitProps is provided and has a resetForm method
    if (onSubmitProps && onSubmitProps.resetForm) {
      onSubmitProps.resetForm();
    }
  };

  const handleFormSubmit = async (values, onSubmitProps) => {
    // console.log("hello");
    await saveChanges(values, onSubmitProps);
  };
  return (
    <Formik
      onSubmit={handleFormSubmit}
      initialValues={initialValuesEdit}
      validationSchema={editProfileSchema}
    >
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
              label="First Name"
              onBlur={handleBlur}
              onChange={handleChange}
              value={values.firstName}
              name="firstName"
              error={Boolean(touched.firstName) && Boolean(errors.firstName)}
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
              error={Boolean(touched.occupation) && Boolean(errors.occupation)}
              helperText={touched.occupation && errors.occupation}
              sx={{ gridColumn: "span 4" }}
            />
            <Box
              gridColumn="span 4"
              border={`1px solid ${palette.neutral.medium}`}
              borderRadius="5px"
              p="1rem"
              display={"flex"}
              justifyContent={"center"}
              alignItems={"center"}
              flexDirection={"column"}
            >
              <UserImage image={picturePath} size="150px" />
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
                    sx={{ "&:hover": { cursor: "pointer" }, mt: "1rem" }}
                    width={"100%"}
                    display={"flex"}
                    justifyContent={"center"}
                  >
                    <input {...getInputProps()} />
                    {!values.picture ? (
                      <p>Add Picture Here</p>
                    ) : (
                      <FlexBetween>
                        <Typography>{values.picture.path}</Typography>
                      </FlexBetween>
                    )}
                  </Box>
                )}
              </Dropzone>
            </Box>
          </Box>

          {/* ALERT */}
          {alert.length > 0 && (
            <Box sx={{ mt: "1.5rem" }}>
              <Alert
                severity="error"
                sx={{
                  backgroundColor: "#fce4e4",
                  color: "#d32f2f",
                  fontWeight: "bold",
                  border: "1px solid #f44336",
                  borderRadius: "8px",
                  padding: "1rem",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <Typography variant="body1" sx={{ marginRight: "8px" }}>
                  {alert}
                </Typography>
              </Alert>
            </Box>
          )}

          {/* BUTTONS */}
          <Box>
            <Button
              fullWidth
              type="submit"
              sx={{
                mt: "2rem",
                p: "1rem",
                backgroundColor: palette.primary.main,
                color: palette.background.alt,
                "&:hover": { color: palette.primary.main },
              }}
              disabled={saveChangesBtnClicked}
            >
              <Typography>
                {saveChangesBtnClicked ? (
                  <ClipLoader size={23} />
                ) : (
                  "Save Changes"
                )}
              </Typography>
            </Button>

            <Button
              fullWidth
              sx={{
                mt: "1rem",
                p: "1rem",
                backgroundColor: palette.neutral.main,
                color: palette.background.alt,
                "&:hover": { color: palette.primary.main },
              }}
              onClick={(e) => {
                e.stopPropagation();
                navigate("/home");
              }}
            >
              Cancel
            </Button>
          </Box>
        </form>
      )}
    </Formik>
  );
};

export default Form;
