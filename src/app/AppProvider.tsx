"use client";
import reviewsReducer from "@/lib/reducers/ReviewsList";
import React, {
  useContext,
  useState,
  createContext,
  useReducer,
  useMemo,
} from "react";

// Define interfaces for better type safety and readability
interface ProductVariant {
  id: number;
  images: string;
  price: number;
  quantity: number;
  [key: string]: string | number | null; // Index signature for additional properties
}

interface CartItem {
  SKU: string;
  availableQty: number;
  image: string;
  key: string;
  name: string;
  price: number;
  productId: number;
  qty: number;
  slug: string;
  variantId?: number;
  specs: any;
}

interface CartState {
  items: CartItem[];
  total: number;
  subTotal: number;
  couponApplied: boolean;
  couponCode?: string;
  couponDiscount?: number;
}

interface Product {
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
  variants: ProductVariant[];
}

interface ReviewAction {
  type: string;
  payload?: any;
}

interface AppContextValues {
  cartDrawerOpen: boolean;
  setCartDrawerOpen: (open: boolean) => void;
  showCartInDrawer: boolean;
  setShowCartInDrawer: (show: boolean) => void;
  cartDrawerContent: Product | null;
  setcartDrawerContent: (content: Product | null) => void;
  cart: CartState | null;
  setCart: (cart: CartState | null) => void;
  ReviewsList: any[];
  dispatchReviewsList: React.Dispatch<ReviewAction>;
}

const AppContext = createContext<AppContextValues | null>(null);

interface AppProviderProps {
  children: React.ReactNode;
  shopCart: string | null;
}

export default function AppProvider({ children, shopCart }: AppProviderProps) {
  const [cart, setCart] = useState<CartState | null>(
    shopCart ? JSON.parse(shopCart) : null
  );
  const [cartDrawerOpen, setCartDrawerOpen] = useState(false);
  const [showCartInDrawer, setShowCartInDrawer] = useState(false);
  const [cartDrawerContent, setcartDrawerContent] = useState<Product | null>(
    null
  );
  const [ReviewsList, dispatchReviewsList] = useReducer(reviewsReducer, []);

  // Memoize context value to prevent unnecessary re-renders
  const contextValue = useMemo(
    () => ({
      cartDrawerOpen,
      setCartDrawerOpen,
      cartDrawerContent,
      setcartDrawerContent,
      showCartInDrawer,
      setShowCartInDrawer,
      cart,
      setCart,
      ReviewsList,
      dispatchReviewsList,
    }),
    [cartDrawerOpen, cartDrawerContent, showCartInDrawer, cart, ReviewsList]
  );

  return (
    <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>
  );
}

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
};
