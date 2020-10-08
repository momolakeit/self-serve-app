// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.
const host = "37a61d1e2594.ngrok.io";
const port = "";
const rolePrefix = 'ROLE_';
export const environment = {
  production: false,
  authApiUrl: `https://${host}:${port}/auth`,
  contactFormUrl: `https://${host}:${port}/support`,
  employeUrl:`https://${host}:${port}/rest/employe`,
  csrfUrl:`https://${host}:${port}/csrf`,
  productUrl:`https://${host}:${port}/product`,
  menuUrl:`https://${host}:${port}/menu`,
  billUrl:`https://${host}:${port}/order`,
  rateUrl:`https://${host}:${port}/rate`,
  paymentIntentUrl:`https://${host}:${port}/stripe/fetchPaymentIntent`,
  paymentRequestIntentUrl:`https://${host}:${port}/stripe/fetchPaymentRquestPaymentIntent`,
  domainFiLE:`https://${host}:${port}/order/fetchDomainFile`,
  baseImgPath:`https://${host}:${port}/product/getProductImg/`,
  kitchenUrl:`https://${host}:${port}/rest/kitchen`
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
