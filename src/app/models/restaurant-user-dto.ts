import { RoleName } from "./role-name.enum";

export interface RestaurantUserDto {
    id:number;
    username:string;
    password:string;
    restaurantId:number;
    role:RoleName;

}
