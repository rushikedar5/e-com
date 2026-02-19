import { createContext, useContext, useEffect, useState } from "react";
import axiosInstance from "../api/axios";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartCount, setCartCount] = useState(0);

  const fetchCartCount = async () => {
    try {
      const res = await axiosInstance.get("/cart");
      setCartCount(res.data.cartItems.length);
    } catch {
      setCartCount(0);
    }
  };

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user?.role === "CUSTOMER") {
      fetchCartCount();
    }
  }, []);

  return (
  <CartContext.Provider value={{ cartCount, fetchCartCount, setCartCount }}>
    {children}
  </CartContext.Provider>
);
};

export const useCart = () => useContext(CartContext);
