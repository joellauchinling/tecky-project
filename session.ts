import expressSession from "express-session";
import { isTemplateExpression } from "typescript";
import { env } from "./env";

export let sessionMiddleware = expressSession({
  secret: env.SESSION_SECRET,
  saveUninitialized: true,
  resave: true,
});

declare module "express-session" {
  export interface SessionData {
    user?: SessionUser;
    item?: SessionItem;
    inactive_item?: InactiveItem[];
    cart_sum?: number;
    area: SessionArea;
  }
}

export type SessionUser = {
  id: number;
  username: string;
  role: string;
  promoCode?: string;
};

// Cart, key: item id, value: quantity
export type SessionItem = {
  // item id -> quantity
  [id: number]: number;
};

// Store items that reduced to zero in cart
export type InactiveItem = {
  id: number;
  name: string;
  price: number;
};

export type SessionArea = {
  id: number;
};
