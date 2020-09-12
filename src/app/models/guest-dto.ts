import { BillDTO } from "./bill-dto";
import { RoleDTO } from "./role-dto";


export interface GuestDTO {
    id:number;
    username:string;
    password:string;
    bills:[BillDTO];
    roles:Set<RoleDTO>;
}
