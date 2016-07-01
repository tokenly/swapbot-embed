require("!style!css!sass!../style/application.sass");

import api from './lib/api';

// expose global SwapbotAPI
window.SwapbotAPI = window.SwapbotAPI || api;