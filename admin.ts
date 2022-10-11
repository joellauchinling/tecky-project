import { client } from "./db";
import { Router } from "express";
import { hashPassword } from "./hash";

export let adminRoute = Router();

adminRoute.get("/", async (req, res) => {
  try {
    let result = await client.query(
      `select id, username, deactivated_time from "user" where role='staff' order by id`
    );
    let rows = result.rows;
    res.json(rows);
  } catch (error) {
    res.status(500);
    res.json({ error: String(error) });
  }
});

// Add Staff
adminRoute.post("/", async (req, res) => {
  try {
    let { username, password, re_password } = req.body;
    if (!username) {
      res.status(400);
      res.json({ error: "Missing username" });
      return;
    }

    if (!password) {
      res.status(400);
      res.json({ error: "Missing password" });
      return;
    }
    if (password !== re_password) {
      res.status(400);
      res.json({ error: "Two passwords are not matched." });
      return;
    }
    if (
      typeof username !== "string" ||
      typeof password !== "string" ||
      typeof re_password !== "string"
    ) {
      res.status(400);
      res.json({ error: "Invalid username or password, please try again." });
      return;
    }

    let hash_password = await hashPassword(password);
    await client.query(
      `insert into "user" (username, password, role) values ($1, $2, 'staff')`,
      [username, hash_password]
    );
    res.status(200);
    res.json({});
  } catch (error) {
    res.status(500);
    res.json({ error: String(error) });
  }
});

adminRoute.patch("/:id", async (req, res) => {
  try {
    let id = +req.params.id;
    if (typeof id !== "number") {
      throw new Error("");
      return;
    }
    let { status } = req.query;
    if (status == "deactivate") {
      await client.query(
        `update "user" set deactivated_time = CURRENT_TIMESTAMP where id = $1`,
        [id]
      );
    }
    if (status == "activate") {
      await client.query(
        `update "user" set deactivated_time = null where id = $1`,
        [id]
      );
    }
    res.json({});
  } catch (error) {
    res.status(500);
    res.json({ error: String(error) });
  }
});
