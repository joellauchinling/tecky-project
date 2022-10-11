import { Router } from "express";
import formidable from "formidable";
import { mkdirSync } from "fs";
import { client } from "./db";
import dayjs from 'dayjs';

export let receiptRoute = Router();

let uploadDir = "./receipt"; // folder name
mkdirSync(uploadDir, { recursive: true });

/*upload receipt with image file version */
receiptRoute.post("/:id", async (req, res) => {
  let orderId = +req.params.id;

  //let orderId =  req.session.order.id; // get order id by session

  // let orderId = 1;
  if (typeof orderId !== "number") {
    throw new Error("");
  }
  let form = formidable({
    uploadDir,
    maxFiles: 1,
    maxFileSize: 5 * 1024 ** 2, //5MB
    keepExtensions: true,
    filter: (part) =>
      (part.name === "image" && part.mimetype?.startsWith("image/")) || false,
  });
  try {
    form.parse(req, async (err, fields, files) => {
      if (err) {
        res.status(400);
        res.end("Failed to upload receipt: " + String(err));
        return;
      }
      let image = files.image;
      let imageFile = Array.isArray(image) ? image[0] : image;
      let image_filename = imageFile?.newFilename;
      console.log("image_filename:", image_filename);

      let date = dayjs(Date.now()).format('YYYY-MM-DD');

      let result = await client.query(
        `SELECT payment_id FROM "order" WHERE id = $1`,
        [orderId]
      )
      
      let payment_id = result.rows[0].payment_id
      // add photo
      await client.query(
        `update "payment" set evidence = $1,  payment_status = 'pending', date = $2, order_id = $3 where id = $4`,
        [image_filename, date, orderId, payment_id]
      );
      // update the order status
      // await client.query(
      //   `update "payment" set payment_status = 'pending' where order_id = $1`,
      //   [orderId]
      // );
      res.status(201);
      res.redirect("/orderdetails.html");

      // .catch(err=> {
      //     console.error(`Failed to upload ${receiptFile}:`, err)
      //     res.status(507)
      //     res.end('Failed to save: ' + receiptFile)
      // })
    });
  } catch (error) {
    console.log(error);
    
    res.status(400);
    res.end("Failed to upload photo");
  }
});

receiptRoute.post("/", async (req, res) => {

  // let records = await client.query(
  //   `select * from payment where user_id = $1 and order_id is not null;`,
  //  [ req.session.user?.id]
  // )

  let result = await client.query(
    `INSERT INTO "payment" (user_id, payment_status) VALUES ($1, 'waitingUpload') RETURNING id`,
    [req.session.user!.id]
  );

  res.json(result.rows[0].id)
})
