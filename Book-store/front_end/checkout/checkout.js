document.addEventListener("DOMContentLoaded", () => {
    const cartItems = JSON.parse(localStorage.getItem("cart")) || [];
    const cartDiv = document.getElementById("cart-items");

    // Display the cart items dynamically
    cartItems.forEach(item => {
        const bookCard = document.createElement("div");
        bookCard.classList.add("book-card");
        bookCard.innerHTML = `
            <h4>${item.title}</h4>
            <p>${item.author}</p>
            <p>$${item.price}</p>
        `;
        cartDiv.appendChild(bookCard);
    });

    // Payment form submission handler
    const paymentForm = document.getElementById("payment-form");
    paymentForm.addEventListener("submit", async (event) => {
        event.preventDefault();

        const cardNumber = document.getElementById("card-number").value;
        const expDate = document.getElementById("exp-date").value;
        const cvv = document.getElementById("cvv").value;

        // Here you can send features related to the card number for fraud detection
        const cardFeatures = [cardNumber, expDate, cvv]; // Collect the features for fraud detection

        try {
            // First, check the credit card with the fraud detection model
            const fraudResponse = await fetch("http://localhost:5000/check_credit_card", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ features: cardFeatures })
            });

            const fraudResult = await fraudResponse.json();
            const fraudStatusDiv = document.getElementById("fraud-status");

            // Display the fraud alert message based on the result
            if (fraudResult.message.includes("fraudulent")) {
                fraudStatusDiv.textContent = `🚨 Fraud detected! 🚨\nProbability: ${fraudResult.fraud_probability * 100}%`;
                fraudStatusDiv.classList.add("fraud");
                fraudStatusDiv.classList.remove("valid");
                fraudStatusDiv.style.display = "block";
                return; // Stop further processing if fraud is detected
            } else {
                fraudStatusDiv.textContent = `Payment successful! Thank you for your purchase.`;
                fraudStatusDiv.classList.add("valid");
                fraudStatusDiv.classList.remove("fraud");
                fraudStatusDiv.style.display = "block";
            }

            // If no fraud, proceed with payment (this is just a simulation)
            const paymentData = {
                card_number: cardNumber,
                exp_date: expDate,
                cvv: cvv,
                cart_items: cartItems
            };

            const paymentResponse = await fetch("http://localhost:5000/checkout", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(paymentData)
            });

            const paymentResult = await paymentResponse.json();
            if (paymentResult.success) {
                alert("Payment successful!");
            } else {
                alert("Payment failed. Please try again.");
            }

        } catch (error) {
            console.error("Error processing payment:", error);
            alert("An error occurred during payment. Please try again.");
        }
    });
});
