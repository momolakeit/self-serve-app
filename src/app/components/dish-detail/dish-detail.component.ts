import { Component, OnInit, Input } from '@angular/core';
import { ProductDTO } from '../../models/product-dto' 
import { CurrentBill} from '../../global/current-bill'

@Component({
  selector: 'app-dish-detail',
  templateUrl: './dish-detail.component.html',
  styleUrls: ['./dish-detail.component.css']
})
export class DishDetailComponent implements OnInit {

  @Input() productDTO :ProductDTO
  
  constructor(private currentBill:CurrentBill) { }

  ngOnInit(): void {
    console.log(this.productDTO)
  }
  updateCurrentBill = function (product :ProductDTO): void {
   // this.currentBill.ongoingBill.add(product);
    
    console.log(this.currentBill);
  };

}
