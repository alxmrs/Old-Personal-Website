(function ()
{
    window.onload = main;
    window.onresize = handleResize;
    document.onmousemove = handleMouseMove;

    var x = null;
    var y = null;
    var M = 10000;
    var d = .5;
    var screenW;
    var screenH;
    var svgId = 'svg';


    function handleMouseMove(event)
    {
        var eventDoc, doc, body;

        event = event || window.event; // IE-ism

        // If pageX/Y aren't available and clientX/Y are,
        // calculate pageX/Y - logic taken from jQuery.
        // (This is to support old IE)
        if (event.pageX == null && event.clientX != null) {
            eventDoc = (event.target && event.target.ownerDocument) || document;
            doc = eventDoc.documentElement;
            body = eventDoc.body;

            event.pageX = event.clientX +
                (doc && doc.scrollLeft || body && body.scrollLeft || 0) -
                (doc && doc.clientLeft || body && body.clientLeft || 0);
            event.pageY = event.clientY +
                (doc && doc.scrollTop || body && body.scrollTop || 0) -
                (doc && doc.clientTop || body && body.clientTop || 0 );
        }

        // Use event.pageX / event.pageY here
        x = event.pageX;
        y = event.pageY;

    }

    function getMouseX()
    {
        return x;
    }

    function getMouseY()
    {
        return y;
    }

    function getElemPos(elem)
    {
        // yay readability
        for (var lx = 0, ly = 0;
             elem != null;
             lx += elem.offsetLeft, ly += elem.offsetTop, elem = elem.offsetParent);
        // lx = elem.offsetLeft;
        // ly = elem.offsetTop;
        return {x: lx, y: ly};
    }

    function updateElemPos(elem, M, d)
    {
        var x0 = getElemPos(elem).x;
        var y0 = getElemPos(elem).y;
        // console.log(x0, y0);
        var x00 = x0;
        var y00 = y0;
        if (elem.style.left !== '') {
            x00 = x0 - parseInt(elem.style.left);
        }
        if (elem.style.top !== '') {
            y00 = y0 - parseInt(elem.style.top);
        }

        var x = getMouseX();
        var y = getMouseY();

        var a = x - x0;
        var b = y - y0;

        var r = (a * a + b * b);

        elem.style.left = ((x0 - a * M / r) + (x00 - x0) * d) + 'px';
        elem.style.top = ((y0 - b * M / r) + (y00 - y0) * d) + 'px';
    }

    function updateSVGPos(svg, M, d)
    {
        var ratio = d || 0.5;
        var x = parseInt(svg.getAttribute('x'));
        var y = parseInt(svg.getAttribute('y'));
        var x0 = parseInt(svg.getAttribute('x0'));
        var y0 = parseInt(svg.getAttribute('y0'));


        var mouseX = getMouseX();
        var mouseY = getMouseY();

        var a = mouseX - x;
        var b = mouseY - y;

        var r = (a * a + b * b);

        svg.setAttribute('x', ((x - a * M / r) + (x0 - x) * ratio) + 'px');
        svg.setAttribute('y', ((y - b * M / r) + (y0 - y) * ratio) + 'px');
    }

    function getBrowserDimensions()
    {
        var w = document.documentElement.clientWidth
            || window.innerWidth
            || document.body.clientWidth;


        var h = document.documentElement.clientHeight
            || window.innerHeight
            || document.body.clientHeight;

        return {w: w, h: h};
    }

    function buildSVG(svgId, xStart, yStart, rLen, rows, cols, color)
    {
        var svg = document.getElementById(svgId);

        var left = xStart;
        var top = yStart;

        var counter = 0;

        for (var i = 0; i < cols; i++) {
            left = xStart;
            for (var j = 0; j < rows; j++) {
                svg.appendChild(createSquare(left, top, rLen, color, 'svgBlock'));
                left += rLen;
                counter++;
            }
            top += rLen;
        }
    }

    function buildTable(tableId, w, h)
    {
        var table = document.getElementById(tableId);

        var tmpTr;

        for (var i = 0; i < h; i++) {
            tmpTr = document.createElement('tr');
            for (var j = 0; j < w; j++) {
                tmpTr.appendChild(createBlockTd());
            }
            table.appendChild(tmpTr);
        }
    }

    function createRect(x, y, w, h, c, className, idName)
    {
        var _x = x || '0px';
        var _y = y || '0px';
        var _w = w || '10px';
        var _h = h || '10px';
        var _color = c || 'lightblue';
        var _class = className || 'svgBlock';

        var rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        if(typeof idName !== 'undefined'){
            rect.setAttribute('id', idName);
        }
        rect.setAttribute('class', _class);
        rect.setAttribute('x', _x);
        rect.setAttribute('y', _y);
        rect.setAttribute('x0', _x);
        rect.setAttribute('y0', _y);
        rect.setAttribute('width', _w);
        rect.setAttribute('height', _h);
        rect.setAttribute('fill', _color);

        return rect;
    }

    function createSquare(x, y, l, c, className, idName)
    {
        return createRect(x, y, l, l, c, className, idName);
    }

    function createBlockTd()
    {
        var div = document.createElement('div');

        div.setAttribute('class', 'block');
        var td = document.createElement('td');
        td.appendChild(div);
        td.setAttribute('class', 'td');

        return td;
    }

    function handleResize()
    {
        var svg = document.getElementById(svgId);

        var screenWOld = screenW;
        var screenHOld = screenH;

        screenW = getBrowserDimensions().w;
        screenH = getBrowserDimensions().h;

        svg.setAttribute('width', screenW + 'px');
        svg.setAttribute('height', screenH + 'px');

        var svgBlocks = document.getElementsByClassName('svgBlock');

        [].forEach.call(svgBlocks, function (block)
        {
            var x0 = parseFloat(block.getAttribute('x0'));
            var y0 = parseFloat(block.getAttribute('y0'));
            block.setAttribute('x0', x0 + (screenW - screenWOld) / 2 + 'px');
            block.setAttribute('y0', y0 + (screenH - screenHOld) / 2 + 'px');
        });

    }

    function main()
    {
        svgId = 'svg';

        var svgObj = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svgObj.setAttribute('id', svgId);
        document.body.appendChild(svgObj);


        screenW = getBrowserDimensions().w;
        screenH = getBrowserDimensions().h;

        var titleText = document.getElementById('titleText');

        svgObj.setAttribute('width', screenW + 'px');
        svgObj.setAttribute('height', screenH + 'px');

        var sw = 10;
        var sr = Math.ceil(titleText.offsetWidth / sw) + 2;
        var sc = Math.ceil(titleText.offsetHeight / sw) + 2;

        buildSVG(svgId, (screenW - sw * sr) / 2, (screenH - sw * sc) / 2, sw, sr, sc, '#375a7f');

        var svgBlocks = document.getElementsByClassName('svgBlock');

        setInterval(function ()
        {
            [].forEach.call(svgBlocks, function (block)
            {
                updateSVGPos(block, 10000);
            });
        }, 64);

    }

})();