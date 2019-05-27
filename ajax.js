function ajax(method, url, data, callback, flag) {
    var xhr = null;
    method = method.toUpperCase();
    if(window.XMLHttpRequest) {
        xhr = new XMLHttpRequest();
    }else {
        xhr = new ActiveXObject('Microsoft.XMLHttp');
    }
    if(method == 'GET') {
        var date = new Date(),
            timer = date.getTime();
        xhr.open(method, url + '?' + data + '&timer' + timer, flag);
        xhr.send();
    }else if(method == 'POST') {
        xhr.open(method, url, flag);
        xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
        xhr.send(data);
    }
    xhr.onreadystatechange = function () {
        if(xhr.readyState == 4) {
            if(xhr.status == 200) {
                callback(xhr.responseText);
            }else {
                console.log('error');
            }
        }
    }
}