const itemsContainer = document.getElementById('items');
const totalEl = document.getElementById('total');
const resetBtn = document.getElementById('resetBtn');

const itemsData = [
  { id: 1, name: "Diagnosticering", price: 1000 },
  { id: 2, name: "Topstykke", price: 450 },
  { id: 3, name: "Bundkar", price: 112 },
  { id: 4, name: "Krumtap", price: 600 },
  { id: 5, name: "Luftfilter", price: 37 },
  { id: 6, name: "Oliefilter", price: 30 },
  { id: 7, name: "Vandpumpe", price: 150 },
  { id: 8, name: "Pakningssæt", price: 187 },
  { id: 9, name: "Tandem", price: 90 },
  { id: 10, name: "Knastaksel", price: 375 },
  { id: 11, name: "Køler", price: 225 },
  { id: 12, name: "Ventilvippearme", price: 300 },
  { id: 13, name: "Tændrør", price: 375 },
  { id: 14, name: "Stempler", price: 187 },
  { id: 15, name: "Brændstofindsp", price: 150 },
  { id: 16, name: "Dæk & Fælg", price: 150 },
  { id: 17, name: "Bagklap & motorhjelm", price: 600 },
  { id: 18, name: "Bildør For & Bag", price: 600 },
  { id: 19, name: "Reserverdele tier A", price: 33.750 },
  { id: 20, name: "Reserverdele tier B", price: 15.625 },
  { id: 21, name: "Reserverdele tier C", price: 9375 },
  { id: 22, name: "Reserverdele tier D", price: 125 },
  { id: 23, name: "Reserverdele tier S", price: 84.375 },
  { id: 24, name: "Kørsels Tillæg", price: 1000 },
];

function createItemElement(item) {
  const div = document.createElement('div');
  div.className = 'item';
  div.innerHTML = `
    <div class="item-left">
      <input type="checkbox" id="item${item.id}" data-price="${item.price}">
      <label class="item-name" for="item${item.id}">${item.name}</label>
    </div>
    <div class="item-right">
      <div class="item-price">${item.price} kr</div>
      <div class="quantity-control">
        <button class="qty-btn qty-minus" disabled>−</button>
        <span class="qty-display">0</span>
        <button class="qty-btn qty-plus" disabled>+</button>
      </div>
    </div>
  `;
  return div;
}

itemsData.forEach(item => {
  itemsContainer.appendChild(createItemElement(item));
});

function updateTotal() {
  let total = 0;
  document.querySelectorAll('.item').forEach(item => {
    const checkbox = item.querySelector('input[type="checkbox"]');
    const qty = parseInt(item.querySelector('.qty-display').textContent);
    if (checkbox.checked && qty > 0) {
      total += Number(checkbox.dataset.price) * qty;
    }
  });
  totalEl.textContent = `${total} kr`;
}

document.querySelectorAll('.item').forEach(item => {
  const checkbox = item.querySelector('input[type="checkbox"]');
  const qtyDisplay = item.querySelector('.qty-display');
  const minusBtn = item.querySelector('.qty-minus');
  const plusBtn = item.querySelector('.qty-plus');
  
  let quantity = 0;

  checkbox.addEventListener('change', () => {
    if (checkbox.checked) {
      quantity = 1;
      qtyDisplay.textContent = quantity;
      minusBtn.disabled = false;
      plusBtn.disabled = false;
    } else {
      quantity = 0;
      qtyDisplay.textContent = quantity;
      minusBtn.disabled = true;
      plusBtn.disabled = true;
    }
    updateTotal();
  });

  minusBtn.addEventListener('click', () => {
    if (quantity > 0) {
      quantity--;
      qtyDisplay.textContent = quantity;
      if (quantity === 0) {
        checkbox.checked = false;
        minusBtn.disabled = true;
        plusBtn.disabled = true;
      }
      updateTotal();
    }
  });

  plusBtn.addEventListener('click', () => {
    quantity++;
    qtyDisplay.textContent = quantity;
    updateTotal();
  });
});

// 🔁 Nulstil alt-knap funktion
resetBtn.addEventListener('click', () => {
  document.querySelectorAll('.item').forEach(item => {
    const checkbox = item.querySelector('input[type="checkbox"]');
    const qtyDisplay = item.querySelector('.qty-display');
    const minusBtn = item.querySelector('.qty-minus');
    const plusBtn = item.querySelector('.qty-plus');

    checkbox.checked = false;
    qtyDisplay.textContent = '0';
    minusBtn.disabled = true;
    plusBtn.disabled = true;
  });

  totalEl.textContent = '0 kr';
});
