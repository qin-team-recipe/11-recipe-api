# 11-recipe-api
recipe app backend

docker build . -t test
docker run -p 8080:8080 -d test

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

DB初期マイグレーション
```
npx prisma migrate dev --name init
```