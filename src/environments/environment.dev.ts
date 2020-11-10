// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.
// const host = "18.221.184.6";
const host = "18.188.8.244";
const rolePrefix = 'ROLE_';

export const environment = {
  production: false,
  authApiUrl: `http://${host}/auth`,
  contactFormUrl: `http://${host}/support`,
  employeUrl:`http://${host}/rest/employe`,
  csrfUrl:`http://${host}/csrf`,
  productUrl:`http://${host}/product`,
  menuUrl:`http://${host}/menu`,
  billUrl:`http://${host}/order`,
  rateUrl:`http://${host}/rate`,
  paymentIntentUrl:`http://${host}/stripe/fetchPaymentIntent`,
  paymentRequestIntentUrl:`http://${host}/stripe/fetchPaymentRquestPaymentIntent`,
  domainFiLE:`http://${host}/order/fetchDomainFile`,
  baseImgPath:`http://${host}/product/getProductImg/`,
  kitchenUrl:`http://${host}/rest/kitchen`,
};

export const roles={
  owner: `${rolePrefix}OWNER`,
  cook: `${rolePrefix}COOK`,
  waiter: `${rolePrefix}WAITER`,
  client: `${rolePrefix}CLIENT`,
  guest: `${rolePrefix}GUEST`,
}

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
