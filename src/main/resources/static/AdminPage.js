const URL = "http://localhost:8080/api";
const URL_INFO = "http://localhost:8080/userInfo"

const listRoles = []
$(document).ready(function () {
    showAllUsers();
    fetch(URL + '/roles')
        .then(response => response.json())
        .then(roles => {
            roles.forEach(role => {
                listRoles.push(role)
            })
        })
})

async function getPage(){
    const response = await fetch(URL_INFO);
    if (!response.ok) {
        throw new Error(`Error: ${response.status}`)
    }

    const user = await response.json();
    showHeader(user);
}

function showHeader(user) {
    const headUsernameElement = document.getElementById("headerUsername");
    const headRoleElement = document.getElementById("headerRole");

    headUsernameElement.textContent = user.username;

    let roles = '';
    user.roles.forEach(role => {
        roles += role.name + ' ';
    });

    headRoleElement.textContent = roles.trim();
}


function showAllUsers() {
    const usersTable = $('.users-table')
    usersTable.empty()
    fetch(URL + '/users')
        .then(response => response.json())
        .then(users => {
            users.forEach(user => {
                let list = `$(
            <tr>
                <td>${user.id}</td>
                <td>${user.firstName}</td>
                <td>${user.lastName}</td>
                <td>${user.age}</td>            
                <td>${user.roles.map(r => r.name)}</td>
                <td>
                    <button class="btn btn-info text-white"
                            data-bs-toggle="modal"
                            data-bs-target="#editModal"
                            onclick="editModal(${user.id})">
                            Edit
                    </button>
                </td>
                <td>
                    <button class="btn btn-danger text-white"
                            data-bs-toggle="modal"
                            data-bs-target="#deleteModal"
                            onclick="deleteModal(${user.id})">
                            Delete
                    </button>
                </td>
            </tr>
            )`
                usersTable.append(list)
            })
        })
}

function showRoles(form) {
    $(`[name="roles"]`, form).empty();
    listRoles.forEach(role => {
        let option =`<option value="${role.id}">
                                ${role.name}
                            </option>`
        $(`[name="roles"]`, form).append(option)
    })
}

function getRole(form) {
    let role = []
    let option = $(`[name = "roles"]`, form)[0].options
    for (let i = 0; i < option.length; i++) {
        if (option[i].selected) {
            role.push(listRoles[i])
        }
    }
    return role
}

function createUser(){
    let createUserForm = $('#create-user-form')[0]
    showRoles(createUserForm);
    createUserForm.addEventListener("submit", (ev) => {
        ev.preventDefault()
        ev.stopPropagation()

        let newUser = JSON.stringify({
            firstName: $(`[name = "firstName"]`, createUserForm).val(),
            lastName: $(`[name = "lastName"]`, createUserForm).val(),
            age: $(`[name = "age"]`, createUserForm).val(),
            username: $(`[name = "username"]`, createUserForm).val(),
            password: $(`[name = "password"]`, createUserForm).val(),
            roles: getRole(createUserForm)
        })
        fetch(URL + '/users', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: newUser
        })
            .then(r => {
                if (!r.ok) {
                    alert("This username already used")
                } else {
                    $('#users-table-tab')[0].click()
                }
            })
    })
}


function showModal(form, modal, id) {
    modal.show()
    showRoles(form)
    fetch(URL + `/users/${id}`)
        .then(response => {
            response.json()
                .then(user => {
                    $(`[name = "id"]`, form).val(user.id)
                    $(`[name = "firstName"]`, form).val(user.firstName)
                    $(`[name = "lastName"]`, form).val(user.lastName)
                    $(`[name = "age"]`, form).val(user.age)
                    $(`[name = "username"]`, form).val(user.username)
                    $(`[name = "password"]`, form).val()

                })
        })

}

function editModal(id) {
    const editModal = new bootstrap.Modal($('.edit-modal'))
    const editForm = $('#edit-form')[0]
    showModal(editForm, editModal, id)
    editForm.addEventListener('submit', (ev) => {
        ev.preventDefault()
        ev.stopPropagation()
        let newUser = JSON.stringify({
            id: $(`[name="id"]` , editForm).val(),
            firstName:  $(`[name="firstName"]` , editForm).val(),
            lastName:  $(`[name="lastName"]` , editForm).val(),
            age:  $(`[name="age"]` , editForm).val(),
            username:  $(`[name="username"]` , editForm).val(),
            password:  $(`[name="password"]` , editForm).val(),
            roles: getRole(editForm)
        })
        fetch(URL + `/users/${$(`[name = "id"]`, editForm).val()}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: newUser
        })
            .then(r => {
                editModal.hide()
                $('#users-table-tab')[0].click()
                if (!r.ok) {
                    alert("This username already used")
                }
            })
    })
}

function deleteModal(id) {
    const deleteModal = new bootstrap.Modal($('.delete-modal'))
    const deleteForm = $('#delete-form')[0]
    showModal(deleteForm, deleteModal, id)
    deleteForm.addEventListener('submit', (ev) => {
        ev.preventDefault()
        ev.stopPropagation()

        fetch(URL + `/users/${$(`[name = "id"]`, deleteForm).val()}`, {
            method: 'DELETE'
        })
        .then(r => {
                deleteModal.hide()
                $('#users-table-tab')[0].click()
                if (!r.ok) {
                    alert("Delete failed")
                }
            })
    })
}
getPage();


