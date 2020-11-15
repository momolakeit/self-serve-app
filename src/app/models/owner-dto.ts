import { RestaurantDTO } from './restaurant-dto';

export interface OwnerDTO {
    restaurants: [RestaurantDTO];
    stripeAccountId:string;
    stripeCustomerId:string;
    isStripeEnable :boolean;
}
