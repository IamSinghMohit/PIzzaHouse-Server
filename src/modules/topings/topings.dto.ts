import { TopingsType } from "./topings.model";

class TopingDto {
    id;
    name;
    image;
    category;
    price;

    constructor(toping: TopingsType) {
        this.id = toping._id;
        this.name = toping.name;
        this.image = toping.image;
        this.category = toping.category;
        this.price = toping.price;
    }
}

export default TopingDto;
