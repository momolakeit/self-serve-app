const host = "back-end-prod.i-serve.ca";
const port = "";
const rolePrefix = 'ROLE_';
export const environment = {
  production: true,
  authApiUrl: `https://${host}${port}/auth`,
  contactFormUrl: `https://${host}${port}/support`,
  employeUrl:`https://${host}${port}/rest/employe`,
  csrfUrl:`https://${host}${port}/csrf`,
  productUrl:`https://${host}${port}/product`,
  menuUrl:`https://${host}${port}/menu`,
  billUrl:`https://${host}${port}/order`,
  rateUrl:`https://${host}${port}/rate`,
  adminUrl:`https://${host}${port}/admin/getOwners`,
  subscriptionProductUrl:`https://${host}${port}/stripe/fetchSubscriptionProducts`,
  fetchSubscription:`https://${host}${port}/stripe/retreiveSubscription`,
  cancelSubscriptionUrl:`https://${host}${port}/stripe/cancelSubscription`,
  registerOwnerWithStripeUrl :`https://${host}${port}/stripe/createStripeAcccount`,
  saveStripeAccountId :`https://${host}${port}/stripe/saveAccountId`,
  fetchStripeAccountId:`https://${host}${port}/stripe/getAccountId`,
  paymentIntentUrl:`https://${host}${port}/stripe/fetchPaymentIntent`,
  retrySubscriptionUrl:`https://${host}${port}/stripe/retrySubscription`,
  createSubscriptionUrl:`https://${host}${port}/stripe/createSubscription`,
  fetchSubscriptionSessionUrl: `https://${host}${port}/stripe/fetchSubscriptionSession`,
  paymentRequestIntentUrl:`https://${host}${port}/stripe/fetchPaymentRquestPaymentIntent`,
  domainFiLE:`https://${host}${port}/order/fetchDomainFile`,
  baseImgPath:`https://${host}${port}/product/getProductImg/`,
  kitchenUrl:`https://${host}${port}/rest/kitchen`,
  qrCodeUrl:`https://${host}${port}/qrcode`,
};

export const roles={
  owner: `${rolePrefix}OWNER`,
  cook: `${rolePrefix}COOK`,
  waiter: `${rolePrefix}WAITER`,
  client: `${rolePrefix}CLIENT`,
  guest: `${rolePrefix}GUEST`,
  admin: `${rolePrefix}ADMIN`
}
export const stripeKey ={
  value : 'pk_live_51HLwKgC5UoZOX4GR068jiSuMmMumVdwC2SnCztiAErlWVZOOsouqxExXe8EHeXpfULenaj9XClLnyHT7eg7HLpqP00W8sKmErZ'
}

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
