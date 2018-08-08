window.onload = function() {
    var oUl = document.getElementById("ul1");
    var oLi = oUl.getElementsByTagName("li");
    var ipage = 1;
    var b = true;
    getList();


    function getShort() { //获取最短的一列
        var index = 0;
        var ih = oLi[index].offsetHeight;
        for (var i = 1; i < oLi.length; i++) {
            if (oLi[i].offsetHeight < ih) {
                index = i;
                ih = oLi[i].offsetHeight;
            }
        }
        return index;
    }

    function getTop(obj) { //获取最短一列的高度，实现预加载
        var iTop = 0;
        while (obj) {
            iTop = obj.offsetTop;
            obj = obj.offsetParent;
        }
        return iTop;
    }

    function ajax(method, url, data, success) {
        var xhr = null;
        try {
            xhr = new XMLHttpRequest();
        } catch (ex) {
            xhr = new ActiveXObject('Microsoft.XMLHttp');
        }
        if (method == 'get' && data) {
            url += '?' + data;
        }
        xhr.open(method, url, true);
        if (method == 'post') {
            xhr.setRequestHeader('content-type', 'application/x-www-form-urlencoded');
            xhr.send(data);
        } else {
            xhr.send();
        }
        xhr.onreadystatechange = function() {
            if (xhr.readyState == 4) {
                if (xhr.status == 200) {
                    success && success(xhr.responseText);
                } else {
                    alert(xhr.status);
                }
            }
        };
    };

    function getList() {
        ajax('get', 'waterfall.php', 'cpage=' + ipage, function(data) {
            var data = JSON.parse(data);
            if (!data.length) {
                return;
            }
            for (var i = 0; i < data.length; i++) {
                var _index = getShort();
                var oDiv = document.createElement("div");
                var oImg = document.createElement('img');
                oImg.src = data[i].preview;
                oImg.style.width = "225px";
                oImg.style.height = data[i].height * (225 / oImg.style.width) + 'px';
                oDiv.appendChild(oImg);
                var oP = document.createElement('p');
                oP.innerHTML = data[i].title;
                oDiv.appendChild(oP);
                oLi[_index].appendChild(oDiv);
            }
            b = true;
        });
    }
    window.onscroll = function() {
        var _index = getShort();
        var aLi = oLi[_index];
        var scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
        if (getTop(aLi) + aLi.offsetHeight < document.documentElement.clientHeight + scrollTop) {
            if (b) {
                b = false;
                ipage++;
                getList();
            }
        }
    }

}