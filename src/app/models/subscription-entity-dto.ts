import {OwnerDTO} from "./owner-dto"
import {StripeSubscriptionProducts} from "./stripe-subscription-products";
export class SubscriptionEntityDTO {
    id :number;

    subscriptionId:string;

    object:string;

    created:number;

    periodStart:number;

    stripeSubscriptionProducts: StripeSubscriptionProducts

    periodEnd:number;

    status:string;

    owner :OwnerDTO;

    errorMessage:string;

}
