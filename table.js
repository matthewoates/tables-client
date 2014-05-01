function Table(paper, data) {
    var self = this,
        startX,
        startY;

    $.extend(this, data);

    this.cloverData = JSON.stringify(data);

    var el = paper.rect(this.x, this.y, this.width, this.height, 5)
        .attr({
            fill: 'red'
        });

    new Resizer(paper, el, this, 0);
    new Resizer(paper, el, this, 90);
    new Resizer(paper, el, this, 180);
    new Resizer(paper, el, this, 270);

    el.mouseover(function () {
        el.animate({'fill-opacity': 0.5}, 300);
    });

    el.mouseout(function () {
        el.animate({'fill-opacity': 1}, 300);
    });

    el.drag(
        function (dx, dy) {
            // drag update
            el.attr({
                x: startX + dx,
                y: startY + dy
            });
        },
        function () {
            // drag start
            startX = el.attr('x');
            startY = el.attr('y');
        },
        function () {
            // drag stop
            self.x = el.attr('x');
            self.y = el.attr('y');

            self.updateServer();
        }
    );

    this.updateServer = function () {
        $.ajax({
            type: 'POST',
            url: 'http://localhost:3000/table/' + this.id,
            data: JSON.stringify({
                /*cloverData: JSON.stringify({
                    id: this.id
                }),*/
                cloverData: this.cloverData,
                id: this.id,
                x: this.x,
                y: this.y,
                width: this.width,
                height: this.height,
                rotation: this.rotation,
                isRect: this.isRect
            }),
            dataType: 'json',
            contentType: 'application/json; charset=utf-8'
        }).done(function (data) {
            el.attr({
                x: data.x,
                y: data.y,
                width: data.width,
                height: data.height
            });
        });
    }

    this.updateServer();
}
