import {OptionDTO} from './option-dto';
import {ProductDTO} from './product-dto';
import {OrderStatus} from './order-status.enum';

export interface OrderItemDTO {
    id:number;
    product:ProductDTO;
    orderStatus:OrderStatus;
    prix:number;
    commentaires:string;
    delaiDePreparation:Date;
    tempsDePreparation :Date;
    option:[OptionDTO]
}
