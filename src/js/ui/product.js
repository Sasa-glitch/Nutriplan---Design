export default class Product {
    constructor(value, method = "search") {
        this.value = value;
        this.method = method;
        this.data;
        this.modal = null;
        this.handleEscKey = this.handleEscKey.bind(this);
        this.logData = {
            products: [],
            meals: [],
        };
    }
    generateApi() {
        console.log("Firedd");
        console.log(this.value);
        if (this.method === "barcode") {
            return `https://nutriplan-api.vercel.app/api/products/barcode/${this.value}`;
        } else if (this.method === "category") {
            return `https://nutriplan-api.vercel.app/api/products/category/${this.value}`;
        } else {
            return `https://nutriplan-api.vercel.app/api/products/search?q=${this.value}&page=1&limit=24`;
        }
    }
    async fetchData() {
        const respone = await fetch(this.generateApi());
        const data = await respone.json();
        console.log(data);
        if (this.method === "barcode") {
            this.data = data.result;
            return this.data;
        } else {
            this.data = data.results;
            return this.data;
        }
    }
    createProductCard(dataObject) {
        // Helper function to get Nutri-Score color
        const getNutriScoreColor = (score) => {
            const colors = {
                a: "bg-green-500",
                b: "bg-lime-500",
                c: "bg-yellow-500",
                d: "bg-orange-500",
                e: "bg-red-500",
            };
            return colors[score?.toLowerCase()] || "bg-gray-500";
        };

        // Helper function to get NOVA color
        const getNovaColor = (nova) => {
            const colors = {
                1: "bg-green-500",
                2: "bg-yellow-500",
                3: "bg-orange-500",
                4: "bg-red-500",
            };
            return colors[nova?.toString()] || "bg-gray-500";
        };

        return `
        <div class="product-card bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all cursor-pointer group"
            data-barcode="${dataObject.barcode || ""}" data-grade="${"none" && dataObject.nutritionGrade}">
            <div class="relative h-40 bg-gray-100 flex items-center justify-center overflow-hidden">
                <img class="w-full h-full object-contain group-hover:scale-110 transition-transform duration-300"
                    src="${dataObject.image || ""}"
                    alt="${dataObject.name || "Product"}" loading="lazy"
                    onerror="this.onerror=null; this.parentElement.innerHTML='&lt;div class=\'w-16 h-16 bg-gray-200 rounded-xl flex items-center justify-center\'&gt;&lt;i class=\'fa-solid fa-box text-gray-400 text-2xl\'&gt;&lt;/i&gt;&lt;/div&gt;'">
                <!-- Nutri-Score Badge -->
                ${
                    dataObject.nutritionGrade
                        ? `
                <div class="absolute top-2 left-2 ${getNutriScoreColor(dataObject.nutritionGrade)} text-white text-xs font-bold px-2 py-1 rounded uppercase">
                    Nutri-Score ${dataObject.nutritionGrade.toUpperCase()}
                </div>
                `
                        : ""
                }
                <!-- NOVA Badge -->
                ${
                    dataObject.novaGroup
                        ? `
                <div class="absolute top-2 right-2 ${getNovaColor(dataObject.novaGroup)} text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center"
                    title="NOVA ${dataObject.novaGroup}">
                    ${dataObject.novaGroup}
                </div>
                `
                        : ""
                }
            </div>
            <div class="p-4">
                <p class="text-xs text-emerald-600 font-semibold mb-1 truncate">${dataObject.brand || "Unknown Brand"}</p>
                <h3 class="font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-emerald-600 transition-colors">
                    ${dataObject.name || "Unknown Product"}
                </h3>
                <!-- Mini Nutrition -->
                <div class="grid grid-cols-4 gap-1 text-center">
                    <div class="bg-emerald-50 rounded p-1.5">
                        <p class="text-xs font-bold text-emerald-700">${dataObject.nutrients?.protein || "0"}g</p>
                        <p class="text-[10px] text-gray-500">Protein</p>
                    </div>
                    <div class="bg-blue-50 rounded p-1.5">
                        <p class="text-xs font-bold text-blue-700">${dataObject.nutrients?.carbs || "0"}g</p>
                        <p class="text-[10px] text-gray-500">Carbs</p>
                    </div>
                    <div class="bg-purple-50 rounded p-1.5">
                        <p class="text-xs font-bold text-purple-700">${dataObject.nutrients?.fat || "0"}g</p>
                        <p class="text-[10px] text-gray-500">Fat</p>
                    </div>
                    <div class="bg-orange-50 rounded p-1.5">
                        <p class="text-xs font-bold text-orange-700">${dataObject.nutrients?.sugar || "0"}g</p>
                        <p class="text-[10px] text-gray-500">Sugar</p>
                    </div>
                </div>
            </div>
        </div>
    `;
    }
    populateGrid(data, grid) {
        if (Array.isArray(data)) {
            const htmlMarkup = data.map((dataObject) => {
                return this.createProductCard(dataObject);
            });
            grid.innerHTML = htmlMarkup.join(" ");
            data.forEach((dataObject) => {
                document
                    .querySelector(`div[data-barcode="${dataObject.barcode}"]`)
                    .addEventListener("click", () =>
                        this.showModal(dataObject),
                    );
            });
        } else {
            grid.innerHTML = this.createProductCard(data);
            document
                .querySelector(`div[data-barcode="${data.barcode}"]`)
                .addEventListener("click", () => this.showModal(data));
        }
    }
    getNutriScoreInfo(grade) {
        const info = {
            a: { color: "#038141", bg: "#03814120", label: "Excellent" },
            b: { color: "#85bb2f", bg: "#85bb2f20", label: "Good" },
            c: { color: "#fecb02", bg: "#fecb0220", label: "Fair" },
            d: { color: "#ee8100", bg: "#ee810020", label: "Poor" },
            e: { color: "#e63e11", bg: "#e63e1120", label: "Bad" },
        };
        return info[grade?.toLowerCase()] || info["e"];
    }

    // Helper function to get NOVA info
    getNovaInfo(group) {
        const info = {
            1: { color: "#038141", bg: "#03814120", label: "Unprocessed" },
            2: { color: "#85bb2f", bg: "#85bb2f20", label: "Processed" },
            3: { color: "#ee8100", bg: "#ee810020", label: "Processed" },
            4: { color: "#e63e11", bg: "#e63e1120", label: "Ultra-processed" },
        };
        return info[group?.toString()] || info["4"];
    }

    createModalHTML(dataObject) {
        // Calculate percentages for progress bars (out of 100g total)
        const totalMacros =
            (dataObject.nutrients?.protein || 0) +
            (dataObject.nutrients?.carbs || 0) +
            (dataObject.nutrients?.fat || 0);

        const proteinPercent =
            totalMacros > 0
                ? ((dataObject.nutrients?.protein || 0) / totalMacros) * 100
                : 0;
        const carbsPercent =
            totalMacros > 0
                ? ((dataObject.nutrients?.carbs || 0) / totalMacros) * 100
                : 0;
        const fatPercent =
            totalMacros > 0
                ? ((dataObject.nutrients?.fat || 0) / totalMacros) * 100
                : 0;
        const sugarPercent =
            (dataObject.nutrients?.carbs || 0) > 0
                ? ((dataObject.nutrients?.sugar || 0) /
                      (dataObject.nutrients?.carbs || 1)) *
                  100
                : 0;

        const nutriScore = this.getNutriScoreInfo(dataObject.nutritionGrade);
        const nova = this.getNovaInfo(dataObject.novaGroup);

        return `
        <div class="fixed inset-0 bg-black/50 flex items-center justify-center z-50" id="product-detail-modal">
            <div class="bg-white rounded-2xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
                <div class="p-6">
                    <!-- Header -->
                    <div class="flex items-start gap-6 mb-6">
                        <div class="w-32 h-32 bg-gray-100 rounded-xl flex items-center justify-center overflow-hidden flex-shrink-0">
                            <img src="${dataObject.image || ""}"
                                alt="${dataObject.name || "Product"}" 
                                class="w-full h-full object-contain"
                                onerror="this.onerror=null; this.parentElement.innerHTML='<i class=\'fa-solid fa-box text-gray-400 text-5xl\'></i>'">
                        </div>
                        <div class="flex-1">
                            <p class="text-sm text-emerald-600 font-semibold mb-1">${dataObject.brand || "Unknown Brand"}</p>
                            <h2 class="text-2xl font-bold text-gray-900 mb-2">${dataObject.name || "Unknown Product"}</h2>

                            <div class="flex items-center gap-3">
                                <!-- Nutri-Score Badge -->
                                ${
                                    dataObject.nutritionGrade
                                        ? `
                                <div class="flex items-center gap-2 px-3 py-1.5 rounded-lg" style="background-color: ${nutriScore.bg}">
                                    <span class="w-8 h-8 rounded flex items-center justify-center text-white font-bold" style="background-color: ${nutriScore.color}">
                                        ${dataObject.nutritionGrade.toUpperCase()}
                                    </span>
                                    <div>
                                        <p class="text-xs font-bold" style="color: ${nutriScore.color}">Nutri-Score</p>
                                        <p class="text-[10px] text-gray-600">${nutriScore.label}</p>
                                    </div>
                                </div>
                                `
                                        : ""
                                }

                                <!-- NOVA Badge -->
                                ${
                                    dataObject.novaGroup
                                        ? `
                                <div class="flex items-center gap-2 px-3 py-1.5 rounded-lg" style="background-color: ${nova.bg}">
                                    <span class="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold" style="background-color: ${nova.color}">
                                        ${dataObject.novaGroup}
                                    </span>
                                    <div>
                                        <p class="text-xs font-bold" style="color: ${nova.color}">NOVA</p>
                                        <p class="text-[10px] text-gray-600">${nova.label}</p>
                                    </div>
                                </div>
                                `
                                        : ""
                                }
                            </div>
                        </div>
                        <button class="close-product-modal text-gray-400 hover:text-gray-600">
                            <i class="fa-solid fa-xmark text-2xl"></i>
                        </button>
                    </div>

                    <!-- Nutrition Facts -->
                    <div class="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl p-5 mb-6 border border-emerald-200">
                        <h3 class="font-bold text-gray-900 mb-4 flex items-center gap-2">
                            <i class="fa-solid fa-chart-pie text-emerald-600"></i>
                            Nutrition Facts
                        </h3>

                        <div class="text-center mb-4 pb-4 border-b border-emerald-200">
                            <p class="text-4xl font-bold text-gray-900">${dataObject.nutrients?.calories || 0}</p>
                            <p class="text-sm text-gray-500">Calories</p>
                        </div>

                        <div class="grid grid-cols-4 gap-4">
                            <div class="text-center">
                                <div class="w-full bg-gray-200 rounded-full h-2 mb-2">
                                    <div class="bg-emerald-500 h-2 rounded-full" style="width: ${proteinPercent}%"></div>
                                </div>
                                <p class="text-lg font-bold text-emerald-600">${dataObject.nutrients?.protein || 0}g</p>
                                <p class="text-xs text-gray-500">Protein</p>
                            </div>
                            <div class="text-center">
                                <div class="w-full bg-gray-200 rounded-full h-2 mb-2">
                                    <div class="bg-blue-500 h-2 rounded-full" style="width: ${carbsPercent}%"></div>
                                </div>
                                <p class="text-lg font-bold text-blue-600">${dataObject.nutrients?.carbs || 0}g</p>
                                <p class="text-xs text-gray-500">Carbs</p>
                            </div>
                            <div class="text-center">
                                <div class="w-full bg-gray-200 rounded-full h-2 mb-2">
                                    <div class="bg-purple-500 h-2 rounded-full" style="width: ${fatPercent}%"></div>
                                </div>
                                <p class="text-lg font-bold text-purple-600">${dataObject.nutrients?.fat || 0}g</p>
                                <p class="text-xs text-gray-500">Fat</p>
                            </div>
                            <div class="text-center">
                                <div class="w-full bg-gray-200 rounded-full h-2 mb-2">
                                    <div class="bg-orange-500 h-2 rounded-full" style="width: ${sugarPercent}%"></div>
                                </div>
                                <p class="text-lg font-bold text-orange-600">${dataObject.nutrients?.sugar || 0}g</p>
                                <p class="text-xs text-gray-500">Sugar</p>
                            </div>
                        </div>

                        <div class="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-emerald-200">
                            <div class="text-center">
                                <p class="text-sm font-semibold text-gray-900">${dataObject.nutrients?.saturatedFat || 0}g</p>
                                <p class="text-xs text-gray-500">Saturated Fat</p>
                            </div>
                            <div class="text-center">
                                <p class="text-sm font-semibold text-gray-900">${dataObject.nutrients?.fiber || 0}g</p>
                                <p class="text-xs text-gray-500">Fiber</p>
                            </div>
                        </div>
                    </div>

                    <!-- Actions -->
                    <div class="flex gap-3">
                        <button class="add-product-to-log flex-1 py-3 bg-emerald-600 text-white rounded-xl font-semibold hover:bg-emerald-700 transition-all"
                            data-barcode="${dataObject.barcode || ""}">
                            <i class="fa-solid fa-plus mr-2"></i>Log This Food
                        </button>
                        <button class="close-product-modal flex-1 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-all">
                            Close
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
    }

    // Show modal
    showModal(dataObject) {
        // Close existing modal if any
        this.closeModal();

        // Create and insert modal
        const modalHTML = this.createModalHTML(dataObject);
        document.body.insertAdjacentHTML("beforeend", modalHTML);

        // Get modal element
        this.modal = document.getElementById("product-detail-modal");

        // Add event listeners
        this.attachModalEventListeners();
    }

    // Attach event listeners
    attachModalEventListeners() {
        if (!this.modal) return;

        // Close buttons
        const closeButtons = this.modal.querySelectorAll(
            ".close-product-modal",
        );
        closeButtons.forEach((btn) => {
            btn.addEventListener("click", () => this.closeModal());
        });

        // Click outside to close
        this.modal.addEventListener("click", (e) => {
            if (e.target === this.modal) {
                this.closeModal();
            }
        });

        // ESC key to close
        document.addEventListener("keydown", this.handleEscKey);

        // product logg poweeerrr
        this.modal
            .querySelector(".add-product-to-log")
            .addEventListener("click", () => this.updateLocalStorage());
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

    // handelign lof=g
    returnProductObject() {
        const timeNow = new Date();
        const hourNow = timeNow.getHours();
        const minutesNow = timeNow.getMinutes();
        const nutritionGrid = this.modal.querySelectorAll(
            ".grid.grid-cols-4 > div.text-center",
        );
        const productObject = {
            id: Date.now(),
            pictureSrc: this.modal.querySelector("img").getAttribute("src"),
            name: this.modal.querySelector("h2").textContent.trim(),
            brand: this.modal
                .querySelector("p.text-emerald-600.font-semibold")
                .textContent.trim(),
            calories:
                parseInt(
                    this.modal
                        .querySelector(".text-4xl.font-bold")
                        .textContent.trim(),
                    10,
                ) || 0,
            protein:
                parseFloat(
                    nutritionGrid[0]
                        .querySelector("p.text-lg.font-bold")
                        .textContent.replace("g", "")
                        .trim(),
                ) || 0,
            carbs:
                parseFloat(
                    nutritionGrid[1]
                        .querySelector("p.text-lg.font-bold")
                        .textContent.replace("g", "")
                        .trim(),
                ) || 0,
            fat:
                parseFloat(
                    nutritionGrid[2]
                        .querySelector("p.text-lg.font-bold")
                        .textContent.replace("g", "")
                        .trim(),
                ) || 0,
            hour: hourNow,
            minute: minutesNow,
        };
        this.closeModal();
        return productObject;
    }
    updateLocalStorage() {
        const productObject = this.returnProductObject();
        console.log(productObject);
        let todayDate = new Date();
        todayDate = todayDate.toISOString().split("T")[0];
        const todayObject = JSON.parse(localStorage.getItem(todayDate));
        todayObject.calories += productObject.calories;
        todayObject.fat += productObject.fat;
        todayObject.protein += productObject.protein;
        todayObject.carbs += productObject.carbs;
        todayObject.products.push(productObject);
        localStorage.setItem(todayDate, JSON.stringify(todayObject));
    }
}
