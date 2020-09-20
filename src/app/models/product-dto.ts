import { OptionDTO } from "./option-dto";
import { MenuDTO } from "./menu-dto";
import { RateDTO } from "./rate-dto";
import { ProductType } from "./product-type.enum";
import { ImgFileDTO } from "./img-file-dto";



export interface ProductDTO {
    id:number;
    name:string;
    description:string;
    menu:MenuDTO;
    options:[OptionDTO];
    imgUrl :string;
    prix:number;
    tempsDePreparation: number;
    imgFileDTO: ImgFileDTO;
    rates:[RateDTO];
    productType:ProductType;
}
