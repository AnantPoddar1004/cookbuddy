import { useEffect, useMemo, useState } from 'react'
import { Navigate, NavLink, Route, Routes, useNavigate, useParams } from 'react-router-dom'
import './App.css'

const navItems = [
  { path: '/', label: 'Home', icon: 'H' },
  { path: '/recipes', label: 'Recipes', icon: 'R' },
  { path: '/cart', label: 'Shopping List', icon: 'S' },
  { path: '/cook', label: 'Cook', icon: 'C' },
  { path: '/preferences', label: 'Preferences', icon: 'P' },
]

const profile = {
  name: 'Anant',
  household: '2 people',
  appliances: ['Stovetop', 'Oven', 'Sheet pan', 'Blender'],
}

const initialPreferences = {
  dietaryRestrictions: 'Vegetarian-friendly, no peanuts',
  skillLevel: 'Beginner',
  budget: '65',
  goals: 'High-protein dinners with leftovers for lunch',
  stores: ['Walmart', 'Trader Joe’s'],
}

const hardcodedRecipes = [
  {
    id: 'chickpea-bowl',
    name: 'Crispy Chickpea Rice Bowl',
    time: '28 min',
    level: 'Beginner',
    servings: 3,
    estimate: '$13.40',
    macros: { calories: 520, protein: '24g', carbs: '72g', fat: '16g', fiber: '13g' },
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
    estimate: '$16.20',
    macros: { calories: 610, protein: '21g', carbs: '82g', fat: '22g', fiber: '7g' },
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
    estimate: '$11.85',
    macros: { calories: 430, protein: '23g', carbs: '28g', fat: '24g', fiber: '8g' },
    match: 'Budget-friendly, allergy-aware, and built around one pan.',
    ingredients: ['Eggs', 'Crushed tomatoes', 'Bell pepper', 'Feta', 'Parsley'],
    steps: [
      'Simmer tomatoes and bell pepper with garlic and cumin.',
      'Make wells in the sauce and crack eggs into the pan.',
      'Cover until eggs set, then finish with feta and herbs.',
    ],
  },
]

const assistantSuggestions = [
  'Suggest some viral celebrity recipes by the Kardashians',
  'Increase my weekly budget to $70 in a week',
  'I just bought a microwave that I can use to cook with',
]

function App() {
  const [preferences, setPreferences] = useState(initialPreferences)
  const [selectedRecipeId, setSelectedRecipeId] = useState(hardcodedRecipes[0].id)
  const [recipeQuantities, setRecipeQuantities] = useState({
    'chickpea-bowl': 1,
  })
  const [assistantNotice, setAssistantNotice] = useState('')

  const selectedRecipe =
    hardcodedRecipes.find((recipe) => recipe.id === selectedRecipeId) || hardcodedRecipes[0]

  const cartItems = useMemo(() => {
    const counts = new Map()

    hardcodedRecipes.forEach((recipe) => {
      const quantity = recipeQuantities[recipe.id] || 0
      if (quantity === 0) return

      recipe.ingredients.forEach((ingredient) => {
        counts.set(ingredient, (counts.get(ingredient) || 0) + quantity)
      })
    })

    return Array.from(counts, ([name, count]) => ({ name, count }))
  }, [recipeQuantities])

  function updateRecipeQuantity(recipeId, direction) {
    setRecipeQuantities((current) => {
      const nextQuantity = Math.max(0, (current[recipeId] || 0) + direction)
      return { ...current, [recipeId]: nextQuantity }
    })
  }

  return (
    <main className="app-shell">
      <aside className="sidebar" aria-label="CookBuddy navigation">
        <NavLink className="brand" to="/">
          <span className="brand-mark">CB</span>
          <div>
            <strong>CookBuddy</strong>
            <span>Personal meal planning</span>
          </div>
        </NavLink>

        <nav className="nav-list">
          {navItems.map((item) => (
            <NavLink
              className={({ isActive }) => (isActive ? 'nav-item is-active' : 'nav-item')}
              end={item.path === '/'}
              key={item.path}
              to={item.path}
            >
              <span>{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </nav>
      </aside>

      <section className="workspace">
        <Routes>
          <Route
            path="/"
            element={
              <HomeView
                cartItems={cartItems}
                preferences={preferences}
                recipes={hardcodedRecipes}
                selectedRecipe={selectedRecipe}
                recipeQuantities={recipeQuantities}
                setAssistantNotice={setAssistantNotice}
                setPreferences={setPreferences}
                setSelectedRecipeId={setSelectedRecipeId}
              />
            }
          />
          <Route
            path="/recipes"
            element={
              <RecipesView
                preferences={preferences}
                recipeQuantities={recipeQuantities}
                recipes={hardcodedRecipes}
                selectedRecipeId={selectedRecipeId}
                setSelectedRecipeId={setSelectedRecipeId}
                updateRecipeQuantity={updateRecipeQuantity}
              />
            }
          />
          <Route
            path="/recipes/:recipeId"
            element={
              <RecipeDetailsRoute
                recipeQuantities={recipeQuantities}
                recipes={hardcodedRecipes}
                setSelectedRecipeId={setSelectedRecipeId}
                updateRecipeQuantity={updateRecipeQuantity}
              />
            }
          />
          <Route
            path="/cart"
            element={
              <CartView
                cartItems={cartItems}
                recipeQuantities={recipeQuantities}
                recipes={hardcodedRecipes}
                updateRecipeQuantity={updateRecipeQuantity}
              />
            }
          />
          <Route path="/cook" element={<CookView recipe={selectedRecipe} recipeQuantities={recipeQuantities} recipes={hardcodedRecipes} setSelectedRecipeId={setSelectedRecipeId} />} />
          <Route path="/cook/:recipeId" element={<CookRoute recipeQuantities={recipeQuantities} recipes={hardcodedRecipes} setSelectedRecipeId={setSelectedRecipeId} />} />
          <Route
            path="/preferences"
            element={
              <PreferencesView
                assistantNotice={assistantNotice}
                preferences={preferences}
                setAssistantNotice={setAssistantNotice}
                setPreferences={setPreferences}
              />
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </section>
    </main>
  )
}

function PageHeader({ eyebrow, title, children, action }) {
  return (
    <header className="page-header">
      <div>
        <p className="eyebrow">{eyebrow}</p>
        <h1>{title}</h1>
        {children ? <p className="header-copy">{children}</p> : null}
      </div>
      {action}
    </header>
  )
}

function HomeView({
  cartItems,
  preferences,
  recipeQuantities,
  recipes,
  selectedRecipe,
  setAssistantNotice,
  setPreferences,
  setSelectedRecipeId,
}) {
  const navigate = useNavigate()
  const [chatInput, setChatInput] = useState('')
  const [listening, setListening] = useState(false)
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      text: `Hi ${profile.name}. I can help you cook, update preferences, build a shopping list, or pick a recipe. Try "I want to cook something quick" or "change my budget to 50".`,
    },
  ])

  function addAssistant(text) {
    setMessages((current) => [...current, { role: 'assistant', text }])
  }

  function updatePreferenceFromText(text) {
    const lower = text.toLowerCase()
    const budgetMatch = lower.match(/budget(?:\s+to|\s+is)?\s+\$?(\d+)/)

    if (budgetMatch) {
      setPreferences((current) => ({ ...current, budget: budgetMatch[1] }))
      return `Confirmed. I updated your weekly budget to $${budgetMatch[1]}.`
    }

    if (lower.includes('peanut')) {
      setPreferences((current) => ({ ...current, dietaryRestrictions: 'Vegetarian-friendly, no peanuts' }))
      return 'Confirmed. I kept peanuts listed as an allergy/restriction.'
    }

    if (lower.includes('beginner') || lower.includes('novice') || lower.includes('advanced') || lower.includes('pro')) {
      const skill = ['beginner', 'novice', 'advanced', 'pro'].find((level) => lower.includes(level))
      const formatted = skill.charAt(0).toUpperCase() + skill.slice(1)
      setPreferences((current) => ({ ...current, skillLevel: formatted }))
      return `Confirmed. I updated your cooking level to ${formatted}.`
    }

    if (lower.includes('target') || lower.includes('kroger') || lower.includes('walmart') || lower.includes('trader joe')) {
      const stores = ['Walmart', 'Target', 'Trader Joe’s', 'Kroger'].filter((store) =>
        lower.includes(store.toLowerCase().replace('’', '')),
      )
      if (stores.length > 0) {
        setPreferences((current) => ({ ...current, stores }))
        return `Confirmed. I updated your preferred stores to ${stores.join(', ')}.`
      }
    }

    return ''
  }

  function handleAssistantRequest(text) {
    const lower = text.toLowerCase()
    const preferenceMessage = updatePreferenceFromText(text)

    if (preferenceMessage) {
      setAssistantNotice(preferenceMessage)
      addAssistant(`${preferenceMessage} I opened Preferences so you can review it.`)
      navigate('/preferences')
      return
    }

    if (lower.includes('shop') || lower.includes('cart') || lower.includes('list')) {
      const recipeCount = Object.values(recipeQuantities).reduce((sum, quantity) => sum + quantity, 0)
      addAssistant(`I opened your shopping list with ${recipeCount} selected recipe${recipeCount === 1 ? '' : 's'} and ${cartItems.length} ingredients.`)
      navigate('/cart')
      return
    }

    if (lower.includes('cook') || lower.includes('step') || lower.includes('instruction')) {
      addAssistant(`Great. I opened cooking mode for ${selectedRecipe.name}.`)
      navigate('/cook')
      return
    }

    if (lower.includes('recipe') || lower.includes('dinner') || lower.includes('meal') || lower.includes('quick')) {
      setSelectedRecipeId(recipes[0].id)
      addAssistant(`I found a strong match: ${recipes[0].name}. I opened Recipes so you can compare options.`)
      navigate('/recipes')
      return
    }

    if (lower.includes('preference') || lower.includes('allergy') || lower.includes('diet') || lower.includes('budget')) {
      addAssistant('I opened Preferences. You can change allergies, skill level, budget, diet goals, and stores there.')
      navigate('/preferences')
      return
    }

    addAssistant('I can help with recipes, cooking steps, shopping lists, and preferences. Try asking for one of those.')
  }

  function sendMessage(text = chatInput) {
    const trimmed = text.trim()
    if (!trimmed) return

    setMessages((current) => [...current, { role: 'user', text: trimmed }])
    setChatInput('')
    handleAssistantRequest(trimmed)
  }

  function startVoiceInput() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition

    if (!SpeechRecognition) {
      addAssistant('Voice input is not available in this browser, but typed chat works here.')
      return
    }

    const recognition = new SpeechRecognition()
    recognition.lang = 'en-US'
    recognition.interimResults = false
    recognition.onstart = () => setListening(true)
    recognition.onend = () => setListening(false)
    recognition.onerror = () => {
      setListening(false)
      addAssistant('I could not hear that clearly. Try typing the request instead.')
    }
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript
      sendMessage(transcript)
    }
    recognition.start()
  }

  return (
    <>
      <PageHeader
        eyebrow="Home"
        title="Tell CookBuddy what you want to do next."
      >
        Use the assistant to jump to recipes, cooking steps, shopping lists, or preference changes.
      </PageHeader>

      <section className="home-grid">
        <article className="assistant-panel panel">
          <div className="assistant-hero">
            <span className="assistant-spark">CB</span>
            <div>
              <p className="eyebrow">Assistant</p>
              <h2>What are we cooking today?</h2>
              <p>Ask CookBuddy to find a meal, adjust preferences, or prep your shopping list.</p>
            </div>
          </div>

          <div className="suggestion-panel" aria-label="Suggested assistant prompts">
            {assistantSuggestions.map((suggestion) => (
              <button key={suggestion} type="button" onClick={() => sendMessage(suggestion)}>
                {suggestion}
              </button>
            ))}
          </div>

          <div className="assistant-actions">
            <button type="button" onClick={() => sendMessage('I want to cook something quick')}>
              Cook something
            </button>
            <button type="button" onClick={() => sendMessage('Create a shopping list')}>
              Create shopping list
            </button>
            <button type="button" onClick={() => sendMessage('Change my preferences')}>
              Change preferences
            </button>
          </div>

          <form
            className="chat-form"
            onSubmit={(event) => {
              event.preventDefault()
              sendMessage()
            }}
          >
            <input
              aria-label="Message CookBuddy"
              onChange={(event) => setChatInput(event.target.value)}
              placeholder="Ask to cook, shop, find recipes, or update preferences..."
              value={chatInput}
            />
            <button type="button" className="secondary-action" onClick={startVoiceInput}>
              {listening ? 'Listening' : 'Voice'}
            </button>
            <button type="submit" className="primary-action">
              Send
            </button>
          </form>
        </article>

        <aside className="panel profile-panel">
          <div className="section-heading">
            <p className="eyebrow">Your profile</p>
            <h2>{profile.name}'s kitchen setup</h2>
          </div>
          <dl className="profile-list">
            <div>
              <dt>Diet</dt>
              <dd>{preferences.dietaryRestrictions}</dd>
            </div>
            <div>
              <dt>Skill</dt>
              <dd>{preferences.skillLevel}</dd>
            </div>
            <div>
              <dt>Budget</dt>
              <dd>${preferences.budget}/week</dd>
            </div>
            <div>
              <dt>Stores</dt>
              <dd>{preferences.stores.join(', ')}</dd>
            </div>
          </dl>
        </aside>
      </section>
    </>
  )
}

function RecipesView({
  preferences,
  recipeQuantities,
  recipes,
  selectedRecipeId,
  setSelectedRecipeId,
  updateRecipeQuantity,
}) {
  const navigate = useNavigate()

  return (
    <>
      <PageHeader
        eyebrow="Recipes"
        title="Recommended recipes for your profile."
      >
        Matches account for {preferences.skillLevel.toLowerCase()} cooking, {preferences.dietaryRestrictions.toLowerCase()}, and a ${preferences.budget} weekly budget.
      </PageHeader>

      <section className="recipe-grid">
        {recipes.map((recipe) => {
          const quantity = recipeQuantities[recipe.id] || 0

          return (
            <article className={recipe.id === selectedRecipeId ? 'recipe-card is-selected' : 'recipe-card'} key={recipe.id}>
              <div>
                <p className="eyebrow">{recipe.level}</p>
                <h2>{recipe.name}</h2>
                <p>{recipe.match}</p>
              </div>
              <div className="recipe-meta">
                <span>{recipe.time}</span>
                <span>{recipe.servings} servings</span>
                <span>{recipe.estimate}</span>
                <span>{quantity} in list</span>
              </div>
              <div className="ingredient-preview">
                {recipe.ingredients.slice(0, 4).map((ingredient) => (
                  <span key={ingredient}>{ingredient}</span>
                ))}
              </div>
              <div className="recipe-controls">
                <button
                  aria-label={`Remove ${recipe.name} from shopping list`}
                  type="button"
                  onClick={() => updateRecipeQuantity(recipe.id, -1)}
                >
                  -
                </button>
                <strong>{quantity}</strong>
                <button
                  aria-label={`Add ${recipe.name} to shopping list`}
                  type="button"
                  onClick={() => updateRecipeQuantity(recipe.id, 1)}
                >
                  +
                </button>
                <span>in list</span>
              </div>
              <div className="card-actions">
                <button type="button" onClick={() => navigate(`/recipes/${recipe.id}`)}>
                  Details
                </button>
                <button
                  className="primary-action"
                  type="button"
                  onClick={() => {
                    setSelectedRecipeId(recipe.id)
                    navigate(`/cook/${recipe.id}`)
                  }}
                >
                  Cook
                </button>
              </div>
            </article>
          )
        })}
      </section>
    </>
  )
}

function RecipeDetailsRoute({ recipeQuantities, recipes, setSelectedRecipeId, updateRecipeQuantity }) {
  const { recipeId } = useParams()
  const navigate = useNavigate()
  const recipe = recipes.find((item) => item.id === recipeId)

  useEffect(() => {
    if (recipe) {
      setSelectedRecipeId(recipe.id)
    }
  }, [recipe, setSelectedRecipeId])

  if (!recipe) return <Navigate to="/recipes" replace />

  const quantity = recipeQuantities[recipe.id] || 0

  return (
    <>
      <PageHeader
        eyebrow="Recipe details"
        title={recipe.name}
        action={
          <button className="secondary-action" type="button" onClick={() => navigate('/recipes')}>
            Back to recipes
          </button>
        }
      >
        See why this recipe fits your profile, review nutrition, and add it to your shopping list before cooking.
      </PageHeader>

      <section className="details-layout">
        <article className="panel">
          <div className="section-heading">
            <p className="eyebrow">Overview</p>
            <h2>{recipe.match}</h2>
          </div>
          <div className="recipe-meta large">
            <span>{recipe.time}</span>
            <span>{recipe.level}</span>
            <span>{recipe.servings} servings</span>
            <span>{recipe.estimate}</span>
          </div>
          <div className="recipe-controls details-controls">
            <button type="button" onClick={() => updateRecipeQuantity(recipe.id, -1)}>-</button>
            <strong>{quantity}</strong>
            <button type="button" onClick={() => updateRecipeQuantity(recipe.id, 1)}>+</button>
            <span>{quantity} in shopping list</span>
          </div>
          <div className="card-actions">
            <button className="primary-action" type="button" onClick={() => navigate(`/cook/${recipe.id}`)}>
              Cook this recipe
            </button>
            <button type="button" onClick={() => navigate('/cart')}>
              View shopping list
            </button>
          </div>
        </article>

        <article className="panel">
          <div className="section-heading">
            <p className="eyebrow">Macros</p>
            <h2>Nutrition breakdown</h2>
          </div>
          <div className="macro-grid">
            {Object.entries(recipe.macros).map(([label, value]) => (
              <div key={label}>
                <span>{label}</span>
                <strong>{value}</strong>
              </div>
            ))}
          </div>
        </article>

        <article className="panel">
          <div className="section-heading">
            <p className="eyebrow">Ingredients</p>
            <h2>What you need</h2>
          </div>
          <div className="ingredient-preview vertical">
            {recipe.ingredients.map((ingredient) => (
              <span key={ingredient}>{ingredient}</span>
            ))}
          </div>
        </article>
      </section>
    </>
  )
}

function CartView({ cartItems, recipeQuantities, recipes, updateRecipeQuantity }) {
  const navigate = useNavigate()
  const selectedRecipes = recipes.filter((recipe) => (recipeQuantities[recipe.id] || 0) > 0)
  const estimatedTotal = selectedRecipes.reduce((sum, recipe) => {
    const price = Number(recipe.estimate.replace(/[^0-9.]/g, ''))
    return sum + price * (recipeQuantities[recipe.id] || 0)
  }, 0)

  return (
    <>
      <PageHeader
        eyebrow="Shopping list"
        title="Review recipes in your list before you shop."
      >
        CookBuddy combines ingredients from your selected meals so you can shop once and cook confidently.
      </PageHeader>

      <section className="cart-layout">
        <article className="panel">
          <div className="section-heading">
            <p className="eyebrow">Selected recipes</p>
            <h2>Meals in your list</h2>
          </div>
          <div className="mini-list selected-recipes-list">
            {selectedRecipes.length === 0 ? (
              <p className="helper-copy">No recipes added yet. Add recipes to create your shopping list.</p>
            ) : (
              selectedRecipes.map((recipe) => (
                <div key={recipe.id}>
                  <strong>{recipe.name}</strong>
                  <span>{recipe.estimate} each</span>
                  <div className="recipe-controls compact">
                    <button type="button" onClick={() => updateRecipeQuantity(recipe.id, -1)}>-</button>
                    <strong>{recipeQuantities[recipe.id] || 0}</strong>
                    <button type="button" onClick={() => updateRecipeQuantity(recipe.id, 1)}>+</button>
                    <span>in list</span>
                  </div>
                </div>
              ))
            )}
          </div>
          <button className="primary-action add-more-action" type="button" onClick={() => navigate('/recipes')}>
            Add more recipes
          </button>
        </article>

        <article className="panel">
          <div className="section-heading">
            <p className="eyebrow">Cart</p>
            <h2>Ingredients to buy</h2>
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
            <strong>${estimatedTotal.toFixed(2)}</strong>
          </div>
        </article>
      </section>
    </>
  )
}

function CookRoute({ recipeQuantities, recipes, setSelectedRecipeId }) {
  const { recipeId } = useParams()
  const recipe = recipes.find((item) => item.id === recipeId)

  useEffect(() => {
    if (recipe) {
      setSelectedRecipeId(recipe.id)
    }
  }, [recipe, setSelectedRecipeId])

  if (!recipe) return <Navigate to="/cook" replace />

  return <CookView recipe={recipe} recipeQuantities={recipeQuantities} recipes={recipes} setSelectedRecipeId={setSelectedRecipeId} />
}

function CookView({ recipe, recipeQuantities = {}, recipes, setSelectedRecipeId }) {
  const navigate = useNavigate()
  const cookQuantity = Math.max(1, recipeQuantities[recipe.id] || 1)

  return (
    <>
      <PageHeader
        eyebrow="Cooking mode"
        title={recipe.name}
      >
        Follow each recipe one step at a time, with ingredients kept nearby so you can stay focused while cooking.
      </PageHeader>

      <section className="cook-layout">
        <article className="panel">
          <div className="section-heading">
            <p className="eyebrow">Instructions</p>
            <h2>Step-by-step guide</h2>
          </div>
          <ol className="steps-list">
            {recipe.steps.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>
        </article>

        <aside className="panel">
          <div className="section-heading">
            <p className="eyebrow">Ingredients</p>
            <h2>For {recipe.servings * cookQuantity} servings</h2>
          </div>
          <ul className="ingredient-quantity-list">
            {recipe.ingredients.map((ingredient) => (
              <li key={ingredient}>
                <span>{ingredient}</span>
                <strong>{cookQuantity}x</strong>
              </li>
            ))}
          </ul>
          <div className="recipe-switcher">
            {recipes.map((item) => (
              <button
                className={item.id === recipe.id ? 'selected' : ''}
                key={item.id}
                type="button"
                onClick={() => {
                  setSelectedRecipeId(item.id)
                  navigate(`/cook/${item.id}`)
                }}
              >
                {item.name}
              </button>
            ))}
          </div>
        </aside>
      </section>
    </>
  )
}

function PreferencesView({ assistantNotice, preferences, setAssistantNotice, setPreferences }) {
  const navigate = useNavigate()

  function toggleStore(store) {
    const next = preferences.stores.includes(store)
      ? preferences.stores.filter((current) => current !== store)
      : [...preferences.stores, store]
    setPreferences({ ...preferences, stores: next })
  }

  return (
    <>
      <PageHeader
        eyebrow="Preferences"
        title="Tune your cooking profile."
      >
        CookBuddy uses these preferences to recommend recipes that match your diet, budget, stores, and cooking comfort level.
      </PageHeader>

      <section className="preferences-layout">
        <article className="panel">
          <div className="section-heading">
            <p className="eyebrow">Profile</p>
            <h2>Cooking preferences</h2>
          </div>

          {assistantNotice ? (
            <div className="assistant-notice">
              <span>{assistantNotice}</span>
              <button type="button" onClick={() => setAssistantNotice('')}>
                Dismiss
              </button>
            </div>
          ) : null}

          <div className="form-grid">
            <label>
              Dietary restrictions and allergies
              <textarea
                value={preferences.dietaryRestrictions}
                onChange={(event) =>
                  setPreferences({ ...preferences, dietaryRestrictions: event.target.value })
                }
              />
            </label>
            <label>
              Weekly budget
              <input
                value={preferences.budget}
                onChange={(event) => setPreferences({ ...preferences, budget: event.target.value })}
              />
            </label>
            <label>
              Diet goals
              <textarea
                value={preferences.goals}
                onChange={(event) => setPreferences({ ...preferences, goals: event.target.value })}
              />
            </label>
            <fieldset>
              <legend>Skill level</legend>
              <div className="segmented-control">
                {['Beginner', 'Novice', 'Advanced', 'Pro'].map((level) => (
                  <button
                    className={level === preferences.skillLevel ? 'selected' : ''}
                    key={level}
                    type="button"
                    onClick={() => setPreferences({ ...preferences, skillLevel: level })}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </fieldset>
            <fieldset className="store-options">
              <legend>Preferred stores</legend>
              {['Walmart', 'Target', 'Trader Joe’s', 'Kroger'].map((store) => (
                <label
                  className={preferences.stores.includes(store) ? 'store-option is-checked' : 'store-option'}
                  key={store}
                >
                  <input
                    checked={preferences.stores.includes(store)}
                    onChange={() => toggleStore(store)}
                    type="checkbox"
                  />
                  <span aria-hidden="true">{preferences.stores.includes(store) ? '✓' : ''}</span>
                  {store}
                </label>
              ))}
            </fieldset>

            <button className="primary-action apply-preferences-action" type="button" onClick={() => navigate('/recipes')}>
              Apply to recipes
            </button>
          </div>
        </article>

        <aside className="panel">
          <div className="section-heading">
            <p className="eyebrow">Household</p>
            <h2>Saved context</h2>
          </div>
          <dl className="profile-list">
            <div>
              <dt>Household</dt>
              <dd>{profile.household}</dd>
            </div>
            <div>
              <dt>Appliances</dt>
              <dd>{profile.appliances.join(', ')}</dd>
            </div>
            <div>
              <dt>Goal</dt>
              <dd>{preferences.goals}</dd>
            </div>
          </dl>
        </aside>
      </section>
    </>
  )
}

export default App
