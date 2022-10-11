-- 1. create the project inside your pc
create database project;
\c project;

-- 2. create a role and alter it for accessing the db
create role project with password 'project' superuser;
alter role project with login;

-- create the table of address[area]
create table area (
    id serial primary key
    ,area varchar(20)
);

INSERT INTO area (area) VALUES ('港島'),('九龍'),('新界');

-- you could use this to insert area record iterally
/*
let array = ['港島','九龍','新界']
async function main() {
  for (let i of array) {
    await client.query("insert into area (area) values ($1)", [i]);
  }
}
console.log("finished");
main();
*/


-- create the table of address[district]
create table district (
    id serial primary key
    ,district varchar(20)
    ,area_id integer references area(id)
);

INSERT INTO district (district) VALUES ('中西區'),('灣仔'),('東區'),('南區'),('油尖旺'),('深水埗'),('九龍城'),('黃大仙'),('觀塘'),('葵青'),('荃灣'),('屯門'),('元朗'),('北區'),('大埔'),('沙田'),('西貢'),('離島');


-- you could use this to insert district record iterally
/*
let array = ['中西區','灣仔','東區','南區','油尖旺','深水埗','九龍城','黃大仙','觀塘','葵青','荃灣','屯門','元朗','北區','大埔','沙田','西貢','離島']
async function main() {
  for (let i of array) {
    await client.query("insert into district (district) values ($1)", [i]);
  }
}
console.log("finished");
main();
*/

-- you could use this to update the foreign key in district table
/*
update district set area_id = 1 where id<5;
update district set area_id = 2 where id>4 and id<10;
update district set area_id = 1 where id>9;
*/

-- create the table of address[address]
create table address (
    id serial primary key
    ,address varchar(50)
    ,district_id integer references district(id)
);




-- create the table of user
create table "user" (
    id serial primary key
    ,username varchar(50) unique NOT NULL
    ,password varchar(72) NOT NULL
    ,email varchar(100) NULL unique
    ,phone_number varchar(20) 
    ,address_id integer references address(id)
    ,birth_month integer
    ,role varchar(8) NOT NULL
    ,is_vip integer
    ,point integer
    ,discount integer
    ,consumption money
    ,deactivated_time timestamp
    ,credit decimal(10,2)
    );

-- deactivated_time admin block ac time 
-- INSERT INTO "user" (username,password,role) VALUES ('Admin','$2a$12$Hxr7tbsldf0Dr/rC6Q.BCurySAreDHwH4CLJVXkd0CbM6cKWpWf8y','admin');

create table cart (
    id serial primary key
    ,user_id integer NOT NULL references "user"(id)
    ,item_id integer NOT NULL references "item"(id)
    ,order_quantity integer NOT NULL
    ,status varchar(50) NOT NULL
);
-- status //active, deactivate  //if user delect item in cart, it will deactivate the item and push into "addback" block, so user can add back the item they removed
-- when user confirmed order

CREATE TABLE payment (
    id serial primary key
    ,user_id integer NOT NULL references "user"(id)
    ,order_id integer NOT NULL
    ,evidence varchar(255)
    ,payment_status varchar(15) NOT NULL
    ,date timestamp
    ,foreign key (user_id) references "user"(id)
    ,foreign key (order_id) references "order"(id)
);

-- INSERT INTO payment (id,user_id,order_id,evidence,payment_status,date) VALUES (1,5,1,'34775ca0ad3602c4d32610e01.12.14.png','confirmed','2022-09-09');
-- INSERT INTO payment (id,user_id,order_id,evidence,payment_status,date) VALUES (2,5,2,'34775ca0ad3602c4d32610e00.54.52.png','confirmed','2022-09-10');
-- INSERT INTO payment (id,user_id,order_id,evidence,payment_status,date) VALUES (3,5,3,'14a0b626257304be7dca18c00.54.04.png','confirmed','2022-09-12');
-- INSERT INTO payment (id,user_id,order_id,payment_status) VALUES (4,3,4,'waitingUpload');

CREATE TABLE order (
    id serial primary key
    ,user_id integer NOT NULL references "user"(id)
    ,coupon_id integer references coupon(id)
    ,payment_id integer NOT NULL references payment(id)
    ,amount money NOT NULL
    ,status varchar(10) 
    ,address_id integer NOT NULL references address(id)
    ,point integer NOT NULL
);

-- INSERT INTO "order" (user_id,payment_date,amount, status, address_id, point) VALUES (5,'2022-09-09',85,'deliverd','confirmed', 2, 0);
-- INSERT INTO "order" (user_id,payment_date,amount, status, address_id, point) VALUES (5,'2022-09-10',100,'delivering','confirmed', 2, 1);
-- INSERT INTO "order" (user_id,payment_date,amount, status, address_id, point) VALUES (5,'2022-09-12',65,'readying','pending', 2, 0);

CREATE TABLE orderItem (
    id serial primary key
    ,user_id integer NOT NULL references "user"(id)
    ,order_id integer NOT NULL references "order"(id)
    ,item_id integer NOT NULL references item(id)
    ,quantity integer NOT NULL
    ,amount money NOT NULL
);

-- INSERT INTO "orderItem" (user_id, orderlist, qty, amount, item_name) VALUES (5,1,2,10,'apple');
-- INSERT INTO "orderItem" (user_id, orderlist, qty, amount, item_name) VALUES (5,1,4,40,'banana');
-- INSERT INTO "orderItem" (user_id, orderlist, qty, amount, item_name) VALUES (5,1,5,35,'cake');
-- INSERT INTO "orderItem" (user_id, orderlist, qty, amount, item_name) VALUES (5,2,5,25,'apple');
-- INSERT INTO "orderItem" (user_id, orderlist, qty, amount, item_name) VALUES (5,2,4,40,'banana');
-- INSERT INTO "orderItem" (user_id, orderlist, qty, amount, item_name) VALUES (5,2,5,35,'cake');
-- INSERT INTO "orderItem" (user_id, orderlist, qty, amount, item_name) VALUES (5,3,3,15,'apple');
-- INSERT INTO "orderItem" (user_id, orderlist, qty, amount, item_name) VALUES (5,3,5,50,'banana');

create table item (
id serial primary key
,category varchar(100)
,name varchar(100) unique NOT NULL
,price decimal(10,2)
,spec varchar(100) 
,weight decimal(10,2)
,quantity integer
,photo varchar(255)
,is_product boolean
,is_hot_item boolean
,created_time timestamp default current_timestamp
,deactivated_time timestamp 
);


create table coupon (
    id serial primary key
    , amount integer
    , code varchar(20)
    , condition varchar(50)
    , no_of_coupon integer
    , max_claim integer
    , start_date date
    , end_date date
);


create table category (
    id serial primary key
    ,cat varchar(30)
);

INSERT INTO "category" (cat) VALUES ('fruit'),('vegetable'),('meat'),('fish');

