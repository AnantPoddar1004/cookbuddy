const fallbackRecipes = [
  {
    id: 'lentil-tacos',
    name: 'Smoky Lentil Tacos',
    time: '30 min',
    level: 'Beginner',
    servings: 4,
    match: 'Budget-friendly, simple to cook, and easy to adapt around allergies.',
    ingredients: ['Lentils', 'Tortillas', 'Salsa', 'Avocado', 'Cabbage', 'Lime'],
    steps: [
      'Simmer lentils with taco seasoning until tender.',
      'Warm tortillas and slice avocado, cabbage, and lime.',
      'Build tacos with lentils, salsa, vegetables, and a squeeze of lime.',
    ],
  },
  {
    id: 'veggie-fried-rice',
    name: 'Vegetable Fried Rice',
    time: '25 min',
    level: 'Beginner',
    servings: 3,
    match: 'Uses flexible ingredients and turns leftovers into a quick dinner.',
    ingredients: ['Rice', 'Eggs', 'Frozen vegetables', 'Soy sauce', 'Green onions'],
    steps: [
      'Scramble eggs in a hot pan, then set them aside.',
      'Cook vegetables and rice until the rice gets lightly crisp.',
      'Stir eggs back in with soy sauce and green onions.',
    ],
  },
  {
    id: 'sheet-pan-gnocchi',
    name: 'Sheet Pan Gnocchi',
    time: '32 min',
    level: 'Novice',
    servings: 4,
    match: 'Low cleanup, beginner-friendly, and easy to portion for leftovers.',
    ingredients: ['Gnocchi', 'Cherry tomatoes', 'Zucchini', 'Mozzarella', 'Basil'],
    steps: [
      'Spread gnocchi and vegetables on a sheet pan with olive oil.',
      'Roast until the gnocchi is crisp and tomatoes soften.',
      'Top with mozzarella and basil before serving.',
    ],
  },
]

function normalizeRecipes(recipes) {
  if (!Array.isArray(recipes)) return []

  return recipes
    .filter((recipe) => recipe && recipe.name)
    .map((recipe, index) => ({
      id: recipe.id || recipe.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || `recipe-${index + 1}`,
      name: recipe.name,
      time: recipe.time || '30 min',
      level: recipe.level || 'Beginner',
      servings: recipe.servings || 2,
      match: recipe.match || 'Matches your current cooking preferences.',
      ingredients: Array.isArray(recipe.ingredients) ? recipe.ingredients : [],
      steps: Array.isArray(recipe.steps) ? recipe.steps : [],
    }))
}

export async function getRecipes(prefs) {
  const endpoint = import.meta.env.VITE_RECIPE_API_URL

  if (!endpoint) {
    return fallbackRecipes
  }

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ preferences: prefs }),
  })

  if (!response.ok) {
    throw new Error('Recipe generation failed')
  }

  const data = await response.json()
  const recipes = normalizeRecipes(data.recipes)

  return recipes.length > 0 ? recipes : fallbackRecipes
}
