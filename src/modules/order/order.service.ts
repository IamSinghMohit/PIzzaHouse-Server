import { OrderModel, TOrderModel } from "./order.model"

type Opts = TOrderModel
class OrderServices {
    static async create(opts:Partial<Opts>){
        return await OrderModel.create(opts) 
    }
}
export default OrderServices
