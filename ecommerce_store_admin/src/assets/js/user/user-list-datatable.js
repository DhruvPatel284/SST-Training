
$(document).ready(function () {
 $('#user-table').DataTable({
  processing: true,
  serverSide: false,
  ajax: {
   url: '/users',
   type: 'GET',
   dataSrc: function (json) {
    return json.data ? json.data : [];
   }
  },
  columns: [
   { data: 'id' },
   { data: 'name' },
   { data: 'email' },
   { data: 'phoneNumber' },
   { data: 'createdAt' },
   {
    data: null,
    orderable: false,
    render: function (data, type, row) {
     return `
      <div class="dropdown d-inline-block">
        <button class="btn btn-soft-secondary btn-sm dropdown" type="button" data-bs-toggle="dropdown"
          aria-expanded="false">
          <i class="ri-more-fill align-middle"></i>
        </button>
        <ul class="dropdown-menu dropdown-menu-end">
          <li><a href="/users/${row.id}" class="dropdown-item"><i class="ri-eye-fill align-bottom me-2 text-muted"></i> View</a></li>
          <li><a href="/users/${row.id}/edit" class="dropdown-item edit-item-btn"><i class="ri-pencil-fill align-bottom me-2 text-muted"></i> Edit</a></li>
          <li>
              <a href="#" class="dropdown-item text-danger remove-item-btn"
                data-user-id="${row.id}"
                data-bs-toggle="modal"
                data-bs-target="#deleteConfirmationModal">
                <i class="ri-delete-bin-fill align-bottom me-2"></i> Delete
              </a>
          </li>
        </ul>
      </div>
    `;
    }
   }
  ]
 });
  // ── Delete via modal ────────────────────────────────────────────────
 $(document).on('click', '.remove-item-btn', function (e) {
    e.preventDefault();
    const userId = $(this).data('user-id');
    $('#modal-row-id').val(userId);
  });

 $('#delete-form').on('submit', function (e) {
    e.preventDefault();
    const userId = $('#modal-row-id').val();
    if (!userId) return;

    const form = document.createElement('form');
    form.method = 'POST';
    form.action = `/users/${userId}?_method=DELETE`;

    const input = document.createElement('input');
    input.type = 'hidden';
    input.name = '_method';
    input.value = 'DELETE';
    form.appendChild(input);

    document.body.appendChild(form);
    form.submit();
  });

});
