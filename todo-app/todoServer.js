import { getTodoItems } from './api.js';
export async function getServerListData(listInLocalStrorage) {
  let dataOnServer = await getTodoItems(listInLocalStrorage);
  return dataOnServer;
};
