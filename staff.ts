import { Router } from "express";
import { client } from "./db";
import "./session";
import { hashPassword, checkPassword } from "./hash";
import formidable from "formidable";
import { mkdirSync } from "fs";

export let staffRoute = Router();

let uploadDir = "./itemPhoto"; // folder name
mkdirSync(uploadDir, { recursive: true });

staffRoute.get("/ctmLists", async (req, res) => {
  try {
    const result = await client.query(
      `SELECT * FROM "user" WHERE role = 'customer'`
    );
    res.json(result.rows);
  } catch (error) {
    res.status(500);
    res.json({ error: String(error) });
  }
});

// return the staff id to JS when the staff try to change his password
staffRoute.get("/staffId", async (req, res) => {
  try {
    let result = await client.query(
      `select id from "user" where role = 'staff' and id = $1`,
      [req.session.user!.id]
    );
    res.json(result.rows);
  } catch (error) {
    res.status(500);
    res.json({ error: String(error) });
  }
});

// patch: change the password in database
staffRoute.patch("/:id", async (req, res) => {
  let id = +req.params.id;
  let { old_password, new_password, re_password } = req.body;
  // console.log(old_password);
  // console.log(new_password);
  // console.log(re_password);
  if (!old_password) {
    res.status(400);
    res.json({ error: "Missing old password." });
    return;
  }

  if (!new_password || !re_password) {
    res.status(400);
    res.json({ error: "Missing new password." });
    return;
  }

  if (new_password !== re_password) {
    res.status(400);
    res.json({ error: "Two passwords are not matched." });
    return;
  }
  // if (
  //   typeof !old_password != "string" ||
  //   typeof !new_password != "string" ||
  //   typeof !re_password != "string"
  // ) {
  //   res.status(400);
  //   res.json({ error: "Invalid Input, a string expected." });
  //   return;
  // }

  let result = await client.query(`select * from "user" where id = $1`, [id]);
  let target = result.rows[0];
  let match = await checkPassword(old_password, target.password);
  if (match == false) {
    res.status(400);
    res.json({ error: "Wrong password." });
    return;
  }
  let hash_new_password = await hashPassword(new_password);
  await client.query(`update "user" set password = $1 where id = $2`, [
    hash_new_password,
    id,
  ]);
  res.json({});
});

staffRoute.get("/coupon", async (req, res) => {
  try {
    const result = await client.query(`SELECT * FROM coupon`);
    res.json(result.rows);
  } catch (error) {
    res.status(500);
    res.json({ error: String(error) });
  }
});

staffRoute.post("/coupon", async (req, res) => {
  try {
    let {
      code,
      amount,
      no_of_coupon,
      condition,
      max_claim,
      start_date,
      end_date,
    } = req.body;

    if (!code) {
      res.status(400);
      res.json({ error: "Missing coupon code" });
      return;
    }
    if (!amount) {
      res.status(400);
      res.json({ error: "Missing coupon amount" });
      return;
    }
    if (!no_of_coupon) {
      res.status(400);
      res.json({ error: "Missing the total number of coupon" });
      return;
    }
    if (!condition) {
      res.status(400);
      res.json({ error: "Missing coupon usage condition" });
      return;
    }
    if (!max_claim) {
      res.status(400);
      res.json({ error: "Missing the maximum time of claiming" });
      return;
    }
    if (!start_date) {
      res.status(400);
      res.json({ error: "Missing the starting date" });
      return;
    }
    if (!end_date) {
      res.status(400);
      res.json({ error: "Missing the ending date" });
      return;
    }
    await client.query(
      `insert into coupon (code, amount, no_of_coupon, condition, max_claim, start_date, end_date) values ($1, $2, $3, $4, $5, $6, $7)`,
      [code, amount, no_of_coupon, condition, max_claim, start_date, end_date]
    );
    res.json({});
  } catch (error) {
    res.status(500);
    res.json({ error: String(error) });
  }
});

staffRoute.get("/couponInfo/:id", async (req, res) => {
  try {
    let id = +req.params.id;
    const result = await client.query(`SELECT * FROM coupon where id = $1`, [
      id,
    ]);
    res.json(result.rows);
  } catch (error) {
    res.status(500);
    res.json({ error: String(error) });
  }
});

staffRoute.patch("/coupon/:id", async (req, res) => {
  try {
    let id = +req.params.id;
    let {
      code,
      amount,
      no_of_coupon,
      condition,
      max_claim,
      start_date,
      end_date,
    } = req.body;

    if (!code) {
      res.status(400);
      res.json({ error: "Missing coupon code" });
      return;
    }
    if (!amount) {
      res.status(400);
      res.json({ error: "Missing coupon amount" });
      return;
    }
    if (!no_of_coupon) {
      res.status(400);
      res.json({ error: "Missing the total number of coupon" });
      return;
    }
    if (!condition) {
      res.status(400);
      res.json({ error: "Missing coupon usage condition" });
      return;
    }
    if (!max_claim) {
      res.status(400);
      res.json({ error: "Missing the maximum time of claiming" });
      return;
    }
    if (!start_date) {
      res.status(400);
      res.json({ error: "Missing the starting date" });
      return;
    }
    if (!end_date) {
      res.status(400);
      res.json({ error: "Missing the ending date" });
      return;
    }
    await client.query(
      `update coupon set 
      code=$1,
      amount=$2,
      no_of_coupon=$3,
      condition=$4,
      max_claim=$5,
      start_date=$6,
      end_date=$7
      where id = $8`,
      [
        code,
        amount,
        no_of_coupon,
        condition,
        max_claim,
        start_date,
        end_date,
        id,
      ]
    );
    res.json({});
  } catch (error) {
    res.status(500);
    res.json({ error: String(error) });
  }
});

staffRoute.post("/item", (req, res) => {
  let form = formidable({
    uploadDir,
    keepExtensions: true,
    maxFiles: 1,
    maxFileSize: 10 * 1024 ** 2,
    filter: (part) => part.mimetype?.startsWith("image/") || false,
  });

  try {
    form.parse(req, async (err, fields, files) => {
      if (err) {
        res.status(400);
        res.end(String(err));
        return;
      }
      // check if username and password have been filled in
      let {
        category,
        name,
        price,
        spec,
        weight,
        quantity,
        is_product,
        is_hot_item,
      } = fields;

      if (!category) {
        res.status(400);
        res.json({ error: "Missing category" });
        return;
      }
      if (!name) {
        res.status(400);
        res.json({ error: "Missing name" });
        return;
      }
      if (!price) {
        res.status(400);
        res.json({ error: "Missing price" });
        return;
      }
      if (!spec) {
        res.status(400);
        res.json({ error: "Missing spec" });
        return;
      }
      if (!weight) {
        res.status(400);
        res.json({ error: "Missing weight" });
        return;
      }
      if (!quantity) {
        res.status(400);
        res.json({ error: "Missing quantity" });
        return;
      }
      // console.log(Boolean(is_product));
      // console.log(Boolean(is_hot_item));

      let image = files.image;
      let imageFile = Array.isArray(image) ? image[0] : image;
      let image_filename = imageFile?.newFilename;

      await client.query(
        `insert into item 
        (category, name, price, spec, weight, quantity, is_product, is_hot_item ,photo) 
        values ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
        [
          category,
          name,
          price,
          spec,
          weight,
          quantity,
          Boolean(is_product),
          Boolean(is_hot_item),
          image_filename,
        ]
      );
      res.json({});
      return;
    });
  } catch (error) {
    res.status(400);
    res.json({ error: String(error) });
  }
});

staffRoute.get("/product", async (req, res) => {
  try {
    let result = await client.query(
      `select * from item where is_product is true order by category`
    );
    res.json(result.rows);
  } catch (error) {
    res.status(500);
    res.json({ error: String(error) });
  }
});
staffRoute.get("/gift", async (req, res) => {
  try {
    let result = await client.query(
      `select * from item where is_product is false order by category`
    );
    res.json(result.rows);
  } catch (error) {
    res.status(500);
    res.json({ error: String(error) });
  }
});

staffRoute.get("/itemInfo/:id", async (req, res) => {
  try {
    let id = +req.params.id;
    const result = await client.query(`SELECT * FROM item where id = $1`, [id]);
    res.json(result.rows);
  } catch (error) {
    res.status(500);
    res.json({ error: String(error) });
  }
});

staffRoute.patch("/item/:id", async (req, res) => {
  try {
    let id = +req.params.id;
    let {
      category,
      name,
      price,
      spec,
      weight,
      quantity,
      is_product,
      is_hot_item,
    } = req.body;

    if (!category) {
      res.status(400);
      res.json({ error: "Missing category" });
      return;
    }
    if (!name) {
      res.status(400);
      res.json({ error: "Missing name" });
      return;
    }
    if (!price) {
      res.status(400);
      res.json({ error: "Missing price" });
      return;
    }
    if (!spec) {
      res.status(400);
      res.json({ error: "Missing spec" });
      return;
    }
    if (!weight) {
      res.status(400);
      res.json({ error: "Missing weight" });
      return;
    }
    if (!quantity) {
      res.status(400);
      res.json({ error: "Missing quantity" });
      return;
    }

    await client.query(
      `update item set 
      category=$1,
      name=$2,
      price=$3,
      spec=$4,
      weight=$5,
      quantity=$6,
      is_product=$7,
      is_hot_item=$8
      where id = $9`,
      [
        category,
        name,
        price,
        spec,
        weight,
        quantity,
        Boolean(is_product),
        Boolean(is_hot_item),
        id,
      ]
    );
    res.json({});
  } catch (error) {
    res.status(500);
    res.json({ error: String(error) });
  }
});
