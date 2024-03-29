import { OrderItemDTO } from './order-item-dto';
import { GuestDTO } from './guest-dto';
import { BillStatus } from './bill-status.enum';
import { RestaurantDTO } from './restaurant-dto';

export interface BillDTO {
    id: number;
    orderItems: OrderItemDTO[];
    orderCustomer: GuestDTO[];
    date: Date;
    prixTotal: number;
    prix: number;
    tips: number;
    billStatus: BillStatus;
    restaurant: RestaurantDTO;
    isBillEmpty :boolean;
}
