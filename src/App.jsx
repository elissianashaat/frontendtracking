import "./App.css";

import { BrowserRouter, Routes, Route } from "react-router-dom";

import AssignedOrderList from "/src/components/AssignedOrdersPage/AssignedOrderList";
import CourierOrderList from "/src/components/AssignedOrdersToCourier/CourierOrderList";
import OrderTable from "/src/components/ManageOrderPage/OrderTable";
import MyOrders from "/src/components/MyOrdersPage/MyOrders";
import OrderDetailsPage from "/src/components/OrderDetailsPage/OrderDetails";
import OrderForm from "/src/components/OrderPage/OrderForm";
import StatusUpdateForm from "/src/components/UpdateOrderStatus/StatusUpdateForm";
import LoginSignUp from "/src/components/loginsignup/LoginSignUp";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginSignUp />} />

        <Route path="/create-order" element={<OrderForm />} />
        <Route path="/my-orders" element={<MyOrders />} />
        <Route path="/order-details/" element={<OrderDetailsPage />} />

        <Route path="/assigned-orders" element={<AssignedOrderList />} />
        <Route path="/update-order-status/" element={<StatusUpdateForm />} />

        <Route path="/manage-orders" element={<OrderTable />} />
        <Route path="/courier-orders" element={<CourierOrderList />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
