import React from 'react';

import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';

import { Content, Form, AutoComplete } from './styled';
import apiWeather from '../../services/api';

function Main({ history }) {
  // Carrega os estilos a serem aplicados no html
  const classes = useStyles();

  // Este evento é disparado toda vez que o usuário digita no campo de texto(txtCity)
  async function txtCityOnChange(e) {
    // Carrega a api das cidades de acordo com a cidade digita
    const cities = await apiWeather.get(`/listaCidades?city=${e}`);
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(cities.data, 'text/xml');

    const xmlCities = xmlDoc.getElementsByTagName('cidade');

    // Monta a lista das cidades a ser inserida no html
    let html = '<div>';
    for (let i = 0; i < xmlCities.length; i++) {
      const city = xmlCities[i].getElementsByTagName('nome')[0].innerHTML;
      const cityId = xmlCities[i].getElementsByTagName('id')[0].innerHTML;
      const uf = xmlCities[i].getElementsByTagName('uf')[0].innerHTML;

      html += '<ul>';
      html += `<a href="/previsao_do_tempo/${cityId}">`;
      html += `<li>${city} | UF: ${uf}<br>/previsao_do_tempo/${cityId}<li>`;
      html += '</a>';
      html += '</ul>';
    }

    html += '</div>';

    // Coloca na tela as listas da cidades pesquisadas
    document.getElementById('cities').innerHTML = html;
  }

  return (
    <Content>
      <p>Informe o nome da cidade</p>

      <div>
        <TextField
          className={classes.textF}
          label="Nome da cidade"
          variant="outlined"
          onChange={e => txtCityOnChange(e.target.value)}
          name="txtCity"
        />
      </div>
      <AutoComplete id="cities" />
    </Content>
  );
}
export default Main;

// Define as configurações dos componentes do material-ui
const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
  textF: {
    '& > *': {
      margin: theme.spacing(1),
      width: 400,
    },
  },
  btnSearch: {
    '& > *': {
      margin: theme.spacing(1),
      width: 100,
    },
  },
}));
