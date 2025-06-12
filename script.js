// Global variables
let items = [];
let invoiceCounter = 1;

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    // Set today's date as default
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('invoiceDate').value = today;
    updatePreview();
    generateInvoiceNumber();
});

// Generate unique invoice number
function generateInvoiceNumber() {
    const invoiceNum = `INV-${String(invoiceCounter).padStart(3, '0')}`;
    document.getElementById('invoiceNumber').textContent = invoiceNum;
    return invoiceNum;
}

// Add item to the invoice
function addItem() {
    const productName = document.getElementById('productName').value.trim();
    const quantity = parseInt(document.getElementById('quantity').value) || 0;
    const pricePerUnit = parseFloat(document.getElementById('pricePerUnit').value) || 0;

    // Validation
    if (!productName) {
        alert('Please enter a product name');
        return;
    }
    if (quantity <= 0) {
        alert('Please enter a valid quantity');
        return;
    }
    if (pricePerUnit <= 0) {
        alert('Please enter a valid price');
        return;
    }

    // Create item object
    const item = {
        id: Date.now(),
        product: productName,
        quantity: quantity,
        pricePerUnit: pricePerUnit,
        total: quantity * pricePerUnit
    };

    // Add to items array
    items.push(item);

    // Clear form fields
    document.getElementById('productName').value = '';
    document.getElementById('quantity').value = '';
    document.getElementById('pricePerUnit').value = '';

    // Update preview
    updatePreview();
    
    // Focus back to product name input
    document.getElementById('productName').focus();
}

// Remove item from invoice
function removeItem(itemId) {
    items = items.filter(item => item.id !== itemId);
    updatePreview();
}

// Update the invoice preview
function updatePreview() {
    // Update customer name
    const customerName = document.getElementById('customerName').value || 'Customer Name';
    document.getElementById('previewCustomerName').textContent = customerName;

    // Update invoice date
    const invoiceDate = document.getElementById('invoiceDate').value || '-';
    const formattedDate = invoiceDate ? new Date(invoiceDate).toLocaleDateString() : '-';
    document.getElementById('previewInvoiceDate').textContent = formattedDate;

    // Update items table
    const tableBody = document.getElementById('itemsTableBody');
    
    if (items.length === 0) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="4" class="border border-gray-300 px-3 py-8 text-center text-gray-500">
                    No items added yet
                </td>
            </tr>
        `;
    } else {
        tableBody.innerHTML = items.map(item => `
            <tr>
                <td class="border border-gray-300 px-3 py-2">${item.product}</td>
                <td class="border border-gray-300 px-3 py-2 text-center">${item.quantity}</td>
                <td class="border border-gray-300 px-3 py-2 text-right">₦ ${item.pricePerUnit.toFixed(2)}</td>
                <td class="border border-gray-300 px-3 py-2 text-right">
                    ₦ ${item.total.toFixed(2)}
                    <button onclick="removeItem(${item.id})" class="ml-2 text-red-500 hover:text-red-700">
                        <i class="fas fa-times text-xs"></i>
                    </button>
                </td>
            </tr>
        `).join('');
    }

    // Update total amount
    const total = items.reduce((sum, item) => sum + item.total, 0);
    document.getElementById('totalAmount').textContent = `₦ ${total.toFixed(2)}`;
}

// Generate invoice (update counter and number)
function generateInvoice() {
    if (items.length === 0) {
        alert('Please add at least one item to generate an invoice');
        return;
    }

    const customerName = document.getElementById('customerName').value.trim();
    if (!customerName) {
        alert('Please enter a customer name');
        return;
    }

    invoiceCounter++;
    generateInvoiceNumber();
    alert('Invoice generated successfully! You can now download it as PDF.');
}

// Clear all data
function clearAll() {
    if (confirm('Are you sure you want to clear all data?')) {
        items = [];
        document.getElementById('customerName').value = '';
        document.getElementById('productName').value = '';
        document.getElementById('quantity').value = '';
        document.getElementById('pricePerUnit').value = '';
        const today = new Date().toISOString().split('T')[0];
        document.getElementById('invoiceDate').value = today;
        updatePreview();
    }
}

// Download invoice as PDF
async function downloadPDF() {
    if (items.length === 0) {
        alert('Please add at least one item before downloading');
        return;
    }

    const customerName = document.getElementById('customerName').value.trim();
    if (!customerName) {
        alert('Please enter a customer name before downloading');
        return;
    }

    try {
        // Show loading state
        const downloadBtn = document.querySelector('button[onclick="downloadPDF()"]');
        const originalText = downloadBtn.innerHTML;
        downloadBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Generating PDF...';
        downloadBtn.disabled = true;

        // Get the invoice preview element
        const invoiceElement = document.getElementById('invoicePreview');
        
        // Create a temporary container for PDF generation
        const tempContainer = document.createElement('div');
        tempContainer.style.position = 'absolute';
        tempContainer.style.left = '-9999px';
        tempContainer.style.top = '0';
        tempContainer.style.width = '800px';
        tempContainer.style.backgroundColor = 'white';
        tempContainer.style.padding = '20px';
        
        // Clone the invoice content
        const clonedInvoice = invoiceElement.cloneNode(true);
        
        // Remove action buttons from cloned content
        const removeButtons = clonedInvoice.querySelectorAll('button');
        removeButtons.forEach(btn => btn.remove());
        
        tempContainer.appendChild(clonedInvoice);
        document.body.appendChild(tempContainer);

        // Generate canvas from the temporary container
        const canvas = await html2canvas(tempContainer, {
            scale: 2,
            useCORS: true,
            backgroundColor: '#ffffff'
        });

        // Remove temporary container
        document.body.removeChild(tempContainer);

        // Create PDF
        const { jsPDF } = window.jspdf;
        const pdf = new jsPDF('p', 'mm', 'a4');
        
        const imgWidth = 210; // A4 width in mm
        const pageHeight = 295; // A4 height in mm
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        
        let heightLeft = imgHeight;
        let position = 0;

        // Add first page
        pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;

        // Add additional pages if needed
        while (heightLeft >= 0) {
            position = heightLeft - imgHeight;
            pdf.addPage();
            pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, position, imgWidth, imgHeight);
            heightLeft -= pageHeight;
        }

        // Generate filename
        const invoiceNum = document.getElementById('invoiceNumber').textContent;
        const sanitizedCustomerName = customerName.replace(/[^a-zA-Z0-9]/g, '_');
        const filename = `Invoice_${invoiceNum}_${sanitizedCustomerName}.pdf`;

        // Save the PDF
        pdf.save(filename);

        // Reset button state
        downloadBtn.innerHTML = originalText;
        downloadBtn.disabled = false;

    } catch (error) {
        console.error('Error generating PDF:', error);
        alert('Error generating PDF. Please try again.');
        
        // Reset button state
        const downloadBtn = document.querySelector('button[onclick="downloadPDF()"]');
        downloadBtn.innerHTML = '<i class="fas fa-download mr-2"></i>Download PDF';
        downloadBtn.disabled = false;
    }
}

// Handle Enter key press on input fields
document.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        const target = e.target;
        
        if (target.id === 'customerName') {
            document.getElementById('productName').focus();
        } else if (target.id === 'productName') {
            document.getElementById('quantity').focus();
        } else if (target.id === 'quantity') {
            document.getElementById('pricePerUnit').focus();
        } else if (target.id === 'pricePerUnit') {
            addItem();
        }
    }
});

// Update preview when customer name or date changes
document.getElementById('customerName').addEventListener('input', updatePreview);
document.getElementById('invoiceDate').addEventListener('change', updatePreview);

// Auto-calculate total when typing in quantity or price fields
document.getElementById('quantity').addEventListener('input', showCalculation);
document.getElementById('pricePerUnit').addEventListener('input', showCalculation);

function showCalculation() {
    const quantity = parseFloat(document.getElementById('quantity').value) || 0;
    const price = parseFloat(document.getElementById('pricePerUnit').value) || 0;
    const total = quantity * price;
    
    // You could add a small preview of the calculation here if desired
    if (quantity > 0 && price > 0) {
        // Could show a small calculation preview
    }
}
