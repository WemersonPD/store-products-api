import axios from 'axios';

const getInstance = () => axios.create({
  baseURL: 'https://viacep.com.br/ws',
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
    'Cache-Control': 'no-cache',
    Accept: 'application/json',
  },
});

export default class ViaCep {
  static async getAddress(cep): Promise<any> {
    let response = null;

    try {
      const instance: any = getInstance();
      const { data } = await instance.get(`/${cep}/json`);

      response = {
        zipCode: data.cep,
        state: data.uf,
        neighborhood: data.bairro,
        city: data.localidade,
        street: data.logradouro,
        country: 'BRA',
      };
    } catch (err) {
      console.log(err, 'viacep');
    }

    return response;
  }
}
