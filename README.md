# 11-recipe-api

## DockerでAPI(express)とDB(postgres)のcontainerを構築する
APIとDBのcontainerを立ち上げる
```
docker-compose up -d
```
package.jsonなどに変更があり再度Docker Imageをbuildし直す場合
```
docker-compose up -d --build
```
DockerのDBに接続するためにローカルに`.env`ファイルを作成し以下を追記する
```
DB_USER=postgres
DB_PASSWORD=password
DB_PORT=5432
DB_NAME=recipeapp
```

起動したAPIのcontainerに入る
```
docker-compose exec app /bin/sh
```

schema.prismaをmigrateしてDBおよびテーブルを作成する(containerに入って)
```
npx prisma migrate dev --name init
```
docker volumeに `11-recipe-api_postgres_data` が作成される。
[docker volume](https://matsuand.github.io/docs.docker.jp.onthefly/storage/volumes/)にDBを作成することで、containerを落としてもDBが消えない。
存在するdocker volumeの確認方法
```
docker volume ls
```
Docker Containerのステータスの確認
```
docker-compose ps -a
```
containerを終了する
```
docker-compose down
```

※DBにはcontainerが起動している時のみ接続可能