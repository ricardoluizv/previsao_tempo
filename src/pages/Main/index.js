import React, { useState } from 'react';

import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

import { Content, Form, AutoComplete } from './styled';
import apiWeather from '../../services/api';

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

function Main({ history }) {
  const classes = useStyles();

  let [setCity] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    const data = new FormData(e.target);

    let city = data.get('txtCity');
    city = city.normalize('NFD').replace(/[\u0300-\u036f]/g, '');

    const cities = await apiWeather.get(`/listaCidades?city=${city}`);
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(cities.data, 'text/xml');

    city = xmlDoc.getElementsByTagName('nome')[0].innerHTML;
    const cityId = xmlDoc.getElementsByTagName('id')[0].innerHTML;
    const uf = xmlDoc.getElementsByTagName('uf')[0].innerHTML;

    const search = {
      city,
      cityId,
      uf,
    };

    history.push({ pathname: `/previsao_do_tempo/${cityId}`, data: search });
  }

  async function txtCityOnChange(e) {
    setCity = e;

    const cities = await apiWeather.get(`/listaCidades?city=${e}`);
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(cities.data, 'text/xml');

    const xmlCities = xmlDoc.getElementsByTagName('cidade');

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
    document.getElementById('cities').innerHTML = html;
  }

  return (
    <Form onSubmit={handleSubmit}>
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

          <Button
            type="submit"
            className={classes.btnSearch}
            variant="contained"
            color="primary"
          >
            Buscar
          </Button>
        </div>
        <AutoComplete id="cities" />
      </Content>
    </Form>
  );
}
export default Main;
