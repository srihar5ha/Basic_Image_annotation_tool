let canvas,canvasList, ctx, annotationLabel, annotationLabels, annotations;
let isDrawing = false;
let startX, startY;
let boundingBoxes = [];
let currentBox = null;


window.addEventListener('DOMContentLoaded', () => {
    //canvasList = document.querySelectorA('#' + {image_name}');
    canvasList=document.querySelectorAll('canvas');
    canvasList.forEach(canvas => {
        var ctx = canvas.getContext('2d');
        console.log(canvas)
    
    

        annotationLabel = document.querySelector('#annotation-label');
        annotationLabels = document.querySelector('#annotation-labels');
        annotations = document.querySelector('#annotations');
    
        canvas.addEventListener('mousedown', startDrawing);
        canvas.addEventListener('mousemove', draw);
        canvas.addEventListener('mouseup', endDrawing);
        canvas.addEventListener('mouseleave', endDrawing);
    
        document.querySelector('#save-button').addEventListener('click', saveAnnotations);
        document.querySelector('#reset-button').addEventListener('click', resetAnnotations);
    });
    //ctx = canvas.getContext('2d');

   // annotationLabel = document.querySelector('#annotation-label');
    //annotationLabels = document.querySelector('#annotation-labels');
    //annotations = document.querySelector('#annotations');

    //canvas.addEventListener('mousedown', startDrawing);
    //canvas.addEventListener('mousemove', draw);
    //canvas.addEventListener('mouseup', endDrawing);
    //canvas.addEventListener('mouseleave', endDrawing);

    //document.querySelector('#save-button').addEventListener('click', saveAnnotations);
    //document.querySelector('#reset-button').addEventListener('click', resetAnnotations);
});

function startDrawing(event) {
    startX = event.offsetX;
    startY = event.offsetY;
    isDrawing = true;

    currentBox = {
        x: startX,
        y: startY,
        width: 0,
        height: 0,
        label: annotationLabel.value
    };
}

function draw(event) {
    if (!isDrawing) return;

    const x = event.offsetX;
    const y = event.offsetY;

    clearCanvas();
    drawBoundingBox(currentBox);
    drawBoundingBox({
        x: startX,
        y: startY,
        width: x - startX,
        height: y - startY,
        label: annotationLabel.value
    });
}

function endDrawing() {
    isDrawing = false;

    const x = event.offsetX;
    const y = event.offsetY;

    currentBox.width = x - startX;
    currentBox.height = y - startY;

    boundingBoxes.push(currentBox);
    currentBox = null;

    clearCanvas();
    drawBoundingBoxes();
}

function drawBoundingBox(box) {
    ctx.strokeStyle = 'red';
    ctx.lineWidth = 2;
    ctx.strokeRect(box.x, box.y, box.width, box.height);

    if (box.label) {
        const label = document.createElement('div');
        label.classList.add('annotation-label');
        label.style.left = box.x + 'px';
        label.style.top = box.y + 'px';
        label.textContent = box.label;
        annotationLabels.appendChild(label);
    }
}

function drawBoundingBoxes() {
    boundingBoxes.forEach(drawBoundingBox);
}

function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    annotationLabels.innerHTML = '';
}

function saveAnnotations() {
    const data = {
        bounding_boxes: boundingBoxes,
        image_name: document.querySelector('#image-name').value
    };

    fetch('/save_annotations', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    }).then(response => {
        if (response.ok) {
            alert('Annotations saved successfully!');
        } else {
            alert('Failed to save annotations!');
        }
    }).catch(error => {
        console.error(error);
        alert('An error occurred while saving annotations!');
    });
}

function resetAnnotations() {
    boundingBoxes = [];
    clearCanvas();
}
