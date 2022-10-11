import { client } from "./db";
import { sessionMiddleware } from "./session";
import express, { Router } from "express";
export let userRoute = Router();
import { hashPassword, checkPassword } from "./hash";
import { isLoggedInAPI } from "./guard";
import { json } from "stream/consumers";

userRoute.use(express.static("public"));
userRoute.use(express.urlencoded({ extended: false }));
userRoute.use(express.json());
userRoute.use(sessionMiddleware);

// Signup post
userRoute.post("/signup", async (req, res) => {
  try {
    let { username, password, re_password } = req.body;

    if (!username || !password || !re_password) {
      res.status(400);
      res.json({ error: "Missing username or password" });
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
    if (password !== re_password) {
      res.status(400);
      res.json({ error: "Two password are not matched" });
      return;
    }

    username = username.toLowerCase();
    let hash_password = await hashPassword(password);
    let result = await client.query(
      'insert into "user" (username, password, role, is_vip) values ($1, $2, $3, $4) returning id',
      // [username, hash_password, "customer", false]
      [username, hash_password, "customer", 0]
    );
    let id = result.rows[0].id;
    req.session.user = { id: id, username, role: "customer" };
    req.session.save();
    res.status(202);
    res.json({});
  } catch (error) {
    res.status(500);
    res.json({ error: String(error) });
  }
});

// Login
userRoute.post("/login", async (req, res) => {
  try {
    let { username, password } = req.body;
    username = username.toLowerCase();
    if (!username || !password) {
      res.status(400);
      res.json({ error: "Missing username or password" });
      return;
    }
    if (typeof username !== "string" || typeof password !== "string") {
      res.status(400);
      res.json({ error: "Invalid username or password, please try again." });
      return;
    }
    // console.log({ username, password });
    let result = await client.query(
      `select id, username, password, role, deactivated_time from "user" where username=($1)`,
      [username]
    );
    //result.rows is a Array of object
    if (result.rows.length === 0) {
      res.status(400);
      res.json({ error: "Wrong username or password." });
    }
    let row = result.rows[0];

    let match = await checkPassword(password, row.password);
    if (match == false) {
      res.status(400);
      res.json({ error: "Wrong password." });
    }

    if (row.deactivated_time !== null) {
      res.status(401);
      res.json({ error: "Your permission has been declined." });
    }

    req.session.user = { id: row.id, username, role: row.role };
    req.session.save();
    res.status(202);
    let role = req.session.user.role;
    console.log("User successfully login");
    res.json({ role });
    // switch (row.role) {
    //   case "admin":
    //     res.redirect("/admin/admin.html");
    //     break;
    //   case "staff":
    //     res.redirect("/staff.html");
    //     break;
    //   case "customer":
    //     res.redirect("/index.html");
    //     break;
    // }
  } catch (error) {
    res.status(500);
    console.log(String(error));
    res.end(String(error));
  }
});

userRoute.post("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      res.status(500);
      res.end("Failed to logout");
      return;
    }
    res.status(202);
    res.end();
  });
});

userRoute.get("/vip", async (req, res) => {
  try {
    let id = req.session.user!.id;
    let result = await client.query(`select is_vip from "user" where id = $1`, [
      id,
    ]);
    let vip = result.rows[0];
    res.json(vip);
  } catch (error) {
    res.status(500);
    res.json({ error: String(error) });
  }
});

//
userRoute.get("/profile", (req, res) => {
  switch (req.session.user?.role) {
    case "admin":
      res.redirect("/admin/admin.html");
      break;
    case "staff":
      res.redirect("/staff.html");
      break;
    case "customer":
      res.redirect("/customer.html");
      break;
    default:
      res.redirect("/login.html");
  }
});

userRoute.get("/toCart", (req, res) => {
  if (req.session.user) {
    res.redirect("/cart.html");
  } else {
    res.redirect("/login.html");
  }
});
