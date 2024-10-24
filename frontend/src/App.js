import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import React from "react";
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
            </Routes>
          </BrowserRouter>
        </React.Suspense>
      </header>
    </div>
  );
}

export default App;
