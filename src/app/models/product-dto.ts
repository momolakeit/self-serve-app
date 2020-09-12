import { OptionDTO } from "./option-dto";
import { MenuDTO } from "./menu-dto";
import { RateDTO } from "./rate-dto";
import { ProductType } from "./product-type.enum";


export interface ProductDTO {
    id:number;
    name:string;
    description:string;
    menu:MenuDTO;
    options:OptionDTO;
    prix:number;
    tempsDePreparation: number;
    rates:[RateDTO];
    productType:ProductType;
}
