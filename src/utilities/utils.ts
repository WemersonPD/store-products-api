import crypto from 'crypto';
import { ISearchParameterBase } from '../models/pagination';

export function controllerPaginationHelper(req: any): ISearchParameterBase {
  return {
    offset: req.query.offset
      ? (parseInt(req.query.offset, 10) * (parseInt(req.query.limit || '10', 10)))
      : 0,
    orderBy: req.query.orderBy || 'createdAt',
    isDESC: req.query.isDESC === 'false' ? false : true,
    limit: Math.min(parseInt(req.query.limit || '10', 10), 100),
  };
}

export function sha256(stringToHash: string): string {
  return crypto.createHash('sha256')
    .update(stringToHash)
    .digest('hex');
}

const alphabet = 'abcdefghijklmnopqrstuvwxyz';

export function stringReplace(base, params) {
  Object.keys(params).forEach((opt) => {
    const value = params[opt] ? params[opt] : '';

    base = base.replace(new RegExp(`\\{${opt}\\}`, 'g'), value);
  });

  return base;
}

export function generateRandomCode(stringLength = 3, numberLength = 3, isUpperCase = true) {
  const strRand = Array(...Array(stringLength))
    .map(() => alphabet.charAt(Math.floor(Math.random() * alphabet.length)))
    .join('');
  const numericRand = Math.random().toString().substr(3, numberLength);

  return isUpperCase
    ? `${strRand}${numericRand}`.toUpperCase()
    : `${strRand}${numericRand}`.toLowerCase();
}

export function hideCardNumber(number: string): string {
  return `**** **** **** ${number.substring(number.length - 4, number.length)}`;
}

export function decodeBase64toJson(text: string) {
  return JSON.parse(Buffer.from(text, 'base64').toString());
}