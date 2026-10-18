# Pinch: a weekly dinner planner

**Seven dinners, decided for you.** Pinch builds a week of dinners around what's already in your kitchen, what's on sale nearby, your budget, and how long you want to spend cooking.

> A working prototype built to explore one product question: can a meal planner start from the household's real constraints (money, time, and food about to expire) instead of a recipe catalog?

## The problem

Planning dinner is a daily decision that most households make under pressure. Three things make it harder than it looks:

- **Money.** Food is a large, flexible part of the household budget, and takeout is the easy way to overspend.
- **Time.** Weeknights are short. A "30-minute" recipe often isn't.
- **Waste.** Food expires before it gets used, because nobody is planning around it.

Most meal-planning tools start from recipes and ask you to adapt your life to them. Pinch starts from your constraints and works backward to a plan.

## Who it's for

Households of 2 to 6 people who cook most weeknight dinners, watch what they spend, and don't want to think about dinner every day. Kids under 12 are accounted for in onboarding, and the dietary filters cover common needs (vegetarian, no pork, dairy-free, gluten-free, nut allergy).

## What it does

- **Builds a 7-night plan** that respects your weekly budget, a weeknight time cap (weekends get 20 extra minutes), and a cooking style: mostly fresh, mixed, or shortcuts.
- **Plans around your pantry.** Items that expire soonest are prioritized, and the plan shows which night uses which item.
- **Finds the deals.** Meals that use sale items get a lower estimated price and a "On sale" tag, and a deals panel shows what's in or out of the plan.
- **Writes the shopping list.** Items are grouped by store aisle, and anything you already have is left off.
- **Lets you swap any night.** One tap cycles to the next best meal that fits your limits.
- **Shows what planning saves you.** It compares the plan against ordering out and paying full price, with adjustable assumptions.
- **Illustrates what that could become.** A simple compounding projection shows how part of the savings could grow over time. It is a hypothetical illustration, not investment advice.
- **Reminds you before food expires.** Reminders show in the page while it's open.
- **Keeps your data on your device.** A short onboarding flow collects household size, zip code, stores, diet, and pantry. Everything is stored in the browser, and there is a "Delete my data" control.

## Key product decisions

| Decision | Why |
|---|---|
| Start from constraints, not recipes | Budget, time, and expiring food are what actually drive the decision at home. |
| Score meals instead of picking them at random | Each meal is scored on cost against budget, use of expiring pantry items, sale prices, and cooking style. A small penalty avoids serving the same type of meal two nights in a row. |
| Offer "Shortcuts" as a first-class style | Frozen and precooked meals save real time, and the app shows how many minutes that buys. |
| Never break a dietary rule to fill the week | If few meals qualify, the plan repeats a safe meal rather than suggesting one that doesn't fit. |
| Collect the minimum, store it locally | Only a first name, a zip code, and store choices are asked for. Nothing leaves the device, which keeps trust high and privacy risk low for a first version. |
| Label estimates honestly | Prices, deals, store distances, and savings are clearly marked as examples or estimates in the UI. |

## What is real and what is sample data

This is a prototype, and the README should be clear about that.

- **Working logic:** the planning and scoring, budget math, pantry and expiry handling, swaps, shopping list, savings calculator, onboarding, and local storage.
- **Sample data:** the 16-dinner catalog, the weekly deals, store names, and store distances are hard-coded examples. Distances are derived from the zip code only to look plausible.
- **Not built yet:** live store flyers and prices, a real store locator, phone notifications, user accounts, and nutrition data beyond approximate calories.

## Tech

Plain HTML, CSS, and JavaScript, with no framework, build step, or backend. Browser `localStorage` holds the profile and pantry.

| File | Purpose |
|---|---|
| `index.html` | Page structure |
| `app.js` | Meal catalog, planning and scoring logic, rendering, onboarding, savings calculator |
| `styles.css` | Layout and theming, including light and dark mode |

## Run it locally

No install is needed.

```bash
git clone https://github.com/Jayita736/meal-planner-app.git
cd meal-planner-app
open index.html        # macOS; on other systems, open the file in your browser
```

Or serve the folder with any static server, for example `python3 -m http.server`, and visit `http://localhost:8000`.

## What I would build next

1. **Live deals.** Connect a flyer or store-deals data source so sale prices are real. This is the biggest gap between the prototype and a useful product.
2. **A larger, filterable recipe set** with real recipes, steps, and portion scaling.
3. **Smarter leftovers.** Plan batch-cooked meals so one cooking session covers two nights.
4. **Mobile notifications** for expiry reminders and weekly plan day.
5. **Measure it.** Track plan completion, swaps per week, shopping-list use, and reported savings to learn which features earn their place.
6. **Test with real households** to check the assumptions behind the budget tiers and the savings estimates.

## Disclaimer

Prices, deals, and savings figures are illustrative. The investing section is a hypothetical illustration of compounding and is not financial advice. Calorie figures are approximate, and anyone with food allergies should always check ingredient labels.
