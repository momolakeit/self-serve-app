import { RestaurantType } from "./restaurant-type.enum";
import { RoleName } from "./role-name.enum";

export interface RestaurantEmployerDto {
    id: number;
    username: string;
    password: string;
    restaurantId: number;
    restaurantType: RestaurantType;
    role: RoleName;
    ownerUsername: string;
}
