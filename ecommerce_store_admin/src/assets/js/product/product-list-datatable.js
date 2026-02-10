$(document).ready(function () {
  console.log('Initializing product DataTable...');

  $('#product-table').DataTable({
    processing: true,
    serverSide: false,
    ajax: {
      url: '/products',
      type: 'GET',
      headers: {
        'Accept': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
      },
      // nestjs-paginate wraps results in { data: [], meta: {}, links: {} }
      // We need to fetch ALL records, so we pass a large limit
      data: function (d) {
        return {
          limit: 1000,
          page: 1,
        };
      },
      dataSrc: function (json) {
        console.log('Products response:', json);
        // nestjs-paginate returns { data: [...] }
        if (json.data) return json.data;
        // fallback if it returns a plain array
        if (Array.isArray(json)) return json;
        return [];
      },
      error: function (xhr, error, code) {
        console.error('DataTable AJAX error:', error, code, xhr.responseText);
      },
    },
    columns: [
      {
        data: 'id',
        title: 'ID',
        width: '5%',
      },
      {
        data: 'name',
        title: 'Product Name',
      },
      {
        data: 'price',
        title: 'Price',
        render: function (data) {
          return '$' + parseFloat(data).toFixed(2);
        },
      },
      {
        data: 'stock',
        title: 'Stock',
        render: function (data) {
          if (data > 10) {
            return `<span class="badge bg-success">${data}</span>`;
          } else if (data > 0) {
            return `<span class="badge bg-warning">${data}</span>`;
          } else {
            return `<span class="badge bg-danger">${data}</span>`;
          }
        },
      },
      {
        data: 'category',
        title: 'Category',
      },
      {
        data: null,
        title: 'Actions',
        orderable: false,
        render: function (data, type, row) {
          return `
            <div class="dropdown d-inline-block">
              <button class="btn btn-soft-secondary btn-sm" type="button"
                data-bs-toggle="dropdown" aria-expanded="false">
                <i class="ri-more-fill align-middle"></i>
              </button>
              <ul class="dropdown-menu dropdown-menu-end">
                <li>
                  <a href="/products/${row.id}" class="dropdown-item">
                    <i class="ri-eye-fill align-bottom me-2 text-muted"></i> View
                  </a>
                </li>
                <li>
                  <a href="/products/${row.id}/edit" class="dropdown-item">
                    <i class="ri-pencil-fill align-bottom me-2 text-muted"></i> Edit
                  </a>
                </li>
                <li>
                  <a href="#" class="dropdown-item text-danger remove-item-btn"
                    data-product-id="${row.id}"
                    data-bs-toggle="modal"
                    data-bs-target="#deleteConfirmationModal">
                    <i class="ri-delete-bin-fill align-bottom me-2"></i> Delete
                  </a>
                </li>
              </ul>
            </div>`;
        },
      },
    ],

    // ── Pagination & length menu ──────────────────────────────────────
    paging: true,
    pageLength: 10,
    lengthChange: true,
    lengthMenu: [
      [10, 25, 50, 100, -1],
      [10, 25, 50, 100, 'All'],
    ],

    order: [[0, 'desc']],
    language: {
      emptyTable: 'No products available',
      loadingRecords: 'Loading products…',
      processing: 'Processing…',
      lengthMenu: 'Show _MENU_ entries',
      info: 'Showing _START_ to _END_ of _TOTAL_ products',
    },
  });

  // ── Delete via modal ────────────────────────────────────────────────
  $(document).on('click', '.remove-item-btn', function (e) {
    e.preventDefault();
    const productId = $(this).data('product-id');
    $('#modal-row-id').val(productId);
  });

  $('#delete-form').on('submit', function (e) {
    e.preventDefault();
    const productId = $('#modal-row-id').val();
    if (!productId) return;

    const form = document.createElement('form');
    form.method = 'POST';
    form.action = `/products/${productId}?_method=DELETE`;

    const input = document.createElement('input');
    input.type = 'hidden';
    input.name = '_method';
    input.value = 'DELETE';
    form.appendChild(input);

    document.body.appendChild(form);
    form.submit();
  });
});