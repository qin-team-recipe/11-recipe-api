# 11-recipe-api
recipe app backend

docker build . -t test
docker run -p 8080:8080 -d test

## DockerでDBのcontainerを構築する
dbのcontainerを立ち上げる
```
docker-compose up -d
```
DockerのDBに接続するためにローカルに`.env`ファイルを作成し以下を追記する
```
DATABASE_URL="postgresql://postgres:password@localhost:5433/recipeapp"
```

schema.prismaをmigrateしてDBおよびテーブルを作成する
```
npx prisma migrate dev --name init
```
docker volumeに `11-recipe-api_postgres_data` が作成される。
[docker volume](https://matsuand.github.io/docs.docker.jp.onthefly/storage/volumes/)にDBを作成することで、containerを落としてもDBが消えない。
存在するdocker volumeの確認方法
```
docker volume ls
```
containerを終了する
```
docker-compose down
```
※DBにはcontainerが起動している時のみ接続可能

---
## ローカルでPostgreqlを使用する場合
emptyのDBを作成する


PostgresqlのDBにログインする
```
psql postgres
```

DBを作成する
```
create database DBNAME;
```

ローカルに`.env`ファイルを作成し、`DATABASE_URL` を定義する
```
DATABASE_URL="postgresql://USER_NAME:PASSWORD@HOST:PORT/DBNAME"
// ex) DATABASE_URL="postgresql://nakaharakenichi:password@localhost:5432/exploreprisma"
※ HOST: サーバのホスト名はデフォルトは "localhost" 
※ PORT: サーバが監視しているポート番号。デフォルトは Postgres の標準的な ポート番号(5432)
```

DB初期マイグレーション(DBが存在しなければ作成 + テーブルの作成)
```
npx prisma migrate dev --name init
```