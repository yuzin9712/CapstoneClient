//은규가준 이미지 삽입 부분 JS part를 여기다 전역함수로 선언해줘서 사용한다.
function initCanvas() {
  $(".canvas-container").each(function(index) {
    var canvasContainer = $(this)[0];
    var canvasObject = $("canvas", this)[0];
    // var url = $(this).data("floorplan");
    
    canvas = (window._canvas = new fabric.Canvas(canvasObject,{backgroundColor:"#fff"}));  //이런식으로 backgroud설정가능


    
    canvas.setHeight(400); //캔버스의 크기설정할수 있음//캔버스의 높이설정 여기서 해줘야함
    canvas.setWidth(300);  //캔버스랑 배경 안겹치면 이숫자를 맞춰줘라
    // canvas.setBackgroundImage(url, canvas.renderAll.bind(canvas));

    var imageOffsetX, imageOffsetY;

    function handleDragStart(e) {  //넣을 이미지를 클릭하고 옮기는 딱 start시점에 발생
    console.log('DragStart');
    [].forEach.call(images, function(img) {
        img.classList.remove("img_dragging");
    });
    this.classList.add("img_dragging");

    var imageOffset = $(this).offset();
    imageOffsetX = e.clientX - imageOffset.left;  //내가 놓은 위치에 이미지가 그 위치에 안착하게 도와주는부분
    imageOffsetY = e.clientY - imageOffset.top;
    }

    function handleDragOver(e) {   //넣을 이미지가 canvas위에서 자리이동할때 불리는함수
    console.log('drag over');
    if (e.preventDefault) {
        e.preventDefault();
    }
    e.dataTransfer.dropEffect = "copy";
    return false;
    }

    function handleDragEnter(e) {  //넣을 이미지가 canvas안에 들어가는 시점에서 발생되는 함수(start와는다름)
        console.log('drag enter');
    this.classList.add("over");
    }

    function handleDragLeave(e) {  //넣을 이미지가 canvas에서 나오는 시점에서 발생되는함수
    console.log('drag leave');
    this.classList.remove("over");
    }


    async function handleDrop(e) {    
    console.log('drag drop');
    e = e || window.event;
    if (e.preventDefault) {
        e.preventDefault();
    }
    if (e.stopPropagation) {
        e.stopPropagation();
    }
    var img = document.querySelector(".furniture img.img_dragging");
    
    // console.log("event: ", e);
    //  console.log(img);
    var offset = $(canvasObject).offset();
    var y = e.clientY - (offset.top + imageOffsetY); //내가 놓은 위치에 이미지가 그 위치에 안착하게 도와주는부분
    var x = e.clientX - (offset.left + imageOffsetX);

    var newImage = new fabric.Image(img, {//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!1여기서 img란 밑에 삽입되길 기다리는 놈이 img를 의미함,위에서의  src={this.props.basket[0]} width='600' 이놈의 width통제받는다는말
        // width: img.width,   //  !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!img.width    이부분존나중요!!!!!!!!!!이미지가 canvas에 들어가는순간 바뀌는 크기지정하는곳!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
        // height: img.height,  // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!img.height    width랑 height을 600 , 600 으로 하면 보임, 사진이 짤리고 안짤리고는 이부분과, Testhome에 있는 이미지원본크기 이 둘사이의 상관관계에 의해 사진이 짤리고 안짤리고가결정남
        left: x,           //!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!1!!!!!!!!!!!!!!!!!!!!!!!!!Testhome에서 받는 원본이미지가 존나 크면 잘려나오고, 감당이 되는 사이즈가 주어지면 제대로나옴, 
        top: y                //!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!Testhome의 원본이미지가 800 800크긴데 여기서 width 400 height 400 주면 짤려나오고
    });                    //!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!Testhome이 800800 인데 여기서 width 800 hetight 800 주면 제대로 다나옴, 여기서 width height은 기준이 Lest ,Top 왼쪽윗꼭지점기준 width height이여서 원본이미지크기보다 작게 canvas에서 찍을경우 잘려나오는것임
    
    canvas.add(newImage);
        newImage.scaleToWidth(img.width)
        return false;
    }

    

    function handleDragEnd(e) {
        console.log('Dragend');
        [].forEach.call(images, function(img) {
            img.classList.remove("img_dragging");
        });
        }

        var images = document.querySelectorAll(".furniture img");
        [].forEach.call(images, function(img) {
        img.addEventListener("dragstart", handleDragStart, false);
        img.addEventListener("dragend", handleDragEnd, false);
        });

        canvasContainer.addEventListener("dragenter", handleDragEnter, false);
        canvasContainer.addEventListener("dragover", handleDragOver, false);
        canvasContainer.addEventListener("dragleave", handleDragLeave, false);
        canvasContainer.addEventListener("drop", handleDrop, false);
    });
}



function deleteObjects(canvas){ //삭제하기
    var activeObject = canvas.getActiveObjects(),
    activeobjectGroup = new fabric.ActiveSelection(activeObject, {              //여러개 선택하면 삭제 안되니깐 새로 패브릭으로 만들어주고
        canvas: canvas                                                              // 그걸 통으로 지우는 방식
    });
    if (activeobjectGroup) {
    // console.log(activeobjectGroup);
    activeobjectGroup.forEachObject(function(obj) {
        //console.log(obj);
    canvas.remove(obj);
    });
    }
    else {
    //console.log("aaaaaaaaaaaaaaaaa");
    //console.log(activeObject);
    canvas.remove(activeObject);
    
    }
    canvas.discardActiveObject();
    canvas.requestRenderAll();
}


function getIndex(canvas){  //이미지 앞뒤 순서 자동으로 정해주는놈

// console.log("aaa");
var activeObj = canvas.getActiveObject();


canvas.bringToFront(activeObj);                                                 
// console.log(activeObj && canvas.getObjects().indexOf(activeObj));              
return activeObj && canvas.getObjects().indexOf(activeObj)
}