// DATA TIL HVER SIDE
const mekanikerData = [
  { name: "Diagnosticering", price: 1000 },
  { name: "Topstykke", price: 450 },
  { name: "Bundkar", price: 112 },
  { name: "Krumtap", price: 600 },
  { name: "Luftfilter", price: 37 },
  { name: "Oliefilter", price: 30 },
  { name: "Vandpumpe", price: 150 },
  { name: "Pakningssæt", price: 187 },
  { name: "Tandem", price: 90 },
  { name: "Knastaksel", price: 375 },
  { name: "Køler", price: 225 },
  { name: "Ventilvippearme", price: 300 },
  { name: "Tændrør", price: 375 },
  { name: "Stempler", price: 187 },
  { name: "Brændstofindsp", price: 150 },
  { name: "Dæk & Fælg", price: 150 },
  { name: "Bagklap & motorhjelm", price: 600 },
  { name: "Bildør For & Bag", price: 600 },
  { name: "Reserverdele tier A", price: 33750 },
  { name: "Reserverdele tier B", price: 15625 },
  { name: "Reserverdele tier C", price: 9375 },
  { name: "Reserverdele tier D", price: 125 },
  { name: "Reserverdele tier S", price: 84375 },
  { name: "Kørsels Tillæg", price: 1000 }
];

const materialerData = [
  { name: "Fjederstål", price: 338 },
  { name: "Smøremiddel Base", price: 90 },
  { name: "Plastik", price: 675 },
  { name: "Aluminium", price: 338 },
  { name: "Gummi", price: 113 },
  { name: "Bolte", price: 90 },
  { name: "Skruer", price: 158 },
  { name: "Ballistisk Stof", price: 113 },
  { name: "Loddepakke", price: 338 },
  { name: "Ledningsrulle", price: 675 },
  { name: "Metalisk Skrot ", price: 90 },
  { name: "Hærdet Stål", price: 338 },
  { name: "Kredsløb", price: 158 },
  { name: "Tekstil", price: 113 },
  { name: "Klud", price: 113 },
  { name: "Træ", price: 90 },
  { name: "Aluminiumplade", price: 338 },
  { name: "Lockpick", price: 158 },
  { name: "Krudt", price: 113 },
  { name: "Krudt (Høj ladning)", price: 113 },
  { name: "Batteri Pakke", price: 90 },
  { name: "Refineret Jern", price: 113 }
];

const ammoData = [
  { name: "Hylster 9mm", price: 555 },
  { name: "Hylster Magnum", price: 90 },
  { name: "Hylster .50 AE", price: 555 },
  { name: "Hylster .45 ACP", price: 555 },
  { name: "Kugle 9mm", price: 845 },
  { name: "Kugle Magnum", price: 555 },
  { name: "Kugle .50 AE", price: 555 },
  { name: "Kugle .45 ACP", price: 113 }
];

const fiskiData = [
  { name: "Laks", price: 338 },
  { name: "Blåfinnet", price: 675 },
  { name: "Sild", price: 90 },
  { name: "Søtunge", price: 338 },
  { name: "Rødspætte", price: 158 },
  { name: "Ørrede", price: 113 },
  { name: "Torsk", price: 113 },
  { name: "Makrel", price: 90 }
];

// GENERER ITEMS AUTOMATISK
function createItems(containerId, dataArray) {
  const container = document.getElementById(containerId);

  dataArray.forEach(item => {
    const div = document.createElement("div");
    div.className = "item";

    div.innerHTML = `
      <div class="item-left">
        <label class="custom-checkbox">
            <input type="checkbox" class="item-check" data-price="${item.price}">
            <span class="checkmark"></span>
        </label>
        <span class="item-name">${item.name}</span>
      </div>

      <div class="item-right">
        <div class="item-price">${item.price} kr</div>
        <input type="number" class="qty-input" value="1" min="1" disabled>
      </div>
    `;

    container.appendChild(div);
  });
}

// Byg alle sider
createItems("mekaniker-items", mekanikerData);
createItems("materialer-items", materialerData);
createItems("ammo-items", ammoData);
createItems("fiski-items", fiskiData);

// TOTAL-BEREGNING
function updateTotal() {
  let total = 0;

  document.querySelectorAll(".item").forEach(item => {
    const chk = item.querySelector(".item-check");
    const qty = item.querySelector(".qty-input");

    if (chk.checked) {
      total += Number(chk.dataset.price) * Number(qty.value);
    }
  });

  document.getElementById("total").textContent = total + " kr";
}

// AKTIVER/DEAKTIVER ANTAL + OPDATER TOTAL
document.addEventListener("change", (e) => {
  // Når checkbox vælges
  if (e.target.classList.contains("item-check")) {
    const item = e.target.closest(".item");
    const qtyInput = item.querySelector(".qty-input");

    qtyInput.disabled = !e.target.checked;

    updateTotal();
  }

  // Når antal ændres
  if (e.target.classList.contains("qty-input")) {
    updateTotal();
  }
});

// RESET
document.getElementById("resetBtn").addEventListener("click", () => {
  document.querySelectorAll('.item-check').forEach(chk => chk.checked = false);
  document.querySelectorAll('.qty-input').forEach(q => {
    q.value = 1;
    q.disabled = true;
  });
  updateTotal();
});

// PAGE SWITCHING
const pageButtons = document.querySelectorAll(".page-btn");
const pages = document.querySelectorAll(".page");

pageButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    pageButtons.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");

    const pageName = btn.dataset.page;

    pages.forEach(p => p.classList.remove("active"));
    document.getElementById(pageName).classList.add("active");
  });
});
