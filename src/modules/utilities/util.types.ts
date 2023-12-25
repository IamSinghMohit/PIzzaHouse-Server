
interface BaseUtility {
    title: string;
}

export interface TProductUtilityDocument extends BaseUtility {
    data: {
        product_count: number;
        maximum_price: number;
    };
}
