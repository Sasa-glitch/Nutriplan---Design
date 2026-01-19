export default class Menu {
    constructor(method, target, value, container) {
        this.method = method;
        this.target = target;
        this.value = value;
        this.container = container;
    }
    generateApi() {
        return `
            https://nutriplan-api.vercel.app/api/meals/${this.method}?${
                this.target
            }=${this.value}${this.method == "random" ? "" : "&page=1&limit=25"}
        `;
    }
    generateIdApi(id) {
        return `https://nutriplan-api.vercel.app/api/meals/${id}`;
    }
    async generateMeal(id) {
        const mealApiLink = this.generateIdApi(id);
        const response = await fetch(mealApiLink);
        const data = await response.json();
        return data.result;
    }
    async generateMenu() {
        const apiLink = this.generateApi();
        const response = await fetch(apiLink);
        const data = await response.json();
        return data.results;
    }
    async populateMenu() {
        const menuRecipes = await this.generateMenu();
        const htmlMarkup = menuRecipes.map((recipe) => {
            return `
                <div class="recipe-card bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all cursor-pointer group"
                    data-meal-id="${recipe.id}">
                    <div class="img-container relative overflow-hidden h-48">
                        <img class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                            src="${recipe.thumbnail}"
                            alt="${recipe.name}" loading="lazy" />
                        <div class="absolute bottom-3 left-3 flex gap-2 top-badge">
                            <span
                                class="px-2 py-1 bg-white/90 backdrop-blur-sm text-xs font-semibold rounded-full text-gray-700">
                                ${recipe.category}
                            </span>
                            <span
                                class="px-2 py-1 bg-emerald-500 text-xs font-semibold rounded-full text-white">
                                ${recipe.area}
                            </span>
                        </div>
                    </div>
                    <div class="p-4">
                        <h3
                            class="text-base font-bold text-gray-900 mb-1 group-hover:text-emerald-600 transition-colors line-clamp-1">
                            ${recipe.name}
                        </h3>
                        <p class="text-xs text-gray-600 mb-3 line-clamp-2">
                            ${recipe.instructions}
                        </p>
                        <div class="flex items-center justify-between text-xs">
                            <span class="font-semibold text-gray-900">
                                <i class="fa-solid fa-utensils text-emerald-600 mr-1"></i>
                                ${recipe.category}
                            </span>
                            <span class="font-semibold text-gray-500">
                                <i class="fa-solid fa-globe text-blue-500 mr-1"></i>
                                ${recipe.area}
                            </span>
                        </div>
                    </div>
                </div>
            `;
        });
        this.container.innerHTML = htmlMarkup.join(" ");
    }
}
