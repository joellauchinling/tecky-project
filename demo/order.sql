create database "WSP-project";
create role "admin" with password 'admin' superuser;


-- create the table of user
create table "user" (
    id serial primary key
    ,username varchar(50) unique
    ,password varchar(72)
    ,email varchar(100) NULL unique
    ,phone_number varchar(20) NULL
    ,address_id integer NULL
    ,birth_month integer
    ,role varchar(8)
    ,is_vip integer
    ,point integer
    ,discount integer
    ,consumption money
    );
    -- ,foreign key (address_id) references address(id)

-- create table for orderlist
create table order (
    id serial primary key
    ,user_id integer
    ,item_id integer
    ,coupon_id integer
    ,payment_date date
    ,ordered_amount money
    ,payment_evidence varchar(50) NULL
    ,payment_status varchar(20) NULL
    ,address_id integer NULL
);
    -- ,foreign key (user_id) references user(id)
    -- ,foreign key (item_id) references item(id)
    -- ,foreign key (coupon_id) references coupon(id)

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


create table item (
id serial primary key
,category varchar(100)
,name varchar(100) unique
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

SELECT * FROM orderlist;
SELECT * FROM "user";

//order
INSERT INTO order (user_id,item_id,coupon_id,payment_date,ordered_amount) VALUES (3,6,333,'2022-09-09',300);
INSERT INTO order (user_id,item_id,coupon_id,payment_date,ordered_amount) VALUES (2,6,256,'2022-09-10',500);
INSERT INTO order (user_id,item_id,coupon_id,payment_date,ordered_amount) VALUES (20,6,333,'2022-09-11',400);
INSERT INTO order (user_id,item_id,coupon_id,payment_date,ordered_amount) VALUES (33,6,333,'2022-09-12',800);
INSERT INTO order (user_id,item_id,coupon_id,payment_date,ordered_amount) VALUES (55,6,333,'2022-09-08',1200);

//user
INSERT INTO "user" (username,password,birth_month,role, is_vip, point, discount,consumption, email) VALUES ('Cherry','123123',3, 'customer',0,0,0,'500','abc@gmail.com');
INSERT INTO "user" (username,password,birth_month,role, is_vip, point, discount,consumption, email) VALUES ('Hebe','123123',2, 'customer',1,500,5,'3000','ccc@gmail.com');
INSERT INTO "user" (username,password,birth_month,role, is_vip, point, discount,consumption, email) VALUES ('Lucas','123123',5, 'customer',1,200,5,'8000','bbb@gmail.com');
INSERT INTO "user" (username,password,birth_month,role, is_vip, point, discount,consumption, email) VALUES ('Angel','123123',3, 'customer',0,0,0,'800','ccab@gmail.com');
INSERT INTO "user" (username,password,role) VALUES ('Admin','$2a$12$Hxr7tbsldf0Dr/rC6Q.BCurySAreDHwH4CLJVXkd0CbM6cKWpWf8y','admin');
INSERT INTO "user" (username,password,role) VALUES ('Staff','$2a$12$VCNliIunOvL0XqShgYcsPOq1W.C.BNQKkKosYvDJnMD5lVpnftA3C','staff');


//item
INSERT INTO "user" () VALUES


ALTER TABLE "user" ALTER COLUMN character TYPE character(255);