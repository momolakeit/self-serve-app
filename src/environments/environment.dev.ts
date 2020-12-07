// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.
// const host = "18.221.184.6";
const host = "https://back-end-dev.i-serve.ca";
const port = "";
const rolePrefix = 'ROLE_';

export const environment = {
  production: false,
  authApiUrl: `http://${host}${port}/auth`,
  contactFormUrl: `http://${host}${port}/support`,
  employeUrl:`http://${host}${port}/rest/employe`,
  csrfUrl:`http://${host}${port}/csrf`,
  productUrl:`http://${host}${port}/product`,
  menuUrl:`http://${host}${port}/menu`,
  billUrl:`http://${host}${port}/order`,
  rateUrl:`http://${host}${port}/rate`,
  adminUrl:`http://${host}${port}/admin/getOwners`,
  subscriptionProductUrl:`http://${host}${port}/stripe/fetchSubscriptionProducts`,
  fetchSubscription:`http://${host}${port}/stripe/retreiveSubscription`,
  cancelSubscriptionUrl:`http://${host}${port}/stripe/cancelSubscription`,
  registerOwnerWithStripeUrl :`http://${host}${port}/stripe/createStripeAcccount`,
  saveStripeAccountId :`http://${host}${port}/stripe/saveAccountId`,
  fetchStripeAccountId:`http://${host}${port}/stripe/getAccountId`,
  paymentIntentUrl:`http://${host}${port}/stripe/fetchPaymentIntent`,
  retrySubscriptionUrl:`http://${host}${port}/stripe/retrySubscription`,
  createSubscriptionUrl:`http://${host}${port}/stripe/createSubscription`,
  fetchSubscriptionSessionUrl: `http://${host}${port}/stripe/fetchSubscriptionSession`,
  paymentRequestIntentUrl:`http://${host}${port}/stripe/fetchPaymentRquestPaymentIntent`,
  domainFiLE:`http://${host}${port}/order/fetchDomainFile`,
  baseImgPath:`http://${host}${port}/product/getProductImg/`,
  kitchenUrl:`http://${host}${port}/rest/kitchen`,
  qrCodeUrl:`http://${host}${port}/qrcode`,
};

export const roles={
  owner: `${rolePrefix}OWNER`,
  cook: `${rolePrefix}COOK`,
  waiter: `${rolePrefix}WAITER`,
  client: `${rolePrefix}CLIENT`,
  guest: `${rolePrefix}GUEST`,
  admin: `${rolePrefix}ADMIN`
}

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
