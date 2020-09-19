import {OptionDTO} from './option-dto';

export interface CheckItemDTO {
    id:number;
    name:string;
    isActive : boolean;
    option:OptionDTO;
}
