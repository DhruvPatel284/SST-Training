$(document).ready(function () {
  console.log('Initializing user DataTable...');
  
  var table = $('#user-table').DataTable({
    processing: true,
    serverSide: false,
    ajax: {
      url: '/users',
      type: 'GET',
      headers: {
        'Accept': 'application/json',
        'X-Requested-With': 'XMLHttpRequest'
      },
      data: function (d) {
        return {
          limit: 1000,
          page: 1
        };
      },
      dataSrc: function (json) {
        console.log('Users data received:', json);
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
        width: '8%'
      },
      { 
        data: 'name',
        title: 'Name',
        width: '20%'
      },
      { 
        data: 'email',
        title: 'Email',
        width: '25%'
      },
      { 
        data: 'phoneNumber',
        title: 'Phone Number',
        width: '15%',
      },
      { 
        data: 'createdAt',
        title: 'Created At',
        width: '15%',
        render: function(data, type, row) {
          if (type === 'display' || type === 'filter') {
            return new Date(data).toLocaleDateString();
          }
          return data;
        }
      },
      {
        data: null,
        title: 'Actions',
        orderable: false,
        width: '12%',
        render: function (data, type, row) {
          return `
            <div class="dropdown d-inline-block">
              <button class="btn btn-soft-secondary btn-sm" type="button" 
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
                  <a href="/users/${row.id}/edit" class="dropdown-item">
                    <i class="ri-pencil-fill align-bottom me-2 text-muted"></i> Edit
                  </a>
                </li>
                <li>
                  <a href="javascript:void(0);" 
                     class="dropdown-item text-danger remove-item-btn" 
                     data-user-id="${row.id}"
                     data-user-name="${row.name}">
                    <i class="ri-delete-bin-fill align-bottom me-2"></i> Delete
                  </a>
                </li>
              </ul>
            </div>
          `;
        }
      }
    ],
    paging: true,
    pageLength: 10,
    lengthChange: true,
    lengthMenu: [
      [10, 25, 50, 100, -1],
      [10, 25, 50, 100, 'All']
    ],
    order: [[0, 'asc']],
    language: {
      emptyTable: 'No users available',
      loadingRecords: 'Loading users...',
      processing: 'Processing...',
      lengthMenu: 'Show _MENU_ entries',
      info: 'Showing _START_ to _END_ of _TOTAL_ users',
      paginate: {
        first: 'First',
        last: 'Last',
        next: 'Next',
        previous: 'Previous'
      }
    }
  });

  console.log('DataTable initialized:', table);

  // Delete user with SweetAlert2
  $(document).on('click', '.remove-item-btn', function(e) {
    e.preventDefault();
    var userId = $(this).data('user-id');
    var userName = $(this).data('user-name');

    console.log('Delete clicked for user:', userId, userName);

    Swal.fire({
      title: 'Are you sure?',
      html: 'You are about to delete user: <strong>' + userName + '</strong>',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#f06548',
      cancelButtonColor: '#74788d',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        // Show loading
        Swal.fire({
          title: 'Deleting...',
          text: 'Please wait',
          allowOutsideClick: false,
          didOpen: () => {
            Swal.showLoading();
          }
        });

        // Create and submit delete form
        var form = document.createElement('form');
        form.method = 'POST';
        form.action = '/users/' + userId + '?_method=DELETE';

        var methodInput = document.createElement('input');
        methodInput.type = 'hidden';
        methodInput.name = '_method';
        methodInput.value = 'DELETE';
        form.appendChild(methodInput);

        document.body.appendChild(form);
        form.submit();
      }
    });
  });
});