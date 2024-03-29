import szamlazz from '@jssc/szamlazz.js';

const getPaymentMethod = (order) => {
  const {
    payment_option_name,
  } = order;


  if (payment_option_name === 'stripe') {
    return szamlazz.PaymentMethod.CreditCard;
  }

  // paypal_express_checkout
  return szamlazz.PaymentMethod.PayPal;
};

export default getPaymentMethod
