import szamlazz from '@jssc/szamlazz.js';
import create from './create';
import getEventConfig from 'lib/eventconfig'

const order = {
  id: 6050550,
  text: 'Test Usaer registered a ticket',
  event: {
    id: 1087445,
    title: 'Integration Test Event 2020',
    url: 'https://ti.to/jsconf-bp/integration-test-event-2020',
    account_slug: 'jsconf-bp',
    slug: 'integration-test-event-2020',
    start_date: null,
    end_date: null,
    metadata: null,
  },
  slug: 'pwNGuU9LWgsHaysSe7qrvOQ',
  reference: 'K0DF',
  currency: 'EUR',
  total: '133.00',
  total_less_tax: '133.00',
  name: 'Szabolcs Szabolcsi-Toth',
  first_name: 'Szabolcs',
  last_name: 'Szabolcsi-Toth',
  email: 'neccccc@gmail.com',
  phone_number: '',
  company_name: 'Teszt Company GMBH',
  discount_code: null,
  payment_reference: null,
  created_at: '2019-12-18T07:52:21.000Z',
  created_date: '2019-12-18',
  completed_at: '2019-12-18T07:52:35.665Z',
  completed_date: '2019-12-18',
  custom: '',
  metadata: null,
  updated_at: '2019-12-18T07:52:35.750Z',
  paid: true,
  line_items: [
    {
      id: 6569922,
      release_slug: 'qqtuetcorjg',
      release_id: 1219124,
      release_title: 'Early Bird',
      release_price: '133.00',
      release: {
        slug: 'qqtuetcorjg',
        title: 'Early Bird',
        price: '133.00',
        metadata: null,
      },
      price: '133.00',
      title: 'Early Bird',
      quantity: 1,
      total: '133.00',
      currency: 'EUR',
    },
  ],
  quantities: {
    qqtuetcorjg: {
      release: 'Early Bird',
      quantity: 1,
    },
  },
  tickets: [
    {
      reference: 'K0DF-1',
      slug: 'psIUP92DhtUtc9FeiDpWipw',
      price: '133.00',
      price_less_tax: '133.00',
      total_paid: '133.00',
      total_paid_less_tax: '133.00',
      release_id: 1219124,
      release_slug: 'qqtuetcorjg',
      release_title: 'Early Bird',
      release: {
        id: 1219124,
        slug: 'qqtuetcorjg',
        title: 'Early Bird',
        price: '133.00',
        metadata: null,
      },
      name: 'Szabolcs Szabolcsi-Toth',
      first_name: 'Szabolcs',
      last_name: 'Szabolcsi-Toth',
      company_name: 'Teszt Company GMBH',
      email: 'neccccc@gmail.com',
      url: 'https://ti.to/tickets/psIUP92DhtUtc9FeiDpWipw',
      admin_url: 'https://ti.to/jsconf-bp/integration-test-event-2020/admin/tickets/psIUP92DhtUtc9FeiDpWipw',
      responses: null,
      answers: [

      ],
    },
  ],
  payment: {
    reference: null,
    type: 'redirect',
  },
  receipt: {
    number: '0000041',
    total: '133.00',
    tax: 0,
    total_less_tax: '133.00',
    payment_provider: 'PayPal',
    payment_reference: null,
    paid: true,
  },
  billing_address: {
    address: 'Andrássy út 39\r\nUSTREAM Magyarország Kft',
    city: 'Budapest',
    state_province_region: 'Budapest',
    zip_postal_code: '1061',
    country: 'DE',
    country_name: 'Germany',
    vat_number: '234536',
    company_name: 'Teszt Company GMBH',
  },
};


describe('create invoice', () => {
  test('szamlazz invoice invoked with proper params - yaml config', async () => {

      process.env.EVENT_CONFIG_PATH = './test-config.yaml'
      const eventConfig = getEventConfig('integration-test-event-2022')

      const invoice = await create(
        order,
        eventConfig
      );

      expect(invoice._generateXML()).toMatchSnapshot();
  });

  test('szamlazz invoice invoked with proper params - kdl config', async () => {

    process.env.EVENT_CONFIG_PATH = './test-config.kdl'
    const eventConfig = getEventConfig('integration-test-event-2022')

    const invoice = await create(
      order,
      eventConfig
    );

    expect(invoice._generateXML()).toMatchSnapshot();
});
});
