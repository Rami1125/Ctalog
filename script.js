document.addEventListener('DOMContentLoaded', () => {
    // --- Mock Product Data (ניתן לטעון מ-API בעולם האמיתי) ---
    const products = [
        {
            id: 'prod1',
            name: 'מחשב נייד מקצועי',
            description: 'מחשב נייד חזק במיוחד לעבודה וגיימינג, עם מעבד i9 ו-32GB RAM.',
            fullDescription: 'מחשב נייד מקצועי בעל ביצועים עוצמתיים, אידיאלי למפתחים, עורכי וידאו וגיימרים. כולל מסך 15.6 אינץ\' ברזולוציית 4K, כרטיס מסך RTX 4080, דיסק SSD בנפח 1TB. קל משקל ובעל חיי סוללה ארוכים. מגיע עם אחריות לשלוש שנים.',
            price: 5500,
            image: 'https://via.placeholder.com/300x200?text=Laptop',
            unit: 'יחידה'
        },
        {
            id: 'prod2',
            name: 'מסך מחשב 27 אינץ\'',
            description: 'מסך QHD איכותי בגודל 27 אינץ\' עם קצב רענון של 144Hz.',
            fullDescription: 'מסך מחשב גדול ואיכותי בגודל 27 אינץ\' ברזולוציית QHD (2560x1440), מושלם לעבודה ובידור. בעל פאנל IPS המספק זוויות צפייה רחבות וצבעים מדויקים. קצב רענון של 144Hz וזמן תגובה של 1ms הופכים אותו למתאים גם לגיימינג. חיבורי HDMI ו-DisplayPort.',
            price: 1200,
            image: 'https://via.placeholder.com/300x200?text=Monitor',
            unit: 'יחידה'
        },
        {
            id: 'prod3',
            name: 'מקלדת מכנית גיימינג',
            description: 'מקלדת מכנית RGB עם סוויצ\'ים אדומים, תאורה אחורית ונוחות מרבית.',
            fullDescription: 'מקלדת מכנית מקצועית המיועדת לגיימרים, עם סוויצ\'ים אדומים עמידים ומהירים. תאורת RGB ניתנת להתאמה אישית, עם מצבי תאורה רבים. עיצוב ארגונומי לנוחות מרבית גם בשימוש ממושך. כבל ארוך ועמיד עם חיבור USB.',
            price: 450,
            image: 'https://via.placeholder.com/300x200?text=Keyboard',
            unit: 'יחידה'
        },
        {
            id: 'prod4',
            name: 'עכבר אלחוטי ארגונומי',
            description: 'עכבר אלחוטי נוח ומדויק לעבודה משרדית ושימוש יומיומי.',
            fullDescription: 'עכבר אלחוטי ארגונומי המעניק נוחות מקסימלית לשימוש ממושך. חיישן אופטי מדויק עם רגישות של 1600 DPI, כפתורים שקטים וגלגלת גלילה מהירה. מתחבר באמצעות דונגל USB קטן ומגיע עם סוללת AA אחת. מתאים ליד ימין.',
            price: 150,
            image: 'https://via.placeholder.com/300x200?text=Mouse',
            unit: 'יחידה'
        },
        {
            id: 'prod5',
            name: 'אוזניות גיימינג אלחוטיות',
            description: 'אוזניות גיימינג עם צליל היקפי 7.1 ומיקרופון מבטל רעשים.',
            fullDescription: 'אוזניות גיימינג אלחוטיות עם איכות צליל יוצאת דופן וצליל היקפי 7.1 (וירטואלי) לחוויית משחק סוחפת. מיקרופון מבטל רעשים הניתן להסרה מבטיח תקשורת ברורה עם חברים לקבוצה. כריות אוזניים נוחות במיוחד לשימוש ממושך. טווח קליטה של עד 10 מטרים.',
            price: 700,
            image: 'https://via.placeholder.com/300x200?text=Headset',
            unit: 'יחידה'
        }
    ];

    // --- DOM Elements ---
    const productGrid = document.querySelector('.product-grid');
    const cartIcon = document.getElementById('cartIcon');
    const cartCount = document.querySelector('.cart-count');
    const productDetailsPopup = document.getElementById('productDetailsPopup');
    const cartPopup = document.getElementById('cartPopup');
    const quotePopup = document.getElementById('quotePopup');
    const closePopupBtns = document.querySelectorAll('.close-popup-btn');
    const cartItemsContainer = cartPopup.querySelector('.cart-items');
    const cartTotalElement = document.getElementById('cartTotal');
    const checkoutBtn = document.getElementById('checkoutBtn');

    // --- Cart State ---
    let cart = JSON.parse(localStorage.getItem('shoppingCart')) || {}; // Load cart from localStorage

    // --- Functions ---

    // Render Products to the Grid
    function renderProducts() {
        productGrid.innerHTML = ''; // Clear existing products
        products.forEach((product, index) => {
            const productCard = document.createElement('div');
            productCard.classList.add('product-card');
            productCard.style.animationDelay = `${index * 0.1}s`; // Stagger animation
            productCard.innerHTML = `
                <img src="${product.image}" alt="${product.name}">
                <div class="product-card-content">
                    <h3>${product.name}</h3>
                    <p>${product.description}</p>
                    <span class="price">${product.price.toLocaleString('he-IL')} ₪ ל${product.unit}</span>
                    <button class="btn-primary view-details-btn" data-product-id="${product.id}">צפה בפרטים</button>
                </div>
            `;
            productGrid.appendChild(productCard);
        });
    }

    // Open Popup
    function openPopup(popupElement) {
        popupElement.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent scrolling background
    }

    // Close Popup
    function closePopup(popupElement) {
        popupElement.classList.remove('active');
        document.body.style.overflow = ''; // Allow scrolling background
    }

    // Populate and Open Product Details Popup
    function openProductDetails(productId) {
        const product = products.find(p => p.id === productId);
        if (!product) return;

        productDetailsPopup.querySelector('.popup-body').innerHTML = `
            <img src="${product.image}" alt="${product.name}">
            <h2>${product.name}</h2>
            <p class="description">${product.fullDescription}</p>
            <p class="price-unit">${product.price.toLocaleString('he-IL')} ₪ ל${product.unit}</p>
            <div class="quantity-controls">
                <label for="productQuantity">כמות (${product.unit}):</label>
                <input type="number" id="productQuantity" value="1" min="1">
                <span class="total-price-display">סה"כ: <span id="currentProductTotalPrice">${product.price.toLocaleString('he-IL')}</span> ₪</span>
            </div>
            <button class="btn-primary add-to-cart-btn" data-product-id="${product.id}">הוסף לעגלה</button>
        `;

        const quantityInput = productDetailsPopup.querySelector('#productQuantity');
        const currentProductTotalPrice = productDetailsPopup.querySelector('#currentProductTotalPrice');

        // Update total price based on quantity input
        quantityInput.addEventListener('input', () => {
            let quantity = parseInt(quantityInput.value);
            if (isNaN(quantity) || quantity < 1) {
                quantity = 1;
                quantityInput.value = 1;
            }
            currentProductTotalPrice.textContent = (product.price * quantity).toLocaleString('he-IL');
        });

        openPopup(productDetailsPopup);
    }

    // Update Cart Count Display
    function updateCartCount() {
        const totalItems = Object.values(cart).reduce((sum, item) => sum + item.quantity, 0);
        cartCount.textContent = totalItems;
        if (totalItems > 0) {
            cartCount.style.transform = 'scale(1)'; // Show with animation
        } else {
            cartCount.style.transform = 'scale(0)'; // Hide
        }
    }

    // Add Product to Cart
    function addToCart(productId, quantity) {
        const product = products.find(p => p.id === productId);
        if (!product) return;

        if (cart[productId]) {
            cart[productId].quantity += quantity;
        } else {
            cart[productId] = { ...product, quantity: quantity };
        }

        localStorage.setItem('shoppingCart', JSON.stringify(cart)); // Save to localStorage
        updateCartCount();
        renderCartItems();
        closePopup(productDetailsPopup); // Close product details after adding
        openPopup(cartPopup); // Open cart popup
    }

    // Render Cart Items
    function renderCartItems() {
        cartItemsContainer.innerHTML = '';
        let totalCartPrice = 0;

        if (Object.keys(cart).length === 0) {
            cartItemsContainer.innerHTML = '<p class="empty-cart-message" style="text-align: center; color: #777;">העגלה ריקה. התחילו להוסיף מוצרים!</p>';
        } else {
            for (const productId in cart) {
                const item = cart[productId];
                const itemTotal = item.price * item.quantity;
                totalCartPrice += itemTotal;

                const cartItemElement = document.createElement('div');
                cartItemElement.classList.add('cart-item');
                cartItemElement.innerHTML = `
                    <img src="${item.image}" alt="${item.name}">
                    <div class="cart-item-details">
                        <h4>${item.name}</h4>
                        <p>${item.price.toLocaleString('he-IL')} ₪ ל${item.unit} x ${item.quantity}</p>
                    </div>
                    <div class="cart-item-controls">
                        <input type="number" class="cart-item-quantity" data-product-id="${item.id}" value="${item.quantity}" min="1">
                        <button class="remove-item-btn" data-product-id="${item.id}"><i class="fas fa-trash-alt"></i></button>
                    </div>
                `;
                cartItemsContainer.appendChild(cartItemElement);
            }
        }
        cartTotalElement.textContent = totalCartPrice.toLocaleString('he-IL');
    }

    // Update Item Quantity in Cart
    function updateCartItemQuantity(productId, newQuantity) {
        if (cart[productId]) {
            if (newQuantity < 1) {
                delete cart[productId]; // Remove if quantity is less than 1
            } else {
                cart[productId].quantity = newQuantity;
            }
            localStorage.setItem('shoppingCart', JSON.stringify(cart));
            updateCartCount();
            renderCartItems(); // Re-render the cart to reflect changes
        }
    }

    // Generate and Open Quote Popup
    function generateQuote() {
        const quoteDetailsDiv = quotePopup.querySelector('.quote-details');
        quoteDetailsDiv.innerHTML = '<h3>פרטי הצעת מחיר</h3>';

        if (Object.keys(cart).length === 0) {
            quoteDetailsDiv.innerHTML += '<p style="text-align: center;">העגלה ריקה, לא ניתן ליצור הצעת מחיר.</p>';
            quotePopup.querySelector('.quote-share-form').style.display = 'none'; // Hide share form
            return;
        } else {
            quotePopup.querySelector('.quote-share-form').style.display = 'block'; // Show share form
        }

        let quoteHtml = '';
        let quoteTotalPrice = 0;

        for (const productId in cart) {
            const item = cart[productId];
            const itemTotal = item.price * item.quantity;
            quoteTotalPrice += itemTotal;
            quoteHtml += `
                <div class="quote-item">
                    <span class="quote-item-name">${item.name}</span>
                    <span>${item.quantity} ${item.unit} x ${item.price.toLocaleString('he-IL')} ₪ = ${itemTotal.toLocaleString('he-IL')} ₪</span>
                </div>
            `;
        }

        quoteHtml += `<div class="quote-total">סה"כ להצעת מחיר: ${quoteTotalPrice.toLocaleString('he-IL')} ₪</div>`;
        quoteDetailsDiv.innerHTML += quoteHtml;

        openPopup(quotePopup);
    }

    // Simulate Sending Quote (In a real app, this would involve server-side logic)
    function sendQuote() {
        const customerName = document.getElementById('customerName').value;
        const customerEmail = document.getElementById('customerEmail').value;
        const quoteNotes = document.getElementById('quoteNotes').value;

        if (!customerName || !customerEmail) {
            alert('אנא מלאו את השם והאימייל לשליחת ההצעה.');
            return;
        }

        let emailBody = `שלום מחלקת הזמנות,\n\n`;
        emailBody += `קיבלתם הצעת מחיר חדשה מלקוח:\n`;
        emailBody += `שם: ${customerName}\n`;
        emailBody += `אימייל: ${customerEmail}\n\n`;
        emailBody += `פרטי ההצעה:\n`;

        let quoteTotalPrice = 0;
        for (const productId in cart) {
            const item = cart[productId];
            const itemTotal = item.price * item.quantity;
            quoteTotalPrice += itemTotal;
            emailBody += `- ${item.name} (${item.quantity} ${item.unit}) x ${item.price.toLocaleString('he-IL')} ₪ = ${itemTotal.toLocaleString('he-IL')} ₪\n`;
        }

        emailBody += `\nסה"כ להצעת מחיר: ${quoteTotalPrice.toLocaleString('he-IL')} ₪\n\n`;

        if (quoteNotes) {
            emailBody += `הערות הלקוח: ${quoteNotes}\n\n`;
        }

        emailBody += `אנא טפלו בהקדם.\n`;
        emailBody += `בברכה, המערכת האוטומטית.`;

        // Using mailto to simulate sending email
        // In a real application, you'd send this data to a backend server.
        window.location.href = `mailto:orders@yourstore.com?subject=הצעת מחיר חדשה מ-${customerName}&body=${encodeURIComponent(emailBody)}`;

        alert('הצעת המחיר נשלחה למחלקת הזמנות בהצלחה!');
        closePopup(quotePopup);
        cart = {}; // Clear cart after sending quote (optional, depends on business logic)
        localStorage.removeItem('shoppingCart');
        updateCartCount();
        renderCartItems();
    }

    // Simulate PDF Download (basic HTML to PDF, in real app use a library)
    function downloadQuoteAsPdf() {
        const quoteDetailsContent = quotePopup.querySelector('.quote-details').innerHTML;
        const customerName = document.getElementById('customerName').value || 'לקוח';
        const customerEmail = document.getElementById('customerEmail').value || '';
        const quoteNotes = document.getElementById('quoteNotes').value || '';

        const pdfContent = `
            <html dir="rtl" lang="he">
            <head>
                <title>הצעת מחיר - ${customerName}</title>
                <style>
                    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; direction: rtl; text-align: right; }
                    h1 { color: #007bff; text-align: center; }
                    h3 { color: #343a40; border-bottom: 1px solid #dee2e6; padding-bottom: 5px; margin-bottom: 15px; }
                    .quote-item { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px dashed #eee; }
                    .quote-total { font-size: 1.6rem; font-weight: bold; color: #28a745; text-align: center; margin-top: 20px; }
                    .customer-info { margin-top: 30px; padding-top: 15px; border-top: 1px solid #dee2e6; }
                    .customer-info p { margin-bottom: 5px; }
                </style>
            </head>
            <body>
                <h1>הצעת מחיר מהחנות שלי</h1>
                <div class="customer-info">
                    <h3>פרטי לקוח:</h3>
                    <p><strong>שם:</strong> ${customerName}</p>
                    <p><strong>אימייל:</strong> ${customerEmail}</p>
                    ${quoteNotes ? `<p><strong>הערות:</strong> ${quoteNotes}</p>` : ''}
                </div>
                <h3>פרטי ההצעה:</h3>
                ${quoteDetailsContent}
            </body>
            </html>
        `;

        const blob = new Blob([pdfContent], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `הצעת מחיר-${customerName}-${new Date().toLocaleDateString('he-IL')}.html`; // Download as HTML, can be converted to PDF via server or browser print
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url); // Clean up the URL object

        alert('הצעת המחיר הורדה כקובץ HTML (ניתן להדפיס כ-PDF).');
    }


    // --- Event Listeners ---

    // Event Delegation for 'View Details' and 'Add to Cart' buttons
    productGrid.addEventListener('click', (e) => {
        if (e.target.classList.contains('view-details-btn')) {
            const productId = e.target.dataset.productId;
            openProductDetails(productId);
        }
    });

    productDetailsPopup.addEventListener('click', (e) => {
        if (e.target.classList.contains('add-to-cart-btn')) {
            const productId = e.target.dataset.productId;
            const quantityInput = productDetailsPopup.querySelector('#productQuantity');
            const quantity = parseInt(quantityInput.value);
            if (quantity > 0) {
                addToCart(productId, quantity);
            } else {
                alert('אנא הזינו כמות חוקית.');
            }
        }
    });

    // Close popups when clicking on the close button or overlay
    closePopupBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const popupElement = e.target.closest('.popup-overlay');
            if (popupElement) {
                closePopup(popupElement);
            }
        });
    });

    productDetailsPopup.addEventListener('click', (e) => {
        if (e.target === productDetailsPopup) { // Clicked on overlay itself
            closePopup(productDetailsPopup);
        }
    });

    cartPopup.addEventListener('click', (e) => {
        if (e.target === cartPopup) { // Clicked on overlay itself
            closePopup(cartPopup);
        }
    });

    quotePopup.addEventListener('click', (e) => {
        if (e.target === quotePopup) { // Clicked on overlay itself
            closePopup(quotePopup);
        }
    });


    // Open Cart Popup
    cartIcon.addEventListener('click', () => {
        renderCartItems(); // Ensure cart is updated before opening
        openPopup(cartPopup);
    });

    // Event listener for updating quantity and removing items in the cart
    cartItemsContainer.addEventListener('change', (e) => {
        if (e.target.classList.contains('cart-item-quantity')) {
            const productId = e.target.dataset.productId;
            const newQuantity = parseInt(e.target.value);
            updateCartItemQuantity(productId, newQuantity);
        }
    });

    cartItemsContainer.addEventListener('click', (e) => {
        if (e.target.classList.contains('remove-item-btn') || e.target.closest('.remove-item-btn')) {
            const productId = e.target.dataset.productId || e.target.closest('.remove-item-btn').dataset.productId;
            updateCartItemQuantity(productId, 0); // Set quantity to 0 to remove
        }
    });

    // Checkout button (build quote)
    checkoutBtn.addEventListener('click', () => {
        closePopup(cartPopup); // Close cart before opening quote
        generateQuote();
    });

    // Send Quote button
    document.getElementById('sendQuoteBtn').addEventListener('click', sendQuote);

    // Download PDF button
    document.getElementById('downloadPdfBtn').addEventListener('click', downloadQuoteAsPdf);

    // --- Initial Load ---
    renderProducts();
    updateCartCount(); // Update cart count on page load
});
