import { client } from "./db";
import { Router } from "express";

export let shipmentRoute = Router();

shipmentRoute.get("/area", async (req, res) => {
  try {
    let result = await client.query("select * from area");
    let areas = result.rows;
    console.log(areas);
    res.json(areas);
  } catch (error) {
    res.status(500);
    res.json({ error: String(error) });
  }
});

shipmentRoute.get("/district", async (req, res) => {
  let { area } = req.query;
  let areaID = await client.query("select id from area where area = ($1)", [
    area,
  ]);
  let target = areaID.rows[0].id;
  let result = await client.query(
    "select * from district where area_id = ($1)",
    [target]
  );
  console.log(result.rows);
  res.json(result.rows);
});
