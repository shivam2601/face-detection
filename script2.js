let docImg;




async function compareImg(){
    let image
    let canvas
  
    const faceMatcher = new faceapi.FaceMatcher(labeledFaceDescriptors, 0.6)
      if (image) image.remove()
      if (canvas) canvas.remove()


    const container = document.createElement('div')
    container.style.position = 'relative'
    container.id="id-1";
  
    document.body.append(container)
    
    //const labeledFaceDescriptors = await loadLabeledImages('Black Widow');
    image=docImg;
   


    container.append(image)
    canvas = faceapi.createCanvasFromMedia(image)
    container.append(canvas)
    const displaySize = { width: image.width, height: image.height }
    faceapi.matchDimensions(canvas, displaySize)
    const detections = await faceapi.detectAllFaces(image).withFaceLandmarks().withFaceDescriptors()
    const resizedDetections = faceapi.resizeResults(detections, displaySize)
    const results = resizedDetections.map(d => faceMatcher.findBestMatch(d.descriptor));
    console.log(results)

    results.forEach((result, i) => {
      const box = resizedDetections[i].detection.box
      const drawBox = new faceapi.draw.DrawBox(box, { label: result.toString() })
      drawBox.draw(canvas)
    })
}

const video = document.getElementById('video')
let click_button = document.querySelector("#click-photo");
let canvas = document.querySelector("#canvas2");
var labeledFaceDescriptors;
Promise.all([
  faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
  faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
  faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
]).then(startVideo)

function startVideo() {
  navigator.getUserMedia(
    { video: {} },
    stream => video.srcObject = stream,
    err => console.error(err)
  )
}

video.addEventListener('play', () => {
  const canvas = faceapi.createCanvasFromMedia(video);

  let videoContainer=document.getElementById("video-container")
  videoContainer.append(canvas)
  const displaySize = { width: video.width, height: video.height }
  faceapi.matchDimensions(canvas, displaySize)
  setInterval(async () => {
    const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks();
    const resizedDetections = faceapi.resizeResults(detections, displaySize)
    canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height)
    faceapi.draw.drawDetections(canvas, resizedDetections)
  }, 100)
})
click_button.addEventListener('click', async ()=> {
  
  canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);
  let image_data_url = canvas.toDataURL('image/jpeg');

  var img = document.createElement('img');
            img.src=image_data_url
            labeledFaceDescriptors = await loadLabeledImages('Shivam',img);


            compareImg();

  //getBase64FromImageUrl(image_data_url);
  // data url of the image
  //console.log(image_data_url);
});














const imageUpload = document.getElementById('imageUpload')

Promise.all([
  faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
  faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
  faceapi.nets.ssdMobilenetv1.loadFromUri('/models')
]).then(start)

async function start() {

 

  imageUpload.addEventListener('change', async () => {
  
    image = await faceapi.bufferToImage(imageUpload.files[0])
    docImg=image
    document.getElementById("img-container").style.display="block"
    document.getElementById("doc-img").style.display="none"
  })
}

async function loadLabeledImages(name,img) {
      const descriptions = []
      const detections2 = await faceapi.detectSingleFace(img).withFaceLandmarks().withFaceDescriptor()
      descriptions.push(detections2.descriptor)
    
      return new faceapi.LabeledFaceDescriptors(name,descriptions)
}
