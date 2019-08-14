CREATE DATABASE laika_info;


CREATE TABLE source (
  id serial,
  email varchar(225),
  password varchar(255),
  PRIMARY KEY(user_id)
);

CREATE TABLE user (
  id.source,
  id serial,
  first_name varchar(225) NOT NULL,
  last_name varchar(225),
  gender varchar(225),
  birthday varchar(225),
  take_med boolean,
  avg_hr int
);

CREATE TABLE laika (
  id.source,
  id serial,
  laika_use varchar(225)
);

CREATE TABLE medicine (
  id.source,
  id int,
  med_form varchar(255),
  med_name varchar(2555),
  dosage int,
  med_time int
);

CREATE TABLE med_amount (
  id.medicine,
  id int,
  med_start int,
  med_current int
);
