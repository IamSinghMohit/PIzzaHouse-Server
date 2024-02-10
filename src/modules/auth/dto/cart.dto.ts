import { Order } from "@/modules/order/model/order";

export class CartDto {
    id;
    image;
    quantity;
    price;
    constructor(order: Order) {
        this.id = order._id;
        this.image = order.image;
        this.quantity = order.quantity;
        this.price = order.price;
    }
}
