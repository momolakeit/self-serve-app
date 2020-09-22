import { CheckItemDTO } from "./check-item-dto";

export interface OptionDTO {
    id?:number;
    name:string;
    checkItemList:CheckItemDTO[];
}
