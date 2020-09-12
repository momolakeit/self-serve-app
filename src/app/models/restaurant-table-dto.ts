import { BillDTO } from "./bill-dto";
import { MenuDTO } from "./menu-dto";
import { RestaurantDTO } from "./restaurant-dto";

export interface RestaurantTableDTO {
    id:number;
    tableNumber:number;
    billDTOList:BillDTO;
    menuDTO:MenuDTO;
    restaurant:RestaurantDTO;
}
