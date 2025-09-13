-- Drizzle initial migration

CREATE TABLE IF NOT EXISTS projects (
  id serial primary key,
  slug varchar(200) not null unique,
  title varchar(200) not null,
  description text,
  hero_image varchar(1000),
  created_at timestamp default now() not null
);

CREATE TABLE IF NOT EXISTS services (
  id serial primary key,
  slug varchar(200) not null unique,
  title varchar(200) not null,
  description text,
  created_at timestamp default now() not null
);

CREATE TABLE IF NOT EXISTS streams (
  id serial primary key,
  slug varchar(200) not null unique,
  title varchar(200) not null,
  is_live varchar(10) default 'false' not null,
  started_at timestamp,
  created_at timestamp default now() not null
);

CREATE TABLE IF NOT EXISTS posts (
  id serial primary key,
  slug varchar(200) not null unique,
  title varchar(200) not null,
  body text,
  published_at timestamp,
  created_at timestamp default now() not null
);
