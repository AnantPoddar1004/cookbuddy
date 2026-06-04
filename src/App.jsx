import { useMemo, useState } from 'react'
import './App.css'
import { getRecipes } from './recipes'

const navItems = [
  { id: 'home', label: 'Home', icon: 'H' },
  { id: 'recipes', label: 'Recipes', icon: 'R' },
  { id: 'cart', label: 'Cart', icon: 'C' },
  { id: 'cook', label: 'Cook', icon: 'K' },
  { id: 'prefs', label: 'Preferences', icon: 'P' },
]

const starterPreferences = {
  dietaryRestrictions: 'Vegetarian-friendly, no peanuts',
  skillLevel: 'Beginner',
  budget: '65',
  goals: 'High-protein dinners with leftovers for lunch',
  stores: ['Walmart', "Trader Joe’s"],
}

const starterRecipes = [
  {
    id: 'chickpea-bowl',
    name: 'Crispy Chickpea Rice Bowl',
    time: '28 min',
    level: 'Beginner',
    servings: 3,
    match: 'Uses pantry staples, keeps prep simple, and fits a protein-focused goal.',
    ingredients: ['Chickpeas', 'Brown rice', 'Greek yogurt', 'Cucumber', 'Lemon', 'Paprika'],
    steps: [
      'Cook rice while chickpeas roast with paprika and olive oil.',
      'Mix yogurt, lemon juice, salt, and pepper into a quick sauce.',
      'Slice cucumber and assemble bowls with rice, chickpeas, and sauce.',
    ],
  },
  {
    id: 'rigatoni',
    name: 'Light Vodka Rigatoni',
    time: '35 min',
    level: 'Novice',
    servings: 4,
    match: 'A familiar comfort recipe with a lighter sauce and easy leftovers.',
    ingredients: ['Rigatoni', 'Tomato paste', 'Cream', 'Parmesan', 'Spinach'],
    steps: [
      'Boil rigatoni until al dente and reserve pasta water.',
      'Toast tomato paste, add cream, and loosen with pasta water.',
      'Fold in spinach, pasta, and parmesan until glossy.',
    ],
  },
  {
    id: 'shakshuka',
    name: 'Weeknight Shakshuka',
    time: '30 min',
    level: 'Beginner',
    servings: 2,
    match: 'Budget-friendly, allergy-aware, and built around one pan.',
    ingredients: ['Eggs', 'Crushed tomatoes', 'Bell pepper', 'Feta'],
    steps: [
      'Simmer tomatoes and bell pepper with garlic and cumin.',
      'Make wells in the sauce and crack eggs into the pan.',
      'Cover until eggs set, then finish with feta and herbs.',
    ],
  },
]

const pantryItems = ['Russet potatoes', 'Blueberries', 'Unsalted butter']

function App() {
  const [activeView, setActiveView] = useState('home')
  const [prefs, setPrefs] = useState(starterPreferences)
  const [recipes, setRecipes] = useState(starterRecipes)
  const [loading, setLoading] = useState(false)
  const [selectedRecipeId, setSelectedRecipeId] = useState(starterRecipes[0].id)

  const selectedRecipe = recipes.find((r) => r.id === selectedRecipeId) || recipes[0]

  const cartItems = useMemo(() => {
    const ingredientMap = new Map()
    recipes.forEach((recipe) => {
      recipe.ingredients.forEach((ingredient) => {
        ingredientMap.set(ingredient, (ingredientMap.get(ingredient) || 0) + 1)
      })
    })
    return Array.from(ingredientMap, ([name, count]) => ({ name, count }))
  }, [recipes])

  async function handleGenerate() {
    setLoading(true)
    const result = await getRecipes(prefs)
    if (result.length > 0) {
      setRecipes(result)
      setSelectedRecipeId(result[0].id)
    }
    setLoading(false)
    setActiveView('recipes')
  }

  function toggleStore(store) {
    const next = prefs.stores.includes(store)
      ? prefs.stores.filter((s) => s !== store)
      : [...prefs.stores, store]
    setPrefs({ ...prefs, stores: next })
  }

  return (
    <main className="app-shell">
      <aside className="sidebar" aria-label="CookBuddy navigation">
        <div className="brand">
          <span className="brand-mark">CB</span>
          <div>
            <strong>CookBuddy</strong>
            <span>Recipe planning MVP</span>
          </div>
        </div>

        <nav className="nav-list">
          {navItems.map((item) => (
            <button
              className={activeView === item.id ? 'nav-item is-active' : 'nav-item'}
              key={item.id}
              onClick={() => setActiveView(item.id)}
              type="button"
            >
              <span>{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>
      </aside>

      <section className="workspace">
        <header className="topbar">
          <div>
            <p className="eyebrow">MVP dashboard</p>
            <h1>Plan dinners around your preferences, budget, and cooking level.</h1>
          </div>
          <button className="primary-action" type="button" onClick={handleGenerate} disabled={loading}>
            {loading ? 'Generating…' : 'Generate recipes'}
          </button>
        </header>

        <section className="hero-band">
          <div>
            <p className="eyebrow">How can we help today?</p>
            <h2>Start with preferences, then pick a recipe and cook from guided steps.</h2>
          </div>
          <div className="quick-actions">
            <button type="button" onClick={() => setActiveView('prefs')}>Update preferences</button>
            <button type="button" onClick={() => setActiveView('recipes')}>Browse recipes</button>
            <button type="button" onClick={() => setActiveView('cart')}>Review cart</button>
          </div>
        </section>

        <section className="content-grid">
          <article className="panel preferences-panel">
            <div className="section-heading">
              <p className="eyebrow">Preferences</p>
              <h2>Cooking profile</h2>
            </div>

            <div className="form-grid">
              <label>
                Dietary restrictions and allergies
                <textarea
                  value={prefs.dietaryRestrictions}
                  onChange={(e) => setPrefs({ ...prefs, dietaryRestrictions: e.target.value })}
                />
              </label>
              <label>
                Weekly budget
                <input
                  value={prefs.budget}
                  onChange={(e) => setPrefs({ ...prefs, budget: e.target.value })}
                />
              </label>
              <label>
                Diet goals
                <textarea
                  value={prefs.goals}
                  onChange={(e) => setPrefs({ ...prefs, goals: e.target.value })}
                />
              </label>
              <fieldset>
                <legend>Skill level</legend>
                <div className="segmented-control">
                  {['Beginner', 'Novice', 'Advanced', 'Pro'].map((level) => (
                    <button
                      className={level === prefs.skillLevel ? 'selected' : ''}
                      key={level}
                      type="button"
                      onClick={() => setPrefs({ ...prefs, skillLevel: level })}
                    >
                      {level}
                    </button>
                  ))}
                </div>
              </fieldset>
              <fieldset className="store-options">
                <legend>Preferred stores</legend>
                {['Walmart', 'Target', "Trader Joe’s", 'Kroger'].map((store) => (
                  <label key={store}>
                    <input
                      type="checkbox"
                      checked={prefs.stores.includes(store)}
                      onChange={() => toggleStore(store)}
                    />
                    {store}
                  </label>
                ))}
              </fieldset>
            </div>
          </article>

          <article className="panel recipe-panel">
            <div className="section-heading">
              <p className="eyebrow">Recommended recipes</p>
              <h2>Narrowed picks</h2>
            </div>

            <div className="recipe-list">
              {loading ? (
                <p className="helper-copy">Generating recipes…</p>
              ) : (
                recipes.map((recipe) => (
                  <button
                    className={recipe.id === selectedRecipeId ? 'recipe-card is-selected' : 'recipe-card'}
                    key={recipe.id}
                    onClick={() => {
                      setSelectedRecipeId(recipe.id)
                      setActiveView('cook')
                    }}
                    type="button"
                  >
                    <div>
                      <h3>{recipe.name}</h3>
                      <p>{recipe.match}</p>
                    </div>
                    <div className="recipe-meta">
                      <span>{recipe.time}</span>
                      <span>{recipe.level}</span>
                      <span>{recipe.ingredients.length} ingredients</span>
                    </div>
                  </button>
                ))
              )}
            </div>
          </article>

          <article className="panel cart-panel">
            <div className="section-heading">
              <p className="eyebrow">Auto cart</p>
              <h2>Ingredient list</h2>
            </div>
            <ul className="cart-list">
              {cartItems.map((item) => (
                <li key={item.name}>
                  <span>{item.name}</span>
                  <strong>{item.count}x</strong>
                </li>
              ))}
            </ul>
            <div className="cart-total">
              <span>Estimated total</span>
              <strong>$42.80</strong>
            </div>
          </article>

          <article className="panel cook-panel">
            <div className="section-heading">
              <p className="eyebrow">Cooking mode</p>
              <h2>{selectedRecipe.name}</h2>
            </div>
            <ol className="steps-list">
              {selectedRecipe.steps.map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ol>
          </article>

          <article className="panel pantry-panel">
            <div className="section-heading">
              <p className="eyebrow">Stock, simplified</p>
              <h2>Pantry notes</h2>
            </div>
            <p className="helper-copy">
              For the MVP, stock stays lightweight so the app can focus on recipes, allergies,
              cart generation, and guided cooking.
            </p>
            <div className="pantry-tags">
              {pantryItems.map((item) => (
                <span key={item}>{item}</span>
              ))}
            </div>
          </article>
        </section>
      </section>
    </main>
  )
}

export default App
