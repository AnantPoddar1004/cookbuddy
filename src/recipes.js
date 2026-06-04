import OpenAI from 'openai'

const client = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true,
})

function buildPrompt(prefs) {
  const stores = (prefs.stores || []).join(', ')
  return `Suggest 3 recipes for this person.

Dietary restrictions and allergies: ${prefs.dietaryRestrictions}
Skill level: ${prefs.skillLevel}
Weekly budget: $${prefs.budget}
Diet goals: ${prefs.goals}
Preferred stores: ${stores}

Return JSON shaped like:
{
  "recipes": [
    {
      "id": "short-slug",
      "name": "Recipe Name",
      "time": "30 min",
      "level": "Beginner",
      "servings": 3,
      "ingredients": ["item one", "item two"],
      "steps": ["step one", "step two"],
      "match": "one sentence on why this fits their preferences"
    }
  ]
}

Respect the allergies and restrictions, keep steps simple for the given skill level, and try to stay near the budget.`
}

export async function getRecipes(prefs) {
  const res = await client.chat.completions.create({
    model: 'gpt-4o-mini',
    response_format: { type: 'json_object' },
    messages: [
      { role: 'system', content: 'You are a recipe assistant. Reply with valid JSON only.' },
      { role: 'user', content: buildPrompt(prefs) },
    ],
  })

  // data.recipes is the array the recipe cards expect
  const data = JSON.parse(res.choices[0].message.content)
  return data.recipes || []
}
