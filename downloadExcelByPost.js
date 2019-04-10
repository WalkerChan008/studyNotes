downloadExcelByPost: function (curUrl, reqData) {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
        var a,
            contentDisposition = '',
            excelFileName = 'test-file.xls';  // default filename
        if (xhr.readyState === 4 && xhr.status === 200) {
            // Trick for making downloadable link
            a = document.createElement('a');
            a.href = window.URL.createObjectURL(xhr.response);

            // Get filename from response header
            contentDisposition = xhr.getResponseHeader('content-disposition');
            if(contentDisposition.indexOf('filename') !== -1) {
                excelFileName = contentDisposition.split('=')[1].replace(/\"/g, '');
            }

            // Download
            a.download = excelFileName;
            a.style.display = 'none';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        }
    };
    // Post data to URL which handles post request
    xhr.open("POST", ELMP.postUrl(curUrl));
    xhr.setRequestHeader("Content-Type", "application/json");
    // You should set responseType as blob for binary responses
    xhr.responseType = 'blob';
    xhr.send(JSON.stringify(reqData));
}
