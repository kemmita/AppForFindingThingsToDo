import React from 'react';
import ReactDOM from 'react-dom';
import {Router} from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.min.css'
import './app/layout/index.css';
import App from './app/layout/App';
import * as serviceWorker from './serviceWorker';
import ScrollToTop from "./app/layout/ScrollToTop";
import 'react-widgets/dist/css/react-widgets.css'
import dateFnsLocalizer from 'react-widgets-date-fns';
import {createBrowserHistory} from "history";

dateFnsLocalizer();

export const history = createBrowserHistory();

ReactDOM.render(<Router history={history}> <ScrollToTop>  <App /> </ScrollToTop> </Router>, document.getElementById('root'));

serviceWorker.unregister();
