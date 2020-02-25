import React, { useState } from 'react';

import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

import { Content, Form } from './styled';
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
      </Content>
    </Form>
  );
}
export default Main;
