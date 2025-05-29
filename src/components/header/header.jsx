import * as React from "react";
import { lazy, useState, useEffect } from "react";
import { styled, useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import MuiAppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import CssBaseline from "@mui/material/CssBaseline";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import FacebookIcon from "@mui/icons-material/Facebook";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import XIcon from "@mui/icons-material/X";
import InstagramIcon from "@mui/icons-material/Instagram";
import PinterestIcon from "@mui/icons-material/Pinterest";
import YouTubeIcon from "@mui/icons-material/YouTube";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "./header.css";
import {
  NavLink,
  Navigate,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from "react-router-dom";
import CommonSidebar from "../dashboard/commonSidebar/commonSidebar";
import CommonProfile from "../dashboard/commonSidebar/commonProfile.jsx";

const CustomerCreateProject = lazy(() =>
  import(
    "../dashboard/customerDashboard/createProject/customerCreateProject.jsx"
  )
);
const MyProject = lazy(() => import("../dashboard/commonProject/myProject"));
const CustomerMyInfo = lazy(() =>
  import("../dashboard/customerDashboard/myInfo/customerMyInfo.jsx")
);
const RouteGuard = lazy(() => import("../../services/routeGuard/routeGuard"));
const Home = lazy(() => import("../dashboard/home"));
const CommonSignup = lazy(() => import("../auth/signUp/commonSignup"));
const SignupAgent = lazy(() => import("../auth/signUp/signupAgent"));
const SignupPros = lazy(() => import("../auth/signUp/signupPros"));
const SignupCostumer = lazy(() => import("../auth/signUp/signupCostumer"));
const ContactUs = lazy(() => import("../contact/contact.jsx"));
const SignInUser = lazy(() => import("../auth/signIn/signIn.jsx"));
const Agentproject = lazy(() =>
  import("../dashboard/agentDashboard/createProject/agentCreateProject")
);
const LoginRealtor = lazy(() =>
  import("../auth/signIn/loginRealtor/loginRealtor.jsx")
);
const LoginProfessional = lazy(() =>
  import("../auth/signIn/loginProfessional/loginprofessional.jsx")
);
const LoginCustomer = lazy(() =>
  import("../auth/signIn/loginCustomers/loginCustomer.jsx")
);
const TermsandConditions = lazy(() =>
  import("../terms&conditions/termsandConditions")
);
const drawerWidth = 240;
const AgentDashboard = lazy(() =>
  import("../dashboard/agentDashboard/agentDashboard")
);
const ProfessionalDashboard = lazy(() =>
  import("../dashboard/professionalDashboard/professionalDashboard")
);
const CustomerDashboard = lazy(() =>
  import("../dashboard/customerDashboard/customerDashboard")
);
const Blog = lazy(() => import("../blog/blog"));
const CompletePhdproject = lazy(() =>
  import("../dashboard/agentDashboard/pdhProject/completeproject")
);
const SavePhdproject = lazy(() =>
  import("../dashboard/agentDashboard/pdhProject/saveProject")
);
const AgentProfile = lazy(() =>
  import("../dashboard/agentDashboard/profile/agentProfile")
);
const Agentchangepassword = lazy(() =>
  import("../dashboard/agentDashboard/profile/changeAgentpassword")
);
const CreatePhd = lazy(() =>
  import("../dashboard/agentDashboard/pdhProject/createPhd")
);
const ViewPhdAlt = lazy(() =>
  import("../dashboard/agentDashboard/pdhProject/viewPhdAlt")
);
const AddRoom = lazy(() =>
  import("../dashboard/agentDashboard/pdhProject/addRoom")
);
const EditAddRoom = lazy(() =>
  import("../dashboard/agentDashboard/pdhProject/editAddRoom")
);
const ProjectOpportunities = lazy(() =>
  import("../dashboard/professionalDashboard/projectOpportunities")
);
const ProjectOpportunity = lazy(() =>
  import("../dashboard/professionalDashboard/projectOpportunity")
);
const companyProfile = lazy(() =>
  import("../dashboard/professionalDashboard/profile/companyProfile")
);

// const drawerWidth = 240;

// Styled components (unchanged)
const Main = styled("main", { shouldForwardProp: (prop) => prop !== "open" })(
  ({ theme, open }) => ({
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    width: "100%", // Default width when Drawer is closed
    ...(open && {
      transition: theme.transitions.create("width", {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
      width: `calc(100% - ${drawerWidth}px)`,
    }),
    position: "relative",
  })
);

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  position: "fixed",
  transition: theme.transitions.create(["left", "width"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    left: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["left", "width"], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
  justifyContent: "flex-start",
}));

const Header = () => {
  const [isActive, setIsActive] = useState(false);
  const [open, setOpen] = useState(false);
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  const token = localStorage.getItem("token");
  const userType = localStorage.getItem("userType");

  const sideItems = [
    { page: token ? "DAZL ON TREND" : "HOME", route: "/" },
    // { page: "BLOG", route: "/blogs" },
    {
      page: token ? "DASHBOARD" : "TERMS & CONDITIONS",
      route: token
        ? userType === "agent"
          ? "/agent/home"
          : userType === "professional"
          ? "/company/professional"
          : "/homeOwner/dashboard"
        : "/termsandconditions",
    },
    { page: "CONTACT US", route: "/contact-us" },
    token
      ? { page: "LOG OUT", route: "/" }
      : { page: "LOG IN", route: "/login-users" },
    token ? null : { page: "SIGN UP", route: "/signup-users" },
  ].filter(Boolean);

  const handleDrawerOpen = (e) => {
    e.stopPropagation();
    setOpen(true);
    console.log("Drawer opening, open state:", true);
  };

  const handleDrawerClose = () => {
    // Removed e parameter since it's not passed from ListItemButton
    setOpen(false);
    console.log("Drawer closing, open state:", false);
  };

  const handleListItemClick = (route, page) => {
    handleDrawerClose(); // Call handleDrawerClose instead of setOpen(false)
    setTimeout(() => {
      navigate(route);
    }, 0);

    setOpen(false);
    console.log("=====first");
    if (page === "LOG OUT") localStorage.clear();
  };

  const handleShowMenuClick = () => setIsActive(true);
  const handleCloseMenuClick = () => setIsActive(false);

  const clicktoChange = ({ isActive }) => ({
    color: isActive ? "#dc3545" : "#000",
    textDecoration: "none",
  });

  const [showSidebar, setShowSidebar] = useState(true);
  useEffect(() => {
    const currentPath = location.pathname;
    setShowSidebar(!currentPath.startsWith("/agent/viewPhdAlt"));
  }, [location.pathname]);

  // Debug useEffect to track open state
  useEffect(() => {
    console.log("Current open state:", open);
  }, [open]);

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        open={open}
        sx={{ backgroundColor: "#2d2d2d" }}
        className="header header-mainn"
      >
        <div className="header-topp py-1 bg-primary">
          <div className="header-topp-inner container d-flex flex-wrap align-items-center justify-content-between">
            <p className="mb-0">
              <a href="mailto:info@dazlpro.com" className="lh-sm text-white">
                <small>info@dazlpro.com</small>
              </a>
            </p>
            <div className="social-links-footer d-flex gap-0 gap-md-1">
              <a href="" target="_blank" className="social-icon-item">
                <FacebookIcon />
              </a>
              <a href="" target="_blank" className="social-icon-item">
                <LinkedInIcon />
              </a>
              <a href="" target="_blank" className="social-icon-item">
                <XIcon />
              </a>
              <a href="" target="_blank" className="social-icon-item">
                <InstagramIcon />
              </a>
              <a href="" target="_blank" className="social-icon-item">
                <PinterestIcon />
              </a>
              <a href="" target="_blank" className="social-icon-item">
                <YouTubeIcon />
              </a>
            </div>
          </div>
        </div>
        <Toolbar className="px-0 bg-white">
          <div className="container header-containerr">
            <div className="menu-topp py-2 d-flex justify-content-between align-items-center">
              <div className="header-logo">
                <LazyLoadImage
                  alt="img"
                  src="/images/footerImages/footer.png"
                  width="70px"
                />
              </div>
              <div className="w-100 desktop-menu heading-font fw-semibold">
                <ul
                  className="d-flex justify-content-end align-items-center text-uppercase fw-medium mb-0"
                  style={{ listStyle: "none" }}
                >
                  <li>
                    <NavLink to="/" style={clicktoChange} className="mx-3">
                      {token ? "DAZL ON TREND" : "Home"}
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to={
                        token
                          ? userType === "agent"
                            ? "/agent/home"
                            : userType === "professional"
                            ? "/company/professional"
                            : "/homeOwner/dashboard"
                          : "/termsandconditions"
                      }
                      style={clicktoChange}
                    >
                      {token ? "DASHBOARD" : "TERMS & CONDITIONS"}
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to="/contact-us"
                      style={clicktoChange}
                      className="mx-3"
                    >
                      CONTACT US
                    </NavLink>
                  </li>
                  {token ? (
                    <li>
                      <NavLink
                        style={clicktoChange}
                        onClick={() => (localStorage.clear(), navigate("/"))}
                      >
                        LOG OUT
                      </NavLink>
                    </li>
                  ) : (
                    <>
                      <li>
                        <NavLink to="/login-users" style={clicktoChange}>
                          LOG IN
                        </NavLink>
                      </li>
                      <li>
                        <NavLink
                          to="/signup-users"
                          style={clicktoChange}
                          className="ms-3"
                        >
                          SIGN UP
                        </NavLink>
                      </li>
                    </>
                  )}
                </ul>
              </div>
              <div className="icon-button-container">
                <IconButton
                  color="inherit"
                  className="btn rounded hamburg-btnn bg-black me-0"
                  aria-label="open drawer"
                  edge="end"
                  onClick={handleDrawerOpen}
                  sx={{ ...(open && { display: "none" }) }}
                >
                  <MenuIcon />
                </IconButton>
              </div>
            </div>
          </div>
        </Toolbar>
      </AppBar>

      <Main open={open} sx={{ padding: 0 }} className="main-content-main">
        <DrawerHeader />
        {token &&
        location.pathname !== "/" &&
        location.pathname !== "/contact-us" ? (
          <div className={showSidebar ? "bg-light-red" : ""}>
            <div
              className={`d-flex flex-wrap ${
                showSidebar ? "dashboard-main" : ""
              }`}
            >
              {showSidebar && (
                <div
                  className={`dashboard-sidebar-main rounded-4 ${
                    isActive ? "active" : ""
                  }`}
                >
                  <div className="d-flex justify-content-between justify-content-md-end align-items-center position-relative z-1">
                    <div className="profile-infoo-side px-3 pb-0 d-lg-none w-100 position-relative z-1">
                      <CommonProfile />
                    </div>
                    <div
                      className={`hamberg-sidebar text-white position-relative ${
                        isActive ? "active" : ""
                      }`}
                    >
                      {isActive ? (
                        <div
                          className="icon-close-menu btn btn-primary lh-1 px-2"
                          onClick={handleCloseMenuClick}
                        >
                          <CloseIcon />
                        </div>
                      ) : (
                        <div
                          className="icon-show-menu btn btn-primary lh-1 px-2"
                          onClick={handleShowMenuClick}
                        >
                          <MenuIcon />
                        </div>
                      )}
                    </div>
                  </div>
                  <CommonSidebar
                    callback={() => {
                      handleCloseMenuClick();
                    }}
                  />
                </div>
              )}
              <div
                className={
                  showSidebar
                    ? `dashboard-content-right ${isActive ? "active" : ""}`
                    : "w-100"
                }
              >
                <div
                  className={
                    showSidebar
                      ? "dashboard-content-right-inner h-100 p-md-4 p-3 shadow-lg bg-white rounded-4"
                      : ""
                  }
                >
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route exact path="/contact-us" element={<ContactUs />} />
                    <Route
                      exact
                      path="/termsandconditions"
                      element={<TermsandConditions />}
                    />
                    <Route exact path="/blogs" element={<Blog />} />
                    <Route path="*" element={<Navigate to="/" />} />
                    {token ? (
                      userType === "agent" ? (
                        <>
                          <Route path="/agent">
                            <Route
                              exact
                              path="/agent/viewPhdAlt/:itemId"
                              element={<RouteGuard Components={ViewPhdAlt} />}
                            />

                            <Route
                              exact
                              path="/agent/home"
                              element={
                                <RouteGuard Components={AgentDashboard} />
                              }
                            />

                            <Route
                              exact
                              path="/agent/phdproject"
                              element={
                                <RouteGuard Components={CompletePhdproject} />
                              }
                            />
                            <Route
                              exact
                              path="/agent/saveproject"
                              element={
                                <RouteGuard Components={SavePhdproject} />
                              }
                            />
                            <Route
                              exact
                              path="/agent/agentprofile"
                              element={<RouteGuard Components={AgentProfile} />}
                            />
                            <Route
                              exact
                              path="/agent/changePassword"
                              element={
                                <RouteGuard Components={Agentchangepassword} />
                              }
                            />
                            <Route
                              exact
                              path="/agent/createPhd"
                              element={<RouteGuard Components={CreatePhd} />}
                            />
                            <Route
                              exact
                              path="/agent/createPhd/rooms"
                              element={<RouteGuard Components={AddRoom} />}
                            />

                            <Route
                              exact
                              path="/agent/editPhd/rooms/:itemId"
                              element={<RouteGuard Components={EditAddRoom} />}
                            />
                            <Route
                              exact
                              path="/agent/createProject"
                              element={<RouteGuard Components={Agentproject} />}
                            />
                            <Route
                              exact
                              path="/agent/my-project"
                              element={<RouteGuard Components={MyProject} />}
                            />
                            <Route
                              path="*"
                              element={<Navigate to="/agent/home" />}
                            />
                          </Route>
                        </>
                      ) : userType === "professional" ? (
                        <Route path="/company">
                          <Route
                            exact
                            path="/company/professional"
                            element={
                              <RouteGuard Components={ProfessionalDashboard} />
                            }
                          />
                          <Route
                            exact
                            path="/company/companyProfile"
                            element={<RouteGuard Components={companyProfile} />}
                          />
                          <Route
                            exact
                            path="/company/projectOpportunities"
                            element={
                              <RouteGuard Components={ProjectOpportunities} />
                            }
                          />
                          <Route
                            exact
                            path="/company/projectOpportunities/:id"
                            element={
                              <RouteGuard Components={ProjectOpportunity} />
                            }
                          />
                        </Route>
                      ) : (
                        <Route path="/homeOwner">
                          <Route
                            exact
                            path="/homeOwner/dashboard"
                            element={
                              <RouteGuard Components={CustomerDashboard} />
                            }
                          />
                          <Route
                            exact
                            path="/homeOwner/create-project"
                            element={
                              <RouteGuard Components={CustomerCreateProject} />
                            }
                          />
                          <Route
                            exact
                            path="/homeOwner/my-project"
                            element={<RouteGuard Components={MyProject} />}
                          />
                          <Route
                            exact
                            path="/homeOwner/my-info"
                            element={<RouteGuard Components={CustomerMyInfo} />}
                          />
                          <Route
                            exact
                            path="/homeOwner/changePassword"
                            element={
                              <RouteGuard Components={Agentchangepassword} />
                            }
                          />
                        </Route>
                      )
                    ) : null}
                  </Routes>
                </div>
              </div>
            </div>
          </div>
        ) : null}
        {token ? (
          <Routes>
            <Route path="/" element={<Home />} />
            <Route exact path="/contact-us" element={<ContactUs />} />
          </Routes>
        ) : (
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/signup-users" element={<CommonSignup />} />
            <Route exact path="/signup-users/agent" element={<SignupAgent />} />
            <Route
              exact
              path="/signup-users/professional"
              element={<SignupPros />}
            />
            <Route
              exact
              path="/signup-users/customer"
              element={<SignupCostumer />}
            />
            <Route exact path="/contact-us" element={<ContactUs />} />
            <Route exact path="/login-users" element={<SignInUser />} />
            <Route exact path="/login/realtor" element={<LoginRealtor />} />
            <Route
              exact
              path="/login/professional"
              element={<LoginProfessional />}
            />
            <Route
              exact
              path="/termsandconditions"
              element={<TermsandConditions />}
            />
            <Route exact path="/blogs" element={<Blog />} />
            <Route exact path="/login/customer" element={<LoginCustomer />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        )}
      </Main>
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
          },
        }}
        variant="temporary" // Changed to temporary
        anchor="right"
        open={open}
        onClose={handleDrawerClose} // Added onClose for temporary drawer
        className="header1 header-sidebarr"
      >
        <DrawerHeader
          sx={{ backgroundColor: "#fff" }}
          className="siderbarr-inner"
        >
          <IconButton
            onClick={handleDrawerClose}
            className="btn bg-primary rounded"
          >
            <CloseIcon sx={{ color: "white" }} />
          </IconButton>
        </DrawerHeader>
        <Divider />
        <List>
          {sideItems.map((items, index) => (
            <ListItem key={index} disablePadding>
              <ListItemButton
                onClick={() => handleListItemClick(items.route, items.page)}
              >
                <ListItemText
                  className="head-font fw-semibold text-center text-sm-start"
                  primary={items.page}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
        <Divider />
      </Drawer>
    </Box>
  );
};

export default Header;
