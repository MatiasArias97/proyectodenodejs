const socket = io();

// Función para actualizar la lista de productos en la interfaz
function updateProductList(products) {
    const productList = document.getElementById('productList');
    productList.innerHTML = ''; // Limpiar la lista actual
    products.forEach(product => {
        const li = document.createElement('li');
        // Se asume que product.id viene del backend; si usas MongoDB, podrías necesitar product._id
        li.id = `product-${product.id || product._id}`;
        li.innerHTML = `${product.title} - $${product.price} <button onclick="deleteProduct('${product.id || product._id}')">❌</button>`;
        productList.appendChild(li);
    });
}

// --- WebSockets para actualización en tiempo real de productos ---

// Escuchar evento de actualización de productos desde el servidor
socket.on('updateProducts', (products) => {
    updateProductList(products);
});

// Evento para agregar un producto mediante WebSockets
document.getElementById('productForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const title = document.getElementById('title').value;
    const price = document.getElementById('price').value;
    socket.emit('newProduct', { title, price });
    document.getElementById('title').value = '';
    document.getElementById('price').value = '';
});

// Función para eliminar un producto (envía el evento correspondiente)
window.deleteProduct = function(id) {
    socket.emit('deleteProduct', id);
};

// --- Funcionalidad para Filtros, Paginación y Ordenamiento ---
// (Se utiliza la API REST de la ruta GET /api/products, que ya configuramos en el servidor)

async function fetchProducts(params = {}) {
    // Crear una cadena de consulta a partir de los parámetros recibidos
    const queryString = new URLSearchParams(params).toString();
    try {
        const response = await fetch(`/api/products?${queryString}`);
        if (!response.ok) throw new Error('Error al obtener los productos');
        const data = await response.json();
        // Se espera que data tenga la forma: { products, total, page, pages }
        updateProductList(data.products);
        // Aquí podrías actualizar la UI de paginación (ej. mostrar página actual, total de páginas, etc.)
    } catch (error) {
        console.error(error);
    }
}

// Manejar el formulario de filtros (asegúrate de tenerlo en tu HTML con los IDs correspondientes)
document.getElementById('filterForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const category = document.getElementById('filterCategory').value;
    const priceRange = document.getElementById('filterPriceRange').value; // Ejemplo: "50-150"
    const sort = document.getElementById('filterSort').value;             // Ejemplo: "price:asc" o "price:desc"
    const page = document.getElementById('filterPage').value || 1;
    const limit = document.getElementById('filterLimit').value || 10;
    
    // Realiza la petición con los parámetros de filtro, paginación y ordenamiento
    fetchProducts({ category, priceRange, sort, page, limit });
});