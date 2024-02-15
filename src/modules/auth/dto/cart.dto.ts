import { Order } from "@/modules/order/model/order";

export class CartDto {
    id;
    image;
    quantity;
    price;
    name;
    status;
    constructor(order: Order) {
        this.id = order._id;
        this.image = order.image;
        this.name = order.name;
        this.status = order.status;
        this.quantity = order.quantity;
        this.price = order.price;
    }
}
