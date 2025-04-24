import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/layout/Layout";
import Dashboard from "./components/dashboardPage/Dashboard";
import InvestPage from "./components/InvestPage/InvestPage";
import PortfolioPage from "./components/portfolioPage/PortfolioPage";
import PropertyLoanDetails from "./components/propertyDetail/PropertyDetail";
import Register from "./components/AuthPages/Register";
import Login from "./components/AuthPages/Login";
import AdminLayout from "./components/layout/AdminLayout";
import AdminDashBoard from "./components/admin/AdminDashBoard";
import Users from "./components/admin/Users";
import RegistrationRequest from "./components/admin/RegistrationRequest";
import InvestmentOpportunities from "./components/admin/InvestmentOpportunities";
import { ToastContainer } from "react-toastify";
import PropertyForm from "./components/porpertyFormPage/PorpertyForm";
import { UserProvider } from "./components/context/UserContext";
import WhatsApp from "./components/WhatsApp";

function App() {
  return (
    <UserProvider>
      <ToastContainer
        position='top-right'
        autoClose={5000}
        hideProgressBar={false}
        closeOnClick
        pauseOnHover
      />
      <Router>
        <Routes>
          <Route path='/' element={<Register />} />
          <Route path='/register' element={<Register />} />
          <Route path='/login' element={<Login />} />

          {/* Admin routes */}
          <Route path='/admin' element={<AdminLayout />}>
            <Route path='dashboard' index element={<AdminDashBoard />} />
            <Route path='users' element={<Users />} />
            <Route
              path='registration-request'
              element={<RegistrationRequest />}
            />
            <Route
              path='investment-opportunities'
              element={<InvestmentOpportunities />}
            />
          </Route>

          {/* Main App Layout without /dashboard in URLs */}
          <Route path='/' element={<Layout />}>
            <Route path='dashboard' element={<Dashboard />} />
            <Route path='portfolio' element={<PortfolioPage />} />
            <Route path='invest' element={<InvestPage />} />
            <Route
              path='property-detail/:propertyId'
              element={<PropertyLoanDetails />}
            />
          </Route>

          <Route path='/sell' element={<PropertyForm />} />
        </Routes>
        <WhatsApp />
      </Router>
    </UserProvider>
  );
}

export default App;
