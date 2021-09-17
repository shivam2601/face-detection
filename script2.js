let docImg;
let userName = "";
let form = document.getElementById("custom-form");
let resName;
let resScore;



async function compareImg(img,id) {
  let image;
  let canvas;

  const faceMatcher = new faceapi.FaceMatcher(labeledFaceDescriptors, 0.6);
  if (image) image.remove();
  if (canvas) canvas.remove();

  const container = document.createElement("div");
  container.style.position = "relative";
  container.id = id;

  document.body.append(container);

  //const labeledFaceDescriptors = await loadLabeledImages('Black Widow');
  image = img;

  container.append(image);
  canvas = faceapi.createCanvasFromMedia(image);
  container.append(canvas);
  const displaySize = { width: image.width, height: image.height };
  faceapi.matchDimensions(canvas, displaySize);
  const detections = await faceapi
    .detectAllFaces(image)
    .withFaceLandmarks()
    .withFaceDescriptors();
  const resizedDetections = faceapi.resizeResults(detections, displaySize);
  const results = resizedDetections.map((d) =>
    faceMatcher.findBestMatch(d.descriptor)
  );
  console.log(results);

  results.forEach((result, i) => {
    const box = resizedDetections[i].detection.box;
    const drawBox = new faceapi.draw.DrawBox(box, );
    console.log(result["_distance"])
    drawBox.draw(canvas);
  });



  if(id=="id-1"){
    console.log("klklkl");
    resName=results[0]["_label"];
    resScore=1-results[0]["_distance"]

    if(resName!="unknown"){
      let result =document.createElement('h2');
      result.innerText='(Name: '+ resName+ ", Score: "+parseFloat(resScore).toFixed(2)+')';
      document.body.append(result);

    }

    let result3 =document.createElement('button');
    result3.innerText=resName==="unknown"? "Verification Failed":"Verified";
    resName==="unknown"?result3.classList.add("red-btn"):result3.classList.add("green-btn")
    document.body.append(result3);
  }
  

}


const video = document.getElementById("video");
let click_button = document.querySelector("#click-photo");
let canvas = document.querySelector("#canvas2");
var labeledFaceDescriptors;
Promise.all([
  faceapi.nets.tinyFaceDetector.loadFromUri("/models"),
  faceapi.nets.faceLandmark68Net.loadFromUri("/models"),
  faceapi.nets.faceRecognitionNet.loadFromUri("/models"),
]).then(startVideo);

function startVideo() {
  navigator.getUserMedia(
    { video: {} },
    (stream) => (video.srcObject = stream),
    (err) => console.error(err)
  );
}

video.addEventListener("play", () => {
  const canvas = faceapi.createCanvasFromMedia(video);

  let videoContainer = document.getElementById("video-container");
  videoContainer.append(canvas);
  const displaySize = { width: video.width, height: video.height };
  faceapi.matchDimensions(canvas, displaySize);
  setInterval(async () => {
    const detections = await faceapi
      .detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
      .withFaceLandmarks();
    const resizedDetections = faceapi.resizeResults(detections, displaySize);
    canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);
    faceapi.draw.drawDetections(canvas, resizedDetections);
  }, 100);
});

//capture click handle

click_button.addEventListener("click", async () => {
  canvas.getContext("2d").drawImage(video, 0, 0, canvas.width, canvas.height);
  let image_data_url = canvas.toDataURL("image/jpeg");

  var img = document.createElement("img");
  img.src = image_data_url;
  labeledFaceDescriptors = await loadLabeledImages(userName, img);
  compareImg(docImg,"id-1");
  compareImg(img,"id-2");

  document.getElementById("img-container").style.display = "none";
});

//image upload code

const imageUpload = document.getElementById("imageUpload");

Promise.all([
  faceapi.nets.faceRecognitionNet.loadFromUri("/models"),
  faceapi.nets.faceLandmark68Net.loadFromUri("/models"),
  faceapi.nets.ssdMobilenetv1.loadFromUri("/models"),
]).then(start);

async function start() {
  imageUpload.addEventListener("change", async () => {
    image = await faceapi.bufferToImage(imageUpload.files[0]);
    docImg = image;

  });
}

//create image vector for a image

async function loadLabeledImages(name, img) {
  const descriptions = [];
  const detections2 = await faceapi
    .detectSingleFace(img)
    .withFaceLandmarks()
    .withFaceDescriptor();
  descriptions.push(detections2.descriptor);

  return new faceapi.LabeledFaceDescriptors(name, descriptions);
}

form.addEventListener("submit", function (e) {
  e.preventDefault();
  userName = document.getElementById("fname").value;
  if (userName == "") {
    alert("please enter the name");
    return;
  }
  document.getElementById("img-container").style.display = "block";
  document.getElementById("doc-img").style.display = "none";
});
