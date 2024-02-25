import { Order } from "./model/order";
import { OrderTopings } from "./model/orderTopings";

export class  OrderTopingDto{
    id;
    image;
    name;
    price;
    constructor(toping:OrderTopings ){
        this.id = toping._id;
        this.image = toping.image;
        this.name = toping.name;
        this.price = toping.price;
    }
}

export class BaseOrderDto {
    id;
    image;
    price;
    quantity;
    description;
    name;
    topings;
    status;
    constructor(order: Order,toping:OrderTopingDto[]) {
        this.id = order._id;
        this.price = order.price;
        this.status = order.status;
        this.name = order.name;
        this.quantity = order.quantity;
        this.image = order.image;
        this.description = order.description;
        this.topings = toping;
    }
}
