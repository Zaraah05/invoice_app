# Receipt & Invoice Generator

A modern, responsive web application for generating receipts and invoices with PDF download functionality.

## Features

- **Modern UI**: Built with Tailwind CSS for a clean, professional look
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile devices
- **Real-time Preview**: See your invoice update as you add items
- **PDF Download**: Download invoices as PDF files with one click
- **Easy Item Management**: Add and remove items with validation
- **Auto-calculations**: Automatic total calculations
- **Customer Information**: Store customer details and invoice dates
- **Unique Invoice Numbers**: Auto-generated invoice numbering system

## How to Use

### 1. Setup
- Open `index.html` in any modern web browser
- No additional setup required - all dependencies are loaded via CDN

### 2. Creating an Invoice

1. **Enter Customer Information**:
   - Fill in the customer name
   - Set the invoice date (defaults to today)

2. **Add Items**:
   - Enter product name
   - Specify quantity
   - Set price per unit
   - Click "Add Item" or press Enter

3. **Review Invoice**:
   - Check the preview on the right side
   - Remove items if needed by clicking the × button
   - Verify the total amount

4. **Generate & Download**:
   - Click "Generate Invoice" to finalize
   - Click "Download PDF" to save the invoice

### 3. Keyboard Shortcuts
- **Enter**: Move to next field or add item
- **Tab**: Navigate between fields

## Technical Details

### Technologies Used
- **HTML5**: Structure and semantic markup
- **Tailwind CSS**: Styling and responsive design
- **JavaScript**: Interactive functionality
- **jsPDF**: PDF generation
- **html2canvas**: HTML to canvas conversion
- **Font Awesome**: Icons

### Browser Compatibility
- Chrome 60+
- Firefox 55+
- Safari 11+
- Edge 79+

### File Structure
```
fatima_app/
├── index.html          # Main HTML file
├── script.js           # JavaScript functionality
└── README.md          # This file
```

## Features in Detail

### PDF Generation
- High-quality PDF output
- A4 paper size format
- Automatic page breaks for long invoices
- Filename includes invoice number and customer name

### Invoice Management
- Unique invoice numbering (INV-001, INV-002, etc.)
- Real-time total calculation
- Input validation for all fields
- Clear all functionality

### Responsive Design
- Mobile-first approach
- Grid layout that adapts to screen size
- Touch-friendly interface for mobile devices

## Customization

### Company Information
To change the company details, modify the header section in `index.html`:
```html
<p class="text-gray-600">Your Company Name, Address | Phone: Your Phone Number</p>
```

### Styling
The application uses Tailwind CSS classes. You can customize:
- Colors by changing color classes (e.g., `bg-blue-600` to `bg-green-600`)
- Spacing by modifying padding/margin classes
- Typography by changing font classes

### Currency
Currently set to Nigerian Naira (₦). To change:
1. Update the currency symbol in `script.js`
2. Modify the `updatePreview()` function

## Troubleshooting

### PDF Download Issues
- Ensure you're using a modern browser
- Check that JavaScript is enabled
- Try refreshing the page if download fails

### Display Issues
- Clear browser cache
- Ensure internet connection for CDN resources
- Check browser console for errors

## Support

For issues or questions about this application, please check:
1. Browser console for JavaScript errors
2. Network tab for CDN loading issues
3. Ensure all required fields are filled before generating invoice

## License

This project is open source and available under the MIT License.
