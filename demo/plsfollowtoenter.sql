
-- // 1
create table area (
    id serial primary key
    ,area varchar(20)
);

INSERT INTO area (area) VALUES ('港島'),('九龍'),('新界');

-- //2
create table district (
    id serial primary key
    ,district varchar(20)
    ,area_id integer references area(id)
);

INSERT INTO district (district, area_id) VALUES ('中西區',1),('灣仔',1),('東區',1),('南區',1),('油尖旺',2),('深水埗',2),('九龍城',2),('黃大仙',2),('觀塘',2),('葵青',3),('荃灣',3),('屯門',3),('元朗',3),('北區',3),('大埔',3),('沙田',3),('西貢',3),('離島',3);

-- //3
create table category (
    id serial primary key
    ,cat varchar(30)
);

INSERT INTO category (cat) VALUES ('fruit'),('vegetable'),('meat'),('fish');

-- //4
create table item (
    id serial primary key
    ,category_id integer references category(id)
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

-- //5
create table gift(
id serial primary key
,item_id integer references item(id)
,conditional_min_price integer
,start_date date
,end_date date
);

-- //6 optional
create table additional_product(
id serial primary key
,conditional_item_id integer references item(id)
,price decimal(10,2)
,start_date date
,end_date date
);


-- //7 
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

-- //8


-- //9
create table address (
    id serial primary key
    ,address varchar(50)
    ,district_id integer references district(id)
);


-- //10
create table "user" (
    id serial primary key
    ,username varchar(50) unique NOT NULL
    ,password varchar(60) NOT NULL
    ,email varchar(100) unique
    ,phone_number varchar(20) 
    ,address varchar(255)
    ,birth_month integer
    ,role varchar(8) NOT NULL
    ,is_vip boolean
    ,point integer
    ,discount integer
    ,consumption money
    ,deactivated_time timestamp
    ,credit decimal(10,2)
    );

INSERT INTO "user" (username, password, role) VALUES ('admin', '$2a$12$ZI8kGglQfAzU/RFMyq7YuOckAo.S1WYBHqYW8PfyrOFmRs9tXwcE', 'admin');
then use admin page to create staff ac.
INSERT INTO "user" (username, password, email, address, role, is_vip, discount, consumption) VALUES ('cherry', 'cherry', 'cherry@gmail.com', 1, 'customer', 1, 5, 3000);

-- //11
CREATE TABLE payment (
    id serial primary key
    ,user_id integer NOT NULL references "user"(id)
    ,order_id integer 
    ,evidence varchar(255)
    ,payment_status varchar(15) NOT NULL
    ,date timestamp
);

-- //12
CREATE TABLE "order" (
    id serial primary key
    ,user_id integer NOT NULL references "user"(id)
    ,coupon_id integer references coupon(id)
    ,payment_id integer NOT NULL references payment(id)
    ,amount decimal(10,2) NOT NULL
    ,status varchar(10) 
    ,address varchar(255) NOT NULL
    ,point integer
);

-- //13
CREATE TABLE "orderItem" (
    id serial primary key
    ,user_id integer NOT NULL references "user"(id)
    ,order_id integer NOT NULL references "order"(id)
    ,item_id integer NOT NULL references item(id)
    ,quantity integer NOT NULL
    ,amount decimal(10,2) NOT NULL
);
