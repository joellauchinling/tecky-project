import express from "express";
import { print } from "listening-on";
import { getSessionAdmin, isLoggedInAPI, getSessionStaff } from "./guard";
import { userRoute } from "./user";
import { adminRoute } from "./admin";
import { staffRoute } from "./staff";
import { cartRoute } from "./cart";
import { orderRoutes } from "./order";
import { receiptRoute } from "./receipt-upload";
import { customerRoute } from "./customer";
import { itemRoute } from "./item";
import { shipmentRoute } from "./shipment";
import "./session";
import path from "path";

let app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static("public"));
app.use("/receipt", express.static("receipt"));
app.use("/itemPhoto", express.static("itemPhoto"));
app.use(userRoute);
app.use("/homepage", itemRoute);
app.use("/customer", isLoggedInAPI, customerRoute);
app.use("/staff", getSessionStaff, staffRoute);
app.use("/order", isLoggedInAPI, orderRoutes);
app.use("/receipt", receiptRoute);
app.use("/cart", isLoggedInAPI, cartRoute);
app.use("/item", isLoggedInAPI, itemRoute);
app.use("/admin", getSessionAdmin, adminRoute);
app.use("/admin", getSessionAdmin, express.static("admin"));
app.use("/shipment", isLoggedInAPI, shipmentRoute);

app.use((req, res) => {
  res.status(404);
  res.sendFile(path.resolve("public", "404.html"));
});

let port = 1840;
app.listen(port, () => {
  print(port);
});
