import { RestaurantDTO } from "./restaurant-dto";
import { ProductDTO } from "./product-dto";


export interface MenuDTO {
    id:number;
    products:[ProductDTO];
    restaurant:[RestaurantDTO];
    speciaux:[ProductDTO];
    souper:[ProductDTO];
    dejeuner:[ProductDTO];
    diner:[ProductDTO];
}
