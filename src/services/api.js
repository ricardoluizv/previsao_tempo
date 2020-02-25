import axios from 'axios';

const apiWeather = axios.create({
  baseURL: 'http://servicos.cptec.inpe.br/XML',
});

export default apiWeather;
