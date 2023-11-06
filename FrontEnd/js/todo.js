document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('addItemForm').addEventListener('submit', createItem);
    document.getElementById('editItemForm').addEventListener('submit', updateItem);
    fetchItems();
});

function fetchItems() {
    // Fetch items as before...
}

function createItem(event) {
    event.preventDefault();
    const name = document.getElementById('newItemName').value;
    const description = document.getElementById('newItemDescription').value;

    fetch('http://localhost:3000/api/items', { // Replace with your actual API URL
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, description })
    })
    .then(response => response.json())
    .then(data => {
        document.getElementById('newItemName').value = ''; // Clear the form
        document.getElementById('newItemDescription').value = '';
        fetchItems(); // Refresh the items list
    })
    .catch(error => console.error('Error adding item:', error));
}

function updateItem(event) {
    event.preventDefault();
    const id = document.getElementById('editItemId').value;
    const name = document.getElementById('editItemName').value;
    const description = document.getElementById('editItemDescription').value;

    fetch(`http://localhost:3000/api/items/${id}`, { // Replace with your actual API URL
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id, name, description })
    })
    .then(() => {
        document.getElementById('edit-item-form').style.display = 'none';
        fetchItems(); // Refresh the items list
    })
    .catch(error => console.error('Error updating item:', error));
}

function deleteItem(id) {
    fetch(`http://localhost:3000/api/items/${id}`, { // Replace with your actual API URL
        method: 'DELETE'
    })
    .then(() => fetchItems()) // Refresh the items list
    .catch(error => console.error('Error deleting item:', error));
}

function editItem(id, name, description) {
    document.getElementById('editItemId').value = id;
    document.getElementById('editItemName').value = name;
    document.getElementById('editItemDescription').value = description;
    document.getElementById('edit-item-form').style.display = 'block';
}

function cancelEdit() {
    document.getElementById('edit-item-form').style.display = 'none';
}

function fetchItems() {
    fetch('http://localhost:3000/api/items') // Replace with your actual API URL
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            return response.json();
        })
        .then(data => {
            const container = document.getElementById('items-container');
            container.innerHTML = ''; // Clear the container
            data.forEach(item => {
                const itemDiv = document.createElement('div');
                itemDiv.className = 'item';
                itemDiv.innerHTML = `
                    <strong>Name:</strong> ${item.name}<br>
                    <strong>Description:</strong> ${item.description}<br>
                    <button onclick="editItem('${item.id}', '${item.name}', '${item.description}')">Edit</button>
                    <button onclick="deleteItem('${item.id}')">Delete</button>
                `;
                container.appendChild(itemDiv);
            });
        })
        .catch(error => {
            console.error('There has been a problem with your fetch operation:', error);
        });
}
