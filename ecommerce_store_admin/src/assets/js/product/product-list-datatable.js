$(document).ready(function () {
  console.log('Initializing product DataTable...');
  
  const table = $('#product-table').DataTable({
    processing: true,
    serverSide: false,
    ajax: {
      url: '/products',
      type: 'GET',
      headers: {
        'Accept': 'application/json',
        'X-Requested-With': 'XMLHttpRequest'
      },
      dataSrc: function (json) {
        console.log('Products data received:', json);
        return json.data ? json.data : [];
      },
      error: function (xhr, error, code) {
        console.error('DataTable AJAX error:', error, code);
        console.error('Response:', xhr.responseText);
      }
    },
    columns: [
      { 
        data: 'id',
        title: 'ID',
        width: '5%'
      },
      { 
        data: 'name',
        title: 'Product Name',
        width: '25%'
      },
      { 
        data: 'price',
        title: 'Price',
        width: '15%',
        render: function (data, type, row) {
          return '$' + parseFloat(data).toFixed(2);
        }
      },
      { 
        data: 'stock',
        title: 'Stock',
        width: '15%',
        render: function (data, type, row) {
          if (data > 10) {
            return `<span class="badge bg-success">${data}</span>`;
          } else if (data > 0) {
            return `<span class="badge bg-warning">${data}</span>`;
          } else {
            return `<span class="badge bg-danger">${data}</span>`;
          }
        }
      },
      { 
        data: 'category',
        title: 'Category',
        width: '20%'
      },
      {
        data: null,
        title: 'Actions',
        width: '20%',
        orderable: false,
        render: function (data, type, row) {
          return `
            <div class="dropdown d-inline-block">
              <button class="btn btn-soft-secondary btn-sm dropdown" type="button" data-bs-toggle="dropdown"
                aria-expanded="false">
                <i class="ri-more-fill align-middle"></i>
              </button>
              <ul class="dropdown-menu dropdown-menu-end">
                <li><a href="/products/${row.id}" class="dropdown-item"><i class="ri-eye-fill align-bottom me-2 text-muted"></i> View</a></li>
                <li><a href="/products/${row.id}/edit" class="dropdown-item edit-item-btn"><i class="ri-pencil-fill align-bottom me-2 text-muted"></i> Edit</a></li>
                <li>
                  <a href="#" class="dropdown-item remove-item-btn" onclick="deleteProduct(${row.id}); return false;">
                    <i class="ri-delete-bin-fill align-bottom me-2 text-muted"></i> Delete
                  </a>
                </li>
              </ul>
            </div>
          `;
        }
      }
    ],
    order: [[0, 'desc']], // Sort by ID descending
    language: {
      emptyTable: "No products available",
      loadingRecords: "Loading products...",
      processing: "Processing..."
    }
  });

  console.log('Product DataTable initialized');
});

// Delete product function
function deleteProduct(productId) {
  if (confirm('Are you sure you want to delete this product?')) {
    // Create a form dynamically
    const form = document.createElement('form');
    form.method = 'POST';
    form.action = `/products/${productId}?_method=DELETE`;
    
    // Add hidden input for method override
    const methodInput = document.createElement('input');
    methodInput.type = 'hidden';
    methodInput.name = '_method';
    methodInput.value = 'DELETE';
    form.appendChild(methodInput);
    
    // Append to body and submit
    document.body.appendChild(form);
    form.submit();
  }
}