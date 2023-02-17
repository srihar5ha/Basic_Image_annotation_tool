      let canvas = document.getElementById("canvas");
      let ctx = canvas.getContext("2d");
      let rects = [];
      let rect={};
      let drag = false;
      let imgWidth = 500;
      let imgHeight = 500;
      let previousLabel="";
      const filePath = '/static/annotations.json';


      function enableDrawing() {
        if(document.getElementById("label").value!=""){
          previousLabel = document.getElementById("label").value;
        canvas.addEventListener("mousedown", mouseDown);
        canvas.addEventListener("mouseup", mouseUp);
        canvas.addEventListener("mousemove", mouseMove);
        document.getElementById("label").value="";
      }
    }

      function mouseDown(e) {
        rect.startX = e.offsetX - image.offsetLeft;
      rect.startY = e.offsetY - image.offsetTop;
      //console.log(e.offsetX,e.offsetY,image.offsetLeft,image.offsetTop)
        drag = true;
      }

      function mouseUp(e) {
        //console.log("up",e.offsetX,e.offsetY)
        drag = false;
        //console.log("in up log",rect.w)
        if(e.offsetX!=rect.startX && e.offsetY!=rect.startY && rect.w!=undefined) // checks if you have a valind box drawn.
         {rects.push(rect);}
        //console.log("Box coordinates:", rect.startX, rect.startY, rect.startX+rect.w, rect.startY+rect.h, "Label:", rect.label);
        rect = {};
        console.log(rects);
        
        canvas.removeEventListener("mousemove", mouseMove);
      }

      function mouseMove(e) {
        if (drag) {
          rect.w=e.offsetX- rect.startX
          rect.h=e.offsetY-rect.startY
          //console.log("in mouse move",rect.w,rect.h)
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          draw();
        }
      }

      function draw() {
        ctx.drawImage(image, 0, 0, imgWidth, imgHeight);
        ctx.globalCompositeOperation = "destination-over";
        ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.globalCompositeOperation = "source-over";
        for (let i = 0; i < rects.length; i++) {
          let rect = rects[i];
        if(rect.w!=NaN){
          ctx.beginPath();
        ctx.rect(rect.startX, rect.startY, rect.w, rect.h);
        ctx.strokeStyle = "red";
        ctx.stroke();
        ctx.font = "bold 16px Arial";
        ctx.fillStyle = "white";

        if(rect.label!=undefined){
        ctx.fillText(rect.label, rect.startX + 5, rect.startY + 20);
        }

        }
       
       }
      if (drag) {
       
        ctx.beginPath();
        ctx.rect(rect.startX, rect.startY, rect.w, rect.h);
        ctx.strokeStyle = "red";
        ctx.stroke();
        ctx.font = "bold 16px Arial";
        ctx.fillStyle = "white";
       
        rect.label = previousLabel; 
        
        //document.getElementById("label").value;
        if(rect.label!=undefined){
        ctx.fillText(rect.label, rect.startX + 5, rect.startY + 20);
        }
     }
} // function draw closing

      function reset() {
        rect = {};
        rects=[];
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        draw();
      }
      
      function saveAnnotations(){
        const image_name=image.src.split('/').pop();
        const annotation_data={ [image_name]: rects };
        console.log("annotation data is ",annotation_data)
        const url = '/save_annotations';
        const options = {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
        body: JSON.stringify(annotation_data)
    
    };
        console.log(options.body)
        fetch(url, options)
        .then(response => response.json())
        .then(data => {
        console.log('Received response from server:', data);
        window.location.href = data.redirect_url;
      })
      .catch(error => console.error('Error:', error));

      }//save annotations closing

      let image = new Image();
      image.onload = function() {
        canvas.width = imgWidth;
        canvas.height = imgHeight
        draw();
      };
      image.src = "../static/uploads/image1.jpg";
