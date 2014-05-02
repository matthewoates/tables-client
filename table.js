function Table(paper, data) {
    var self = this,
        startX,
        startY;

    $.extend(this, data);

    this.cloverData = JSON.stringify(data);

    var el;

    this.init = function () {
        console.log('init()');

        if (this.isRect) {
            el = paper.rect(this.x, this.y, this.width, this.height, 5)
        } else {
            el = paper.ellipse(this.x + this.width / 2, this.y + this.height / 2, this.width / 2, this.height / 2);
            //console.log(this.x, this.y, this.width, this.height);
        }

        el.attr({
                fill: 'red'
        });

        registerListeners();
    }

    function registerListeners() {
        el.mouseover(function () {
            el.animate({'fill-opacity': 0.5}, 300);
        });

        el.mouseout(function () {
            el.animate({'fill-opacity': 1}, 300);
        });

        el.click(function () {
            console.log(self.cloverData);
            selectTable(self);
        });

        el.drag(
            function (dx, dy) {
                // drag update
                if (self.isRect) {
                    el.attr({
                        x: startX + dx,
                        y: startY + dy
                    });
                } else {
                    el.attr({
                        cx: startX + dx,
                        cy: startY + dy
                    });
                }
            },
            function () {
                // drag start
                if (self.isRect) {
                    startX = el.attr('x');
                    startY = el.attr('y');
                } else {
                    startX = el.attr('cx');
                    startY = el.attr('cy');
                }
            },
            function () {
                // drag stop
                if (self.isRect) {
                    self.x = el.attr('x');
                    self.y = el.attr('y');
                } else {
                    self.x = el.attr('cx') - el.attr('rx');
                    self.y = el.attr('cy') - el.attr('ry');
                }

                self.updateServer();
            }
        );
    }

    this.setIsRect = function (isRect) {
        var toX = (this.isRect ? this.width / 2 : 0) + this.x,
            toY = (this.isRect ? this.height / 2 : 0) + this.y;

        this.isRect = isRect;

        el.animate({
            x: toX,
            y: toY,
            width: 0,
            height: 0,
            rx: 0,
            ry: 0,
            opacity: 0
        }, 500);

        var destX = this.x,
            destY = this.y;

        if (isRect) {
            el = paper.rect(this.x + this.width / 2, this.y + this.height / 2, 0, 0, 5);
        } else {
            el = paper.ellipse(this.x + this.width / 2, this.y + this.width / 2, 0, 0);
            destX += this.width / 2;
            destY += this.height / 2;
        }

        el.attr({
                fill: 'red'
        });

        el.animate({
            x: destX,
            y: destY,
            width: this.width,
            rx: this.width / 2,
            height: this.height,
            ry: this.height / 2
        }, 2000, 'elastic');


        this.updateServer();
        registerListeners();
    }

    var firstUpdate = true;

    this.refresh = function (data) {
        $.extend(self, data);

        reposition();
    };

    function reposition() {
        el.attr({
            x: self.x,
            y: self.y,
            width: self.width,
            height: self.height
        });
    }

    this.updateServer = function () {
        $.ajax({
            type: 'POST',
            url: 'http://localhost:3000/table/' + this.id,
            data: JSON.stringify({
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
            $.extend(self, data);

            if (firstUpdate) {
                self.init();
            }

            el.attr({
                x: data.x,
                y: data.y,
                width: data.width,
                height: data.height
            });

            if (firstUpdate) {
                firstUpdate = false;
                new Resizer(paper, el, self, 0);
                new Resizer(paper, el, self, 90);
                new Resizer(paper, el, self, 180);
                new Resizer(paper, el, self, 270);
            }
        });
    }

    this.updateServer();
}
