export function getLocalListData(listInLocalStrorage) {
  let data = localStorage.getItem(listInLocalStrorage) ? JSON.parse(localStorage.getItem(listInLocalStrorage)) : [];
  return data;
};

export function saveLocalListData(listInLocalStrorage, data) {
  localStorage.setItem(listInLocalStrorage, JSON.stringify(data))
}
