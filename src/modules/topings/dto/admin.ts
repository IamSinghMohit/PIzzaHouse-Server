import { TToping } from "../topings.model";
import BaseTopingDto from "./base";

class AdminTopingDto extends BaseTopingDto {
    status;
    categories;
    created_at;
    updated_at;
    constructor(toping: TToping) {
        super(toping);
        this.status = toping.status;
        this.categories = toping.categories;
        this.created_at = toping.createdAt;
        this.updated_at = toping.updatedAt;
    }
}
export default AdminTopingDto;
