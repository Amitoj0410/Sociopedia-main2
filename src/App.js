import { BrowserRouter, Navigate, Routes, Route } from "react-router-dom";
import HomePage from "scenes/homePage"; //Code written in jsconfig.json actually helps here as we dont need to write './scenes/... or ../../scenes'
import LoginPage from "scenes/loginPage";
import ProfilePage from "scenes/profilePage";
import SearchPage from "scenes/searchPage";
import TrendingPage from "scenes/trendingPage";
import NotFoundPage from "scenes/notFoundPage";
import { useMemo, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { createTheme } from "@mui/material/styles";
import { themeSettings } from "theme";
import EditProfilePage from "scenes/editProfile";
import { setLogout } from "state";
import { jwtDecode } from "jwt-decode";
import { SnackbarProvider } from "notistack";

function App() {
  const dispatch = useDispatch();
  const mode = useSelector((state) => state.mode);
  const token = useSelector((state) => state.token);
  const theme = useMemo(() => createTheme(themeSettings(mode)), [mode]);
  const isAuth = Boolean(token);

  // Check token expiration on component mount and update Redux state accordingly
  useEffect(() => {
    const checkTokenExpiration = () => {
      const currentTime = Math.floor(new Date().getTime() / 1000); // Convert milliseconds to seconds
      const tokenExp = token ? jwtDecode(token).exp : null;

      if (tokenExp && tokenExp < currentTime) {
        // Token has expired
        // dispatch(clearToken());
        dispatch(setLogout());
      }
    };

    checkTokenExpiration();

    // Set up an interval to periodically check token expiration
    const intervalId = setInterval(checkTokenExpiration, 1000);

    return () => clearInterval(intervalId);
  }, [dispatch, token]);

  return (
    <div className="app">
      <BrowserRouter>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <SnackbarProvider
            maxSnack={3}
            // anchorOrigin={{ vertical: "top", horizontal: "right" }}
          >
            <Routes>
              <Route
                path="/"
                element={isAuth ? <Navigate to="/home" /> : <LoginPage />}
              />
              <Route
                path="/home"
                element={isAuth ? <HomePage /> : <Navigate to="/" />}
              />
              <Route
                path="/profile/:userId"
                element={isAuth ? <ProfilePage /> : <Navigate to="/" />}
              />
              <Route
                path="/profile/edit"
                element={isAuth ? <EditProfilePage /> : <Navigate to="/" />}
              />
              <Route
                path="/search"
                element={isAuth ? <SearchPage /> : <Navigate to="/" />}
              />
              <Route
                path="/trending"
                element={isAuth ? <TrendingPage /> : <Navigate to="/" />}
              />
              <Route
                path="*"
                element={isAuth ? <NotFoundPage /> : <Navigate to="/" />}
              />
            </Routes>
          </SnackbarProvider>
        </ThemeProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
