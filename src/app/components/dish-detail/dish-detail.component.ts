import { Component, OnInit, Input } from '@angular/core';
import { ProductDTO } from '../../models/product-dto' ;
import { CurrentBill} from '../../global/current-bill';
import { BillService} from '../../services/bill.service';
import {CheckItemDTO} from '../../models/check-item-dto'
import {OptionDTO} from '../../models/option-dto'
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-dish-detail',
  templateUrl: './dish-detail.component.html',
  styleUrls: ['./dish-detail.component.css']
})
export class DishDetailComponent implements OnInit {

  @Input() productDTO :ProductDTO
  
  constructor(private currentBill:CurrentBill,private billService :BillService) { }
  imgUrl :string

  ngOnInit(): void {
    //console.log(this.productDTO.imgFileDTO)
    this.imgUrl = environment.baseImgPath + this.productDTO.imgFileDTO.id;
  }
  updateCurrentBill = function (product :ProductDTO): void {
   this.billService.makeOrder(product).subscribe(data => 
    localStorage.setItem("ongoingBill",JSON.stringify(data)));
  };

  updateCheckItem = function (checkItemDTO:CheckItemDTO,optionDTO:OptionDTO): void {
    var currentOption =this.productDTO.options.find(x =>x.id==optionDTO.id);
    console.log(currentOption.checkItemList);
    currentOption.checkItemList.forEach(element => {
        element.isActive=false;
    });
    var currentCheckItem =currentOption.checkItemList.find(x=> x.id ==checkItemDTO.id);
    currentCheckItem.isActive=true;
    console.log(this.productDTO);
  };
   

}
