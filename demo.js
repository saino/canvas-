var video = document.createElement("VIDEO");
var canvas = document.createElement("CANVAS");
// var img = document.getElementById("img");

window.onload = function() {

    (function () {
        var lastTime = 0;
        var vendors = ['webkit', 'moz'];
        for (var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
            window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
            window.cancelAnimationFrame = window[vendors[x] + 'CancelAnimationFrame'] ||    // Webkit中此取消方法的名字变了
                window[vendors[x] + 'CancelRequestAnimationFrame'];
        }

        if (!window.requestAnimationFrame) {
            window.requestAnimationFrame = function (callback, element) {
                var currTime = new Date().getTime();
                var timeToCall = Math.max(0, 16.7 - (currTime - lastTime));
                var id = window.setTimeout(function () {
                    callback(currTime + timeToCall);
                }, timeToCall);
                lastTime = currTime + timeToCall;
                return id;
            };
        }
        if (!window.cancelAnimationFrame) {
            window.cancelAnimationFrame = function (id) {
                clearTimeout(id);
            };
        }
    }());


    var video = document.createElement("VIDEO");
    var canvas = document.createElement("CANVAS");
    var cx2 = canvas.getContext("2d");
    var demo = document.getElementById("demo");
    var btn = document.getElementById("btn");
    video.src = "./db89f4b9d97992fe281f85d4f6ed991d.mp4";

    var draw = function (video, canvas, cx2){
        if (video.paused || video.ended) {
            return;
        }
        console.log("dddddd");
        cx2.drawImage(video, 0, 0, canvas.width, canvas.height);
        cx2.drawImage(video, 100, 300, 200, 200);
        // cx2.clearRect(0, 0, cx2.width, cx2.height);
        requestAnimationFrame(function(){
            draw(video, canvas, cx2);
        });
    }
    video.onloadedmetadata = function() {
        canvas.height = video.videoHeight;
        canvas.width = video.videoWidth;
        canvas.setAttribute("id", "canvas");
        demo.appendChild(canvas);
        
        var stage = new createjs.Stage("canvas");
        stage.autoClear = false;
        function tick(clip, cx) {
            // console.log("ddddd");
            // clip.draw(cx);
            // stage.update();
        }
        createjs.Ticker.setFPS(35);
        createjs.Ticker.addEventListener("tick", tick);
        
        // // console.log(stage);
        var container = new createjs.Container();
        stage.addChild(container);
        var shape = new createjs.Shape();
        shape.graphics.beginFill("#ff0000").drawRect(0, 0, 100, 100).endFill();
        shape.graphics.beginStroke("#00ff00").drawRect(110, 110, 100, 100);
        var clip3 = new createjs.Graphics();
        clip3.setStrokeStyle(1);
        clip3.beginStroke("#000000");
        // clip3.beginFill("red");
        clip3.drawCircle(100, 100, 50);
        console.log(clip3);
        // shape.appendChild(clip3);
        // var shape3 = new createjs.Shape(clip3);
        var triger1 = new createjs.Shape();
        triger1.graphics.beginStroke("#0000ff").setStrokeStyle(2).moveTo(120, 120).lineTo(100, 140).lineTo(140, 140).lineTo(120, 120).endStroke();
        clip3.beginBitmapStroke(video);
        

        // container.addChild(clip3);

        var images = new createjs.Bitmap(video);//................................................................
        images.x = 0;
        images.y = 0;

        // var imagess = new createjs.Bitmap(img);

        // var matrix22d = new createjs.Matrix2D();
        // matrix22d.append(2, -1, 2, 0.7, 100, 100);
        // console.log(matrix22d);
        // shape.transformMatrix = matrix22d;
        // console.log(shape);
        // images.transformMatrix = "matrix2d(2, -1, 2, 0.7, 100, 100)";
        // images.transformMatrix = matrix22d;
        // console.log(imagess);
        container.addChild(shape);
        // container.addChild(shape3);
        container.addChild(triger1);
        clip3.draw(cx2);
        cx2.clip();
        stage.update();        
        // cx2
        
        container.addChild(images);
        // console.log(container);
        

        stage.update();
        
        btn.onclick = function () {
            if(video.paused){
                video.play();
            }else{
                video.pause();
            }
        }
        video.addEventListener("play", function(){
            console.log("play");
            var disx = 0, disy = 0;
            var bitmap = new createjs.Bitmap(video);
            bitmap.x=100;
            bitmap.y=200;
            bitmap.scaleX = 0.5;
            bitmap.scaleY = 0.3;
            bitmap.image.videoHeight = 100;
            // console.log(bitmap);
            var bitmapl = new createjs.Bitmap(video);
            container.addChild(bitmapl);
            container.addChild(bitmap);
            // console.log(container);
            bitmap.on("mousedown", function(evt) {
                disx = evt.stageX - evt.target.x;
                disy = evt.stageY - evt.target.y;
                console.log(disx, disy);
            }, false);
            bitmap.on("pressmove", function(evt){
                evt.target.x = evt.stageX - disx;
                evt.target.y = evt.stageY - disy;
            }, false);
            // draw(video, canvas, cx2);
            // cx2.drawImage(video, 0, 0, canvas.width, canvas.height);
        }, false);
        video.addEventListener("pause", function(){
            console.log("pause");
            stage.update();
        }, false);
        video.addEventListener("ended", function(){
            console.log("ended");
        }, false);

    }
}
