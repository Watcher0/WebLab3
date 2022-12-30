var canvas = document.getElementById("example");
var context = canvas.getContext("2d");
var image = new Image();
var imgpoint = new Image();
imgpoint.src = "img/evap.png";
image.src = "img/msvg.svg";

image.onload = function() {
    context.drawImage(image, 0, 0);
    let r = document.getElementById("hiddenForm:R").value;
    //let r = document.getElementById("mainForm:inputR").value;
    loadCircles(r);
};

function sendPoint(x,y,r,cx,cy){
    var er_x = document.getElementById('hiddenForm:X');
    var er_y = document.getElementById('hiddenForm:Y');
    var er_r = document.getElementById('hiddenForm:R');
    er_x.value=x.toFixed(3);
    er_y.value=y.toFixed(3);
    er_r.value=r;
    let coor =
        { coor_x: x.toFixed(3),
        coor_y: y.toFixed(3),
        value_R: r
    }

    $.get('hit_checker', coor, function(data){
        let res = JSON.parse(data);
        let p=res==='true';
        if(p){
            saveCircle(cx, cy, r, 'green');
        }
        else{
            saveCircle(cx, cy, r, 'red');
        }
        document.getElementById("hiddenForm:hiddenButton").click();
        //window.location.reload();
    })
}

function saveCircle(x, y, r, color) {
    let circle = {
        "x": x,
        "y": y,
        "r": r,
        "color": color
    };
    let circles = JSON.parse(localStorage.getItem("circles"));

    if (circles == null)
        circles = [];

    circles.push(circle);

    localStorage.setItem("circles", JSON.stringify(circles));
}

function loadCircles(r) {
    circlesStorage = localStorage.getItem("circles");

    circles = JSON.parse(circlesStorage);

    if (circles == null)
        return;

    for (let circle of circles) {
        drawCircle(context, ((circle.x-175)/115)*(circle.r/r)*115+175, ((circle.y-175)/115)*(circle.r/r)*115+175, circle.r, circle.color);
    }
}

function drawCircle(context, x, y, r, color){
    context.beginPath();
    context.arc(x, y, 4, 0, 2 * Math.PI);
    context.fillStyle = color;
    //context.drawImage(imgpoint, x, y);
    context.fill();
    context.closePath();
    context.stroke();
}

function windowToCanvas(canvas, x, y) {
    var bcanv = canvas.getBoundingClientRect();
    return { x: x - bcanv.left,
        y: y - bcanv.top
    };
}

// document.getElementById("mainForm:inputR")
//     .addEventListener("keyup", function(event) {
//         event.preventDefault();
//         if (event.code === 'ArrowUp') {
//             context.clearRect(0, 0, canvas.width, canvas.height);
//             let r = document.getElementById("mainForm:inputR").value;
//             context.drawImage(image, 0, 0);
//             loadCircles(r);
//             //window.location.reload();
//         }
//     });

document.querySelectorAll("input.buttonR").forEach(function (e){
    e.addEventListener("click", function (){
        let button = e;
        document.querySelectorAll("input.buttonR").forEach( function (e){
            e.style.backgroundColor="#DEEFE7";
            e.style.borderColor="#DEEFE7";
        })
        context.clearRect(0, 0, canvas.width, canvas.height);
        let r = button.value;
        document.getElementById("hiddenForm:R").value = r;
        context.drawImage(image, 0, 0);
        loadCircles(r);
        this.style.backgroundColor = "#6e6e6e";
        this.style.borderColor="#6e6e6e";
    })
})

canvas.addEventListener('click', function (e) {
    var x = e.clientX;
    var y = e.clientY;
    var loc = windowToCanvas(canvas, x, y);
    context.clearRect(0, 0, canvas.width, canvas.height);
    let r = document.getElementById("hiddenForm:R").value;
    if(r>=1 && r<=4){
        sendPoint((loc.x-175)/115*r, -(loc.y-175)/115*r, r, loc.x, loc.y);
    }
});
let r = document.getElementById("hiddenForm:R").value;
loadCircles(r);