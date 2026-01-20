/**
 * NutriPlan - Main Entry Point
 *
 * This is the main entry point for the application.
 * Import your modules and initialize the app here.
 */
"use strict";
import Meal from "./ui/meal.js";
import Menu from "./ui/menu.js";
import Product from "./ui/product.js";

// 0-00 creating varibales
// get categories grid
const categoriesGrid = document.getElementById("categories-grid");

// get areas container
const areasContainer = document.querySelector(".areas-btns");

// creating arrays for backgrounds to make catogreis links look different
const backgrounds = [
    ["from-red-50", "to-rose-50"],
    ["from-amber-50", "to-orange-50"],
    ["from-pink-50", "to-rose-50"],
    ["from-cyan-50", "to-blue-50"],
    ["from-emerald-50", "to-green-50"],
    ["from-yellow-50", "to-amber-50"],
];
const borders = [
    ["border-red-200", "hover:border-red-400"],
    ["border-amber-200", "hover:border-amber-400"],
    ["border-pink-200", "hover:border-pink-400"],
    ["border-cyan-200", "hover:border-cyan-400"],
    ["border-emerald-200", "hover:border-emerald-400"],
    ["border-yellow-200", "hover:border-yellow-400"],
];
const iconsBackgrounds = [
    ["from-red-400", "to-rose-500"],
    ["from-amber-400", "to-orange-500"],
    ["from-pink-400", "to-rose-500"],
    ["from-cyan-400", "to-blue-500"],
    ["from-emerald-400", "to-green-500"],
    ["from-yellow-400", "to-amber-500"],
];

// getting recipes grid container
const recipesGrid = document.getElementById("recipes-grid");

// getting search input and its button
const searchInput = document.getElementById("search-input");
const searchButton = document.querySelector(".search-button");

// getting toggle view buttons
const viewToggleContainer = document.getElementById("view-toggle");
const gridViewButton = document.getElementById("grid-view-btn");
const listViewButton = document.getElementById("list-view-btn");

// meals details section(s)
const mealDetails = document.getElementById("meal-details");
const searchFiltersSection = document.getElementById("search-filters-section");
const mealCategoriesSection = document.getElementById(
    "meal-categories-section",
);
const allRecipesSection = document.getElementById("all-recipes-section");
const backToMealButton = document.getElementById("back-to-meals-btn");

// Products sections varaibales
const searchProductInput = document.getElementById("product-search-input");
const barcodeProductInput = document.getElementById("barcode-input");
const productsCount = document.getElementById("products-count");
const productsGrid = document.getElementById("products-grid");
const emptyMarkup = document.getElementById("products-empty");
const productsLoading = document.getElementById("products-loading");
const searchProductButton = document.getElementById("search-product-btn");
const barcodeProductButton = document.getElementById("lookup-barcode-btn");

// get all nutri scores filters
const nutriScoreFilters = document.querySelectorAll(".nutri-score-filter");
// get all products cat buttons
const productCategoryButtons = document.querySelectorAll(
    ".product-category-btn",
);

// get time elements from html
const todayDate = document.getElementById("foodlog-date");

// 1-00 creating functions

// generating and populating cats cards
async function populateCats() {
    try {
        const response = await fetch(
            "https://nutriplan-api.vercel.app/api/meals/categories",
        );
        if (!response.ok) {
            throw new Error("There a problem in the request!!!!!!!");
        }
        const data = await response.json();
        const htmlMarkup = data.results.map((category, i) => {
            return `
            <div class="category-card bg-gradient-to-br ${backgrounds[i % 6][0]} ${backgrounds[i % 6][1]} rounded-xl p-3 border ${borders[i % 6][0]} ${borders[i % 6][1]} hover:shadow-md cursor-pointer transition-all group"
                data-category="${category.name}">
                <div class="flex items-center gap-2.5">
                    <div
                        class="text-white w-9 h-9 bg-gradient-to-br ${iconsBackgrounds[i % 6][0]} ${iconsBackgrounds[i % 6][1]} rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm">
                        <img src="${category.thumbnail}" class="object-cover rounded-lg w-full h-full"/>
                    </div>
                    <div>
                        <h3 class="text-sm font-bold text-gray-900">${category.name}</h3>
                    </div>
                </div>
            </div>
            `;
        });
        categoriesGrid.innerHTML = htmlMarkup.join(" ");
        giveCatsButtonsMagic();
    } catch (error) {
        categoriesGrid.innerHTML = error;
    }
}
populateCats();
// generating and populating areas cards
async function populateCountries() {
    try {
        const response = await fetch(
            "https://nutriplan-api.vercel.app/api/meals/areas",
        );
        if (!response.ok) {
            throw new Error("There a problem in the request!!!!!!!");
        }
        const data = await response.json();
        const htmlMarkup = data.results.map((area) => {
            return `
            <button
                class="area-filter-btn px-4 py-2 bg-gray-100 text-gray-700 rounded-full font-medium text-sm whitespace-nowrap hover:bg-gray-200 transition-all"
                data-area="${area.name}">
                ${area.name}
            </button>
            `;
        });
        areasContainer.innerHTML = `
        <button
            class="area-filter-btn px-4 py-2 bg-emerald-600 text-white rounded-full font-medium text-sm whitespace-nowrap hover:bg-emerald-700 hover:text-white transition-all"
            data-area="">
            All Cuisines
        </button>
        ${htmlMarkup.join(" ")}
        `;
        giveCountriesButtonsMagic();
    } catch (error) {
        areasContainer.innerHTML = error;
    }
}
populateCountries();

// generating populate menu function and using it on the start
let firstTime = true;
async function populateMenu(method, target, value, container = recipesGrid) {
    try {
        const theMenu = new Menu(method, target, value, container);
        loadingMenu();
        await theMenu.populateMenu();
        if (firstTime) {
            firstTime = false;
        } else {
            recipesGrid.scrollIntoView({
                behavior: "smooth",
                block: "start",
            });
            // not necessary but would be useful but we don't have tiimmmmeeee
            // document
            //     .querySelectorAll(".recipe-card")
            //     .removeEventListener("click", recipeOpen);
        }
        document.querySelectorAll(".recipe-card").forEach((card) => {
            card.addEventListener("click", () =>
                recipeOpen(theMenu, card.getAttribute("data-meal-id")),
            );
        });
    } catch (error) {
        // loadingMenuDone();
        console.error(error);
        recipesGrid.innerHTML = "Server error try again later";
    }
}
populateMenu("random", "count", 25, recipesGrid);

// make loading functions for menu loading
function loadingMenu() {
    recipesGrid.innerHTML = `
        <div class="flex items-center justify-center py-12 z-[100] recipes-spinner">
            <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
        </div>
    `;
}
function loadingMenuDone() {
    document.querySelector(".recipes-spinner").classList.add("hidden");
}

// give cat cards some magic
function giveCatsButtonsMagic() {
    // get every category-card we made
    const categoryCards = document.querySelectorAll(".category-card");
    categoryCards.forEach((cat) => {
        cat.addEventListener("click", () => {
            populateMenu(
                "filter",
                "category",
                cat.getAttribute("data-category"),
                recipesGrid,
            );
        });
    });
}

// give countries cards some magic
function giveCountriesButtonsMagic() {
    // get every areabtns we made
    const countriesButtons = document.querySelectorAll(".area-filter-btn");
    countriesButtons.forEach((button) => {
        button.addEventListener("click", () => {
            if (button.getAttribute("data-area")) {
                populateMenu(
                    "filter",
                    "area",
                    button.getAttribute("data-area"),
                    recipesGrid,
                );
            } else {
                populateMenu("random", "count", 25, recipesGrid);
            }
            countriesButtons.forEach((innerButton) => {
                const theCondition = button === innerButton;
                console.log(theCondition);
                innerButton.classList.toggle("bg-emerald-600", theCondition);
                innerButton.classList.toggle("text-white", theCondition);
                innerButton.classList.toggle("bg-gray-100", !theCondition);
                innerButton.classList.toggle("text-gray-700", !theCondition);
            });
        });
    });
}

// give search button magggiccccc
searchInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
        searchAndPopulate();
    }
});
searchButton.addEventListener("click", () => {
    searchAndPopulate();
});

function searchAndPopulate() {
    console.log(searchInput.value);
    populateMenu("search", "q", searchInput.value, recipesGrid);
}

// toggle list-grid view
function toggleRecipesView() {
    // if we clicked a clicked button do nothing
    if (
        this.getAttribute("title") ===
        viewToggleContainer.getAttribute("data-view")
    ) {
        return;
    }
    viewToggleContainer.setAttribute("data-view", this.getAttribute("title"));
    const recipesCards = document.querySelectorAll(".recipe-card");
    if (viewToggleContainer.getAttribute("data-view") === "Grid View") {
        // handel the button
        gridViewButton.classList.add("bg-white", "rounded-md", "shadow-sm");
        listViewButton.classList.remove("bg-white", "rounded-md", "shadow-sm");
        // handel the grid
        recipesGrid.classList.add("grid-cols-4");
        recipesGrid.classList.remove("grid-cols-2");
        recipesCards.forEach((card) => {
            // handel card frame
            card.classList.remove("flex-row", "h-40", "flex");
            // Update image container
            const imageContainer = card.querySelector(".img-container");
            imageContainer.classList.remove("w-17", "h-full", "flex-shrink-0");
            imageContainer.classList.add("h-48");
            // Show badges on image
            const badges = card.querySelector(".top-badge");
            if (badges) {
                badges.classList.remove("hidden");
            }
        });
    } else if (viewToggleContainer.getAttribute("data-view") === "List View") {
        // handel the button
        gridViewButton.classList.remove("bg-white", "rounded-md", "shadow-sm");
        listViewButton.classList.add("bg-white", "rounded-md", "shadow-sm");
        // handel the grid
        recipesGrid.classList.remove("grid-cols-4");
        recipesGrid.classList.add("grid-cols-2");
        recipesCards.forEach((card) => {
            // handel card frame
            card.classList.add("flex", "flex-row", "h-40");
            // Update image container
            const imageContainer = card.querySelector(".img-container");
            imageContainer.classList.remove("h-48");
            imageContainer.classList.add("w-17", "h-full", "flex-shrink-0");
            // Show badges on image
            const badges = card.querySelector(".top-badge");
            if (badges) {
                badges.classList.add("hidden");
            }
        });
    }
}

gridViewButton.addEventListener("click", toggleRecipesView);
listViewButton.addEventListener("click", toggleRecipesView);

// making recipes items interative function
async function recipeOpen(menu, id) {
    const data = await menu.generateMeal(id);
    const meal = new Meal(data);
    // changing hero section
    const herSec = document.querySelector(".hero-sec");
    meal.changingHero(herSec);
    // chaning ingredients grid
    const ingredGrid = document.querySelector(".ingredients-grid");
    meal.changingIngreds(ingredGrid);
    // changing instructions
    const instructionsContainer = document.querySelector(
        ".instructions-container",
    );
    meal.changingInstractions(instructionsContainer);
    // showing youtube video
    meal.showingYoutube();
    meal.createNutritionFactsHTML();
    mealDetails.classList.remove("hidden");
    searchFiltersSection.classList.add("hidden");
    mealCategoriesSection.classList.add("hidden");
    allRecipesSection.classList.add("hidden");
}

function recipeClose() {
    mealDetails.classList.add("hidden");
    searchFiltersSection.classList.remove("hidden");
    mealCategoriesSection.classList.remove("hidden");
    allRecipesSection.classList.remove("hidden");
}
backToMealButton.addEventListener("click", recipeClose);

// giving search input and barcode input guess what? some magiiccc
async function populateProductsGrid(value, method = "search") {
    const productObject = new Product(value, method);
    productsLoading.classList.remove("hidden");
    emptyMarkup.classList.add("hidden");
    productsGrid.classList.add("hidden");
    const data = await productObject.fetchData();
    if (Array.isArray(data)) {
        productsCount.innerHTML = `Found ${data.length} products for "${value}"`;
    } else {
        productsCount.innerHTML = `Found product: ${data.name}`;
        productObject.showModal(data);
    }
    productObject.populateGrid(data, productsGrid);
    productsLoading.classList.add("hidden");
    productsGrid.classList.remove("hidden");
}

searchProductInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
        populateProductsGrid(searchProductInput.value, "search");
    }
});
barcodeProductInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
        populateProductsGrid(barcodeProductInput.value, "barcode");
    }
});

searchProductButton.addEventListener("click", () => {
    populateProductsGrid(searchProductInput.value, "search");
});
barcodeProductButton.addEventListener("click", () => {
    populateProductsGrid(barcodeProductInput.value, "barcode");
});

// allow filter buttons to filter :D
nutriScoreFilters.forEach((filter) => {
    filter.addEventListener("click", () => {
        console.log("fire");
        const productsList = document.querySelectorAll(".product-card");
        if (filter.getAttribute("data-grade")) {
            productsList.forEach((product) => {
                product.classList.add("hidden");
                console.log(product.getAttribute("data-grade"));
                console.log("filter", filter.getAttribute("data-grade"));
                if (
                    product.getAttribute("data-grade") ===
                    filter.getAttribute("data-grade")
                ) {
                    product.classList.remove("hidden");
                }
            });
        } else {
            productsList.forEach((product) => {
                product.classList.remove("hidden");
            });
        }
    });
});

// give all category button magicc
productCategoryButtons.forEach((button) => {
    button.addEventListener("click", () => {
        console.log("fire");
        console.log(button.getAttribute("data-category"));
        populateProductsGrid(button.getAttribute("data-category"), "category");
    });
});

// update today's date
// and generate localstorage with all the last 7 days
let dateKeys = [];

function startDateAndKeys() {
    const date = new Date();
    // date.setDate(date.getDate() - 20);
    todayDate.innerHTML = `${date.toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
    })}`;
    dateKeys = [];
    for (let i = 0; i < 7; i++) {
        let newDate = new Date();
        newDate.setDate(date.getDate() - i);
        newDate = newDate.toISOString().split("T")[0];
        dateKeys.push(newDate);
    }
    const defaultValue = {
        calories: 0,
        fat: 0,
        protein: 0,
        carbs: 0,
        meals: [],
        products: [],
    };
    dateKeys.forEach((date) => {
        if (!localStorage.getItem(date)) {
            localStorage.setItem(date, JSON.stringify(defaultValue));
        }
    });
    Object.keys(localStorage).forEach((key) => {
        if (/^\d{4}-\d{2}-\d{2}$/.test(key) && !dateKeys.includes(key)) {
            localStorage.removeItem(key);
        }
    });
    populateWeekCalendar();
}
startDateAndKeys();

function populateWeekCalendar() {
    const today = new Date();
    const container = document.getElementById("weekly-chart");

    // Html for 7 days
    const daysHTML = [];

    for (let i = 6; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(today.getDate() - i);

        const dateKey = date.toISOString().split("T")[0];
        const dayName = date.toLocaleDateString("en-US", { weekday: "short" });
        const dayNumber = date.getDate();
        const dayData = localStorage.getItem(dateKey);
        let calories = 0;
        if (dayData) {
            const dayObject = JSON.parse(dayData);
            console.log(dayObject);
            calories = dayObject.calories;
        }

        const isToday = i === 0;
        const bgClass = isToday ? "bg-indigo-100 rounded-xl" : "";
        const textClass = calories > 0 ? "text-emerald-600" : "text-gray-300";
        daysHTML.push(`
            <div class="text-center ${bgClass}" data-date="${dateKey}">
                <p class="text-xs text-gray-500 mb-1">${dayName}</p>
                <p class="text-sm font-medium text-gray-900">${dayNumber}</p>
                <div class="mt-2 ${textClass}">
                    <p class="text-lg font-bold">${calories}</p>
                    <p class="text-xs">kcal</p>
                </div>
            </div>
        `);
    }

    container.innerHTML = daysHTML.join("");
    container.classList = `grid grid-cols-7 gap-2`;
}

function generateDailyLogHTML(logData) {
    console.log(logData);
    if (logData.products.length === 0 && logData.meals.length === 0) {
        return 0;
    }

    // Combine all items with type for easy handling
    const items = [
        ...logData.products.map((p) => ({ ...p, type: "product" })),
        ...logData.meals.map((m) => ({ ...m, type: "meal" })), // adjust if your meals are stored differently
    ];

    // Sort by time (earliest first)
    items.sort((a, b) => {
        const timeA = a.hour * 60 + a.minute;
        const timeB = b.hour * 60 + b.minute;
        return timeA - timeB;
    });

    // Helper to format time like "11:43 AM"
    const formatTime = (hour, minute) => {
        const ampm = hour >= 12 ? "PM" : "AM";
        const h = hour % 12 || 12;
        const m = minute.toString().padStart(2, "0");
        return `${h}:${m} ${ampm}`;
    };

    // Build HTML for each item
    const cards = items.map((item) => {
        const timeStr = formatTime(item.hour, item.minute);
        const calories = Math.round(item.calories); // or total if per-serving
        const protein = item.protein?.toFixed(1) || "0";
        const carbs = item.carbs?.toFixed(1) || "0";
        const fat = item.fat?.toFixed(1) || "0";

        if (item.type === "meal") {
            // Meal card
            const servings = item.serving || 1;
            const imageSrc =
                item.pictureSrc ||
                "https://www.themealdb.com/images/media/meals/placeholder.jpg"; // fallback
            return `
<div class="flex items-center justify-between bg-gray-50 rounded-xl p-4 hover:bg-gray-100 transition-all item-card" data-id="${item.id}">
    <div class="flex items-center gap-4">
        <img src="${imageSrc}" alt="${item.name}" class="w-14 h-14 rounded-xl object-cover">
        <div>
            <p class="font-semibold text-gray-900">${item.name}</p>
            <p class="text-sm text-gray-500">
                ${servings} serving<span class="mx-1">•</span><span class="text-emerald-600">Recipe</span>
            </p>
            <p class="text-xs text-gray-400 mt-1">${timeStr}</p>
        </div>
    </div>
    <div class="flex items-center gap-4">
        <div class="text-right">
            <p class="text-lg font-bold text-emerald-600">${calories}</p>
            <p class="text-xs text-gray-500">kcal</p>
        </div>
        <div class="hidden md:flex gap-2 text-xs text-gray-500">
            <span class="px-2 py-1 bg-blue-50 rounded">${protein}g P</span>
            <span class="px-2 py-1 bg-amber-50 rounded">${carbs}g C</span>
            <span class="px-2 py-1 bg-purple-50 rounded">${fat}g F</span>
        </div>
        <button class="remove-foodlog-item text-gray-400 hover:text-red-500 transition-all p-2" onclick='deleteItemById(${item.id},"meals")'>
            <i class="fa-solid fa-trash-can"></i>
        </button>
    </div>
</div>`;
        } else {
            // Product card
            const brand = item.brand || "Unknown";
            return `
<div class="flex items-center justify-between bg-gray-50 rounded-xl p-4 hover:bg-gray-100 transition-all item-card" data-id=${item.id}>
    <div class="flex items-center gap-4">
        <div class="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center">
            <i class="text-blue-600 text-xl fa-solid fa-box"></i>
        </div>
        <div>
            <p class="font-semibold text-gray-900">${item.name}</p>
            <p class="text-sm text-gray-500">
                ${brand}<span class="mx-1">•</span><span class="text-blue-600">Product</span>
            </p>
            <p class="text-xs text-gray-400 mt-1">${timeStr}</p>
        </div>
    </div>
    <div class="flex items-center gap-4">
        <div class="text-right">
            <p class="text-lg font-bold text-emerald-600">${calories}</p>
            <p class="text-xs text-gray-500">kcal</p>
        </div>
        <div class="hidden md:flex gap-2 text-xs text-gray-500">
            <span class="px-2 py-1 bg-blue-50 rounded">${protein}g P</span>
            <span class="px-2 py-1 bg-amber-50 rounded">${carbs}g C</span>
            <span class="px-2 py-1 bg-purple-50 rounded">${fat}g F</span>
        </div>
        <button class="remove-foodlog-item text-gray-400 hover:text-red-500 transition-all p-2" onclick='deleteItemById(${item.id},"products")'>
            <i class="fa-solid fa-trash-can"></i>
        </button>
    </div>
</div>`;
        }
    });

    return cards.join(""); // Concatenate all cards into one string
}
function generateNutritionStats(todayObject) {
    // maximum goa;s
    const goals = {
        calories: 2000,
        protein: 50,
        carbs: 250,
        fat: 65,
    };
    const current = {
        calories: todayObject.calories || 0,
        protein: todayObject.protein || 0,
        carbs: todayObject.carbs || 0,
        fat: todayObject.fat || 0,
    };

    // get precentages
    const percentages = {
        calories: Math.min(
            Math.round((current.calories / goals.calories) * 100),
            100,
        ),
        protein: Math.min(
            Math.round((current.protein / goals.protein) * 100),
            100,
        ),
        carbs: Math.min(Math.round((current.carbs / goals.carbs) * 100), 100),
        fat: Math.min(Math.round((current.fat / goals.fat) * 100), 100),
    };
    const getColorClass = (percentage, nutrient) => {
        if (percentage === 100) return "red";
        const colors = {
            calories: "emerald",
            protein: "blue",
            carbs: "amber",
            fat: "purple",
        };

        return colors[nutrient];
    };

    const createStatCard = (nutrient, label) => {
        const percentage = percentages[nutrient];
        const currentValue =
            nutrient === "calories"
                ? Math.round(current[nutrient])
                : Math.round(current[nutrient]);
        const goalValue = goals[nutrient];
        const color = getColorClass(percentage, nutrient);
        const displayPercentage = Math.min(percentage, 100); // Cap at 100% for progress bar
        const unit = nutrient === "calories" ? "kcal" : "g";

        return `
            <div class="bg-gray-50 rounded-xl p-4">
                <div class="flex items-center justify-between mb-2">
                    <span class="text-sm font-medium text-gray-700">${label}</span>
                    <span class="text-xs text-${color}-600">${percentage}%</span>
                </div>
                <div class="w-full bg-gray-200 rounded-full h-2.5 mb-2">
                    <div class="h-2.5 rounded-full bg-${color}-500" style="width: ${displayPercentage}%"></div>
                </div>
                <div class="flex items-center justify-between text-xs">
                    <span class="font-bold text-${color}-600">${currentValue} ${unit}</span>
                    <span class="text-gray-400">/ ${goalValue} ${unit}</span>
                </div>
            </div>
        `;
    };

    // Generate the complete markup
    return `
            ${createStatCard("calories", "Calories")}
            ${createStatCard("protein", "Protein")}
            ${createStatCard("carbs", "Carbs")}
            ${createStatCard("fat", "Fat")}
    `;
}

function updateUi() {
    let itemsNumber = 0;
    let totalCal = 0;
    let daysOngoal = 0;
    let todayObject;
    dateKeys.forEach((key, i) => {
        const dayObject = JSON.parse(localStorage.getItem(key));
        if (i === 0) {
            todayObject = dayObject;
        }
        itemsNumber += dayObject.meals?.length + dayObject.products?.length;
        totalCal += dayObject.calories;
        if (
            dayObject.calories >= 2000 &&
            dayObject.protein >= 50 &&
            dayObject.carbs >= 250 &&
            dayObject.fat >= 65
        ) {
            daysOngoal++;
        }
    });
    console.log("today's", todayObject);
    document.getElementById("logged-items-count").innerHTML =
        `Logged Items (${itemsNumber})
        `;
    document.getElementById("items-count").innerHTML = `${itemsNumber} items`;
    document.getElementById("cal-count").innerHTML =
        `${(totalCal / 7).toFixed(0)} kcal`;
    document.querySelector(".days-on-goal-counter").innerHTML =
        `${daysOngoal} / 7`;
    populateWeekCalendar();
    const htmlMarkupLog = generateDailyLogHTML(todayObject);
    const logContainer = document.getElementById("logged-items-list");
    if (htmlMarkupLog === 0) {
        document.getElementById("clear-foodlog").style.display = "none";
        logContainer.innerHTML = `<div class="text-center py-8 text-gray-500">
                                <i class="mb-3 text-4xl text-gray-300" data-fa-i2svg=""><svg class="svg-inline--fa fa-utensils" data-prefix="fas" data-icon="utensils" role="img" viewBox="0 0 512 512" aria-hidden="true" data-fa-i2svg=""><path fill="currentColor" d="M63.9 14.4C63.1 6.2 56.2 0 48 0s-15.1 6.2-16 14.3L17.9 149.7c-1.3 6-1.9 12.1-1.9 18.2 0 45.9 35.1 83.6 80 87.7L96 480c0 17.7 14.3 32 32 32s32-14.3 32-32l0-224.4c44.9-4.1 80-41.8 80-87.7 0-6.1-.6-12.2-1.9-18.2L223.9 14.3C223.1 6.2 216.2 0 208 0s-15.1 6.2-15.9 14.4L178.5 149.9c-.6 5.7-5.4 10.1-11.1 10.1-5.8 0-10.6-4.4-11.2-10.2L143.9 14.6C143.2 6.3 136.3 0 128 0s-15.2 6.3-15.9 14.6L99.8 149.8c-.5 5.8-5.4 10.2-11.2 10.2-5.8 0-10.6-4.4-11.1-10.1L63.9 14.4zM448 0C432 0 320 32 320 176l0 112c0 35.3 28.7 64 64 64l32 0 0 128c0 17.7 14.3 32 32 32s32-14.3 32-32l0-448c0-17.7-14.3-32-32-32z"></path></svg></i>
                                <p class="font-medium">No meals logged today</p>
                                <p class="text-sm">
                                    Add meals from the Meals page or scan products
                                </p>
                                <div class="flex justify-center gap-3">
                        <a href="" class="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-all">
                            <i data-fa-i2svg=""><svg class="svg-inline--fa fa-plus" data-prefix="fas" data-icon="plus" role="img" viewBox="0 0 448 512" aria-hidden="true" data-fa-i2svg=""><path fill="currentColor" d="M256 64c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 160-160 0c-17.7 0-32 14.3-32 32s14.3 32 32 32l160 0 0 160c0 17.7 14.3 32 32 32s32-14.3 32-32l0-160 160 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-160 0 0-160z"></path></svg></i>
                            Browse Recipes
                        </a>
                        <a href="" class="nav-link inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all">
                            <i data-fa-i2svg=""><svg class="svg-inline--fa fa-barcode" data-prefix="fas" data-icon="barcode" role="img" viewBox="0 0 448 512" aria-hidden="true" data-fa-i2svg=""><path fill="currentColor" d="M32 32C14.3 32 0 46.3 0 64L0 448c0 17.7 14.3 32 32 32s32-14.3 32-32L64 64c0-17.7-14.3-32-32-32zm88 0c-13.3 0-24 10.7-24 24l0 400c0 13.3 10.7 24 24 24s24-10.7 24-24l0-400c0-13.3-10.7-24-24-24zm72 32l0 384c0 17.7 14.3 32 32 32s32-14.3 32-32l0-384c0-17.7-14.3-32-32-32s-32 14.3-32 32zm208-8l0 400c0 13.3 10.7 24 24 24s24-10.7 24-24l0-400c0-13.3-10.7-24-24-24s-24 10.7-24 24zm-96 0l0 400c0 13.3 10.7 24 24 24s24-10.7 24-24l0-400c0-13.3-10.7-24-24-24s-24 10.7-24 24z"></path></svg></i>
                            Scan Product
                        </a>
                    </div>
                            </div>`;
    } else {
        document.getElementById("clear-foodlog").style.display = "block";
        logContainer.innerHTML = htmlMarkupLog;
    }
    const htmlMarkupNut = generateNutritionStats(todayObject);
    const nutContainer = document.getElementById("nut-progress-bar");
    nutContainer.innerHTML = htmlMarkupNut;
}
updateUi();
// when the foodlog section icon is press ui function fires
document
    .querySelector(`a[data-info="foodlog-section"]`)
    .addEventListener("click", () => {
        console.log("click");
        updateUi();
    });

// create delete and delete all function
window.deleteItemById = function (id, type) {
    const today = new Date().toISOString().split("T")[0];
    const todayObject = JSON.parse(localStorage.getItem(today));
    let productObject;
    todayObject[type] = todayObject[type].filter((item) => {
        if (item.id === id) {
            productObject = item;
        }
        return item.id !== id;
    });

    console.log(productObject);
    todayObject.calories -= productObject.calories;
    todayObject.fat -= productObject.fat;
    todayObject.protein -= productObject.protein;
    todayObject.carbs -= productObject.carbs;
    localStorage.setItem(today, JSON.stringify(todayObject));
    updateUi();
};

function deleteAllItems() {
    const today = new Date().toISOString().split("T")[0];
    let todayObject = JSON.parse(localStorage.getItem(today));
    todayObject = {
        calories: 0,
        fat: 0,
        protein: 0,
        carbs: 0,
        meals: [],
        products: [],
    };
    localStorage.setItem(today, JSON.stringify(todayObject));
    updateUi();
}
document
    .getElementById("clear-foodlog")
    .addEventListener("click", deleteAllItems);
