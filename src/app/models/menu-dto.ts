import { RestaurantDTO } from "./restaurant-dto";
import { ProductDTO } from "./product-dto";
import {MenuType} from "./menu-type.enum"

export interface MenuDTO {
    id:number;

    products:[ProductDTO];

    restaurant:[RestaurantDTO];

    menuType:MenuType;

    name:string;

}
