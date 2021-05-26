(function (exports) {
    var logger = {
        logServerId: "default",
        //logServerIp: "18.183.210.22",
        // logServerIp: "3twjzg79q4.execute-api.ap-northeast-1.amazonaws.com",
        //logServerPort: "6690",
        logServerPort: "",
        clientType: "browser"
    }

    exports.logger = logger;

    console.print = console.log;
    console.printError = console.error;

    console.log = function (text) {
        var logLevel = "INFO";
        console.print(`${logLevel}:${text}`);
        // makeRequest('POST', `https://${logger.logServerIp}:${logger.logServerPort}/log?clientName=${logger.logServerId}&clientType=${logger.clientType}&logMessage=${text}&logLevel=${logLevel}`);
    }

    console.debug = function (text) {
        var logLevel = "DEBUG";
        console.print(`${logLevel}:${text}`);
        // makeRequest('POST', `https://${logger.logServerIp}:${logger.logServerPort}/log?clientName=${logger.logServerId}&clientType=${logger.clientType}&logMessage=${text}&logLevel=${logLevel}`);
    }

    console.error = function (text) {
        var logLevel = "ERROR";
        console.print(`${logLevel}:${text}`);
        // makeRequest('POST', `https://${logger.logServerIp}:${logger.logServerPort}/log?clientName=${logger.logServerId}&clientType=${logger.clientType}&logMessage=${text}&logLevel=${logLevel}`);
    }
    function resendFailedLogRequests(){
        let filedLog = null;
        let id = logger.logServerId.slice(-1);
        switch (id) {
            case '1':
                filedLog = window.parent.failedLogRequests1;
                break;
            case '2':
                filedLog = window.parent.failedLogRequests2;
                break;
            case '3':
                filedLog = window.parent.failedLogRequests3;
                break;
            case '4':
                filedLog = window.parent.failedLogRequests4;
                break;
        }

        if (filedLog != null) {
            for(var i = 0; i < filedLog.length ; i++){
                let failedUrl = filedLog[i];
                failedUrl = failedUrl.replace("&logMessage=","&logMessage=OFFLINE MSG | ");
                makeRequest('POST', failedUrl);
            }
            
            switch (id) {
                case '1':
                    window.parent.failedLogRequests1 = [];
                    break;
                case '2':
                    window.parent.failedLogRequests2 = [];
                    break;
                case '3':
                    window.parent.failedLogRequests3 = [];
                    break;
                case '4':
                    window.parent.failedLogRequests4 = [];
                    break;
            }
        }
    }

    function makeRequest(method, url, data) {
        return new Promise(function (resolve, reject) {
            var xhr = new XMLHttpRequest();
            xhr.open(method, url);
            xhr.onload = function () {
                resendFailedLogRequests();
                if (this.status >= 200 && this.status < 300) {
                    resolve(xhr.response);
                } else {
                    reject({
                        status: this.status,
                        statusText: xhr.statusText
                    });
                }
            };
            xhr.onerror = function () {
                var id = logger.logServerId.slice(-1);
                switch (id) {
                    case '1':
                        window.parent.failedLogRequests1.push(url);
                        console.print(window.parent.failedLogRequests1);
                        break;
                    case '2':
                        window.parent.failedLogRequests2.push(url);
                        console.print(window.parent.failedLogRequests2);
                        break;
                    case '3':
                        window.parent.failedLogRequests3.push(url);
                        console.print(window.parent.failedLogRequests3);
                        break;
                    case '4':
                        window.parent.failedLogRequests4.push(url);
                        console.print(window.parent.failedLogRequests4);
                        break;
                }

                reject({
                    status: this.status,
                    statusText: xhr.statusText
                });
            };
            if (method == "POST" && data) {
                xhr.send(data);
            } else {
                xhr.send();
            }
        });
    }

})(window);