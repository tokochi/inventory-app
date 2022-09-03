import "./App.css";
import "./css/style.css";
import { HashRouter, Routes, Route } from "react-router-dom";
import Sidebar from "./component/layout/Sidebar";
import Navbar from "./component/layout/Navbar";
import Products from "./pages/Products";
import Provider from "./pages/Provider";
import Customer from "./pages/Customer";
import Buying from "./pages/Buying";
import Vending from "./pages/Vending";
import Caisse from './pages/Caisse';
import Facture from './pages/Facture';
import Report from "./pages/Report";
import Login from "./pages/Login";
import Register from "./pages/Register";
import BonAchat from "./pages/BonAchat";
import AddAccount from "./pages/AddAccount";
import { useStore, loadCustomers,loadBuyings, loadVendings,loadProviders, loadProducts } from "./contexts/Store";
import Settings from './pages/Settings';
import PrivateRoute from "./component/PrivateRoute";
import Store from "electron-store";
loadCustomers();
loadVendings();
loadProducts();
loadProviders();
loadBuyings();

const App = () => {
  // const isLoggedIn = useStore((state) => state.isLoggedIn);
  // const store = new Store();
  // const user = store?.get("user");
  // console.log("🚀 ~ isLoggedIn", isLoggedIn);
  // console.log("🚀 ~ user", user);
  // console.log("🚀 ~ users", store?.get("users"));
  return (
    <div className="flex">
      <HashRouter>
        <Sidebar />
        <div className="flex-1">
          <Navbar />
          <Routes>
            <Route element={<PrivateRoute />}>
              <Route path="/" element={<Report />} />
              <Route path="/products" element={<Products />} />
              <Route path="/provider" element={<Provider />} />
              <Route path="/customers" element={<Customer />} />
              <Route path="/sell" element={<Vending />} />
              <Route path="/buy" element={<Buying />} />
              <Route path="/caisse" element={<Caisse />} />
              <Route path="/facture" element={<Facture />} />
              <Route path="/report" element={<Report />} />
              <Route path="/bonAchat" element={<BonAchat />} />
              <Route path="/add" element={<AddAccount />} />
              <Route path="/settings/*" element={<Settings />} />
            </Route>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Routes>
        </div>
      </HashRouter>
    </div>
  );
   
};


export default App;
