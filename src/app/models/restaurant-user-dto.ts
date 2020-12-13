import { RoleName } from "./role-name.enum";

export interface RestaurantEmployerDto {
    id:number;
    username:string;
    password:string;
    restaurantId:number;
    role:RoleName;

}
