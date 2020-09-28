// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.
const host = "localhost";
const port = "8080";
const rolePrefix = 'ROLE_';

export const environment = {
  production: false,
  authApiUrl: `http://${host}:${port}/auth`,
  contactFormUrl: `http://${host}:${port}/support`,
  employeUrl:`http://${host}:${port}/rest/employe`,
  csrfUrl:`http://${host}:${port}/csrf`,
  productUrl:`http://${host}:${port}/product`,
  menuUrl:`http://${host}:${port}/menu`,
  billUrl:`http://${host}:${port}/order`,
  rateUrl:`http://${host}:${port}/rate`,
  paymentIntentUrl:`http://${host}:${port}/order/fetchPaymentIntent`,
  baseImgPath:`http://${host}:${port}/product/getProductImg/`,
  kitchenUrl:`http://${host}:${port}/rest/kitchen`
};

export const roles={
  owner: `${rolePrefix}OWNER`,
  cook: `${rolePrefix}COOK`,
  waiter: `${rolePrefix}WAITER`,
  client: `${rolePrefix}CLIENT`,
}

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
