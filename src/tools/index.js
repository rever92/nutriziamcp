import { createClient } from '../api-client.js';
import { writeCredentials, deleteCredentials, getToken, getTokenInfo } from '../auth.js';
import { resolveBaseUrl } from '../config.js';

const TAXONOMY_MAP = {
  'categories': 'categorias',
  'cuisine-types': 'tipodecocina',
  'restrictions': 'restricciones',
  'allergens': 'allergens',
  'recipe-categories': 'categoriaRecetas',
  'ingredient-categories': 'ingredient-categories',
};

const BODY_KEY = { weight: 'weight', bmi: 'bmi', bodyfat: 'bodyFatPercentage' };

function getUserIdFromToken() {
  const token = getToken();
  if (!token) return null;
  try {
    const payload = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
    return payload.id || payload.userId || payload._id;
  } catch { return null; }
}

function ok(data, meta) {
  return { content: [{ type: 'text', text: JSON.stringify({ success: true, data, meta }, null, 2) }] };
}

function fail(code, message, hint) {
  return { content: [{ type: 'text', text: JSON.stringify({ success: false, error: { code, message, ...(hint ? { hint } : {}) } }, null, 2) }], isError: true };
}

export const toolHandlers = {
  async nutrizia_login({ email, password, baseUrl }) {
    try {
      const url = resolveBaseUrl(baseUrl);
      const client = createClient({ baseUrl: url });
      const res = await client.post('auth/login', { email, password });
      writeCredentials({ token: res.token, role: res.role, email, baseUrl: url });
      return ok({ email, role: res.role });
    } catch (e) { return fail(e.status || 500, e.message); }
  },

  async nutrizia_whoami() {
    const info = getTokenInfo();
    if (!info) return fail(401, 'Not logged in', "Use nutrizia_login first");
    if (info.expired) return fail(401, 'Token expired', "Use nutrizia_login");
    return ok(info);
  },

  async nutrizia_recipes_list() {
    try {
      const data = await createClient().get('recipes');
      return ok(data, { count: data.length });
    } catch (e) { return fail(e.status || 500, e.message); }
  },

  async nutrizia_recipes_get({ id }) {
    try {
      return ok(await createClient().get(`recipes/${id}`));
    } catch (e) { return fail(e.status || 500, e.message); }
  },

  async nutrizia_recipes_search({ name }) {
    try {
      const data = await createClient().get('recipes/search', { query: { name } });
      return ok(data, { count: data.length });
    } catch (e) { return fail(e.status || 500, e.message); }
  },

  async nutrizia_recipes_flatten({ id, servings }) {
    try {
      return ok(await createClient().get(`recipes/${id}/flatten`, { query: { servings } }));
    } catch (e) { return fail(e.status || 500, e.message); }
  },

  async nutrizia_recipes_by_ids({ ids }) {
    try {
      const data = await createClient().get('recipes/by-ids', { query: { ids } });
      return ok(data, { count: data.length });
    } catch (e) { return fail(e.status || 500, e.message); }
  },

  async nutrizia_recipes_create({ recipe }) {
    try {
      return ok(await createClient().post('recipes', recipe));
    } catch (e) { return fail(e.status || 500, e.message); }
  },

  async nutrizia_recipes_compute_macros({ recipe }) {
    try {
      return ok(await createClient().post('recipes/compute-macros', recipe));
    } catch (e) { return fail(e.status || 500, e.message); }
  },

  async nutrizia_ingredients_list() {
    try {
      const data = await createClient().get('ingredients');
      return ok(data, { count: data.length });
    } catch (e) { return fail(e.status || 500, e.message); }
  },

  async nutrizia_ingredients_get({ id }) {
    try {
      return ok(await createClient().get(`ingredients/${id}`));
    } catch (e) { return fail(e.status || 500, e.message); }
  },

  async nutrizia_ingredients_by_ids({ ids }) {
    try {
      const data = await createClient().get('ingredients/by-ids', { query: { ids } });
      return ok(data, { count: data.length });
    } catch (e) { return fail(e.status || 500, e.message); }
  },

  async nutrizia_menu_get({ start, end, meal }) {
    try {
      const query = { start, end };
      if (meal) query.meal = meal;
      const data = await createClient().get('menuschema', { query });
      return ok(data, { count: data.length });
    } catch (e) { return fail(e.status || 500, e.message); }
  },

  async nutrizia_menu_nutrition_summary({ start, end }) {
    try {
      return ok(await createClient().get('menuschema/nutrition-summary', { query: { start, end } }));
    } catch (e) { return fail(e.status || 500, e.message); }
  },

  async nutrizia_menu_week_detail({ start, end }) {
    try {
      return ok(await createClient().get('menuschema/week-detail', { query: { start, end } }));
    } catch (e) { return fail(e.status || 500, e.message); }
  },

  async nutrizia_menu_create({ date, meal, recipes, ingredients }) {
    try {
      return ok(await createClient().post('menuschema', { date, meal, recipes, ingredients: ingredients || [] }));
    } catch (e) { return fail(e.status || 500, e.message); }
  },

  async nutrizia_menu_update({ id, addRecipe, removeRecipe, clearRecipes, addIngredient, removeIngredient, clearIngredients }) {
    try {
      const body = {};
      if (addRecipe) body.addRecipe = addRecipe;
      if (removeRecipe) body.removeRecipe = removeRecipe;
      if (clearRecipes) body.clearRecipes = true;
      if (addIngredient) body.addIngredient = addIngredient;
      if (removeIngredient) body.removeIngredient = removeIngredient;
      if (clearIngredients) body.clearIngredients = true;
      return ok(await createClient().put(`menuschema/${id}`, body));
    } catch (e) { return fail(e.status || 500, e.message); }
  },

  async nutrizia_menu_delete({ id }) {
    try {
      return ok(await createClient().delete(`menuschema/${id}`));
    } catch (e) { return fail(e.status || 500, e.message); }
  },

  async nutrizia_menu_ai_generate({ weekStartDate, existingMenu, keepExisting, includeSnacks }) {
    try {
      const body = { weekStartDate };
      if (existingMenu) body.existingMenu = existingMenu;
      if (keepExisting !== undefined) body.keepExisting = keepExisting;
      if (includeSnacks !== undefined) body.includeSnacks = includeSnacks;
      return ok(await createClient().post('menu-generator/generate-proposal', body));
    } catch (e) { return fail(e.status || 500, e.message); }
  },

  async nutrizia_menu_ai_alternatives({ recipeIdToReplace, meal, day }) {
    try {
      return ok(await createClient().post('menu-generator/find-alternatives', { recipeIdToReplace, meal, day }));
    } catch (e) { return fail(e.status || 500, e.message); }
  },

  async nutrizia_menu_ai_save({ weekStartDate, finalMenuProposal }) {
    try {
      return ok(await createClient().post('menu-generator/save-final-menu', { weekStartDate, finalMenuProposal }));
    } catch (e) { return fail(e.status || 500, e.message); }
  },

  async nutrizia_diary_list({ start, end }) {
    try {
      return ok(await createClient().get('unplanned-meals', { query: { start, end } }));
    } catch (e) { return fail(e.status || 500, e.message); }
  },

  async nutrizia_user_profile() {
    const id = getUserIdFromToken();
    if (!id) return fail(401, 'Not logged in');
    try {
      return ok(await createClient().get(`userinfo/user/${id}`));
    } catch (e) { return fail(e.status || 500, e.message); }
  },

  async nutrizia_user_id() {
    const id = getUserIdFromToken();
    if (!id) return fail(401, 'Not logged in');
    return ok({ userId: id });
  },

  async nutrizia_user_update({ updates }) {
    const id = getUserIdFromToken();
    if (!id) return fail(401, 'Not logged in');
    try {
      return ok(await createClient().put(`userinfo/user/${id}`, updates));
    } catch (e) { return fail(e.status || 500, e.message); }
  },

  async nutrizia_tracking_get({ type }) {
    try {
      return ok(await createClient().get(`tracking/${type}`));
    } catch (e) { return fail(e.status || 500, e.message); }
  },

  async nutrizia_tracking_add({ type, value, date }) {
    try {
      const body = { [BODY_KEY[type]]: value };
      if (date) body.date = date;
      return ok(await createClient().put(`tracking/${type}`, body));
    } catch (e) { return fail(e.status || 500, e.message); }
  },

  async nutrizia_shopping_lists() {
    try {
      const data = await createClient().get('listascompra');
      return ok(data, { count: data.length });
    } catch (e) { return fail(e.status || 500, e.message); }
  },

  async nutrizia_shopping_from_menu({ start, end }) {
    try {
      return ok(await createClient().get('menuschema/shopping-list', { query: { start, end } }));
    } catch (e) { return fail(e.status || 500, e.message); }
  },

  async nutrizia_taxonomy_list({ type }) {
    const endpoint = TAXONOMY_MAP[type];
    if (!endpoint) return fail(400, `Unknown taxonomy: ${type}`);
    try {
      const data = await createClient().get(endpoint);
      return ok(data, { count: data.length });
    } catch (e) { return fail(e.status || 500, e.message); }
  },
};
