export const toolSchemas = {
  nutrizia_login: {
    description: 'Authenticate with Nutrizia. Saves token for subsequent calls.',
    inputSchema: {
      type: 'object',
      properties: {
        email: { type: 'string', description: 'User email' },
        password: { type: 'string', description: 'User password' },
        baseUrl: { type: 'string', description: 'API base URL (optional)' },
      },
      required: ['email', 'password'],
    },
  },

  nutrizia_whoami: {
    description: 'Show current authentication status: email, role, days until token expiration.',
    inputSchema: { type: 'object', properties: {} },
  },

  nutrizia_recipes_list: {
    description: 'List all recipes with their macronutrients, ingredients, and metadata.',
    inputSchema: { type: 'object', properties: {} },
  },

  nutrizia_recipes_get: {
    description: 'Get full details of a recipe by ID, including ingredients, steps, macros, and ratings.',
    inputSchema: {
      type: 'object',
      properties: { id: { type: 'string', description: 'Recipe ID' } },
      required: ['id'],
    },
  },

  nutrizia_recipes_search: {
    description: 'Search recipes by name (case and accent insensitive).',
    inputSchema: {
      type: 'object',
      properties: { name: { type: 'string', description: 'Search query' } },
      required: ['name'],
    },
  },

  nutrizia_recipes_flatten: {
    description: 'Get a recipe flattened into raw ingredient grams for N servings. Useful for nutritional calculations.',
    inputSchema: {
      type: 'object',
      properties: {
        id: { type: 'string', description: 'Recipe ID' },
        servings: { type: 'number', description: 'Number of servings' },
      },
      required: ['id', 'servings'],
    },
  },

  nutrizia_recipes_by_ids: {
    description: 'Get multiple recipes by their IDs in a single call.',
    inputSchema: {
      type: 'object',
      properties: { ids: { type: 'string', description: 'Comma-separated recipe IDs' } },
      required: ['ids'],
    },
  },

  nutrizia_recipes_create: {
    description: 'Create a new recipe with ingredients, steps, and metadata.',
    inputSchema: {
      type: 'object',
      properties: {
        recipe: {
          type: 'object',
          description: 'Recipe object with name, ingredients, components, steps, servings, etc.',
        },
      },
      required: ['recipe'],
    },
  },

  nutrizia_recipes_compute_macros: {
    description: 'Compute macronutrients for a recipe payload without saving it.',
    inputSchema: {
      type: 'object',
      properties: {
        recipe: { type: 'object', description: 'Recipe object to compute macros for' },
      },
      required: ['recipe'],
    },
  },

  nutrizia_ingredients_list: {
    description: 'List all available ingredients with their nutritional info (macros per 100g).',
    inputSchema: { type: 'object', properties: {} },
  },

  nutrizia_ingredients_get: {
    description: 'Get full details of an ingredient by ID, including macros per 100g.',
    inputSchema: {
      type: 'object',
      properties: { id: { type: 'string', description: 'Ingredient ID' } },
      required: ['id'],
    },
  },

  nutrizia_ingredients_by_ids: {
    description: 'Get multiple ingredients by their IDs.',
    inputSchema: {
      type: 'object',
      properties: { ids: { type: 'string', description: 'Comma-separated ingredient IDs' } },
      required: ['ids'],
    },
  },

  nutrizia_menu_get: {
    description: 'Get menu entries for a date range. Optionally filter by meal (Desayuno, Media mañana, Comida, Media tarde, Cena).',
    inputSchema: {
      type: 'object',
      properties: {
        start: { type: 'string', description: 'Start date YYYY-MM-DD' },
        end: { type: 'string', description: 'End date YYYY-MM-DD' },
        meal: { type: 'string', description: 'Filter by meal name (optional)' },
      },
      required: ['start', 'end'],
    },
  },

  nutrizia_menu_nutrition_summary: {
    description: 'Get a complete nutritional summary for a date range in a single call. Returns user macro targets, daily totals broken down by meal with item names, week average, and days tracked. Replaces the need to chain menu + diary + profile + recipes + ingredients calls.',
    inputSchema: {
      type: 'object',
      properties: {
        start: { type: 'string', description: 'Start date YYYY-MM-DD' },
        end: { type: 'string', description: 'End date YYYY-MM-DD' },
      },
      required: ['start', 'end'],
    },
  },

  nutrizia_menu_week_detail: {
    description: 'Get the weekly menu with recipes and ingredients fully populated (names + macros). Replaces chaining menu get → recipes by-ids → ingredients by-ids.',
    inputSchema: {
      type: 'object',
      properties: {
        start: { type: 'string', description: 'Start date YYYY-MM-DD' },
        end: { type: 'string', description: 'End date YYYY-MM-DD' },
      },
      required: ['start', 'end'],
    },
  },

  nutrizia_menu_create: {
    description: 'Create or update a menu entry for a specific date and meal. Upserts if same date+meal exists.',
    inputSchema: {
      type: 'object',
      properties: {
        date: { type: 'string', description: 'Date YYYY-MM-DD' },
        meal: { type: 'string', description: 'Meal: Desayuno|Media mañana|Comida|Media tarde|Cena' },
        recipes: { type: 'array', items: { type: 'string' }, description: 'Array of recipe IDs' },
        ingredients: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              ingredient: { type: 'string' },
              quantity: { type: 'number' },
              unit: { type: 'string' },
            },
          },
          description: 'Array of ingredient objects (optional)',
        },
      },
      required: ['date', 'meal', 'recipes'],
    },
  },

  nutrizia_menu_update: {
    description: 'Update a menu entry: add/remove recipes or ingredients.',
    inputSchema: {
      type: 'object',
      properties: {
        id: { type: 'string', description: 'Menu entry ID' },
        addRecipe: { type: 'string', description: 'Recipe ID to add' },
        removeRecipe: { type: 'string', description: 'Recipe ID to remove' },
        addIngredient: {
          type: 'object',
          properties: {
            ingredient: { type: 'string' },
            quantity: { type: 'number' },
            unit: { type: 'string' },
          },
          description: 'Ingredient to add',
        },
        removeIngredient: { type: 'string', description: 'Ingredient ID to remove' },
      },
      required: ['id'],
    },
  },

  nutrizia_menu_delete: {
    description: 'Delete a menu entry by ID.',
    inputSchema: {
      type: 'object',
      properties: { id: { type: 'string', description: 'Menu entry ID' } },
      required: ['id'],
    },
  },

  nutrizia_menu_ai_generate: {
    description: 'Generate a weekly menu proposal using AI, tailored to user nutritional profile and preferences.',
    inputSchema: {
      type: 'object',
      properties: {
        weekStartDate: { type: 'string', description: 'ISO date for the Monday of the target week' },
        existingMenu: { type: 'object', description: 'Existing menu to keep (optional). Keys are day names, values are meal objects.' },
        keepExisting: { type: 'boolean', description: 'Whether to keep existing menu entries (optional)' },
        includeSnacks: { type: 'boolean', description: 'Whether to include snack meals (optional)' },
      },
      required: ['weekStartDate'],
    },
  },

  nutrizia_menu_ai_alternatives: {
    description: 'Find 3 alternative recipes for a specific meal slot using AI.',
    inputSchema: {
      type: 'object',
      properties: {
        recipeIdToReplace: { type: 'string', description: 'ID of the recipe to replace' },
        meal: { type: 'string', description: 'Meal name' },
        day: { type: 'string', description: 'Day name (Lunes, Martes, etc.)' },
      },
      required: ['recipeIdToReplace', 'meal', 'day'],
    },
  },

  nutrizia_menu_ai_save: {
    description: 'Save a generated weekly menu to the database.',
    inputSchema: {
      type: 'object',
      properties: {
        weekStartDate: { type: 'string', description: 'ISO date for Monday of the week' },
        finalMenuProposal: { type: 'object', description: 'The menu proposal object with menuSemanal key' },
      },
      required: ['weekStartDate', 'finalMenuProposal'],
    },
  },

  nutrizia_diary_list: {
    description: 'Get food diary entries (unplanned meals) for a date range.',
    inputSchema: {
      type: 'object',
      properties: {
        start: { type: 'string', description: 'Start date YYYY-MM-DD' },
        end: { type: 'string', description: 'End date YYYY-MM-DD' },
      },
      required: ['start', 'end'],
    },
  },

  nutrizia_user_profile: {
    description: 'Get the current user profile: name, macros targets, dietary preferences, allergies, cooking preferences, and goals.',
    inputSchema: { type: 'object', properties: {} },
  },

  nutrizia_user_id: {
    description: 'Get the current authenticated user ID.',
    inputSchema: { type: 'object', properties: {} },
  },

  nutrizia_user_update: {
    description: 'Update user profile (macros, preferences, goals, allergies, etc.).',
    inputSchema: {
      type: 'object',
      properties: {
        updates: { type: 'object', description: 'Fields to update on the user profile' },
      },
      required: ['updates'],
    },
  },

  nutrizia_tracking_get: {
    description: 'Get health tracking entries (weight, BMI, or body fat percentage history).',
    inputSchema: {
      type: 'object',
      properties: {
        type: { type: 'string', enum: ['weight', 'bmi', 'bodyfat'], description: 'Tracking type' },
      },
      required: ['type'],
    },
  },

  nutrizia_tracking_add: {
    description: 'Add a health tracking entry (weight in kg, BMI, or body fat %).',
    inputSchema: {
      type: 'object',
      properties: {
        type: { type: 'string', enum: ['weight', 'bmi', 'bodyfat'], description: 'Tracking type' },
        value: { type: 'number', description: 'Value to record' },
        date: { type: 'string', description: 'Date ISO format (optional, defaults to now)' },
      },
      required: ['type', 'value'],
    },
  },

  nutrizia_shopping_lists: {
    description: 'Get all shopping lists for the current user.',
    inputSchema: { type: 'object', properties: {} },
  },

  nutrizia_shopping_from_menu: {
    description: 'Generate a consolidated shopping list from the menu for a date range.',
    inputSchema: {
      type: 'object',
      properties: {
        start: { type: 'string', description: 'Start date YYYY-MM-DD' },
        end: { type: 'string', description: 'End date YYYY-MM-DD' },
      },
      required: ['start', 'end'],
    },
  },

  nutrizia_taxonomy_list: {
    description: 'List taxonomy/reference data: categories, cuisine-types, restrictions, allergens, recipe-categories, or ingredient-categories.',
    inputSchema: {
      type: 'object',
      properties: {
        type: {
          type: 'string',
          enum: ['categories', 'cuisine-types', 'restrictions', 'allergens', 'recipe-categories', 'ingredient-categories'],
          description: 'Taxonomy type to list',
        },
      },
      required: ['type'],
    },
  },
};
