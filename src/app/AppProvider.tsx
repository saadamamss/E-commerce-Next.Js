"use client";
import reviewsReducer from "@/lib/reducers/ReviewsList";

import React, {
  useContext,
  useState,
  createContext,
  useReducer,
  useEffect,
  useMemo,
} from "react";
import { useCookies } from "react-cookie";
type cartcon = {
  items: {
    SKU: string;
    availableQty: number;
    image: string;
    key: string;
    name: string;
    price: number;
    productId: number;
    qty: number;
    slug: string;
    variant: {
      [key: string]: string | number | null;
      id: number;
      images: string;
      price: number;
      quantity: number;
    };
  }[];
  total: number;
  subTotal: number;
  couponApplied: boolean;
  couponCode: string | undefined;
  couponDiscount: number | undefined;
};
type prodtype = {
  id: number;
  SKU: string;
  salePrice: number;
  name: string;
  price: number;
  productId: number;
  qty: number;
  slug: string;
  images: string;
  variantType: string;
  avgRate: number;
  noReview: number;
  shortDesc: string;
  variants: {
    [key: string]: string | number | null;
    id: number;
    images: string;
    price: number;
    quantity: number;
  }[];
};
type vvv = {
  cartDrawerOpen: boolean;
  setCartDrawerOpen: React.Dispatch<React.SetStateAction<boolean>>;

  showCartInDrawer: boolean;
  setShowCartInDrawer: React.Dispatch<React.SetStateAction<boolean>>;

  cartDrawercontent: prodtype | null;
  setCartDrawercontent: React.Dispatch<React.SetStateAction<prodtype | null>>;
  cart: cartcon | null;
  setCart: React.Dispatch<React.SetStateAction<cartcon | null>>;
  ReviewsList: any[];
  dispatch: React.ActionDispatch<[action: any]>;
};
const appcontext = createContext<vvv | null>(null);

export default function AppProvider({
  children,
  shopCart,
}: {
  children: React.ReactNode;
  shopCart: string | null;
}) {
  const [cart, setCart] = useState<cartcon | null>(
    shopCart ? JSON.parse(shopCart) : null
  );
  const [cartDrawerOpen, setCartDrawerOpen] = useState<boolean>(false);
  const [showCartInDrawer, setShowCartInDrawer] = useState<boolean>(false);
  const [cartDrawercontent, setCartDrawercontent] = useState<prodtype | null>(
    null
  );
  const [ReviewsList, dispatch] = useReducer(reviewsReducer, []);

  return (
    <appcontext.Provider
      value={{
        cartDrawerOpen,
        setCartDrawerOpen,
        cartDrawercontent,
        setCartDrawercontent,
        showCartInDrawer,
        setShowCartInDrawer,
        cart,
        setCart,
        ReviewsList,
        dispatch,
      }}
    >
      {children}
    </appcontext.Provider>
  );
}

export const useAppContext = () => {
  return useContext(appcontext) as vvv;
};
