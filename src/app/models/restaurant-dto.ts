import { MenuDTO } from "./menu-dto";
import { BillDTO } from "./bill-dto";
import { OwnerDTO } from "./owner-dto";
import { CustomPropertyDTO } from "./custom-property-dto";
import { RestaurantTableDTO } from "./restaurant-table-dto";


export interface RestaurantDTO {
    id:number;
    name:string;
    billList:BillDTO;
    owner:OwnerDTO;
    customProperty:CustomPropertyDTO;
    menu:MenuDTO;
    restaurantTables:[RestaurantTableDTO];
}
