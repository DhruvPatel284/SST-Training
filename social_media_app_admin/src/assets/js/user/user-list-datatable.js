$(document).ready(function () {
  $('#user-table').DataTable({
    processing: true,
    serverSide: false,
    ajax: {
      url: '/users',
      type: 'GET',
      // request all records so DataTable handles client-side paging
      data: { limit: 100 },
      dataSrc: function (json) {
        return json.data ? json.data : [];
      },
    },
    paging: true,
    lengthChange: true,
    lengthMenu: [[10, 25, 50, 100], [10, 25, 50, 100]],
    pageLength: 10,
    columns: [
      { title: 'ID',          data: 'id' },
      { title: 'Name',        data: 'name' },
      { title: 'Email',       data: 'email' },
      { title: 'Phone',       data: 'phoneNumber' },
      {
        title: 'Created',
        data: 'createdAt',
        render: function (date) {
          return date ? new Date(date).toLocaleDateString() : '—';
        },
      },
      {
        title: 'Actions',
        data: null,
        orderable: false,
        render: function (data, type, row) {
          return `
            <div class="dropdown d-inline-block">
              <button class="btn btn-soft-secondary btn-sm dropdown" type="button"
                data-bs-toggle="dropdown" aria-expanded="false">
                <i class="ri-more-fill align-middle"></i>
              </button>
              <ul class="dropdown-menu dropdown-menu-end">
                <li>
                  <a href="/users/${row.id}" class="dropdown-item">
                    <i class="ri-eye-fill align-bottom me-2 text-muted"></i> View
                  </a>
                </li>
                <li>
                  <a href="/users/${row.id}/edit" class="dropdown-item edit-item-btn">
                    <i class="ri-pencil-fill align-bottom me-2 text-muted"></i> Edit
                  </a>
                </li>
                <li>
                  <form action="/users/${row.id}" method="POST"
                    onsubmit="return confirm('Are you sure you want to delete this user?');">
                    <input type="hidden" name="_method" value="DELETE">
                    <button type="submit" class="dropdown-item remove-item-btn">
                      <i class="ri-delete-bin-fill align-bottom me-2 text-muted"></i> Delete
                    </button>
                  </form>
                </li>
              </ul>
            </div>
          `;
        },
      },
    ],
    order: [[0, 'asc']],
    language: {
      processing:  '<span class="spinner-border spinner-border-sm me-2"></span> Loading...',
      emptyTable:  'No users found.',
    },
  });
});