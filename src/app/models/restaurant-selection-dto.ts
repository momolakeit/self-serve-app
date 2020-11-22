import { RestaurantTableDTO } from './restaurant-table-dto';

export interface RestaurantSelectionDTO {
    restaurantId: number;
    menuId: number;
    restaurantName: string;
    restaurentTablesDTO: RestaurantTableDTO[];
    isLoading?:boolean;
}
