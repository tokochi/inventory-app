import "./App.css";
import "./css/style.css";
import { HashRouter, Routes, Route } from "react-router-dom";
import Sidebar from "./component/layout/Sidebar";
import Navbar from "./component/layout/Navbar";
import Products from "./pages/Products";



const App = () => {
  return (
    <div className="flex">
      <HashRouter>
        <Sidebar />
        <div className="flex-1">
          <Navbar />

          <Routes>
            <Route path="/products" element={<Products />} />
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
