// src/site/utils/icons.jsx
import { lazy } from "react";

export const ShoppingCartIcon = lazy(() =>
  import("lucide-react").then((m) => ({ default: m.ShoppingCart }))
);

export const PhoneIcon = lazy(() =>
  import("lucide-react").then((m) => ({ default: m.Phone }))
);
