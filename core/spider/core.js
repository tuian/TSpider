/**
 * Created by Twi1ight on 2016/7/30.
 */
var require = patchRequire(require);
var utils = require('utils');
var fs = require('fs');

exports.evilResource = function (url) {
    "use strict";
    var parser = document.createElement('a');
    parser.href = url;
    var filename = parser.pathname.replace(/^.*[\\\/]/, '');
    var extension = utils.fileExt(filename);
    var hostname = parser.hostname;
    //todo stastic urls / ad urls
    if (hostname.match('hm\.baidu\.com|googleads\.g\.doubleclick\.net')) {
        return true
    }
    var exclude = ['a3c', 'ace', 'aif', 'aifc', 'aiff', 'arj', 'asf', 'asx', 'attach', 'au',
        'avi', 'bin', 'cab', 'cache', 'class', 'djv', 'djvu', 'dwg', 'es', 'esl',
        'exe', 'fif', 'fvi', 'gz', 'hqx', 'ice', 'ief', 'ifs', 'iso', 'jar', 'kar',
        'mid', 'midi', 'mov', 'movie', 'mp', 'mp2', 'mp3', 'mp4', 'mpeg',
        'mpeg2', 'mpg', 'mpg2', 'mpga', 'msi', 'pac', 'pdf', 'ppt', 'pptx', 'psd',
        'qt', 'ra', 'ram', 'rm', 'rpm', 'snd', 'svf', 'tar', 'tgz', 'tif',
        'tiff', 'tpl', 'uff', 'wav', 'wma', 'wmv', 'doc', 'docx', 'db', 'jpg'];
    return extension && exclude.indexOf(extension) >= 0
};

exports.saveFile = function (static_urls, requested_urls, filename) {
    "use strict";
    if (!filename) {
        console.log('saveFile failed! no filename found!');
        //for (var j = 0; j < requested_urls.length; j++) {
        //    console.log(requested_urls[j])
        //}
        //for (j = 0; j < static_urls.length; j++) {
        //    console.log(static_urls[j])
        //}
        return
    }
    var f = fs.open(filename, 'w');
    for (var i = 0; i < requested_urls.length; i++) {
        f.write(requested_urls[i] + '\n');
    }
    for (i = 0; i < static_urls.length; i++) {
        f.write(static_urls[i] + '\n');
    }
    f.close();
};

exports.FireintheHole = function (frame) {
    "use strict";
    var urls = [];
    //var retvar = [];
    var events = [];
    var events_func_str = [];
    var filled_inputs = [];
    var submited_forms = [];
    var logout_text = ['logout', 'quit', '注销', '退出', '注销登录', '退出登录', '安全注销', '安全退出'];

    function funcWithCatch(func) {
        try {
            func();
        } catch (exception) {
            console.log(func.name, exception)
        }
    }

    function validScheme(url) {
        var schemes = ['http://', 'https://', '//'];
        for (var i = 0; i < schemes.length; i++) {
            if (startsWith(url, schemes[i])) {
                return true
            }
        }
        return false
    }

    function startsWith(str, sub) {
        return str.lastIndexOf(sub, 0) === 0
    }

    function rmFragment(url) {
        return url ? url.split('#')[0] : ''
    }

    function rndStr(length) {
        var text = "";
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

        //make sure starts with alpha
        text += possible.charAt(Math.floor(Math.random() * (possible.length - 10)));
        for (var i = 0; i < length - 1; i++)
            text += possible.charAt(Math.floor(Math.random() * possible.length));
        return text;
    }

    // Serialize an array of form elements or a set of
    // key/values into a query string
    function param(obj) {
        var str = [];
        for (var p in obj)
            if (obj.hasOwnProperty(p)) {
                str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
            }
        return str.join("&");
    }

    function fillInputs() {
        var inputs = document.getElementsByTagName('input');
        //console.log('get ' + inputs.length + ' inputs total');
        //var requestdata = {};
        var buttons = [];
        for (var j = 0; j < inputs.length; j++) {
            var obj = inputs[j];
            if (!obj.hasAttribute('type')) {
                continue
            }
            // check if filled
            var pattern = obj.name + '|' + obj.type + '|' + obj.id;
            if (filled_inputs.indexOf(pattern) >= 0) {
                continue
            }
            filled_inputs.push(pattern);

            console.log('input => name: "' + obj.name + '" type: ' + obj.type + '" id: ' + obj.id);
            switch (obj.type) {
                //case 'hidden':
                case 'submit':
                    continue;
                // Click all the radio buttons and checkboxes
                case 'radio':
                case 'checkbox':
                    obj.click();
                    continue;
                case 'button':
                    buttons.push(obj);
                    continue;
            }
            // exist default value
            if (obj.name && obj.value) {
                continue
            }
            // fill each input
            var length, value;
            switch (obj.type) {
                case 'text':
                    // username, email, address, checkcode etc.
                    if (obj.name.indexOf('user') >= 0) {
                        value = 'mazafaka';
                    } else if (obj.name.indexOf('mail') >= 0) {
                        value = 'fakamaza@yopmail.com';
                    } else if (obj.name.indexOf('phone') >= 0 || obj.name.indexOf('mobile') >= 0) {
                        value = '13800138000';
                    } else {
                        length = obj.maxLength > 0 && obj.maxLength !== 524288 ? obj.maxLength : 10;
                        value = rndStr(length);
                    }
                    break;
                case 'password':
                    value = 'Passw0rd!@#';
                    break;
                case 'email':
                    value = 'fakamaza@yopmail.com';
                    break;
                // todo html5 input type
                default:
                    length = obj.maxLength > 0 && obj.maxLength !== 524288 ? obj.maxLength : 10;
                    value = rndStr(length);
            }
            obj.value = value;
        }

        var selects = document.getElementsByTagName('select');
        for (var k = 0; k < selects.length; k++) {
            var s = selects[k];
            // check if filled
            var spattern = s.name + '|' + s.type + '|' + s.id;
            if (filled_inputs.indexOf(spattern) >= 0) {
                continue
            }
            filled_inputs.push(spattern);
            console.log('input => name: "' + s.name + '" type: ' + s.type + '" id: ' + s.id);
            s.selectedIndex = 1;
        }
        var button_elements = document.getElementsByTagName('button');
        for (k = 0; k < button_elements.length; k++) {
            buttons.push(button_elements[k])
        }
        return buttons
    }

    function getForms() {
        var buttons = fillInputs();
        var f = document.forms;
        console.log('got total: ' + f.length + ' forms');
        for (var i = 0; i < f.length; i++) {
            console.log('form-' + (i + 1) + ' total: ' + f.length);
            var form = f[i];
            var action = form.action ? form.action : form.baseURI;
            var pattern = form.name + '|' + action;
            if (submited_forms.indexOf(pattern) >= 0) {
                //console.log('already submitted');
                continue
            }
            submited_forms.push(pattern);
            var inputs = form.getElementsByTagName('input');
            console.log('get ' + inputs.length + ' inputs from form-' + (i + 1));
            var formdata = {};
            for (var j = 0; j < inputs.length; j++) {
                var obj = inputs[j];
                console.log(obj.name + ' ' + obj.type + ' ' + obj.id + ' ' + obj.value);
                if (!obj.hasAttribute('type')) {
                    continue
                }
                if (obj.name && obj.value) {
                    formdata[obj.name] = obj.value;
                }
            }
            var querystring = param(formdata);
            if (querystring) {
                var request = form.method.toUpperCase() + '|||' + rmFragment(action) + '|||' + querystring + '|||' + rmFragment(form.baseURI);
                if (urls.indexOf(request) < 0) {
                    urls.push(request);
                }

            }
            form.submit();
        }
        //click all buttons
        for (i = 0; i < buttons.length; i++) {
            if (logout_text.indexOf(buttons[i].innerText) >= 0) {
                continue
            }
            buttons[i].click()
        }
    }

    function getEvents() {
        var void_jscode = ['javascript:;', 'javascript:void(0)', 'javascript:void(0);'];
        var nodes = document.all;
        for (var i = 0; i < nodes.length; i++) {
            //skip logout element
            if (logout_text.indexOf(nodes[i].innerText) >= 0) {
                continue
            }
            var attrs = nodes[i].attributes;
            for (var j = 0; j < attrs.length; j++) {
                var attr_name = attrs[j].nodeName;
                var attr_value = attrs[j].nodeValue;
                if (attr_name.substr(0, 2) === "on") {
                    if (events_func_str.indexOf(attr_value) < 0) {
                        console.log(253, 'on*   ' + attr_value);
                        events.unshift(attr_value);
                        events_func_str.unshift(attr_value);
                    }
                }
                if (attr_name in {"src": 1, "href": 1} && attrs[j].nodeValue.substr(0, 11) === "javascript:") {
                    if (void_jscode.indexOf(attrs[j].nodeValue) >= 0) {
                        continue;
                    }
                    if (events_func_str.indexOf(attr_value) < 0) {
                        console.log(263, 'javascript: ' + attr_value);
                        events.unshift(attr_value);
                        events_func_str.unshift(attr_value);
                    }
                }
            }
        }
        // console.log('got', events.length, 'events');
        // console.log('got', window.top.EVENTS.length, 'window events');
        while (window.top.EVENTS.length > 0) {
            events.unshift(window.top.EVENTS.shift())
        }
    }

    function handleTag(tag, src) {
        var elements = document.getElementsByTagName(tag);
        for (var i = 0; i < elements.length; i++) {
            //skip logout url
            if (logout_text.indexOf(elements[i].innerText) >= 0) {
                continue
            }
            var method, referer, url, request;
            method = 'GET';
            referer = window.location.href;
            url = elements[i][src];
            if (url && validScheme(url) && url.length < 1024) {
                request = method + '|||' + rmFragment(url) + '|||null|||' + rmFragment(document.baseURI);
                if (urls.indexOf(request) < 0) {
                    urls.push(request);
                }
            }
        }
    }

    //get href
    function getStaticUrls() {
        handleTag('a', 'href');
        handleTag('link', 'href');
        handleTag('area', 'href');
        handleTag('img', 'src');
        handleTag('embed', 'src');
        handleTag('video', 'src');
        handleTag('audio', 'src');
        // links in window.top.LINKS
        if (!!window.top.LINKS.length) {
            var url = window.top.LINKS.shift();
            if (url && validScheme(url) && url.length < 1024) {
                var request = 'GET' + '|||' + rmFragment(url) + '|||null|||' + rmFragment(document.baseURI);
                if (urls.indexOf(request) < 0) {
                    urls.push(request);
                }
            }
        }
    }


    function mainWork() {
        funcWithCatch(getEvents);
        funcWithCatch(getStaticUrls);
        funcWithCatch(getForms);
        funcWithCatch(getStaticUrls);
    }

    function runInFunc(string) {
        var F = new Function(string);
        funcWithCatch(F);
    }

    function main() {
        mainWork();
        console.log("events.length ", events.length);
        if (events.length > 0) {
            try {
                var event = events.shift();
                if (typeof event === 'string') {
                    console.log('string event ', event);
                    // eval(event)
                    runInFunc(event);
                } else if (typeof event === 'object') {
                    console.log('object event ', event);
                    var evt = document.createEvent('CustomEvent');
                    evt.initCustomEvent(event["event"], true, true, null);
                    event["element"].dispatchEvent(evt);
                }
            } catch (exception) {
                console.log('fireEvent exception:', exception)
            }
            setTimeout(function () {
                main()
            }, 1000)
        } else {
            setTimeout(function () {
                console.log('tspider://' + JSON.stringify({frame: frame, urls: urls}));
            }, 3000)
        }
    }

    //if can't access window.top.LINKS, the frame is not same origin, skip it
    if (typeof window.top.LINKS === "undefined") {
        setTimeout(function () {
            console.log('skip NOT same origin frame');
            console.log('tspider://' + JSON.stringify({frame: frame, urls: urls}));
        }, 100);
    } else {
        main();
    }
};