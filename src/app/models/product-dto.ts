import { OptionDTO } from "./option-dto";
import { MenuDTO } from "./menu-dto";
import { RateDTO } from "./rate-dto";
import { ProductType } from "./product-type.enum";
import { ProductMenuType } from "./product-menu-type.enum";
import { ImgFileDTO } from "./img-file-dto";
import {CheckItemDTO} from './check-item-dto'



export interface ProductDTO {
    id?:number;
    name:string;
    description:string;
    menu?:MenuDTO;
    options?:OptionDTO[];
    imgUrl?:string;
    prix:number;
    tempsDePreparation: number;
    imgFileDTO?: ImgFileDTO;
    checkItems? : CheckItemDTO;
    rates?:[RateDTO];
    productType:ProductType;
    productMenuType:ProductMenuType;
}
