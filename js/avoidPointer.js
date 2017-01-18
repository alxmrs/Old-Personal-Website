(function ()
{
    window.onload = main;
    window.onresize = handleResize;
    document.onmousemove = handleMouseMove;
    document.ontouchmove = handleMouseMove;

    var mouseX;
    var mouseY;
    var svgId;
    var screenSize;

    /**
     * Init + Update loop
     */
    function main()
    {

        // Init
        svgId = 'svg';

        var svgObj = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svgObj.setAttribute('id', svgId);
        document.body.appendChild(svgObj);


        screenSize = _getBrowserDimensions();
        var screenW = screenSize.w;
        var screenH = screenSize.h;

        var titleText = document.getElementById('titleText');

        svgObj.setAttribute('width', screenW + 'px');
        svgObj.setAttribute('height', screenH + 'px');

        var squareWidth = 20;
        var squareRow = Math.ceil(titleText.offsetWidth / squareWidth) + 2;
        var squareCol = Math.ceil(titleText.offsetHeight / squareWidth) + 2;

        _buildSVG(svgId, (screenW - squareWidth * squareRow) / 2,
            (screenH - squareWidth * squareCol) / 2,
            squareWidth, squareRow, squareCol, '#375a7f');

        var svgBlocks = document.getElementsByClassName('svgBlock');


        // Update loop
        setInterval(function () {
            [].forEach.call(svgBlocks, function (block) {
                _updateSVGPos(block, Math.max(screenW, screenH) * 2);
            });
        }, 100);

    }

    /**
     * Update SVG on window resize
     */
    function handleResize() {
        var svg = document.getElementById(svgId);

        var screenWOld = screenW;
        var screenHOld = screenH;

        screenW = _getBrowserDimensions().w;
        screenH = _getBrowserDimensions().h;

        svg.setAttribute('width', screenW + 'px');
        svg.setAttribute('height', screenH + 'px');

        var svgBlocks = document.getElementsByClassName('svgBlock');

        [].forEach.call(svgBlocks, function (block) {
            var x0 = parseFloat(block.getAttribute('x0'));
            var y0 = parseFloat(block.getAttribute('y0'));
            block.setAttribute('x0', x0 + (screenW - screenWOld) / 2 + 'px');
            block.setAttribute('y0', y0 + (screenH - screenHOld) / 2 + 'px');
        });

    }

    /**
     * Update global mouse position on mouse move
     * @param event
     */
    function handleMouseMove(event) {
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
        mouseX = event.pageX;
        mouseY = event.pageY;

    }


    function _getMouseX()
    {
        return mouseX;
    }

    function _getMouseY()
    {
        return mouseY;
    }


    /**
     * Calculate new SVG position based on current attributes
     * @param svgObj object to update
     * @param M constant, determines range of avoidance
     * @param d constant, determines midpoint of current current and new position
     * @private
     */
    function _updateSVGPos(svgObj, M, d)
    {
        var ratio = d || 0.5;
        var x = parseInt(svgObj.getAttribute('x'));
        var y = parseInt(svgObj.getAttribute('y'));
        var x0 = parseInt(svgObj.getAttribute('x0'));
        var y0 = parseInt(svgObj.getAttribute('y0'));


        var mouseX = _getMouseX();
        var mouseY = _getMouseY();

        var xdiff = mouseX - x;
        var ydiff = mouseY - y;

        var hSquared = (xdiff * xdiff + ydiff * ydiff);

        svgObj.setAttribute('x', ((x - xdiff * M / hSquared) + (x0 - x) * ratio) + 'px');
        svgObj.setAttribute('y', ((y - ydiff * M / hSquared) + (y0 - y) * ratio) + 'px');
    }

    /**
     * Get dimensions of browser window
     * @returns {{w: (number|Number), h: (number|Number)}}
     * @private
     */
    function _getBrowserDimensions()
    {
        var w = document.documentElement.clientWidth
            || window.innerWidth
            || document.body.clientWidth;


        var h = document.documentElement.clientHeight
            || window.innerHeight
            || document.body.clientHeight;

        return {w: w, h: h};
    }

    /**
     * Build a rectangle composed of SVG objects with class 'svgBlock'
     * @param svgId parent SVG object ID
     * @param xStart rectangle left start
     * @param yStart rectangle top left start
     * @param rLen SVG square size
     * @param rows number of rows
     * @param cols number of columns
     * @param color color of each SVG object
     * @private
     */
    function _buildSVG(svgId, xStart, yStart, rLen, rows, cols, color)
    {
        var svg = document.getElementById(svgId);

        var left = xStart;
        var top = yStart;

        var counter = 0;

        for (var i = 0; i < cols; i++) {
            left = xStart;
            for (var j = 0; j < rows; j++) {
                svg.appendChild(_createSquare(left, top, rLen, color, 'svgBlock'));
                left += rLen;
                counter++;
            }
            top += rLen;
        }
    }


    /**
     * Create a SVG rectangle
     * @param x left position
     * @param y top position
     * @param w width
     * @param h height
     * @param c color
     * @param className class attribute name
     * @param idName id attribute name
     * @returns {Element}
     * @private
     */
    function _createRect(x, y, w, h, c, className, idName)
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

    /**
     * Easy way to create a square SVG object
     * @param x left position
     * @param y top position
     * @param l length of side of square
     * @param c color
     * @param className class attribute name
     * @param idName id attribute name
     * @returns {Element}
     * @private
     */
    function _createSquare(x, y, l, c, className, idName)
    {
        return _createRect(x, y, l, l, c, className, idName);
    }


})();
