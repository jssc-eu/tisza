import { YamlConfig } from 'lib/eventconfig/yaml';
import { Partner } from 'lib/types';
import getItemizedCosts from '.';


const tickets = [
  {
    quantity: 2,
    price: 205.0,
    title: 'Early Bird',
    isOnlineService: false,
  },
  {
    quantity: 1,
    price: 0,
    title: 'Free ticket',
    isOnlineService: false,
  },
  {
    quantity: 1,
    price: 300,
    title: 'Early Workshop ticket',
    isOnlineService: false,
  },
  {
    quantity: 1,
    price: 450,
    title: 'Early Double ticket',
    isOnlineService: false,
  },
  {
    quantity: 1,
    price: 150,
    title: 'Online admission ticket',
    isOnlineService: true,
  },
];

const testEvents = {
  fixDateSingleCatering: {
    label: 'JSConf Budapest 2021',
    dates: [
      {
        'ticket-name-contains': '*',
        date: 'September 23, 2020',
      }
    ],
    catering: [
      {
        'ticket-name-contains': '*',
        'net-price': 90.3,
      },
    ],
  },
  multipleDatesSingleCatering: {
    label: 'JSConf Budapest 2021',
    dates: [
      {
        'ticket-name-contains': 'Workshop',
        date: 'April 8, 2020',
      },
      {
        'ticket-name-contains': '*',
        date: 'April 6-7, 2020',
      },
    ],
    catering: [
      {
        'ticket-name-contains': '*',
        'net-price': 90,
      },
    ],
  },
  fixDateMultipleCatering: {
    label: 'JSConf Budapest 2021',
    dates: [
      {
        'ticket-name-contains': '*',
        date: 'April 6-7, 2020',
      },
    ],
    catering: [
      {
        'ticket-name-contains': '*',
        'net-price': 90,
      },
      {
        'ticket-name-contains': 'Double',
        'net-price': 180,
      },
    ],
  },
  multipleDateMultipleCatering: {
    label: 'JSConf Budapest 2021',
    dates: [
      {
        'ticket-name-contains': 'Workshop',
        date: 'April 8, 2020',
      },
      {
        'ticket-name-contains': '*',
        date: 'April 6-7, 2020',
      },
    ],
    catering: [
      {
        'ticket-name-contains': '*',
        'net-price': 90,
      },
      {
        'ticket-name-contains': 'Double',
        'net-price': 180,
      },
      {
        'ticket-name-contains': 'Workshop',
        'net-price': 45,
      },
      {
        'ticket-name-contains': 'Online',
        'net-price': 0,
      },
    ],
  },
  multipleDateFreeCatering: {
    label: 'JSConf Budapest 2021',
    dates: [
      {
        'ticket-name-contains': 'Workshop',
        date: 'April 8, 2020',
      },
      {
        'ticket-name-contains': '*',
        date: 'April 6-7, 2020',
      },
    ],
    catering: [
      {
        'ticket-name-contains': '*',
        'net-price': 90,
      },
      {
        'ticket-name-contains': 'Double',
        'net-price': 180,
      },
      {
        'ticket-name-contains': 'Online',
        'net-price': 0,
      },
    ],
  },
  fixDateFreeCatering: {
    label: 'JSConf Budapest 2021',
    dates: [
      {
        'ticket-name-contains': '*',
        date: 'April 6-7, 2020',
      },
    ],
    catering: [
      {
        'ticket-name-contains': '*',
        'net-price': 90,
      },
      {
        'ticket-name-contains': 'Double',
        'net-price': 180,
      },
      {
        'ticket-name-contains': 'Online',
        'net-price': 0,
      },
    ],
  },
};


const buyerData: Partner = {
  name: 'buyerName',
  email: 'email',
  sendEmail: true,
  country: 'HU',
  taxNumber: '1324',
  taxSubject: 7,
  zip: '123',
  city: 'City',
  address: 'addressWithState',
  postAddress: {
    name: 'buyerName',
    zip: '123',
    city: 'City',
    address: 'addressWithState',
  },
  identifier: '1',
  phone: '',
  issuerName: 'name',
  isTEHK: false,
};

const deepClone = data => JSON.parse(JSON.stringify(data));

describe('catering', () => {
  test('create 2 items or every ticket type', async () => {
    const lineItems = [tickets[0]];
    const config = new YamlConfig('event', 'path', testEvents.fixDateSingleCatering)

    const items = await getItemizedCosts(lineItems, buyerData, config);
    expect(items).toHaveLength(2);
  });

  test('item names and comments are correct', async () => {
    const lineItems = [tickets[0]];
    const config = new YamlConfig('event', 'path', testEvents.fixDateSingleCatering)
    const items = await getItemizedCosts(lineItems, buyerData, config);
    expect(items[0].label).toBe('Early Bird');
    expect(items[0].comment).toBe('Ticket for JSConf Budapest 2021, September 23, 2020.');
    expect(items[1].label).toBe('Mediated services');
    expect(items[1].comment).toBe('Conference catering fee');
  });

  test('rounds prices to 2 digits', async () => {
    const lineItems = [tickets[0]];
    const config = new YamlConfig('event', 'path', testEvents.fixDateSingleCatering)
    const items = await getItemizedCosts(lineItems, buyerData, config);

    expect(items[0].grossUnitPrice.toString().split('.')[1].length).toBeLessThanOrEqual(2);
    expect(items[1].grossUnitPrice.toString().split('.')[1].length).toBeLessThanOrEqual(2);
  });

  test('rounding without errors', async () => {
    const lineItems = [tickets[0]];
    const config = new YamlConfig('event', 'path', testEvents.fixDateSingleCatering)
    const items = await getItemizedCosts(lineItems, buyerData, config);

    expect((items[0].grossUnitPrice + items[1].grossUnitPrice)).toBe(205);
  });

  test('skip catering item if its free', async () => {
    const lineItems = [tickets[0], tickets[4]];
    const config = new YamlConfig('event', 'path', testEvents.fixDateFreeCatering)
    const items = await getItemizedCosts(lineItems, buyerData, config);

    expect(items).toHaveLength(3);
    expect(items[2].grossUnitPrice).toBe(150);
  });

  test('skip items if they are free', async () => {
    const lineItems = [tickets[1], tickets[4]];
    const config = new YamlConfig('event', 'path', testEvents.fixDateFreeCatering)
    const items = await getItemizedCosts(lineItems, buyerData, config);

    expect(items).toHaveLength(1);
    expect(items[0].grossUnitPrice).toBe(150);
  });

  test('multiple orders with different catering', async () => {
    const lineItems = [tickets[0], tickets[3]];
    const config = new YamlConfig('event', 'path', testEvents.fixDateMultipleCatering)
    const items = await getItemizedCosts(lineItems, buyerData, config);

    expect((items[0].grossUnitPrice + items[1].grossUnitPrice)).toBe(205);
    expect((items[2].grossUnitPrice + items[3].grossUnitPrice)).toBe(450);
  });
});

describe('event date', () => {
  test('determines date according to ticket name', async () => {
    const lineItems = [tickets[2]];
    const config = new YamlConfig('event', 'path', testEvents.fixDateSingleCatering)
    const items = await getItemizedCosts(lineItems, buyerData, config);

    expect(items).toHaveLength(2);
    expect(items[0].label).toBe('Early Workshop ticket');
    expect(items[0].comment).toBe('Ticket for JSConf Budapest 2021, September 23, 2020.');
    expect(items[1].label).toBe('Mediated services');
    expect(items[1].comment).toBe('Conference catering fee');
  });

  test('multiple orders with different date', async () => {
    const lineItems = [tickets[0], tickets[2]];
    const config = new YamlConfig('event', 'path', testEvents.multipleDateMultipleCatering)
    const items = await getItemizedCosts(lineItems, buyerData, config);

    expect(items).toHaveLength(4);
    expect(items[0].comment).toBe('Ticket for JSConf Budapest 2021, April 6-7, 2020.');
    expect(items[2].comment).toBe('Ticket for JSConf Budapest 2021, April 8, 2020.');
  });
});

describe('VAT TEHK type', () => {
  test('HU without VAT', async () => {
    const lineItems = [tickets[0]];

    const buyer = deepClone(buyerData);

    buyer.isTEHK = false;
    const config = new YamlConfig('event', 'path', testEvents.fixDateSingleCatering)
    const items = await getItemizedCosts(lineItems, buyer, config);

    expect(items[0].vat).toBe(27);
    expect(items[1].vat).toBe(27);
  });

  test('HU with VAT', async () => {
    const lineItems = [tickets[0], tickets[2]];

    const buyer = deepClone(buyerData);

    buyer.isTEHK = false;
    const config = new YamlConfig('event', 'path', testEvents.multipleDateMultipleCatering)
    const items = await getItemizedCosts(lineItems, buyer, config);

    expect(items[0].vat).toBe(27);
    expect(items[1].vat).toBe(27);
  });

  test('EU without VAT', async () => {
    const lineItems = [tickets[0], tickets[2]];

    const buyer = deepClone(buyerData);

    buyer.isTEHK = false;
    const config = new YamlConfig('event', 'path', testEvents.multipleDateMultipleCatering)
    const items = await getItemizedCosts(lineItems, buyer, config);

    expect(items[0].vat).toBe(27);
    expect(items[1].vat).toBe(27);
  });

  test('EU with VAT', async () => {
    const lineItems = [tickets[0], tickets[2]];

    const buyer = deepClone(buyerData);

    buyer.isTEHK = true;
    const config = new YamlConfig('event', 'path', testEvents.multipleDateMultipleCatering)
    const items = await getItemizedCosts(lineItems, buyer, config);

    expect(items[0].vat).toBe(27);
    expect(items[1].vat).toBe(27);
    expect(items[2].vat).toBe(27);
    expect(items[3].vat).toBe(27);
  });

  test('EU Online Service with VAT', async () => {
    const lineItems = [tickets[0], tickets[2], tickets[4]];

    const buyer = deepClone(buyerData);

    buyer.isTEHK = true;

    const config = new YamlConfig('event', 'path', testEvents.multipleDateMultipleCatering)
    const items = await getItemizedCosts(lineItems, buyer, config);

    expect(items[0].vat).toBe(27);
    expect(items[1].vat).toBe(27);
    expect(items[2].vat).toBe(27);
    expect(items[3].vat).toBe(27);
    expect(items[4].vat).toBe('TEHK');
  });

  test('outside EU without VAT', async () => {
    const lineItems = [tickets[0], tickets[2]];

    const buyer = deepClone(buyerData);

    buyer.isTEHK = false;
    const config = new YamlConfig('event', 'path', testEvents.multipleDateMultipleCatering)
    const items = await getItemizedCosts(lineItems, buyer, config);

    expect(items[0].vat).toBe(27);
    expect(items[1].vat).toBe(27);
  });

  test('outside EU with VAT', async () => {
    const lineItems = [tickets[0], tickets[2]];

    const buyer = deepClone(buyerData);

    buyer.isTEHK = false;
    const config = new YamlConfig('event', 'path', testEvents.multipleDateMultipleCatering)
    const items = await getItemizedCosts(lineItems, buyer, config);

    expect(items[0].vat).toBe(27);
    expect(items[1].vat).toBe(27);
  });

  test('outside EU Online Service with VAT', async () => {
    const lineItems = [tickets[0], tickets[4]];

    const buyer = deepClone(buyerData);

    buyer.isTEHK = false;
    const config = new YamlConfig('event', 'path', testEvents.multipleDateMultipleCatering)
    const items = await getItemizedCosts(lineItems, buyer, config);

    expect(items[0].vat).toBe(27);
    expect(items[1].vat).toBe(27);
    expect(items[2].vat).toBe(27);
  });
});


