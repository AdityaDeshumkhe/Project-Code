document.getElementById('addButton').addEventListener('click', addToBill);
document.getElementById('applyDiscount').addEventListener('click', applyDiscount);
document.getElementById('printButton').addEventListener('click', printBill);

let total = 0;
let originalTotal;

function addToBill() {
    const foodItem = document.getElementById('foodItem').value;
    const price = parseFloat(document.getElementById('price').value);
    const quantity = parseInt(document.getElementById('quantity').value);

    if (foodItem && !isNaN(price) && !isNaN(quantity) && quantity > 0) {
        const tableBody = document.getElementById('billTableBody');
        const row = document.createElement('tr');

        const itemCell = document.createElement('td');
        itemCell.textContent = foodItem;
        row.appendChild(itemCell);

        const priceCell = document.createElement('td');
        priceCell.textContent = price.toFixed(2);
        row.appendChild(priceCell);

        const quantityCell = document.createElement('td');
        quantityCell.textContent = quantity;
        row.appendChild(quantityCell);

        const subtotal = price * quantity;
        const subtotalCell = document.createElement('td');
        subtotalCell.textContent = subtotal.toFixed(2);
        row.appendChild(subtotalCell);

        const actionCell = document.createElement('td');
        const removeButton = document.createElement('button');
        removeButton.textContent = 'Remove';
        removeButton.classList.add('removeButton');
        removeButton.addEventListener('click', () => {
            removeFromBill(row, subtotal);
        });
        actionCell.appendChild(removeButton);
        row.appendChild(actionCell);

        tableBody.appendChild(row);

        total += subtotal;
        updateTotal();
        clearInputs();
        saveBillToLocalStorage(foodItem, price, quantity, subtotal);
    }
}

function saveBillToLocalStorage(foodItem, price, quantity, subtotal) {
    const billDetails = JSON.parse(localStorage.getItem('billDetails')) || [];
    billDetails.push({ foodItem, price, quantity, subtotal });
    localStorage.setItem('billDetails', JSON.stringify(billDetails));
}

function removeFromBill(row, subtotal) {
    row.remove();
    total -= subtotal;
    updateTotal();
}

document.getElementById('applyDiscount').addEventListener('click', function() {
    const discount = parseFloat(document.getElementById('discount').value);
    if (!isNaN(discount) && discount >= 0) {
        // Calculate discount amount
        const discountAmount = (total * (discount / 100));
        
        // Apply discount
        originalTotal = total;
        total -= discountAmount;
        updateTotal(); // Update the displayed total
        
        if (discount > 20) {
            alert(`Discount of ${discount}% applied!`);
        }
    } else {
        alert("Please enter a valid discount percentage.");
    }
});

// Remove discount
document.getElementById('removeDiscount').addEventListener('click', function() {
    // Reset total back to the original amount
    total = originalTotal;
    updateTotal(); // Update the displayed total
    
    // Optionally, clear the discount input field
    document.getElementById('discount').value = '';
    alert("Discount has been removed.");
});


// Update the total price display
function updateTotal() {
    // Update the displayed total amount
    document.getElementById('totalAmount').textContent = total.toFixed(2); // Format the total with two decimal points
}

function clearInputs() {
    document.getElementById('foodItem').value = '';
    document.getElementById('price').value = '';
    document.getElementById('quantity').value = '';
}

function printBill() {
    // Get the necessary content for the bill
    const headerContent = `
        <header style="text-align: center; margin-bottom: 20px;">
            <h1>Fast Food Bill Management</h1>
            <p>Date: ${new Date().toLocaleString()}</p>
        </header>
    `;

    const tableContent = document.querySelector('table').outerHTML; // Get the entire table

    const newWindow = window.open('', '', 'width=600,height=400');
    newWindow.document.write(`
        <html>
            <head>
                <title>Print Bill</title>
                <style>
                    body { font-family: Arial, sans-serif; margin: 0; padding: 20px; background: white; }
                    table { width: 100%; border-collapse: collapse; }
                    th, td { padding: 10px; border: 1px solid #ddd; text-align: left; }
                    .total { text-align: center; margin-top: 20px; font-size: 1.5em; }
                </style>
            </head>
            <body>
             <header class="header text-center mb-4">
            <img src="Fast.avif" alt="Logo" class="logo mb-2" style="width: 100px" />
        </header>
                ${headerContent}
                ${tableContent}
                <div class="total">
                    <h2>Total: ₹ <span id="totalAmount">${document.getElementById('totalAmount').textContent}</span></h2>
                </div>
                <p>Thank you </P> 
            </body>
        </html>
    `);
    newWindow.document.close();
    newWindow.print();
}

