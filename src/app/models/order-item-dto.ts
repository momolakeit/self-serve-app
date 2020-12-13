import {OptionDTO} from './option-dto';
import {ProductDTO} from './product-dto';
import {OrderStatus} from './order-status.enum';
import { MenuType } from './menu-type.enum';
import { CheckItemDTO } from './check-item-dto';

export interface OrderItemDTO {
    id:number;
    product:ProductDTO;
    orderStatus:OrderStatus;
    prix:number;
    commentaires:string;
    menuType : MenuType;
    checkItems :CheckItemDTO;
    delaiDePreparation:Date;
    tempsDePreparation :Date;
    option:[OptionDTO]
}
