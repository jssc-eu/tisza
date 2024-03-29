import szamlazz from '@jssc/szamlazz.js';
import { RawPartner } from 'lib/types';
import countryCodes from 'lib/countrycodes';

export default function getTaxSubject(raw: Partial<RawPartner>):szamlazz.TaxSubject {
  const {
    companyName,
    countryCode,
    taxNumber = '0',
  } = raw;

  const isEU = countryCodes(countryCode).isEuropean();
  const isHU = countryCodes(countryCode).isHungarian();

  if (companyName && isEU && taxNumber === '0') {
    return szamlazz.TaxSubject.NoTaxID;
  }

  if (companyName === '' && taxNumber === '0') {
    return szamlazz.TaxSubject.NoTaxID;
  }

  if (companyName && isHU) {
    return szamlazz.TaxSubject.HungarianTaxID;
  }

  if (companyName && isEU) {
    return szamlazz.TaxSubject.EUCompany;
  }

  if (companyName && taxNumber !== '0') {
    return szamlazz.TaxSubject.NonEUCompany;
  }

  if (companyName) {
    return szamlazz.TaxSubject.NoTaxID;
  }

  return szamlazz.TaxSubject.Unknown;
};
