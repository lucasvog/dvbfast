
/**
 * POST data to an http endpoint
 * @param url url to post to
 * @param data in object format
 * @returns Data in JSON format
 */
async function post(url = '', data = {}) {
  try{
  const response = await fetch(url, {
    method: 'POST',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json'
    },
    redirect: 'follow',
    referrerPolicy: 'no-referrer',
    body: JSON.stringify(data)
  });
  return response.json();
}catch(e){
  return null;
}
}

/**
 * HTTP GET method
 * @param {String} url url of the request
 * @returns promise that resolves to the result of the request, otherwise null.
 */
async function get(url:string):Promise<any> {
  return new Promise(function (resolve, reject) {
    try {
      fetch(url, {
        method: "GET",
      })
        .then(response => {
          //console.log(response);
          if (response.status == 200) {
            let contentType = response.headers.get("content-type");
            if (contentType && contentType.indexOf("application/json") !== -1) {
              return response.json()
            } else {
              resolve(null);
            }
          } else {
            resolve(null);
          }
        })
        .then(json => resolve(json));
    } catch (e) {
      resolve(null);
    }
  });
}