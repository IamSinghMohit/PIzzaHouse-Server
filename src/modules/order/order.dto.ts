import { Order } from "./model/order";

class OrderDto {
    id;
    user_full_name;
    image;
    address;
    price;
    quantity;
    status;
    state;
    city;
    description;
    created_at;
    updated_at;
    constructor(order: Order) {
        this.id = order._id;
        this.image = order.image;
        this.user_full_name = order.user_full_name;
        this.status = order.status;
        this.address = order.address;
        this.quantity = order.quantity;
        this.state = order.state;
        this.description = order.description;
        this.city = order.city;
        this.price = order.price;
        this.created_at = order.createdAt;
        this.updated_at = order.updatedAt;
    }
}
export default OrderDto;
