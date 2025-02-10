const socket = io(); // Conectar al WebSocket

socket.on('updateProducts', (products) => {
    const productList = document.getElementById('productList');
    productList.innerHTML = ''; // Limpiar la lista de productos
    products.forEach(product => {
        const li = document.createElement('li');
        li.id = `product-${product.id}`;
        li.innerHTML = `${product.title} - $${product.price} <button onclick="deleteProduct('${product.id}')">❌</button>`;
        productList.appendChild(li);
    });
});

// Enviar evento para agregar un producto
document.getElementById('productForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const title = document.getElementById('title').value;
    const price = document.getElementById('price').value;
    socket.emit('newProduct', { title, price });
    document.getElementById('title').value = '';
    document.getElementById('price').value = '';
});

window.deleteProduct = function(id) {
    socket.emit('deleteProduct', id);
};
