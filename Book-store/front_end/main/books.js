let currentPage = 1;
const perPage = 20;
let cart = JSON.parse(localStorage.getItem('cart')) || [];
let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
let loadedBooks = []; // Array to keep track of loaded books
let originalBooks = []; // Store the original list of books
let searchTimeout; // To store the debounce timeout
let selectedBooks = JSON.parse(localStorage.getItem('selectedBooks')) || []; // Array to track selected books

document.addEventListener('DOMContentLoaded', function () {
    // Fetch books
    function fetchBooks(page = 1, perPage = 20) {
        fetch(`http://127.0.0.1:5000/get_books?page=${page}&per_page=${perPage}`)
            .then(response => response.json())
            .then(data => {
                // Ensure no duplicate books are added
                const newBooks = data.filter(book => !loadedBooks.some(loadedBook => loadedBook.Title === book.Title && loadedBook.Authors === book.Authors));
                
                if (newBooks.length > 0) {
                    displayBooks(newBooks);
                    loadedBooks = [...loadedBooks, ...newBooks];
                    if (originalBooks.length === 0) {
                        originalBooks = [...newBooks];
                    }
                }
            })
            .catch(error => console.error('Error fetching books:', error));
    }
    

    // Debounced search
    document.getElementById('search-bar').addEventListener('input', function () {
        clearTimeout(searchTimeout);

        const query = this.value;
        if (query.length > 0) {
            searchTimeout = setTimeout(function () {
                fetch(`http://127.0.0.1:5000/search_books?query=${query}`)
                    .then(response => response.json())
                    .then(data => {
                        if (data.length > 0) {
                            displayBooks(data);
                        } else {
                            displayBooks([]);
                        }
                    })
                    .catch(error => console.error('Error searching books:', error));
            }, 300);
        } else {
            displayBooks(originalBooks);
        }
    });

    // Display books
    function displayBooks(books) {
        const booksContainer = document.getElementById('books-container');
    
        books.forEach(book => {
            const bookElement = document.createElement('div');
            bookElement.classList.add('book-item');
    
            const bookImage = document.createElement('img');
            const randomImage = `https://picsum.photos/250/300?random=${Math.floor(Math.random() * 1000)}`;
            bookImage.src = randomImage;
            bookImage.loading = 'lazy';
    
            const bookInfo = document.createElement('div');
            bookInfo.classList.add('book-info');
    
            const bookTitle = document.createElement('h3');
            bookTitle.textContent = book.Title || "Book Title";
    
            const bookAuthor = document.createElement('p');
            bookAuthor.textContent = `Author: ${book.Authors || "Unknown Author"}`;
    
            bookInfo.appendChild(bookTitle);
            bookInfo.appendChild(bookAuthor);
    
            const favoriteIcon = document.createElement('span');
            favoriteIcon.classList.add('favorite-icon');
            favoriteIcon.innerHTML = '❤️';
            favoriteIcon.addEventListener('click', function (event) {
                event.stopPropagation();
                toggleFavorite(book, favoriteIcon);
            });
    
            // Add to Cart button (below the favorite button in the card)
            const addToCartBtn = document.createElement('span');
            addToCartBtn.classList.add('add-to-cart-btn');
            addToCartBtn.innerHTML = '🛒';
            addToCartBtn.addEventListener('click', function (event) {
                event.stopPropagation();
                toggleCart(book, addToCartBtn);
            });

            const buyBtn = document.createElement('span');
            buyBtn.classList.add('buy-btn');
            buyBtn.innerHTML = '🛍️';
            buyBtn.addEventListener('click', function (event) {
                event.stopPropagation();
                handleBuy(book);
            });
            
            function handleBuy(book) {
                localStorage.setItem('selectedBook', JSON.stringify(book));
                window.location.href = '/front_end/checkout/checkout.html';
            }
            
            bookElement.appendChild(buyBtn);
            bookElement.appendChild(bookImage);
            bookElement.appendChild(bookInfo);
            bookElement.appendChild(favoriteIcon);
            bookElement.appendChild(addToCartBtn);  // Place the add to cart button below the favorite icon
    
            bookElement.addEventListener('click', () => openModal(book));
    
            booksContainer.appendChild(bookElement);  // Append the book element to the container
        });
    
        const loadMoreButton = document.getElementById('load-more');
        if (books.length === perPage) {
            loadMoreButton.style.display = 'block';
        } else {
            loadMoreButton.style.display = 'none';
        }
    }
    

    // Load more books when button is clicked
    document.getElementById('load-more').addEventListener('click', function () {
        currentPage++;
        fetchBooks(currentPage, perPage);
    });

    // Toggle book as favorite
    function toggleFavorite(book, icon) {
        if (favorites.includes(book)) {
            favorites = favorites.filter(fav => fav !== book);
            icon.classList.remove('favorited');
        } else {
            favorites.push(book);
            icon.classList.add('favorited');
        }
        localStorage.setItem('favorites', JSON.stringify(favorites));
        updateFavIcon();    
        renderFavorites(); // Re-render the favorites list
    }

    // Toggle book in cart
    function toggleCart(book, button) {
        if (cart.includes(book)) {
            cart = cart.filter(item => item !== book);
            button.classList.remove('added-to-cart');
        } else {
            cart.push(book);
            button.classList.add('added-to-cart');
        }
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartIcon(); // Update the cart icon
        renderCart(); // Re-render the cart items
    }

    // Update the cart icon with the number of items
    function updateCartIcon() {
        const cartBtn = document.getElementById('cart-btn');
        cartBtn.textContent = `Cart (${cart.length})`;
    }
    function updateFavIcon() {
        const favBtn = document.getElementById('favorites-btn');
        favBtn.textContent = `Favorites (${favorites.length})`;
    }

    // Open modal with book details
    function openModal(book) {
        const modal = document.getElementById('book-modal');
        const modalTitle = document.getElementById('modal-title');
        const modalAuthor = document.getElementById('modal-author');
        const modalDescription = document.getElementById('modal-description');
        const modalPrice = document.getElementById('modal-price');

        modalTitle.textContent = book.Title || "Book Title";
        modalAuthor.textContent = `Author: ${book.Authors || "Unknown Author"}`;
        modalDescription.textContent = `Description: ${book.Description || "No description available"}`;
        modalPrice.textContent = `Price: $${book.Price || "0.00"}`;

        modal.style.display = 'block';
    }

    // Close modalz
    document.getElementById('close-modal').addEventListener('click', function () {
        document.getElementById('book-modal').style.display = 'none';
    });

    // Close modal if clicked outside the modal content
    window.addEventListener('click', function (event) {
        if (event.target === document.getElementById('book-modal')) {
            document.getElementById('book-modal').style.display = 'none';
        }
    });

    // Render favorites in the menu
    function renderFavorites() {
        const favoritesContainer = document.getElementById('favorites-container');
        favoritesContainer.innerHTML = '';  // Clear the container

        if (favorites.length === 0) {
            favoritesContainer.innerHTML = '<p>No favorites yet!</p>';
        } else {
            favorites.forEach(book => {
                const bookElement = document.createElement('div');
                bookElement.classList.add('cart-item');

                const bookTitle = document.createElement('h3');
                bookTitle.textContent = book.Title || "Book Title";

                const bookAuthor = document.createElement('p');
                bookAuthor.textContent = `Author: ${book.Authors || "Unknown Author"}`;

                const removeFavoriteBtn = document.createElement('remove-from-fav');
                removeFavoriteBtn.textContent = '❌';
                removeFavoriteBtn.addEventListener('click', () => {
                    favorites = favorites.filter(fav => fav !== book);
                    localStorage.setItem('favorites', JSON.stringify(favorites));
                    updateFavIcon();
                    renderFavorites();  // Re-render after removal
                });

                bookElement.appendChild(bookTitle);
                bookElement.appendChild(bookAuthor);
                bookElement.appendChild(removeFavoriteBtn);
                favoritesContainer.appendChild(bookElement);
            });
        }
    }

    // Render cart in the menu
    function renderCart() {
        const cartContainer = document.getElementById('cart-container');
        cartContainer.innerHTML = '';  // Clear the container
    
        if (cart.length === 0) {
            cartContainer.innerHTML = '<p>Your cart is empty!</p>';
        } else {
            cart.forEach(book => {
                const bookElement = document.createElement('div');
                bookElement.classList.add('cart-item');
    
                const bookTitle = document.createElement('h3');
                bookTitle.textContent = book.Title || "Book Title";
    
                const bookAuthor = document.createElement('p');
                bookAuthor.textContent = `Author: ${book.Authors || "Unknown Author"}`;
    
                // Create a checkbox to select the book
                const selectCheckbox = document.createElement('input');
                selectCheckbox.type = 'checkbox';
                selectCheckbox.classList.add('select-checkbox');
                selectCheckbox.checked = selectedBooks.some(selectedBook => selectedBook.Title === book.Title); // Maintain the checked state
                selectCheckbox.addEventListener('change', function () {
                    toggleSelection(book, selectCheckbox.checked);
                });
    
                // Add Remove from Cart button
                const removeFromCartBtn = document.createElement('span');
                removeFromCartBtn.classList.add('remove-from-cart-btn');
                removeFromCartBtn.innerHTML = '❌';
                removeFromCartBtn.addEventListener('click', function (event) {
                    event.stopPropagation();
                    removeFromCart(book, removeFromCartBtn);
                });
    
                bookElement.appendChild(bookTitle);
                bookElement.appendChild(bookAuthor);
                bookElement.appendChild(selectCheckbox); // Append the select checkbox
                bookElement.appendChild(removeFromCartBtn); // Append remove button to the book item
                cartContainer.appendChild(bookElement);
            });
    
            // Add Checkout button
            const checkoutBtn = document.createElement('button');
            checkoutBtn.textContent = 'Checkout';
            checkoutBtn.classList.add('checkout-btn');
            checkoutBtn.addEventListener('click', function () {
                if (selectedBooks.length > 0) {
                    // Save selected books to localStorage or pass them to checkout page
                    localStorage.setItem('selectedBooksForCheckout', JSON.stringify(selectedBooks));
                    window.location.href = '/front_end/checkout/checkout.html'; // Redirect to checkout page
                } else {
                    alert('Please select at least one book to checkout.');
                }
            });
            cartContainer.appendChild(checkoutBtn); // Append the checkout button at the end of the cart
    
            // Add Clear Selection button
            const clearSelectionBtn = document.createElement('button');
            clearSelectionBtn.textContent = 'Clear Selection';
            clearSelectionBtn.classList.add('clear-selection-btn');
            clearSelectionBtn.addEventListener('click', function () {
                clearSelection();
            });
            cartContainer.appendChild(clearSelectionBtn); // Append the clear selection button
        }
    }
    
    // Toggle selection of books
    function toggleSelection(book, isSelected) {
        if (isSelected) {
            selectedBooks.push(book);
        } else {
            selectedBooks = selectedBooks.filter(selectedBook => selectedBook.Title !== book.Title);
        }
        localStorage.setItem('selectedBooks', JSON.stringify(selectedBooks)); // Store selected books in localStorage
        console.log('Selected Books:', selectedBooks); // For debugging purposes
    }
    
    // Clear all selections
    function clearSelection() {
        selectedBooks = []; // Clear the selected books array
        localStorage.setItem('selectedBooks', JSON.stringify(selectedBooks)); // Update localStorage
        renderCart(); // Re-render the cart with cleared selection
    }       

    function removeFromCart(book, button) {
        // Remove the book from the cart
        cart = cart.filter(item => item.Title !== book.Title);
    
        // Remove the 'added-to-cart' class to visually update the add to cart button
        const addToCartButton = document.querySelector(`.add-to-cart-btn[data-title="${book.Title}"]`);
        if (addToCartButton) {
            addToCartButton.classList.remove('remove-from-cart');
            // Reset hover styles by removing any applied 'added-to-cart' styles
            addToCartButton.style.backgroundColor = 'transparent'; // Reset background color
            addToCartButton.style.color = ''; // Reset color (default)
            addToCartButton.style.borderColor = ''; // Reset border color (default)
        }
    
        // Update the localStorage
        localStorage.setItem('cart', JSON.stringify(cart));
    
        // Re-render the cart and update the cart icon
        renderCart();
        updateCartIcon();
    }
    

    // Open favorites menu
    document.getElementById('favorites-btn').addEventListener('click', function () {
        const favoritesContainer = document.getElementById('favorites-container');
        favoritesContainer.style.display = favoritesContainer.style.display === 'block' ? 'none' : 'block';
        renderFavorites();
    });

    // Open cart menu
    document.getElementById('cart-btn').addEventListener('click', function () {
        const cartContainer = document.getElementById('cart-container');
        cartContainer.style.display = cartContainer.style.display === 'block' ? 'none' : 'block';
        renderCart();
    });

    // Fetch and display books on initial load
    fetchBooks(currentPage, perPage);
    updateCartIcon();  // Update cart icon on page load

    function renderPagination() {
        const pageNumbersContainer = document.getElementById('page-numbers');
        pageNumbersContainer.innerHTML = ''; // Clear previous page numbers
    
        for (let i = 1; i <= totalPages; i++) {
            const pageButton = document.createElement('button');
            pageButton.textContent = i;
            pageButton.onclick = () => goToPage(i);
            pageNumbersContainer.appendChild(pageButton);
        }
    }

    document.getElementById('jump-to-page-btn').addEventListener('click', () => {
        const pageNumber = parseInt(document.getElementById('page-jump').value);
        if (pageNumber >= 1 && pageNumber <= totalPages) {
            goToPage(pageNumber);
        }
    });

    function goToPage(page) {
        currentPage = page;
        loadBooks();  // Replace this with your function to load books for the selected page
    }

    renderPagination();
});
