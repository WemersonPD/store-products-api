import path from 'path';
import * as fs from 'fs';
import mjml2html from 'mjml';

import { stringReplace } from '../../utilities/utils';
import BusinessError, { TemplateErrorCodes } from '../../utilities/errors/business';

const readFile = (folder: string) => new Promise((resolve, reject) => {
  const htmlPath = path.join(__dirname, `${folder}.mjml`);

  fs.readFile(htmlPath, 'utf8', (err, html) => {
    if (err) {
      reject(new BusinessError(TemplateErrorCodes.TEMPLATE_NOT_FOUND));
    }

    resolve(html);
  });

});

export default class GetTemplateEmailService {
  static async get(templateName: string, mailOptions?: { [key: string]: string | number }) {
    let response = null;

    let html = null;

    try {
      html = await readFile(templateName);
    } catch (err) {
      new BusinessError(TemplateErrorCodes.TEMPLATE_NOT_FOUND)
    }

    if (!html) {
      new BusinessError(TemplateErrorCodes.TEMPLATE_NOT_FOUND)
    }

    if (mailOptions) {
      html = stringReplace(html, mailOptions);
    }

    html = mjml2html(html).html;

    response = html;

    return response;
  }
}
