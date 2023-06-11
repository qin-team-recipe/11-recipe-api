import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// TODO: fix error
async function main() {
  const alice = await prisma.user.create({
    data: {
      email: "alice@prisma.io",
      name: "Alice",
    },
  });

  const bob = await prisma.user.create({
    data: {
      email: "bob@prisma.io",
      name: "Bob",
    },
  });

  const chefAlice = await prisma.chef.create({
    data: {
      user_id: alice.id,
      role: 1,
      name: "Alice Chef",
      profile: "Chef Alice's profile",
      image_url: "https://example.com/alice.jpg",
    },
  });

  const follow1 = await prisma.follow.create({
    data: {
      following_user_id: alice.id,
      follower_user_id: bob.id,
    },
  });

  const follow2 = await prisma.follow.create({
    data: {
      following_user_id: bob.id,
      follower_user_id: alice.id,
    },
  });

  const link1 = await prisma.link.create({
    data: {
      site_name: "Example Site 1",
      url: "https://example.com/site1",
      account_name: "site1_user",
    },
  });

  const link2 = await prisma.link.create({
    data: {
      site_name: "Example Site 2",
      url: "https://example.com/site2",
      account_name: "site2_user",
    },
  });

  const recipe1 = await prisma.recipe.create({
    data: {
      name: "Recipe 1",
      overview: "Recipe 1 overview",
      serving_size: 4,
      is_published: 1,
    },
  });

  const recipe2 = await prisma.recipe.create({
    data: {
      name: "Recipe 2",
      overview: "Recipe 2 overview",
      serving_size: 2,
      is_published: 1,
    },
  });

  const like1 = await prisma.like.create({
    data: {
      user_id: bob.id,
      recipe_id: recipe1.id,
    },
  });

  const like2 = await prisma.like.create({
    data: {
      user_id: bob.id,
      recipe_id: recipe2.id,
    },
  });

  const recipeImage1 = await prisma.recipeImage.create({
    data: {
      recipe_id: recipe1.id,
      image_url: "https://example.com/recipe1.jpg",
    },
  });

  const recipeImage2 = await prisma.recipeImage.create({
    data: {
      recipe_id: recipe2.id,
      image_url: "https://example.com/recipe2.jpg",
    },
  });

  const recipeStep1 = await prisma.recipeStep.create({
    data: {
      recipe_id: recipe1.id,
      description: "Step 1 description",
      note: "Step 1 note",
    },
  });

  const recipeStep2 = await prisma.recipeStep.create({
    data: {
      recipe_id: recipe2.id,
      description: "Step 2 description",
      note: "Step 2 note",
    },
  });

  const ingredient1 = await prisma.ingredient.create({
    data: {
      name: "Ingredient 1",
      note: "Ingredient 1 note",
    },
  });

  const ingredient2 = await prisma.ingredient.create({
    data: {
      name: "Ingredient 2",
      note: "Ingredient 2 note",
    },
  });

  const shoppingList1 = await prisma.shoppingList.create({
    data: {
      recipe_name: "Shopping List 1",
      sort_order: 1,
    },
  });

  const shoppingList2 = await prisma.shoppingList.create({
    data: {
      recipe_name: "Shopping List 2",
      sort_order: 2,
    },
  });

  const shoppingListIngredient1 = await prisma.shoppingListIngredient.create({
    data: {
      shopping_list_id: shoppingList1.id,
      name: "Ingredient 1",
      note: "Ingredient 1 note",
      is_bought: false,
    },
  });

  const shoppingListIngredient2 = await prisma.shoppingListIngredient.create({
    data: {
      shopping_list_id: shoppingList2.id,
      name: "Ingredient 2",
      note: "Ingredient 2 note",
      is_bought: true,
    },
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
