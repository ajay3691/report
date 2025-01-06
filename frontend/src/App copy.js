import "./App.css";
import { BrowserRouter, Route, Routes,Navigate  } from "react-router-dom";
import React from "react";

import { useSelector } from "react-redux";

// import { useSelector } from "react-redux";
const Login = React.lazy(() =>
  import(/* webpackPrefetch: true */ "./component/Login")
);
const Dashboard = React.lazy(() =>
  import(/* webpackPrefetch: true */ "./component/Dashboard")
);
const ForgotPassword = React.lazy(() =>import(/* webpackPrefetch: true */ "./component/ForgotPassword"));
const ResetPassword = React.lazy(() =>import(/* webpackPrefetch: true */ "./component/ResetPassword"));

// const Nav = React.lazy(() => import(/* webpackPrefetch: true */ "./component/Nav"));

function App() {
  // const isAuth = useSelector((state) => state.login.isAuth);
  const { isAuth } = useSelector((state) => state.login);
  //const isAuth = localStorage.getItem("isAuth");

  return (
    <div className="App">
      <header className="App-header">
        <React.Suspense
          fallback={
            <div className="loader">
              <div className="loaderRectangle">
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
              </div>
            </div>
          }
        >
          <BrowserRouter>
          {/* {!isAuth && <Nav/>} */}
          
            <Routes>
              <Route index element={<Login />} />
              <Route path="/dashboard/*" element={<Dashboard />} />
              <Route path="/forgotPassword/*" element={<ForgotPassword />} />
              <Route path="/resetPassword/*" element={<ResetPassword />} />
                {/* Private Routes */}
          <Route
            path="/dashboard/*"
            element={isAuth ? <Dashboard /> : <Navigate to="/" />}
          />

          {/* Fallback Route */}
          <Route path="*" element={<h1>404 - Page Not Found</h1>} />
            </Routes>
          </BrowserRouter>
        </React.Suspense>
      </header>
    </div>
  );
}

export default App;
