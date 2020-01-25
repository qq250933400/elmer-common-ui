var debug = (function(isDebug){
    var parent = document.createElement("div");
    var listV = document.createElement("ul");
    var listVisible = false;
    var oldLog = console;
    var debugLog = {
        log: logData,
        error: logError,
        info: logData,
        table: logData
    };
    // console = debugLog;
    var init = function() {
        if(isDebug) {
            var btn = document.createElement("button");
            // var listV = document.createElement("ul");
            parent.setAttribute("style", "display: none;width: 100%;height: 80%;background:#fff;position:fixed;left:0;bottom:0;z-index:8999;");
            btn.innerHTML = "Debug";
            btn.setAttribute("style", "display:block;width: 80px;height36px;position:fixed;z-index: 9000;left:0;bottom:0;");
            listV.setAttribute("style", "display: block;list-style:none;margin:0;padding:0;height:100%;position:relative;overflow: auto;");
            parent.appendChild(listV);
            document.body.appendChild(parent);
            document.body.appendChild(btn);
            // console = debugLog;
            console.oldLog = console.log;
            console.log = logData;
            console.oldErr = console.error;
            console.error = logError;
            btn.onclick = onDebugClick;
            window.onerror = logError;
            console.info("init debug v1.0");
        }
    };
    var addLogItem = function(li) {
        if(li && li.style) {
            li.style.listStyle = "none";
            li.style.margin = "0";
            li.style.padding = "5px";
            li.style.borderBottom="1px solid #d2d2d2";
            listV.appendChild(li);
        }
    }
    var logError = function(msg) {
        var msgs = arguments;
        var li = document.createElement("li");
        for(var i=0;i<msgs.length;i++) {
            var p = document.createElement("div");
            if(typeof msgs[i] === "object") {
                p.innerHTML = JSON.stringify(msgs[i], null, 4);
            } else if(msgs[i] === "function") {
                p.innerHTML = msgs[i].toString();
            } else {
                p.innerHTML = msgs[i];
            }
            li.appendChild(p);
        }
        li.style.color ="red";
        addLogItem(li);
        console.oldErr(msg);
    };
    var onDebugClick = function() {
        if(listVisible) {
            parent.style.display = "none";
            listVisible = false;
        } else {
            parent.style.display = "block";
            listVisible = true;
        }
    };
    var logData = function() {
        var msgs = arguments;
        var li = document.createElement("li");
        for(var i=0;i<msgs.length;i++) {
            var p = document.createElement("div");
            if(typeof msgs[i] === "object") {
                p.innerHTML = JSON.stringify(msgs[i], null, 4);
            } else if(msgs[i] === "function") {
                p.innerHTML = msgs[i].toString();
            } else {
                p.innerHTML = msgs[i];
            }
            li.appendChild(p);
        }
        addLogItem(li);
        console.oldLog.apply(this, msgs);
    };
    return init;
})();