import { USE_MOCK_API } from "./config";
import * as mockApi from "./mockApi";
import * as realApi from "./realApi";

const api = USE_MOCK_API ? mockApi : realApi;

export default api;

//import api from "../api";
// api.getShoppingLists(), api.createShoppingList()