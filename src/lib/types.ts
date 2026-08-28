export type Tag = "Breakfast" | "Desk Mini-Meal" | "Work Break Meal" | "Dinner" | "Snack";
export type Day = "Mon" | "Tue" | "Wed" | "Thu" | "Fri" | "Sat" | "Sun";
export type Category = "Produce" | "Protein" | "Dairy" | "Pantry";

export const DAYS: Day[] = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
export const SLOTS: Tag[] = ["Breakfast", "Desk Mini-Meal", "Work Break Meal", "Dinner", "Snack"];
export const CATEGORY_ORDER: Category[] = ["Produce", "Protein", "Dairy", "Pantry"];

export interface Nutrition {
  serving_size: string;
  calories: number;
  total_fat_g: number;
  saturated_fat_g: number;
  cholesterol_mg: number;
  sodium_mg: number;
  total_carbs_g: number;
  fiber_g: number;
  sugars_g: number;
  protein_g: number;
}

export interface Recipe extends Nutrition {
  id: string;
  name: string;
  tag: Tag;
  time: string;
  description: string;
  ingredients: string[];
  instructions: string[];
  prep_video_url: string | null;
  prep_video_is_video: boolean;
}

export interface MealPlanEntry {
  id: string;
  day: Day;
  slot: Tag;
  recipe_id: string;
}

export interface ShoppingListItem {
  id: string;
  name: string;
  category: Category;
  checked: boolean;
}

export interface FoodDiaryEntry {
  id: string;
  logged_date: string;
  day: string;
  slot: string;
  recipe_name: string;
  eaten_url: string;
  eaten_is_video: boolean;
  actual_eaten: string;
  calories: number;
  protein_g: number;
  total_carbs_g: number;
  total_fat_g: number;
  created_at: string;
}

export const TAG_STYLES: Record<Tag, { color: string; bg: string; text: string }> = {
  Breakfast: { color: "#C98A4B", bg: "#F5E9D6", text: "#96652C" },
  "Desk Mini-Meal": { color: "#6B8F63", bg: "#E4EEE1", text: "#3F6B41" },
  "Work Break Meal": { color: "#5B8DA6", bg: "#E1EBEF", text: "#375F70" },
  Dinner: { color: "#8E6FBE", bg: "#EDE6F7", text: "#6B4FA0" },
  Snack: { color: "#B9758F", bg: "#F5E3EA", text: "#8A4C63" },
};

export function categorize(name: string): Category {
  const n = name.toLowerCase();
  const produce = ["lemon", "garlic", "thyme", "avocado", "spinach", "carrot", "asparagus", "onion", "bell pepper", "berries", "apple", "cucumber"];
  const protein = ["chicken", "salmon", "turkey", "beef", "chickpeas", "beans", "hummus"];
  const dairy = ["yogurt", "almond milk", "cheese"];
  if (produce.some((p) => n.includes(p))) return "Produce";
  if (protein.some((p) => n.includes(p))) return "Protein";
  if (dairy.some((p) => n.includes(p))) return "Dairy";
  return "Pantry";
}

// Reference Daily Values (2,000-calorie diet) used to compute the %DV column
// on the nutrition label, same reference the FDA label uses.
export const DAILY_VALUES = {
  total_fat_g: 78,
  saturated_fat_g: 20,
  cholesterol_mg: 300,
  sodium_mg: 2300,
  total_carbs_g: 275,
  fiber_g: 28,
  protein_g: 50,
};

export const DEFAULT_RECIPES: Omit<Recipe, "id">[] = [
  {
    name: "Lemon Herb Chicken",
    tag: "Dinner",
    time: "35 min",
    description: "Bright, garlicky chicken breasts finished with fresh thyme — a weeknight go-to.",
    ingredients: ["2 chicken breasts", "1 lemon", "2 tbsp olive oil", "3 cloves garlic", "1 tsp thyme", "Salt & pepper"],
    instructions: [
      "Pat chicken breasts dry and season both sides with salt and pepper.",
      "Whisk olive oil, juice of the lemon, minced garlic, and thyme in a bowl.",
      "Marinate the chicken in the mixture for at least 15 minutes.",
      "Sear in a hot pan 5-6 minutes per side until golden and cooked through.",
      "Rest 5 minutes before slicing.",
    ],
    prep_video_url: null,
    prep_video_is_video: false,
    serving_size: "1 breast (170g)",
    calories: 280,
    total_fat_g: 14,
    saturated_fat_g: 2.5,
    cholesterol_mg: 95,
    sodium_mg: 320,
    total_carbs_g: 3,
    fiber_g: 0.5,
    sugars_g: 1,
    protein_g: 35,
  },
  {
    name: "Veggie Buddha Bowl",
    tag: "Desk Mini-Meal",
    time: "25 min",
    description: "A colorful bowl of quinoa, chickpeas, and greens with a creamy tahini drizzle.",
    ingredients: ["1 cup quinoa", "1 cup chickpeas", "1 avocado", "2 cups spinach", "1 carrot", "2 tbsp tahini"],
    instructions: [
      "Cook quinoa according to package directions and let cool slightly.",
      "Roast chickpeas at 400°F for 15 minutes until crisp.",
      "Shred the carrot and slice the avocado.",
      "Layer spinach, quinoa, chickpeas, carrot, and avocado in a bowl.",
      "Drizzle with tahini thinned with a splash of water.",
    ],
    prep_video_url: null,
    prep_video_is_video: false,
    serving_size: "1 bowl (400g)",
    calories: 420,
    total_fat_g: 18,
    saturated_fat_g: 2.5,
    cholesterol_mg: 0,
    sodium_mg: 210,
    total_carbs_g: 52,
    fiber_g: 13,
    sugars_g: 4,
    protein_g: 14,
  },
  {
    name: "Berry Overnight Oats",
    tag: "Breakfast",
    time: "5 min + overnight",
    description: "Make it the night before and wake up to a no-fuss, naturally sweet breakfast.",
    ingredients: ["1/2 cup rolled oats", "1/2 cup almond milk", "1/4 cup Greek yogurt", "1/2 cup mixed berries", "1 tsp honey"],
    instructions: [
      "Combine oats, almond milk, and Greek yogurt in a jar.",
      "Stir in honey.",
      "Top with berries, cover, and refrigerate overnight.",
      "Stir before eating; add a splash of milk if too thick.",
    ],
    prep_video_url: null,
    prep_video_is_video: false,
    serving_size: "1 jar (280g)",
    calories: 310,
    total_fat_g: 7,
    saturated_fat_g: 1.5,
    cholesterol_mg: 5,
    sodium_mg: 65,
    total_carbs_g: 51,
    fiber_g: 7,
    sugars_g: 20,
    protein_g: 13,
  },
  {
    name: "Sheet Pan Salmon",
    tag: "Dinner",
    time: "30 min",
    description: "One pan, minimal cleanup — salmon and asparagus roasted in citrus and garlic.",
    ingredients: ["4 salmon fillets", "1 lb asparagus", "2 tbsp olive oil", "1 lemon", "2 cloves garlic", "Salt & pepper"],
    instructions: [
      "Preheat oven to 400°F and line a sheet pan.",
      "Toss asparagus with half the olive oil, salt, and pepper; spread on the pan.",
      "Place salmon on the pan, drizzle with remaining oil, garlic, and lemon slices.",
      "Roast 12-15 minutes until salmon flakes easily.",
    ],
    prep_video_url: null,
    prep_video_is_video: false,
    serving_size: "1 fillet + veg (300g)",
    calories: 360,
    total_fat_g: 22,
    saturated_fat_g: 4,
    cholesterol_mg: 85,
    sodium_mg: 290,
    total_carbs_g: 6,
    fiber_g: 3,
    sugars_g: 2,
    protein_g: 34,
  },
  {
    name: "Turkey Taco Bowls",
    tag: "Dinner",
    time: "20 min",
    description: "All the taco flavor, none of the shells — build your own bowl in 20 minutes.",
    ingredients: ["1 lb ground turkey", "Taco seasoning", "1 cup rice", "1 can black beans", "1 cup corn", "Shredded cheese"],
    instructions: [
      "Brown ground turkey in a skillet, breaking it up as it cooks.",
      "Stir in taco seasoning and a splash of water; simmer 5 minutes.",
      "Warm the rice, beans, and corn.",
      "Build bowls with rice, turkey, beans, corn, and cheese.",
    ],
    prep_video_url: null,
    prep_video_is_video: false,
    serving_size: "1 bowl (380g)",
    calories: 480,
    total_fat_g: 16,
    saturated_fat_g: 5,
    cholesterol_mg: 90,
    sodium_mg: 610,
    total_carbs_g: 48,
    fiber_g: 8,
    sugars_g: 3,
    protein_g: 36,
  },
  {
    name: "Slow Cooker Chili",
    tag: "Dinner",
    time: "6 hrs slow cook",
    description: "Let it simmer all day for a rich, hearty chili that's ready when you are.",
    ingredients: ["1 lb ground beef", "2 cans diced tomatoes", "1 can kidney beans", "1 onion", "2 tbsp chili powder", "1 bell pepper"],
    instructions: [
      "Brown the ground beef and drain excess fat.",
      "Add beef and remaining ingredients to the slow cooker.",
      "Cook on low for 6 hours, stirring occasionally.",
      "Taste and adjust seasoning before serving.",
    ],
    prep_video_url: null,
    prep_video_is_video: false,
    serving_size: "1.5 cups (350g)",
    calories: 390,
    total_fat_g: 17,
    saturated_fat_g: 6,
    cholesterol_mg: 75,
    sodium_mg: 720,
    total_carbs_g: 30,
    fiber_g: 9,
    sugars_g: 7,
    protein_g: 28,
  },
  {
    name: "Turkey & Hummus Wrap",
    tag: "Work Break Meal",
    time: "10 min",
    description: "A five-minute assemble-and-go wrap that survives a desk drawer until lunch.",
    ingredients: ["1 whole wheat wrap", "3 oz turkey slices", "3 tbsp hummus", "1/2 cup spinach", "1/4 cucumber"],
    instructions: [
      "Spread hummus over the wrap.",
      "Layer turkey, spinach, and thinly sliced cucumber.",
      "Roll tightly and slice in half.",
    ],
    prep_video_url: null,
    prep_video_is_video: false,
    serving_size: "1 wrap (250g)",
    calories: 340,
    total_fat_g: 10,
    saturated_fat_g: 2,
    cholesterol_mg: 40,
    sodium_mg: 780,
    total_carbs_g: 38,
    fiber_g: 6,
    sugars_g: 3,
    protein_g: 24,
  },
  {
    name: "Apple & Almond Butter",
    tag: "Snack",
    time: "2 min",
    description: "The simplest reset between meetings — crisp apple, a scoop of almond butter.",
    ingredients: ["1 apple", "2 tbsp almond butter"],
    instructions: ["Slice the apple.", "Serve with almond butter for dipping."],
    prep_video_url: null,
    prep_video_is_video: false,
    serving_size: "1 apple + 2 tbsp (200g)",
    calories: 270,
    total_fat_g: 18,
    saturated_fat_g: 1.5,
    cholesterol_mg: 0,
    sodium_mg: 5,
    total_carbs_g: 27,
    fiber_g: 6,
    sugars_g: 19,
    protein_g: 7,
  },
];
