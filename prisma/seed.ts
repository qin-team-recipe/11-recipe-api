import { PrismaClient } from "@prisma/client";
import { faker } from "@faker-js/faker";

const prisma = new PrismaClient();

async function main() {
  // create dummy data
  // create chef role: USER
  for (let index = 0; index < 1000; index++) {
    let name = faker.internet.userName();
    await prisma.user.create({
      data: {
        email: faker.internet.email(),
        name: name,
        chef: {
          create: {
            role: "USER",
            name: name,
            profile: faker.lorem.paragraph(),
            imageUrl: faker.image.avatar(),
            recipes: {
              create: [
                {
                  name: getRecipeName(),
                  overview: faker.lorem.paragraph(),
                  servingSize: "faker.datatype.number()",
                  isPublished: 1,
                  recipeImages: {
                    create: {
                      imageUrl: faker.image.urlLoremFlickr({
                        category: "food",
                      }),
                    },
                  },
                  recipeSteps: {
                    create: [
                      {
                        step: 1,
                        description: faker.lorem.paragraph(),
                        note: faker.lorem.sentence(),
                      },
                      {
                        step: 2,
                        description: faker.lorem.paragraph(),
                        note: faker.lorem.sentence(),
                      },
                      {
                        step: 3,
                        description: faker.lorem.paragraph(),
                        note: faker.lorem.sentence(),
                      },
                    ],
                  },
                  ingredients: {
                    create: [
                      {
                        name: getIngredientName(),
                        note: faker.lorem.sentence(),
                      },
                      {
                        name: getIngredientName(),
                        note: faker.lorem.sentence(),
                      },
                      {
                        name: getIngredientName(),
                        note: faker.lorem.sentence(),
                      },
                      {
                        name: getIngredientName(),
                        note: faker.lorem.sentence(),
                      },
                    ],
                  },
                },
                {
                  name: getRecipeName(),
                  overview: faker.lorem.paragraph(),
                  servingSize: "faker.datatype.number()",
                  isPublished: 1,
                  recipeImages: {
                    create: {
                      imageUrl: faker.image.urlLoremFlickr({
                        category: "food",
                      }),
                    },
                  },
                  recipeSteps: {
                    create: [
                      {
                        step: 1,
                        description: faker.lorem.paragraph(),
                        note: faker.lorem.sentence(),
                      },
                      {
                        step: 2,
                        description: faker.lorem.paragraph(),
                        note: faker.lorem.sentence(),
                      },
                      {
                        step: 3,
                        description: faker.lorem.paragraph(),
                        note: faker.lorem.sentence(),
                      },
                    ],
                  },
                  ingredients: {
                    create: [
                      {
                        name: getIngredientName(),
                        note: faker.lorem.sentence(),
                      },
                      {
                        name: getIngredientName(),
                        note: faker.lorem.sentence(),
                      },
                      {
                        name: getIngredientName(),
                        note: faker.lorem.sentence(),
                      },
                      {
                        name: getIngredientName(),
                        note: faker.lorem.sentence(),
                      },
                    ],
                  },
                },
              ],
            },
          },
        },
        shoppingMemos: {
          create: [
            {
              name: getIngredientName(),
            },
          ],
        },
      },
    });
  }

  const recipeIds = await prisma.recipe.findMany({
    select: {
      id: true,
    },
  });

  const randomRecipeId1 =
    recipeIds[Math.floor(Math.random() * recipeIds.length)].id;

  const createListsForUsers = async () => {
    // 1. `user`テーブルからユーザーを取得
    const users = await prisma.user.findMany();

    // 2. ユーザーごとに`lists`データを作成
    for (const user of users) {
      const userId = user.id;

      // `lists`データを作成
      const createdLists = await prisma.shoppingList.create({
        data: {
          userId: userId,
          recipeId: randomRecipeId1,
          sortOrder: 1,
          shoppingListIngredients: {
            create: [
              {
                name: "野菜",
              },
              {
                name: "野菜",
              },
              {
                name: "野菜",
              },
            ],
          },
        },
      });
    }
  };

  createListsForUsers();

  // create chef role: CHEF
  for (let index = 0; index < 30; index++) {
    let name = faker.internet.userName();
    await prisma.chef.create({
      data: {
        role: "CHEF",
        name: name,
        profile: faker.lorem.paragraph(),
        imageUrl: faker.image.avatar(),
        links: {
          create: [
            {
              siteType: "TWITTER",
              siteName: "Twitter",
              url: faker.internet.url(),
              accountName: "@" + faker.internet.userName(),
            },
            {
              siteType: "INSTAGRAM",
              siteName: "instagram",
              url: faker.internet.url(),
              accountName: "@" + faker.internet.userName(),
            },
            {
              siteType: "OTHER",
              siteName: "サイト名",
              url: faker.internet.url(),
            },
          ],
        },
        recipes: {
          create: [
            {
              name: getRecipeName(),
              overview: faker.lorem.paragraph(),
              servingSize: "faker.datatype.number()",
              isPublished: 1,
              recipeImages: {
                create: {
                  imageUrl: faker.image.urlLoremFlickr({ category: "food" }),
                },
              },
              recipeSteps: {
                create: [
                  {
                    step: 1,
                    description: faker.lorem.paragraph(),
                    note: faker.lorem.sentence(),
                  },
                  {
                    step: 2,
                    description: faker.lorem.paragraph(),
                    note: faker.lorem.sentence(),
                  },
                  {
                    step: 3,
                    description: faker.lorem.paragraph(),
                    note: faker.lorem.sentence(),
                  },
                ],
              },
              ingredients: {
                create: [
                  {
                    name: getIngredientName(),
                    note: faker.lorem.sentence(),
                  },
                  {
                    name: getIngredientName(),
                    note: faker.lorem.sentence(),
                  },
                  {
                    name: getIngredientName(),
                    note: faker.lorem.sentence(),
                  },
                  {
                    name: getIngredientName(),
                    note: faker.lorem.sentence(),
                  },
                ],
              },
            },
            {
              name: getRecipeName(),
              overview: faker.lorem.paragraph(),
              servingSize: "faker.datatype.number()",
              isPublished: 1,
              recipeImages: {
                create: {
                  imageUrl: faker.image.urlLoremFlickr({ category: "food" }),
                },
              },
              recipeSteps: {
                create: [
                  {
                    step: 1,
                    description: faker.lorem.paragraph(),
                    note: faker.lorem.sentence(),
                  },
                  {
                    step: 2,
                    description: faker.lorem.paragraph(),
                    note: faker.lorem.sentence(),
                  },
                  {
                    step: 3,
                    description: faker.lorem.paragraph(),
                    note: faker.lorem.sentence(),
                  },
                ],
              },
              ingredients: {
                create: [
                  {
                    name: getIngredientName(),
                    note: faker.lorem.sentence(),
                  },
                  {
                    name: getIngredientName(),
                    note: faker.lorem.sentence(),
                  },
                  {
                    name: getIngredientName(),
                    note: faker.lorem.sentence(),
                  },
                  {
                    name: getIngredientName(),
                    note: faker.lorem.sentence(),
                  },
                ],
              },
            },
          ],
        },
      },
    });
  }

  const chefIds = await prisma.chef.findMany({
    where: {
      role: "CHEF",
    },
    select: {
      id: true,
    },
  });
  const userIds = await prisma.user.findMany({
    select: {
      id: true,
    },
  });
  // const recipeIds = await prisma.recipe.findMany({
  //   select: {
  //     id: true,
  //   },
  // });

  const followData = [];
  const likesData = [];
  for (let i = 0; i < 200; i++) {
    const randomUserId = userIds[Math.floor(Math.random() * userIds.length)].id;
    const randomChefId = chefIds[Math.floor(Math.random() * chefIds.length)].id;
    const randomRecipeId2 =
      recipeIds[Math.floor(Math.random() * recipeIds.length)].id;

    followData.push({
      userId: randomUserId,
      chefId: randomChefId,
    });

    likesData.push({
      userId: randomUserId,
      recipeId: randomRecipeId2,
    });
  }

  await prisma.follow.createMany({
    data: followData,
    skipDuplicates: true,
  });

  await prisma.like.createMany({
    data: likesData,
    skipDuplicates: true,
  });

  console.log("Dummy data created successfully.");
}

main()
  .catch((error) => {
    console.error(error);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

function getIngredientName() {
  // 食材の材料の配列
  const array = [
    "牛肉",
    "豚肉",
    "鶏肉",
    "魚",
    "卵",
    "牛乳",
    "豆腐",
    "大豆",
    "小麦",
    "米",
    "パン",
    "麺",
    "野菜",
    "果物",
    "きのこ",
    "海藻",
    "海老",
    "カニ",
    "貝",
    "イカ",
    "タコ",
    "エビ",
    "カニ",
    "貝",
    "イカ",
    "タコ",
    "エビ",
    "チーズ",
    "バター",
    "マヨネーズ",
    "ケチャップ",
    "ソース",
    "塩",
    "砂糖",
    "醤油",
    "味噌",
    "酢",
    "酒",
    "みりん",
    "酢",
    "酒",
    "みりん",
    "コショウ",
    "ガーリック",
    "オリーブオイル",
    "サラダ油",
    "ごま油",
  ];
  // 配列の要素数を取得
  const length = array.length;

  // ランダムなインデックスを生成
  const randomIndex = Math.floor(Math.random() * length);

  // ランダムな要素を返す
  return array[randomIndex];
}

function getRecipeName() {
  // 料理名の配列
  const array = [
    "カレー",
    "ハンバーグ",
    "オムライス",
    "親子丼",
    "カツ丼",
    "天丼",
    "牛丼",
    "麻婆豆腐",
    "餃子",
    "焼きそば",
    "ラーメン",
    "チャーハン",
    "ピザ",
    "パスタ",
    "ハンバーガー",
    "サンドイッチ",
    "ステーキ",
    "寿司",
    "刺身",
    "天ぷら",
    "唐揚げ",
    "鍋",
    "お好み焼き",
    "たこ焼き",
    "焼き鳥",
    "串カツ",
    "おでん",
    "おにぎり",
    "お茶漬け",
    "お寿司",
    "お刺身",
    "お天ぷら",
  ];
  // 配列の要素数を取得
  const length = array.length;

  // ランダムなインデックスを生成
  const randomIndex = Math.floor(Math.random() * length);

  // ランダムな要素を返す
  return array[randomIndex];
}
