!function() {
    "use strict";
    var video = document.createElement("VIDEO");
    var cav = document.getElementById("canvas");
    var cx2 = cav.getContext("2d");

    var stage = new createjs.Stage("canvas");
    var videoContainer = new createjs.Container();
    var videoImg = new createjs.Bitmap(video);
    var disX = 0, disY = 0;
    var idots = [], dots = [], dotscopy = [], count = 20;    

    // stage.autoClear = false;
    createjs.Ticker.setFPS(35);
    createjs.Ticker.addEventListener("tick", function () {
        stage.update();
    });
    videoContainer.x = 50;
    videoContainer.y = 50;
    videoContainer.addChild(videoImg);
    videoContainer.addEventListener("mousedown", dragMouseDown.bind(null, null, "currentTarget"));
    videoContainer.addEventListener("pressmove", dragMouseMove.bind(null, null,  "currentTarget"));
    stage.addChild(videoContainer);

    var layerContainer = new createjs.Container();
    var transformContainer = new createjs.Container();

    layerContainer.addEventListener("mousedown", dragMouseDown.bind(null, null, "currentTarget"));
    layerContainer.addEventListener("pressmove", dragMouseMove.bind(null, null,  "currentTarget"));
    videoContainer.addChild(layerContainer);
    var layerImg = new createjs.Bitmap("./00000.png");

    layerImg.image.onload = function() {
        layerContainer.addChild(layerImg);
        layerContainer.addChild(transformContainer);
        var image_w = layerImg.image.width,
            image_h = layerImg.image.height;
        dots = [
            { x: layerImg.x, y: layerImg.y },
            { x: layerImg.x + image_w, y: layerImg.y },
            { x: layerImg.x + image_w, y: layerImg.y + image_h},
            { x: layerImg.x, y: layerImg.y + image_h }
        ];
        dotscopy = [
            { x: layerImg.x, y: layerImg.y },
            { x: layerImg.x + image_w, y: layerImg.y },
            { x: layerImg.x + image_w, y: layerImg.y + image_h },
            { x: layerImg.x, y: layerImg.y + image_h }
        ];
        idots = rectsplit(count, dotscopy[0], dotscopy[1], dotscopy[2], dotscopy[3]);
        render(transformContainer);
        //添加四个控制点
        for(var i=0; i<4; i++){
            var controlPoint = new createjs.Shape();
            controlPoint.addEventListener("mousedown", dragMouseDown.bind(null, i, "target"));
            controlPoint.addEventListener("pressmove", dragMouseMove.bind(null, i, "target"));
            controlPoint.graphics.beginFill("#000000").drawCircle(dots[i].x, dots[i].y, 6);
            layerContainer.addChild(controlPoint);
        }

    }

    function dragMouseDown(controlNum, target, evt) {
        evt.stopPropagation();
        evt.preventDefault();
        disX = evt.stageX - evt[target].x;
        disY = evt.stageY - evt[target].y;
    }
    function dragMouseMove(controlNum, target, evt) {
        evt.stopPropagation();
        evt.preventDefault();
        evt[target].x = evt.stageX - disX;
        evt[target].y = evt.stageY - disY;
        if (typeof controlNum === "number") {
            dots[controlNum].x = evt[target].x + dotscopy[controlNum].x;
            dots[controlNum].y = evt[target].y + dotscopy[controlNum].y;
            render(transformContainer);
        }
    }

    var btn = document.getElementById("btn");
    video.src = "./db89f4b9d97992fe281f85d4f6ed991d.mp4";
    video.onloadedmetadata = videLoaded;
    function videLoaded(params) {
        video.crossOrigin = "Anonymous";
        btn.onclick = function () {
            if (video.paused) {
                video.play();
            } else {
                video.pause();
            }
        }
    }

    function render(transformContainer) {
        var ndots = rectsplit(count, dots[0], dots[1], dots[2], dots[3]);
        transformContainer.removeAllChildren();
        // var transformContainer = new createjs.Container();
        ndots.forEach(function(dot, i) {
            //获取平行四边形的四个点
            var dot1 = ndots[i];
            var dot2 = ndots[i + 1];
            var dot3 = ndots[i + count + 2];
            var dot4 = ndots[i + count + 1];

            //获取初始平行四边形的四个点
            var idot1 = idots[i];
            var idot2 = idots[i + 1];
            var idot3 = idots[i + count + 2];
            var idot4 = idots[i + count + 1];

            if (dot2 && dot3 && i % (count + 1) < count) {
                //绘制三角形的下半部分
                // renderImage(idot3, dot3, idot2, dot2, idot4, dot4);

                //绘制三角形的上半部分
                // renderImage(idot1, dot1, idot2, dot2, idot4, dot4);
            }
            var shapeCircle = new createjs.Shape();
            shapeCircle.graphics.beginFill("#ff0000").drawCircle(dot.x, dot.y, 1);
            transformContainer.addChild(shapeCircle);
        });
    }

    function renderImage(idot1, dot1, idot2, dot2, idot3, dot3) {
        
    }

    function rectsplit(n, a, b, c, d) {
        var ndots = [];
        //ad方向的向量n等分
        var ad_x = (d.x - a.x) / n,
            ad_y = (d.y - a.y) / n;
        //bc方向的向量n等分
        var bc_x = (c.x - b.x) / n,
            bc_y = (c.y - b.y) / n;
        for(var i=0; i<=n; i++) {
            //ad方向的n等分坐标
            var ad_dot_x = a.x + i * ad_x;
            var ad_dot_y = a.y + i * ad_y;
            //bc方向的n等分坐标
            var bc_dot_x = b.x + i * bc_x;
            var bc_dot_y = b.y + i * bc_y;

            //ac方向的向量n等分
            var ac_x = (bc_dot_x - ad_dot_x) / n;
            var ac_y = (bc_dot_y - ad_dot_y) / n;

            for(var j=0; j<=n; j++){
                //ac方向的n等分坐标
                var ac_dot_x = ad_dot_x + j * ac_x;
                var ac_dot_y = ad_dot_y + j * ac_y;
                ndots.push({
                    x: ac_dot_x,
                    y: ac_dot_y
                });
            }
            

        }
        return ndots;
    }
    
}();