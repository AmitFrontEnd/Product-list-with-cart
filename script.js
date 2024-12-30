// Select all "Add to Cart" buttons
const addToCartBtn = document.querySelectorAll('.add-to-cart')

// Select alternate "Add to Cart" buttons
const addToCartBtn2 = document.querySelectorAll('.add-to-cart-2')

// Container for cart items
const cartContainer = document.querySelector('.cart-items')

// Select all product items
const allItems = document.querySelectorAll('.item')

// Elements to display total payable amount and total cart items
let totalPayEl = document.querySelector('.total-amount-pay')
let totalCartEl = document.querySelector('.total-cart-item')

// Empty cart message container
const emptyContainer = document.querySelector('.cart-empty-container ')

// Confirm order button and final order container
const confirmButton = document.querySelector('.confirm-order')
const finalOrderContainer = document.querySelector('.final-order-container')

// Order summary and new order button
const orderSummary = document.querySelector('.order-summary');
const newOrderBtn = document.querySelector('.final-order-container button')

// Variables to track cart totals
let totalCartItem = 0
let totalPrice = 0;

// Event listener to handle "Add to Cart" button clicks
addToCartBtn.forEach((cart) => {
  cart.addEventListener('click', () => {
    // Hide "Add to Cart" button and show quantity controls
    cart.classList.add('hidden')
    cart.nextElementSibling.classList.add('active')
  })
})

// Function to check and update cart status (empty or not)
const checkCartStatus = () => {
  if (cartContainer.children.length >= 1) {
    // Hide empty cart message and show cart items
    emptyContainer.classList.add('hidden');
    cartContainer.parentElement.classList.remove('hidden')
  } else {
    // Show empty cart message and hide cart items
    emptyContainer.classList.remove('hidden');
    cartContainer.parentElement.classList.add('hidden')
  }
}

// Function to add a product to the cart
const productAdd = (name, price, qty, imgURL) => {
  // Update total price
  totalPrice += price;
  totalPayEl.textContent = `$${totalPrice.toFixed(2)}`

  // Check if the product already exists in the cart
  const existingProduct = Array.from(cartContainer.children).find(cartItem => {
    return cartItem.querySelector('.order-title').textContent === name
  })
  
  if (existingProduct) {
    // Update quantity and total price for the existing product
    const amountEl = existingProduct.querySelector('.amount');
    const totalEl = existingProduct.querySelector('.total');
    const currentQty = parseInt(amountEl.textContent);
    const newQty = currentQty + qty;
    const newTotalPrice = newQty * price;

    amountEl.textContent = `${newQty}x`;
    totalEl.textContent = `@$${newTotalPrice.toFixed(2)}`;
  } else {
    // Add new product to the cart
    totalCartItem++
    totalCartEl.textContent = totalCartItem
    let productPrice = qty * price

    // Create a new cart item element
    const cartitem = document.createElement('div')
    cartitem.classList.add('cart-item')
    cartitem.innerHTML = `
   <img src=${imgURL} alt="" />

              <div>
                <div class="order-title">${name}</div>
                <div class="order-details-container">
                  <div class="order-details">
                    <div class="amount">${qty}x</div>
                    <div class="at">@$${price.toFixed(2)}</div>
                    <div class="total">@$${productPrice.toFixed(2)}</div>
                  </div>
                  <div class="delete-icon">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="10"
                      height="10"
                      fill="none"
                      viewBox="0 0 10 10"
                    >
                      <path
                        fill="#CAAFA7"
                        d="M8.375 9.375 5 6 1.625 9.375l-1-1L4 5 .625 1.625l1-1L5 4 8.375.625l1 1L6 5l3.375 3.375-1 1Z"
                      />
                    </svg>
                  </div>
              </div>
              </div>
    `
    cartContainer.appendChild(cartitem)
  }

  // Update cart status
  checkCartStatus()
}

// Function to remove a product from the cart
const productRemove = (name, price) => {
  // Update total price
  totalPrice -= price;
  totalPayEl.textContent = `$${totalPrice.toFixed(2)}`

  // Find the product in the cart
  const existingProduct = Array.from(cartContainer.children).find(cartItem =>
    cartItem.querySelector('.order-title').textContent === name
  );

  if (existingProduct) {
    // Update quantity or remove the product from the cart
    const amountEl = existingProduct.querySelector('.amount');
    const totalEl = existingProduct.querySelector('.total');
    const currentQty = parseInt(amountEl.textContent);

    if (currentQty > 1) {
      // Reduce quantity and update total price
      const newQty = currentQty - 1;
      const newTotalPrice = newQty * price;

      amountEl.textContent = `${newQty}x`;
      totalEl.textContent = `@$${newTotalPrice.toFixed(2)}`;
    } else {
      // Remove the product if quantity is 1
      cartContainer.removeChild(existingProduct);
      totalCartItem--
      totalCartEl.textContent = totalCartItem
    }
  }

  // Update cart status
  checkCartStatus()
}

// Add event listeners to each product item for quantity and cart controls
allItems.forEach((item) => {
  const plus = item.querySelector('.plus');
  const minus = item.querySelector('.minus');
  const countEl = item.querySelector('.count');
  const name = item.querySelector('.item-name').textContent;
  const itemPriceEL = item.querySelector('.price');
  const itemPrice = parseFloat(itemPriceEL.textContent.replace("$ ", ""));
  const addToCart = item.querySelector('.add-to-cart');
  const imgURL = item.querySelector('img').getAttribute('src')
  const itemImg = item.querySelector('img')

  let count = 0;

  // Increase quantity and add to cart
  plus.addEventListener('click', () => {
    count++;
    countEl.innerText = count;
    productAdd(name, itemPrice, 1, imgURL);
  });

  // Decrease quantity or remove from cart
  minus.addEventListener('click', () => {
    if (count > 1) {
      count--;
      countEl.innerText = count;
      productRemove(name, itemPrice);
    } else if (count === 1) {
      count = 0;
      countEl.innerText = count;
      countEl.parentElement.classList.remove('active');
      addToCart.classList.remove('hidden');
      productRemove(name, itemPrice);
      itemImg.classList.remove('active')
    }
  });

  // Add product to cart via "Add to Cart" button
  addToCart.addEventListener('click', () => {
    count = 1;
    countEl.innerText = count;
    addToCart.classList.add('hidden');
    countEl.parentElement.classList.add('active');
    productAdd(name, itemPrice, 1, imgURL);
    itemImg.classList.add('active')
  });
});

// Handle removing items directly from the cart
cartContainer.addEventListener('click', (event) => {
  if (event.target.closest('.delete-icon')) {
    const cartItem = event.target.closest('.cart-item');
    const itemName = cartItem.querySelector('.order-title').textContent;
    const itemPrice = parseFloat(cartItem.querySelector('.total').textContent.replace("@$", ""));

    totalPrice -= itemPrice;
    totalPayEl.textContent = `$${totalPrice.toFixed(2)}`;

    totalCartItem--;
    totalCartEl.textContent = totalCartItem;

    allItems.forEach(item => {
      const name = item.querySelector('.item-name').textContent;
      if (name === itemName) {
        item.querySelector('.count').innerText = '0';
        item.querySelector('.count').parentElement.classList.remove('active');
        item.querySelector('.add-to-cart').classList.remove('hidden');
        item.querySelector('img').classList.remove('active');
      }
    });

    cartItem.remove();
    checkCartStatus();
  }
});

// Confirm order and display summary
confirmButton.addEventListener('click', () => {
  orderSummary.innerHTML += `
    ${cartContainer.innerHTML}
     <div class="total-order-amount">
      <p>Order Total</p>
      <span class="total-amount-pay">$${totalPrice.toFixed(2)}</span>
    </div>
  `;
  finalOrderContainer.classList.remove('hidden')
  showOverlay()
});

// Show overlay on order confirmation
function showOverlay() {
  document.querySelector('.overlay').classList.remove('hidden')
}

// Hide overlay
function hideOverlay() {
  document.querySelector('.overlay').style.display = 'none';
}

// Start new order logic
newOrderBtn.addEventListener('click', () => {
  let response = confirm('Are you sure to start new order ?')
  if (response) {
    location.href = '/'
  } else {
    alert('Whoa!! You have changed your mood!!')
  }
})
