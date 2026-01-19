export default class Meal {
    constructor(data) {
        this.data = data;
        this.modal = null;
        this.handleEscKey = this.handleEscKey.bind(this);
    }
    changingHero(herSec) {
        const herSecImage = herSec.querySelector(".hero-sec_img");
        herSecImage.src = this.data.thumbnail;
        herSecImage.setAttribute("alt", this.data.name);
        let herSecBadgesMarkup;
        if (this.data.tags) {
            herSecBadgesMarkup = this.data.tags
                .map((tag) => {
                    return `<span
                class="px-3 py-1 bg-purple-500 text-white text-sm font-semibold rounded-full">${tag}</span>`;
                })
                .join(" ");
        }
        const herSecBages = herSec.querySelector(".hero-sec_badges");
        herSecBages.innerHTML = `
        <span
            class="px-3 py-1 bg-emerald-500 text-white text-sm font-semibold rounded-full">${this.data.category}</span>
        <span
            class="px-3 py-1 bg-blue-500 text-white text-sm font-semibold rounded-full">${this.data.area}</span>
        ${herSecBadgesMarkup ? herSecBadgesMarkup : ""}
    `;
        herSec.querySelector(".hero-sec_name").innerHTML = this.data.name;
    }
    changingIngreds(ingredGrid) {
        const ingredGridCount = ingredGrid.querySelector(
            ".ingredients-grid_count",
        );
        ingredGridCount.innerHTML = `${this.data.ingredients.length} items`;
        const ingredGridGrid = ingredGrid.querySelector(
            ".ingredients-grid_grid",
        );
        const ingredGridGridHtml = this.data.ingredients
            .map((ingredient) => {
                return `<div
                        class="flex items-center gap-3 p-3 bg-gray-50 rounded-xl hover:bg-emerald-50 transition-colors">
                        <input type="checkbox"
                            class="ingredient-checkbox w-5 h-5 text-emerald-600 rounded border-gray-300" />
                        <span class="text-gray-700">
                            <span class="font-medium text-gray-900">${ingredient.measure}</span> ${ingredient.ingredient}
                        </span>
                    </div>`;
            })
            .join(" ");
        ingredGridGrid.innerHTML = ingredGridGridHtml;
    }
    changingInstractions(instructionsContainer) {
        const instructionsContainerHtml = this.data.instructions
            .map((instruction, i) => {
                return `<div class="flex gap-4 p-4 rounded-xl hover:bg-gray-50 transition-colors">
                        <div
                            class="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold shrink-0">
                            ${i + 1}
                        </div>
                        <p class="text-gray-700 leading-relaxed pt-2">
                            ${instruction}
                        </p>
                    </div>`;
            })
            .join(" ");
        instructionsContainer.innerHTML = instructionsContainerHtml;
    }
    showingYoutube() {
        document.querySelector(".youtube-video-frame").src =
            `${this.data.youtube ? this.data.youtube : `https://www.youtube.com/results?search_query=${this.data.name}`}`;
    }
    // finally the api was fixed lets work
    async analyzeNutrition() {
        const ingredientsArray = this.data.ingredients.map(
            (item) => `${item.measure} ${item.ingredient}`,
        );
        const response = await fetch(
            "https://nutriplan-api.vercel.app/api/nutrition/analyze",
            {
                method: "POST",
                headers: {
                    "x-api-key": "nQ6UIrYtBiWRaEESwWqWyISPBIxpVxvIEyUKFks1",
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    title: `${this.data.name}`,
                    ingredients: ingredientsArray,
                }),
            },
        );
        const nutritionData = await response.json();
        return nutritionData.data;
    }
    async createNutritionFactsHTML() {
        const nutritionObject = await this.analyzeNutrition();
        const perServing = nutritionObject.perServing;
        const totals = nutritionObject.totals;

        const proteinPercent = Math.min((perServing.protein / 50) * 100, 100);
        const carbsPercent = Math.min((perServing.carbs / 300) * 100, 100);
        const fatPercent = Math.min((perServing.fat / 78) * 100, 100);
        const fiberPercent = Math.min((perServing.fiber / 28) * 100, 100);
        const sugarPercent = Math.min((perServing.sugar / 50) * 100, 100);
        const saturatedFatPercent = Math.min(
            (perServing.saturatedFat / 20) * 100,
            100,
        );

        document.getElementById("nutrition-facts-container").innerHTML = `
        <div id="nutrition-facts-container">
            <p class="text-sm text-gray-500 mb-4">Per serving</p>
            
            <div class="text-center py-4 mb-4 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl">
                <p class="text-sm text-gray-600">Calories per serving</p>
                <p class="text-4xl font-bold text-emerald-600">${perServing.calories}</p>
                <p class="text-xs text-gray-500 mt-1">Total: ${totals.calories} cal</p>
            </div>
            
            <div class="space-y-4">
                <!-- Protein -->
                <div class="flex items-center justify-between">
                    <div class="flex items-center gap-2">
                        <div class="w-3 h-3 rounded-full bg-emerald-500"></div>
                        <span class="text-gray-700">Protein</span>
                    </div>
                    <span class="font-bold text-gray-900">${perServing.protein}g</span>
                </div>
                <div class="w-full bg-gray-100 rounded-full h-2">
                    <div class="bg-emerald-500 h-2 rounded-full" style="width: ${proteinPercent}%"></div>
                </div>
                
                <!-- Carbs -->
                <div class="flex items-center justify-between">
                    <div class="flex items-center gap-2">
                        <div class="w-3 h-3 rounded-full bg-blue-500"></div>
                        <span class="text-gray-700">Carbs</span>
                    </div>
                    <span class="font-bold text-gray-900">${perServing.carbs}g</span>
                </div>
                <div class="w-full bg-gray-100 rounded-full h-2">
                    <div class="bg-blue-500 h-2 rounded-full" style="width: ${carbsPercent}%"></div>
                </div>
                
                <!-- Fat -->
                <div class="flex items-center justify-between">
                    <div class="flex items-center gap-2">
                        <div class="w-3 h-3 rounded-full bg-purple-500"></div>
                        <span class="text-gray-700">Fat</span>
                    </div>
                    <span class="font-bold text-gray-900">${perServing.fat}g</span>
                </div>
                <div class="w-full bg-gray-100 rounded-full h-2">
                    <div class="bg-purple-500 h-2 rounded-full" style="width: ${fatPercent}%"></div>
                </div>
                
                <!-- Fiber -->
                <div class="flex items-center justify-between">
                    <div class="flex items-center gap-2">
                        <div class="w-3 h-3 rounded-full bg-orange-500"></div>
                        <span class="text-gray-700">Fiber</span>
                    </div>
                    <span class="font-bold text-gray-900">${perServing.fiber}g</span>
                </div>
                <div class="w-full bg-gray-100 rounded-full h-2">
                    <div class="bg-orange-500 h-2 rounded-full" style="width: ${fiberPercent}%"></div>
                </div>
                
                <!-- Sugar -->
                <div class="flex items-center justify-between">
                    <div class="flex items-center gap-2">
                        <div class="w-3 h-3 rounded-full bg-pink-500"></div>
                        <span class="text-gray-700">Sugar</span>
                    </div>
                    <span class="font-bold text-gray-900">${perServing.sugar}g</span>
                </div>
                <div class="w-full bg-gray-100 rounded-full h-2">
                    <div class="bg-pink-500 h-2 rounded-full" style="width: ${sugarPercent}%"></div>
                </div>
                
                <!-- Saturated Fat -->
                <div class="flex items-center justify-between">
                    <div class="flex items-center gap-2">
                        <div class="w-3 h-3 rounded-full bg-red-500"></div>
                        <span class="text-gray-700">Saturated Fat</span>
                    </div>
                    <span class="font-bold text-gray-900">${perServing.saturatedFat}g</span>
                </div>
                <div class="w-full bg-gray-100 rounded-full h-2">
                    <div class="bg-red-500 h-2 rounded-full" style="width: ${saturatedFatPercent}%"></div>
                </div>
            </div>
            
            <!-- Other Nutrients -->
            <div class="mt-6 pt-6 border-t border-gray-100">
                <h3 class="text-sm font-semibold text-gray-900 mb-3">Other</h3>
                <div class="grid grid-cols-2 gap-3 text-sm">
                    <div class="flex justify-between">
                        <span class="text-gray-600">Cholesterol</span>
                        <span class="font-medium">${perServing.cholesterol}mg</span>
                    </div>
                    <div class="flex justify-between">
                        <span class="text-gray-600">Sodium</span>
                        <span class="font-medium">${perServing.sodium}mg</span>
                    </div>
                </div>
            </div>
        </div>
    `;
        document.getElementById("hero-servings").innerHTML =
            `${nutritionObject.servings} servings`;
        document.getElementById("hero-calories").innerHTML =
            `${perServing.calories} cal/serving`;
        document.getElementById("meal-action-buttons").innerHTML =
            `<button id="log-meal-btn"
                            class="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-all"
                            data-meal-id="${this.data.id}">
                            <i class="fa-solid fa-clipboard-list"></i>
                            <span>Log This Meal</span>
                        </button>`;
        const logButton = document.getElementById("log-meal-btn");
        logButton.addEventListener("click", () =>
            this.showModal(perServing, this.data),
        );
    }

    createModalHTML(dataObject, mealData) {
        return `
        <div class="fixed inset-0 bg-black/50 flex items-center justify-center z-50" id="log-meal-modal">
            <div class="bg-white rounded-2xl p-6 max-w-md w-full mx-4">
                <div class="flex items-center gap-4 mb-6">
                    <img src="${mealData.thumbnail}" alt="${mealData.name}" class="w-16 h-16 rounded-xl object-cover">
                    <div>
                        <h3 class="text-xl font-bold text-gray-900">Log This Meal</h3>
                        <p class="text-gray-500 text-sm meal-name">${mealData.name}</p>
                    </div>
                </div>
                
                <div class="mb-6">
                    <label class="block text-sm font-semibold text-gray-700 mb-2">Number of Servings</label>
                    <div class="flex items-center gap-3">
                        <button id="decrease-servings" class="w-10 h-10 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center">
                            <svg class="w-5 h-5 text-gray-600" fill="currentColor" viewBox="0 0 448 512">
                                <path d="M0 256c0-17.7 14.3-32 32-32l384 0c17.7 0 32 14.3 32 32s-14.3 32-32 32L32 288c-17.7 0-32-14.3-32-32z"/>
                            </svg>
                        </button>
                        <input type="number" id="meal-servings" value="1" min="0.5" max="10" step="0.5" class="w-20 text-center text-xl font-bold border-2 border-gray-200 rounded-lg py-2">
                        <button id="increase-servings" class="w-10 h-10 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center">
                            <svg class="w-5 h-5 text-gray-600" fill="currentColor" viewBox="0 0 448 512">
                                <path d="M256 64c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 160-160 0c-17.7 0-32 14.3-32 32s14.3 32 32 32l160 0 0 160c0 17.7 14.3 32 32 32s32-14.3 32-32l0-160 160 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-160 0 0-160z"/>
                            </svg>
                        </button>
                    </div>
                </div>
                
                <div class="bg-emerald-50 rounded-xl p-4 mb-6">
                    <p class="text-sm text-gray-600 mb-2">Estimated nutrition <strong>per serving</strong>:</p>
                    <div class="grid grid-cols-4 gap-2 text-center">
                        <div>
                            <p class="text-lg font-bold text-emerald-600" id="modal-calories">${dataObject.calories}</p>
                            <p class="text-xs text-gray-500">Calories</p>
                        </div>
                        <div>
                            <p class="text-lg font-bold text-blue-600" id="modal-protein">${dataObject.protein}g</p>
                            <p class="text-xs text-gray-500">Protein</p>
                        </div>
                        <div>
                            <p class="text-lg font-bold text-amber-600" id="modal-carbs">${dataObject.carbs}g</p>
                            <p class="text-xs text-gray-500">Carbs</p>
                        </div>
                        <div>
                            <p class="text-lg font-bold text-purple-600" id="modal-fat">${dataObject.fat}g</p>
                            <p class="text-xs text-gray-500">Fat</p>
                        </div>
                    </div>
                </div>
                
                <div class="flex gap-3">
                    <button id="cancel-log-meal" class="flex-1 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-all">
                        Cancel
                    </button>
                    <button id="confirm-log-meal" class="flex-1 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-all">
                        <i class="mr-2" data-fa-i2svg=""><svg class="svg-inline--fa fa-clipboard-list" data-prefix="fas" data-icon="clipboard-list" role="img" viewBox="0 0 384 512" aria-hidden="true" data-fa-i2svg=""><path fill="currentColor" d="M311.4 32l8.6 0c35.3 0 64 28.7 64 64l0 352c0 35.3-28.7 64-64 64L64 512c-35.3 0-64-28.7-64-64L0 96C0 60.7 28.7 32 64 32l8.6 0C83.6 12.9 104.3 0 128 0L256 0c23.7 0 44.4 12.9 55.4 32zM248 112c13.3 0 24-10.7 24-24s-10.7-24-24-24L136 64c-13.3 0-24 10.7-24 24s10.7 24 24 24l112 0zM128 256a32 32 0 1 0 -64 0 32 32 0 1 0 64 0zm32 0c0 13.3 10.7 24 24 24l112 0c13.3 0 24-10.7 24-24s-10.7-24-24-24l-112 0c-13.3 0-24 10.7-24 24zm0 128c0 13.3 10.7 24 24 24l112 0c13.3 0 24-10.7 24-24s-10.7-24-24-24l-112 0c-13.3 0-24 10.7-24 24zM96 416a32 32 0 1 0 0-64 32 32 0 1 0 0 64z"></path></svg></i>
                        Log Meal
                    </button>
                </div>
            </div>
        </div>
    `;
    }

    // Show modal
    showModal(dataObject, mealData) {
        // Close existing modal if any
        this.closeModal();

        // Create and insert modal
        const modalHTML = this.createModalHTML(dataObject, mealData);
        document.body.insertAdjacentHTML("beforeend", modalHTML);

        // Get modal element
        this.modal = document.getElementById("log-meal-modal");

        // Add event listeners
        this.attachModalEventListeners();
    }

    // Attach event listeners
    attachModalEventListeners() {
        if (!this.modal) return;

        // Close buttons
        const closeButton = this.modal.querySelector("#cancel-log-meal");
        closeButton.addEventListener("click", () => this.closeModal());

        // Click outside to close
        this.modal.addEventListener("click", (e) => {
            if (e.target === this.modal) {
                this.closeModal();
            }
        });

        // increase and decrease buttons
        const servingArea = this.modal.querySelector("#meal-servings");
        const increase = this.modal.querySelector("#increase-servings");
        increase.addEventListener("click", () => {
            servingArea.stepUp();
        });
        const decrease = this.modal.querySelector("#decrease-servings");
        decrease.addEventListener("click", () => {
            servingArea.stepdown();
        });

        // give log button magggiiiccc
        console.log();
        this.modal
            .querySelector("#confirm-log-meal")
            .addEventListener("click", () => this.updateLocalStorage());

        // ESC key to close
        document.addEventListener("keydown", this.handleEscKey);
    }

    // Handle ESC key
    handleEscKey(e) {
        if (e.key === "Escape") {
            this.closeModal();
        }
    }

    // Close modal
    closeModal() {
        if (this.modal) {
            this.modal.remove();
            this.modal = null;
            document.removeEventListener("keydown", this.handleEscKey);
        }
    }

    // return object for local storage
    returnMealObject() {
        const timeNow = new Date();
        const hourNow = timeNow.getHours();
        const minutesNow = timeNow.getMinutes();
        const serving =
            parseFloat(this.modal.querySelector("#meal-servings").value) || 1;
        const mealObject = {
            id: Date.now(),
            pictureSrc: this.modal.querySelector("img").getAttribute("src"),
            name: this.modal.querySelector(".meal-name").textContent,
            serving: serving,
            calories:
                serving *
                parseInt(
                    this.modal.querySelector("#modal-calories").textContent,
                ),
            protein:
                serving *
                parseFloat(
                    this.modal.querySelector("#modal-protein").textContent,
                ),
            carbs:
                serving *
                parseFloat(
                    this.modal.querySelector("#modal-carbs").textContent,
                ),
            fat:
                serving *
                parseFloat(this.modal.querySelector("#modal-fat").textContent),
            hour: hourNow,
            minute: minutesNow,
        };
        this.closeModal();
        return mealObject;
    }
    updateLocalStorage() {
        const mealObject = this.returnMealObject();
        let todayDate = new Date();
        todayDate = todayDate.toISOString().split("T")[0];
        const todayObject = JSON.parse(localStorage.getItem(todayDate));
        todayObject.meals.push(mealObject);
        todayObject.calories += mealObject.calories;
        todayObject.fat += mealObject.fat;
        todayObject.protein += mealObject.protein;
        todayObject.carbs += mealObject.carbs;
        localStorage.setItem(todayDate, JSON.stringify(todayObject));
        document.getElementById("cal-count").innerHTML =
            `${todayObject.calories} kcal`;
        this.updateUi();
    }
    // ai generated html markup

    generateDailyLogHTML() {
        const today = new Date().toISOString().split("T")[0];
        this.logData = JSON.parse(localStorage.getItem(today)) || {
            products: [],
            meals: [],
        };
        if (
            this.logData.products.length === 0 &&
            this.logData.meals.length === 0
        ) {
            return 0;
        }
        // Combine all items with type for easy handling
        const items = [
            ...this.logData.products.map((p) => ({ ...p, type: "product" })),
            ...this.logData.meals.map((m) => ({ ...m, type: "meal" })), // adjust if your meals are stored differently
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
        const cards = items.map((item, index) => {
            const timeStr = formatTime(item.hour, item.minute);
            const calories = Math.round(item.calories); // or total if per-serving
            const protein = item.protein?.toFixed(1) || "0";
            const carbs = item.carbs?.toFixed(1) || "0";
            const fat = item.fat?.toFixed(1) || "0";

            if (item.type === "meal") {
                // Meal card
                const servings = item.servings || 1;
                const imageSrc =
                    item.pictureSrc ||
                    "https://www.themealdb.com/images/media/meals/placeholder.jpg"; // fallback
                return `
<div class="flex items-center justify-between bg-gray-50 rounded-xl p-4 hover:bg-gray-100 transition-all">
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
        <button class="remove-foodlog-item text-gray-400 hover:text-red-500 transition-all p-2" data-index="${index}" data-type="meal">
            <i class="fa-solid fa-trash-can"></i>
        </button>
    </div>
</div>`;
            } else {
                // Product card
                const brand = item.brand || "Unknown";
                return `
<div class="flex items-center justify-between bg-gray-50 rounded-xl p-4 hover:bg-gray-100 transition-all">
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
        <button class="remove-foodlog-item text-gray-400 hover:text-red-500 transition-all p-2" data-index="${index}" data-type="product">
            <i class="fa-solid fa-trash-can"></i>
        </button>
    </div>
</div>`;
            }
        });

        return cards.join(""); // Concatenate all cards into one string
    }
    updateUi() {
        const htmlMarkup = this.generateDailyLogHTML();
        const container = document.getElementById("logged-items-list");
        if (htmlMarkup) {
            container.innerHTML = htmlMarkup;
        } else {
            container.innerHTML = `<div class="text-center py-8 text-gray-500">
                                <i class="mb-3 text-4xl text-gray-300" data-fa-i2svg=""><svg class="svg-inline--fa fa-utensils" data-prefix="fas" data-icon="utensils" role="img" viewBox="0 0 512 512" aria-hidden="true" data-fa-i2svg=""><path fill="currentColor" d="M63.9 14.4C63.1 6.2 56.2 0 48 0s-15.1 6.2-16 14.3L17.9 149.7c-1.3 6-1.9 12.1-1.9 18.2 0 45.9 35.1 83.6 80 87.7L96 480c0 17.7 14.3 32 32 32s32-14.3 32-32l0-224.4c44.9-4.1 80-41.8 80-87.7 0-6.1-.6-12.2-1.9-18.2L223.9 14.3C223.1 6.2 216.2 0 208 0s-15.1 6.2-15.9 14.4L178.5 149.9c-.6 5.7-5.4 10.1-11.1 10.1-5.8 0-10.6-4.4-11.2-10.2L143.9 14.6C143.2 6.3 136.3 0 128 0s-15.2 6.3-15.9 14.6L99.8 149.8c-.5 5.8-5.4 10.2-11.2 10.2-5.8 0-10.6-4.4-11.1-10.1L63.9 14.4zM448 0C432 0 320 32 320 176l0 112c0 35.3 28.7 64 64 64l32 0 0 128c0 17.7 14.3 32 32 32s32-14.3 32-32l0-448c0-17.7-14.3-32-32-32z"></path></svg></i>
                                <p class="font-medium">No meals logged today</p>
                                <p class="text-sm">
                                    Add meals from the Meals page or scan products
                                </p>
                            </div>`;
        }
        const itemsNumber =
            this.logData.meals.length + this.logData.products.length;
        document.getElementById("logged-items-count").innerHTML =
            `Logged Items (${itemsNumber})
        `;
        document.getElementById("items-count").innerHTML =
            `${itemsNumber} items`;
    }
}
