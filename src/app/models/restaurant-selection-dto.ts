import { MenuDTO } from './menu-dto';
import { RestaurantTableDTO } from './restaurant-table-dto';

export interface RestaurantSelectionDTO {
    restaurantId: number;
    menuDTOS: [MenuDTO];
    restaurantName: string;
    restaurentTablesDTO: RestaurantTableDTO[];
    isLoading?:boolean;
}
