import { Router } from "express";
import { client } from "./db";
import "./session";

export let itemRoute = Router();

itemRoute.get("/item", async (req, res) => {
  // Get all items
  try {
    let result = await client.query(
      "SELECT id, name, price, photo, category FROM item WHERE is_product is true and deactivated_time is null"
    );
    let products = result.rows;
    for (let product of products) {
      product.cart_quantity = req.session?.item?.[product.id] || 0;
    }
    res.json(products);
  } catch (error) {
    res.status(500);
    res.json({ error: String(error) });
  }
});

itemRoute.get("/category", async (req, res) => {
  // Get all category
  try {
    let result = await client.query(
      `SELECT * FROM item`
      // `SELECT category FROM item group by category`
    );
    res.json(result.rows);
  } catch (error) {
    res.status(500);
    res.json({ error: String(error) });
  }
});
