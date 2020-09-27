/**
 * Основная функция для совершения запросов
 * на сервер.
 * */
const createRequest = (options = {}) => {
    const xhr = new XMLHttpRequest();
    let formData = null;

    let {url} = options;
    const {data, headers, responseType, method, callback} = options;

    if (!method) {
        return xhr;
    }

    if (method === 'GET' && typeof data === 'object' && Object.keys(data).length !== 0) {
        url += '?' + Object.entries(data).map(([k, v]) => `${k}=${v}`).join('&');
    } else if (method === 'POST' && typeof data === 'object' && Object.keys(data).length !== 0) {
        formData = new FormData;
        for (const d in data) {
            formData.append(d, data[d]);
        }
    }

    for (const h in headers) {
        xhr.setRequestHeader(h, headers[h]);
    }

    xhr.responseType = responseType;

    xhr.withCredentials = true;

    if (typeof callback === 'function') {
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                if (xhr.status === 200) {
                    if (responseType === 'json') {
                        callback(null, xhr.response);
                    } else {
                        callback(null, xhr.responseText);
                    }
                } else {
                    callback(new Error('Ошибка ' + xhr.status));
                }
            }
        }

        xhr.onerror = function (e) {
            callback(e);
        }
    }

    xhr.open(method, url, true);

    xhr.send(formData);

    return xhr;
};
