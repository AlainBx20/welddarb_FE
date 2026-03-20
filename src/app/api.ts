export const API_BASE_URL = 'http://localhost:8080';

export interface ProductDTO {
    id?: number;
    name: string;
    category: string;
    price: number;
    stock: number;
}

export interface OrderItemDTO {
    productId: number;
    quantity: number;
    price: number;
}

export interface OrderDTO {
    id?: number;
    customerName: string;
    customerEmail: string;
    address: string;
    total: number;
    status: string;
    items: OrderItemDTO[];
}

export async function fetchProducts(): Promise<ProductDTO[]> {
    try {
        const response = await fetch(`${API_BASE_URL}/products`);
        if (!response.ok) {
            throw new Error('Failed to fetch products');
        }
        return response.json();
    } catch (error) {
        console.error("fetchProducts error:", error);
        return []; // Return empty array on failure to avoid crashing
    }
}

export async function createProduct(product: ProductDTO): Promise<ProductDTO> {
    const response = await fetch(`${API_BASE_URL}/products`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(product),
    });
    if (!response.ok) {
        throw new Error('Failed to create product');
    }
    return response.json();
}

/**
 * Note: The backend currently lacks an OrderController.
 * This method is implemented to show how the link would work
 * once the Order API is exposed in the backend.
 */
export async function createOrder(order: OrderDTO): Promise<OrderDTO> {
    // Since we can't change the backend to add an OrderController,
    // we attempt the call and handle the expected 404/500 if the endpoint doesn't exist.
    const response = await fetch(`${API_BASE_URL}/orders`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(order),
    });
    if (!response.ok) {
        throw new Error(`Failed to create order: ${response.statusText}`);
    }
    return response.json();
}

