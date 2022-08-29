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
import BonAchat from "./pages/BonAchat";
import { useStore, loadCustomers,loadBuyings, loadVendings,loadProviders, loadProducts } from "./contexts/Store";

loadCustomers();
loadVendings();
loadProducts();
loadProviders();
loadBuyings();
const App = () => {
  return (
    <div className="flex">
      <HashRouter>
        <Sidebar />
        <div className="flex-1">
          <Navbar />

          <Routes>
            <Route path="/products" element={<Products />} />
            <Route path="/provider" element={<Provider />} />
            <Route path="/customers" element={<Customer />} />
            <Route path="/sell" element={<Vending />} />
            <Route path="/buy" element={<Buying />} />
            <Route path="/caisse" element={<Caisse />} />
            <Route path="/facture" element={<Facture />} />
            <Route path="/report" element={<Report />} />
            <Route path="/bonAchat" element={<BonAchat />} />
            {/* <Route path="/" element={<Home />} />
        <Route path="/accueil" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/user/*" element={<User />} /> */}
            {/* <Route element={<PrivateRoute />}>
</Route> */}
          </Routes>
        </div>
      </HashRouter>
    </div>
  );
   
};


export default App;
