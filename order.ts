import e, { Router } from "express";
import { client } from "./db";
import dayjs from "dayjs";

export let orderRoutes = Router();


orderRoutes.get('/', async (req, res) => {
  const {id, role} = req.session.user!;

  let result;
  if (role == 'customer') {
    result = await client.query(
    
      // `select * from "order" where user_id = $1`,
      // [id]
      `SELECT  "order".id, "order".user_id, "order".amount, "order".status, payment.evidence, payment.payment_status, payment.date FROM "order" INNER JOIN payment ON "order".payment_id = payment.id where "order".user_id = $1;`,
      [id]
    )
  } else {
    // result = await client.query(`SELECT * FROM "order";`);
    result = await client.query(
      `SELECT  "order".id, "order".user_id, "order".amount, "order".status, payment.evidence, payment.payment_status, payment.date FROM "order" INNER JOIN payment ON "order".payment_id = payment.id;`
      );
  }

  result.rows.map((result) => {
    result.date = dayjs(result.date).format("YYYY-MM-DD");
  });
  
  res.json(result.rows)
})


orderRoutes.patch("/:id", async (req, res) => {
  try {
    let id = +req.params.id;
    
    if (typeof id !== "number") {
      throw new Error("");
    }
    let { payment_status, status } = req.query;
    
    if (payment_status && status) {
      await client.query(
        `update "payment" set payment_status = $1 where order_id = $2`,
        [payment_status, id]
      );
      await client.query(
        `update "order" set status = $1 where id = $2`,
        [status, id]
      );
    } else {
      await client.query(
        `update "order" set status = $1 where id = $2`,
        [status, id]
      );
    }
    res.json({});
  } catch (error) {
    res.status(500);
    res.json({ error: String(error) });
  }
});


orderRoutes.post("/", async (req, res) => {
  let  {payment_id, amount, address, point} = req.body;
  console.log(req.body);
  
  let coupon_id = req.session.user!.promoCode;

  let result = await client.query(
    `INSERT INTO "order" (user_id, coupon_id, payment_id, amount, address, point) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id`,
    [ req.session.user!.id, coupon_id, payment_id, amount, address, point ]
  );
    console.log('order id', result.rows[0].id);
    
  res.json(result.rows[0].id)
})


orderRoutes.get('/items', async (req,res) => {
  const userId = req.session.user!.id;

  const result = await client.query(
    `select "orderItem".user_id, "orderItem".order_id, "orderItem".quantity, "orderItem".amount, "item".name, "item".photo from "orderItem" inner join "item" on "orderItem".item_id = "item".id where user_id = $1`,
    // `select * from "orderItem" where user_id = $1`,
    [userId]
  );
    
  res.json(result.rows)
})

orderRoutes.post('/items', async (req,res) => {
  const userId = req.session.user!.id;
  let {order_id, quantity, amount, item_id} = req.body;

  const result = await client.query(
    `INSERT INTO "orderItem" (user_id, order_id, quantity, amount, item_id ) VALUES ($1,$2,$3,$4, $5)`,
    [userId, order_id, quantity, amount, item_id]
  );
    
  res.json(result.rows)
})