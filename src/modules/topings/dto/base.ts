import { TToping } from "../topings.model";

class BaseTopingDto {
    id;
    name;
    price;
    image;
    constructor(toping: TToping) {
        this.id = toping._id;
        this.name = toping.name;
        this.price = toping.price
        this.image = toping.image
    }
}
export default BaseTopingDto;
