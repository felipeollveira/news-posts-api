CREATE TABLE users (
  id serial PRIMARY KEY,
  login text,
  password text
);

CREATE TABLE posts (
  post_id serial primary key,
  titulo text not null,
  imagem bytea,
  introducao text,
  desenvolvimento text not null,
  conclusao text,
  data date,
  autor text
);
