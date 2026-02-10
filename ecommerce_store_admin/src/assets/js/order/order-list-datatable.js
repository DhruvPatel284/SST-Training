$(document).ready(function () {

  // Detect if we're on a user-specific orders page
  const pathParts = window.location.pathname.split('/');
  const isUserOrders = pathParts.includes('user');
  const userId = isUserOrders ? pathParts[pathParts.indexOf('user') + 1] : null;
  const ajaxUrl = userId ? `/orders/user/${userId}` : '/orders';

  const statusBadge = {
    pending:   '<span class="badge bg-warning-subtle   text-warning   text-capitalize">Pending</span>',
    confirmed: '<span class="badge bg-info-subtle      text-info      text-capitalize">Confirmed</span>',
    shipped:   '<span class="badge bg-primary-subtle   text-primary   text-capitalize">Shipped</span>',
    delivered: '<span class="badge bg-success-subtle   text-success   text-capitalize">Delivered</span>',
    cancelled: '<span class="badge bg-danger-subtle    text-danger    text-capitalize">Cancelled</span>',
  };

  $('#order-table').DataTable({
    processing: true,
    serverSide: false,
    ajax: {
      url: ajaxUrl,
      type: 'GET',
      headers: {
        'Accept': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
      },
      // Fetch all records so DataTables handles pagination client-side
      data: function (d) {
        return {
          limit: 1000,
          page: 1,
        };
      },
      dataSrc: function (json) {
        console.log('Orders response:', json);
        if (json.data) return json.data;
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
        title: 'Order ID',
        width: '8%',
        render: function (data) {
          return `<span class="fw-medium">#${data}</span>`;
        },
      },
      {
        data: 'user',
        title: 'Customer',
        render: function (data) {
          if (!data) return '<span class="text-muted">–</span>';
          return `
            <div>
              <p class="mb-0 fw-medium">${data.name || '–'}</p>
              <small class="text-muted">${data.email || ''}</small>
            </div>`;
        },
      },
      {
        data: 'order_items',
        title: 'Items',
        width: '8%',
        render: function (data) {
          return `<span class="badge bg-secondary-subtle text-secondary">${data ? data.length : 0}</span>`;
        },
      },
      {
        data: 'total_amount',
        title: 'Total',
        render: function (data) {
          return `<span class="fw-medium text-primary">$${parseFloat(data).toFixed(2)}</span>`;
        },
      },
      {
        data: 'status',
        title: 'Status',
        render: function (data) {
          return statusBadge[data] || `<span class="badge bg-secondary text-capitalize">${data}</span>`;
        },
      },
      {
        data: 'order_date',
        title: 'Order Date',
        render: function (data) {
          return new Date(data).toLocaleDateString();
        },
      },
      {
        data: null,
        title: 'Actions',
        width: '10%',
        orderable: false,
        render: function (data, type, row) {
          return `
            <a href="/orders/${row.id}" class="btn btn-sm btn-soft-primary">
              <i class="ri-eye-line align-middle"></i> View
            </a>`;
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
      emptyTable: 'No orders found',
      loadingRecords: 'Loading orders…',
      processing: 'Processing…',
      lengthMenu: 'Show _MENU_ entries',
      info: 'Showing _START_ to _END_ of _TOTAL_ orders',
    },
  });
});