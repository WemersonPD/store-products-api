import { CustomError } from 'ts-custom-error';

export default class BusinessError extends CustomError {
  code: string;
  options: { [key: string]: string | number | boolean } | string;
  isBusinessError: boolean = true;

  constructor(code: string, options?: { [key: string]: string | number | boolean } | string) {
    super(code);
    this.code = code;
    this.options = options;
  }
}

export enum TransactionErrorCodes {
  NO_TRANSACTION_RECEIVED = 'no_transaction_received',
  MISSING_PAYMENT_ADDRESS = 'missing_payment_address',
  PAYMENT_INTEGRATION_ERROR = 'payment_integration_error',
  TRANSACTION_VALUE_MUST_BE_GREATER_THAN_ONE_BRL = 'transaction_value_must_be_greater_than_one_brl',
}

export enum CreditCardErrorCodes {
  ADDRESS_REQUIRED = 'address_required',
}

export enum SynodErrorCodes {
  MISSING_SUB_ACCOUNT = 'missing_sub_account',
}

export enum TemplateErrorCodes {
  TEMPLATE_NOT_FOUND = 'template_not_found',
}

export enum ErrorCodes {
  INVALID_ID = 'invalid_id',
  NEWS_NOT_FOUND = 'news_not_found',
  USER_NOT_FOUND = 'user_not_found',
  EVENT_NOT_FOUND = 'event_not_found',
  SYNOD_NOT_FOUND = 'synod_not_found',
  ENTITY_NOT_FOUND = 'entity_not_found',
  PARISH_NOT_FOUND = 'parish_not_found',
  USER_ALREADY_EXISTS = 'user_already_exists',
  CREDIT_CARD_NOT_FOUND = 'credit_card_not_found',
  TRANSACTION_NOT_FOUND = 'transaction_not_found',
  NOTIFICATION_NOT_FOUND = 'notification_not_found',
  USER_NOTIFICATION_NOT_FOUND = 'user_notification_not_found',
  PARISH_AND_SYNOD_NOT_SUBMITTED = 'parish_and_synod_not_submitted',
}
