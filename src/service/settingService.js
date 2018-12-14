import util from '../utils/util';

/********main*********/
export const setting = () => {
  let auth = util.getCookie('auth');
  return fetch(`/api/setting`, {
    method: "get",
    credentials: "include",
    headers: {
      'Content-Type': "application/x-www-form-urlencoded",
      'Authorization': 'Bearer ' + auth
    }
  }).then((res) => {
    return res.json();
  });
};

export const idDocument = (params) => {
  let auth = util.getCookie('auth');
  return fetch(`/api/id_document`, {
    method: "get",
    credentials: "include",
    headers: {
      'Content-Type': "application/x-www-form-urlencoded",
      'Authorization': 'Bearer ' + auth
    }
  }).then((res) => {
    return res.json();
  });
};

export const editIdDocument = (data) => {
  let auth = util.getCookie('auth');
  return fetch(`/api/id_document`, {
    method:"post",
    credentials: "include",
    headers: {
      'Authorization': 'Bearer ' + auth
    //   'Content-Type': "application/x-www-form-urlencoded"
    },
    body: data
  }).then((res) => {
    return res.json();
  });
};