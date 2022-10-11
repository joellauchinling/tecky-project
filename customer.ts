import { client } from "./db";
import { Router } from "express";
import "./session";

export let customerRoute = Router();

customerRoute.get("/info", async (req, res) => {
  const userId = req.session.user!.id;
  try {
    const result = await client.query(`SELECT * FROM "user" where id = $1;`, [
      userId,
    ]);
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500);
    res.json({ error: String(error) });
  }
});

customerRoute.get("/orderChecking", async (req, res) => {
  try {
    let result = await client.query(
      `select * from "order" where user_id = $1`,
      [req.session.user!.id]
    );
    let row = result.rows;
    console.log(row);
    res.json(row);
  } catch (error) {
    res.status(500);
    res.json({ error: String(error) });
  }
});
