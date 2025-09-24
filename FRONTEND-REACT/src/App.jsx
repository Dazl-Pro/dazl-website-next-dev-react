import { lazy, Suspense } from "react";
const Header = lazy(() => import("./components/header/header"));
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import { useSelector } from "react-redux";
const ToastContainerPopup = lazy(() =>
  import("./services/toastify/toastContainer")
);
import CircularProgress from "@mui/material/CircularProgress";
import "./App.css";
import ConfirmPopup from "./services/confirmPopup/confirmPopup";
const ViewPhd = lazy(() =>
  import("./components/dashboard/agentDashboard/pdhProject/viewPhd")
);
const ScrollToTopButton = lazy(() => import("./services/scrollBar/scrollBar"));
const Spinner = lazy(() => import("./services/spinner/spinner"));
const Footer = lazy(() => import("./components/footer/footer"));
function App() {
  const token = localStorage.getItem("token");
  const authSelector = useSelector((state) => state.authSlice);
  const dashboardSelector = useSelector((state) => state.dashboardSlice);
  const loader = !token ? authSelector.loading : dashboardSelector.loading;
  const show = dashboardSelector.data.show;
  const showAlt = dashboardSelector.data.showAlt;
  const completephd = dashboardSelector.data.confirmPopup;

  return (
    <Suspense
      fallback={
        <div
          style={{
            display: "grid",
            justifyContent: "center",
            placeItems: "center",
            position: "absolute",
            left: "50%",
            top: "50%",
          }}
        >
          <CircularProgress style={{ color: "#dc3545" }} />
        </div>
      }
    >
      <ToastContainerPopup />
      <Header />
      {loader && <Spinner />}
      {show && <ViewPhd />}

      {completephd && <ConfirmPopup />}
      <Footer />
      {/* <ScrollToTopButton/> */}
    </Suspense>
  );
}

export default App;
