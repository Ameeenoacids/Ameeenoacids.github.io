function toggleCart() {
    var sidebar = document.getElementById("cart-sidebar");
    sidebar.classList.toggle("active");

    // Load cart items when the cart is toggled
    loadCart();

    if (document.readyState == 'loading') {
        document.addEventListener('DOMContentLoaded', ready)
    } else {
        ready()
    }

    function ready() {
        var incrementButtons = document.getElementsByClassName('increment')
        for (var i = 0; i < incrementButtons.length; i++) {
            var button = incrementButtons[i]
            button.addEventListener('click', incrementQuantity)
        }

        var decrementButtons = document.getElementsByClassName('decrement')
        for (var i = 0; i < decrementButtons.length; i++) {
            var button = decrementButtons[i]
            button.addEventListener('click', decrementQuantity)
        }

        var addToCartButtons = document.getElementsByClassName('add-to-cart')
        for (var i = 0; i < addToCartButtons.length; i++) {
            var button = addToCartButtons[i]
            button.addEventListener('click', addToCartClicked)
        }

        document.getElementsByClassName('btn-purchase')[0].addEventListener('click', purchaseClicked)

        // Update cart total when the page is loaded
        updateCartTotal();
    }
}

function purchaseClicked() {
    var cartItems = document.getElementsByClassName('cart-items')[0]
    while (cartItems.hasChildNodes()) {
        cartItems.removeChild(cartItems.firstChild)
    }
    updateCartTotal();
    // Clear cart in sessionStorage after purchase
    sessionStorage.removeItem('cartItems');
}

function removeCartItem(event) {
    var buttonClicked = event.target
    var cartRow = buttonClicked.parentElement.parentElement;
    cartRow.remove();
    updateCartTotal()
    // Update sessionStorage after removing item from cart
    updateSessionStorage();
}

function incrementQuantity(event) {
    var buttonClicked = event.target
    var input = buttonClicked.parentElement.getElementsByClassName('cart-quantity-input')[0]
    input.value = parseInt(input.value) + 1
    updateCartTotal()
    // Update sessionStorage after incrementing quantity
    updateSessionStorage();
}

function decrementQuantity(event) {
    var buttonClicked = event.target
    var input = buttonClicked.parentElement.getElementsByClassName('cart-quantity-input')[0]
    var cartRow = buttonClicked.parentElement.parentElement;
    if (input.value > 1) {
        input.value = parseInt(input.value) - 1
        updateCartTotal()
    } else {
        cartRow.remove();
        updateCartTotal()
    }
    // Update sessionStorage after decrementing quantity
    updateSessionStorage();
}

function addToCartClicked(event) {
    var button = event.target
    var shopItem = button.parentElement.parentElement
    var title = shopItem.querySelector('.shop-item-title').innerText
    var price = shopItem.querySelector('.shop-item-price').innerText
    var imageSrc = shopItem.querySelector('.shop-item-image').src
    addItemToCart(title, price, imageSrc)
    updateCartTotal()
    // Update sessionStorage after adding item to cart
    updateSessionStorage();
}

function addItemToCart(title, price, imageSrc) {
    var cartRow = document.createElement('div')
    cartRow.classList.add('cart-row')
    var cartItems = document.getElementsByClassName('cart-items')[0]
    var cartItemNames = cartItems.getElementsByClassName('cart-item-title')
    for (var i = 0; i < cartItemNames.length; i++) {
        if (cartItemNames[i].innerText == title) {
            return
        }
    }
    var cartRowContents = `
        <div class="cart-item cart-column">
            <img class="cart-item-image" src="${imageSrc}" width="50" height="50">
            <span class="cart-item-title">${title}</span>
        </div>
        <span class="cart-price cart-column">${price}</span>
        <div class="cart-quantity cart-column">
            <button class="decrement">-</button>
            <input class="cart-quantity-input" type="number" value="1" readonly>
            <button class="increment">+</button>
        </div>`
    cartRow.innerHTML = cartRowContents
    cartItems.append(cartRow)
    cartRow.getElementsByClassName('increment')[0].addEventListener('click', incrementQuantity)
    cartRow.getElementsByClassName('decrement')[0].addEventListener('click', decrementQuantity)
    // Update sessionStorage after adding new item to cart
    updateSessionStorage();
}

function updateCartTotal() {
    var cartItemContainer = document.getElementsByClassName('cart-items')[0]
    var cartRows = cartItemContainer.getElementsByClassName('cart-row')
    var total = 0
    for (var i = 0; i < cartRows.length; i++) {
        var cartRow = cartRows[i]
        var priceElement = cartRow.getElementsByClassName('cart-price')[0]
        var quantityElement = cartRow.getElementsByClassName('cart-quantity-input')[0]
        var price = parseFloat(priceElement.innerText.replace('$', ''))
        var quantity = quantityElement.value
        total = total + (price * quantity)
    }
    total = Math.round(total * 100) / 100
    document.getElementsByClassName('cart-total-price')[0].innerText = '$' + total
}

// Load cart items from sessionStorage
function loadCart() {
    var cartItems = JSON.parse(sessionStorage.getItem('cartItems'));
    if (cartItems) {
        cartItems.forEach(function(item) {
            addItemToCart(item.title, item.price, item.imageSrc);
        });
    }
}

// Update sessionStorage with current cart items
function updateSessionStorage() {
    var cartItems = [];
    var cartRows = document.getElementsByClassName('cart-row');
    for (var i = 0; i < cartRows.length; i++) {
        var cartRow = cartRows[i];
        var title = cartRow.querySelector('.cart-item-title').innerText;
        var price = cartRow.querySelector('.cart-price').innerText;
        var imageSrc = cartRow.querySelector('.cart-item-image').src;
        cartItems.push({ title: title, price: price, imageSrc: imageSrc });
    }
    sessionStorage.setItem('cartItems', JSON.stringify(cartItems));
}document.addEventListener('DOMContentLoaded', function() {
    // Load reviews from localStorage on page load
    loadReviews();

    // Add event listener for review submission
    document.getElementById('submit-review-form').addEventListener('submit', function(event) {
        event.preventDefault(); // Prevent default form submission behavior

        // Get review data from form inputs
        var name = document.getElementById('review-name').value;
        var message = document.getElementById('review-message').value;
        var rating = document.querySelector('input[name="rating"]:checked').value;

        // Get the product ID (you may need to adjust this depending on your setup)
        var productId = 'your_product_id_here'; // Replace 'your_product_id_here' with your actual product ID

        // Check if the user has already reviewed the product
        if (hasReviewed(productId, name)) {
            alert('You have already reviewed this product.');
            return;
        }

        // Create review object
        var review = {
            productId: productId,
            name: name,
            message: message,
            rating: rating
        };

        // Save review to localStorage
        saveReview(review);

        // Clear form inputs
        document.getElementById('review-name').value = '';
        document.getElementById('review-message').value = '';
        document.querySelector('input[name="rating"]:checked').checked = false;

        // Reload reviews
        loadReviews();
    });
});

// Function to save review to localStorage
function saveReview(review) {
    var reviews = JSON.parse(localStorage.getItem('reviews')) || [];
    reviews.push(review);
    localStorage.setItem('reviews', JSON.stringify(reviews));

    // Update list of reviewers
    updateReviewers(review.productId, review.name);
}

// Function to load reviews from localStorage and display them
function loadReviews() {
    var reviews = JSON.parse(localStorage.getItem('reviews')) || [];

    var reviewList = document.getElementById('review-list');
    reviewList.innerHTML = ''; // Clear existing reviews

    reviews.forEach(function(review) {
        var reviewItem = document.createElement('div');
        reviewItem.classList.add('review');
        reviewItem.innerHTML = `
            <h3>${review.name}</h3>
            <div class="stars">Rating: ${'★'.repeat(review.rating)}</div>
            <p>${review.message}</p>
            <button class="delete-btn" onclick="deleteReview('${review.name}', '${review.productId}')">Delete</button>
        `;
        reviewList.appendChild(reviewItem);
    });
}

// Function to check if the user has already reviewed the product
function hasReviewed(productId, userName) {
    var reviewers = JSON.parse(localStorage.getItem('reviewers')) || {};
    return reviewers[productId] && reviewers[productId].includes(userName);
}

// Function to delete a review from localStorage and reload reviews
function deleteReview(userName, productId) {
    var reviews = JSON.parse(localStorage.getItem('reviews')) || [];
    reviews = reviews.filter(function(review) {
        return !(review.name === userName && review.productId === productId);
    });
    localStorage.setItem('reviews', JSON.stringify(reviews)); // Save updated reviews to localStorage
    loadReviews(); // Reload reviews to update the displayed list

    // Remove reviewer from the list of reviewers
    removeReviewer(productId, userName);
}

// Function to update the list of reviewers for a product
function updateReviewers(productId, userName) {
    var reviewers = JSON.parse(localStorage.getItem('reviewers')) || {};
    if (!reviewers[productId]) {
        reviewers[productId] = [];
    }
    reviewers[productId].push(userName);
    localStorage.setItem('reviewers', JSON.stringify(reviewers));
}

// Function to remove a reviewer from the list of reviewers for a product
function removeReviewer(productId, userName) {
    var reviewers = JSON.parse(localStorage.getItem('reviewers')) || {};
    if (reviewers[productId]) {
        reviewers[productId] = reviewers[productId].filter(function(name) {
            return name !== userName;
        });
        localStorage.setItem('reviewers', JSON.stringify(reviewers));
    }
}
