import {OptionDTO} from './option-dto';
import {ProductDTO} from './product-dto';
import {OrderStatus} from './order-status.enum';
import { ProductType } from './product-type.enum';

export interface OrderItemDTO {
    id:number;
    product:ProductDTO;
    orderStatus:OrderStatus;
    prix:number;
    commentaires:string;
    productType : ProductType
    delaiDePreparation:Date;
    tempsDePreparation :Date;
    option:[OptionDTO]
}
