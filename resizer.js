function Resizer(paper, parent, table, direction) {
    var el = paper.circle(100, 100, 6);

    var parentStartX,
        parentStartY,
        parentStartWidth,
        parentStartHeight;

    function reposition() {
        if (direction === 0) {
            el.attr({
                cx: parent.attr('x') + parent.attr('width'),
                cy: parent.attr('y') + parent.attr('height') / 2,
            });
        } else if (direction === 90) {
            el.attr({
                cx: parent.attr('x') + parent.attr('width') / 2,
                cy: parent.attr('y'),
            });
        } else if (direction === 180) {
            el.attr({
                cx: parent.attr('x'),
                cy: parent.attr('y') + parent.attr('height') / 2,
            });
        } else if (direction === 270) {
            el.attr({
                cx: parent.attr('x') + parent.attr('width') / 2,
                cy: parent.attr('y') + parent.attr('height')
            });
        }
    }

    el.attr({
        fill: 'yellow',
        'fill-opacity': 0,
        'stroke-width': 0
    });

    el.mouseover(function () {
        el.animate({
            'fill-opacity': 1
        }, 200);
    });

    el.mouseout(function () {
        el.animate({
            'fill-opacity': 0
        }, 200);
    });

    el.drag(
        function (dx, dy) {
            // update
            if (direction === 0) {
                parent.attr({
                    width: parentStartWidth + dx
                });
            }

            if (direction === 90) {
                parent.attr({
                    y: parentStartY + dy,
                    height: parentStartHeight - dy
                });
            }

            reposition();
        },
        function () {
            // start
            parentStartX = parent.attr('x');
            parentStartY = parent.attr('y');
            parentStartWidth = parent.attr('width');
            parentStartHeight = parent.attr('height');
        },
        function () {
            // stop
            table.x = parent.attr('x');
            table.y = parent.attr('y');
            table.width = parent.attr('width');
            table.height = parent.attr('height');

            table.updateServer();
        }
    );

    /*parent.mouseover(function () {
        reposition();

        el.animate({
            'fill-opacity': 0.4
        }, 500);
    });*/

    parent.drag(reposition);

    /*parent.mouseout(function () {
        el.animate({
            'fill-opacity': 0
        }, 500);
    });*/
}
