import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';

import Main from './pages/Main';
import Weather from './pages/Main/list_weather';

export default function Routes() {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/" exact component={Main} />
        <Route path="/previsao_do_tempo/:id" component={Weather} />
      </Switch>
    </BrowserRouter>
  );
}
