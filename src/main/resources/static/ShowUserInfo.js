const URL = "http://localhost:8080/userInfo"

async function getPage(){
    const response = await fetch(URL);
    if (!response.ok) {
        throw new Error(`Error: ${response.status}`)
    }

    const user = await response.json();
    showHeader(user);
    showUserInfo(user);
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


function showUserInfo(user) {
    const tableBody = document.getElementById("tableUser");
    const roles = user.roles.map(role => role.name);

    tableBody.innerHTML = `
    <tr>
        <td>${user.id}</td>
        <td>${user.firstName}</td>
        <td>${user.lastName}</td>
        <td>${user.age}</td>
        <td>${roles}</td>
    </tr>`;
}

getPage();