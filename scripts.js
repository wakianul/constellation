// =================================================
// 📍 Boston coordinates
// =================================================
const BOSTON = {
  latitude: 42.3601,
  longitude: -71.0589
};

// =================================================
// 🌦 Global weather state
// =================================================
let weatherState = {
  isDay: true,
  sunrise: null,
  sunset: null,
  temperature: null
};

// =================================================
// 🕒 Format countdown text
// =================================================
function formatTimeLeft(ms) {
  if (ms <= 0) return "00:00:00";

  const totalSeconds = Math.floor(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

// =================================================
// 🎨 Apply visual theme
// =================================================
function applyTheme() {
  document.body.classList.remove("day-mode", "night-mode");

  if (weatherState.isDay) {
    document.body.classList.add("day-mode");
  } else {
    document.body.classList.add("night-mode"); 
  }
}

function updateStars() {
  if (!starLayer) return;

  if (weatherState.isDay) {
    starLayer.innerHTML = "";
    stars = [];
  } else {
    if (stars.length === 0) {
      generateStars(40);
    }
  }
}

// =================================================
// 🖼 Simple state image behavior
// You can replace image paths later
// =================================================
function updateImage() {
  const image = document.querySelector("#image1");
  if (!image) return;

  if (weatherState.isDay) {
    image.style.display = "none";
    image.removeAttribute("src");
    return;
  }

  image.style.display = "block";

  if (weatherState.isRain) {
    image.alt = "Rain mode";
    image.removeAttribute("src");
  } else {
    image.alt = "Night mode";
    image.removeAttribute("src");
  }
}

// =================================================
// 🌤 Fetch Boston weather + sunrise/sunset
// =================================================
async function fetchWeatherData() {
  const url =
    `https://api.open-meteo.com/v1/forecast` +
    `?latitude=${BOSTON.latitude}` +
    `&longitude=${BOSTON.longitude}` +
    `&current=temperature_2m,weather_code,is_day` +
    `&daily=sunrise,sunset` +
    `&timezone=America/New_York`;

  try {
    const res = await fetch(url);
    const data = await res.json();

    const current = data.current;
    const daily = data.daily;

    weatherState.isDay = current?.is_day === 1;
    weatherState.temperature = current?.temperature_2m ?? null;
    weatherState.sunrise = daily?.sunrise?.[0] || null;
    weatherState.sunset = daily?.sunset?.[0] || null;

    applyTheme();

    if (weatherState.isDay) {
      stopCamera();
    } else {
      await startCamera();
    }

    updateStars();
    updateImage();
    updateDateTime();

  } catch (error) {
    console.error("Failed to fetch weather data:", error);
  }
}

// =================================================
// 🕛 Update current time text
// =================================================
function updateDateTime() {
  const now = new Date();

  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday"
  ];
  const dayName = days[now.getDay()];

  const month = now.getMonth() + 1;
  const date = now.getDate();
  const year = now.getFullYear();

  let hour = now.getHours();
  const ampm = hour >= 12 ? "PM" : "AM";
  hour = hour % 12;
  if (hour === 0) hour = 12;

  const minute = String(now.getMinutes()).padStart(2, "0");
  const second = String(now.getSeconds()).padStart(2, "0");

  // =================================================
  // ✅ ➊ mainText1: current date & time
  // =================================================
  const mainText1 = document.querySelector("#mainText1");
  if (mainText1) {
    mainText1.textContent = `${dayName}, ${month}/${date}/${year}, ${hour}:${minute}:${second} ${ampm}`;
  }
 // 根据昼夜改变颜色
  if (weatherState.isDay) {
    mainText1.style.color = "black";
  } else {
    mainText1.style.color = "white";
  }
  // =================================================
  // ✅ ➋ mainText2: day / night / rain logic
  // =================================================
  const mainText2 = document.querySelector("#mainText2");
  if (!mainText2) return;

  if (weatherState.isDay) {
  if (weatherState.sunset) {
    const sunsetTime = new Date(weatherState.sunset);
    const msLeft = sunsetTime - now;
    const countdown = formatTimeLeft(msLeft);

    mainText2.textContent = `Boston is still in daylight. Night begins in ${countdown}.`;
  } else {
    mainText2.textContent = `Boston is still in daylight.`;
  }
} else {
  mainText2.innerHTML = `Night has fallen in Boston.<br>Use your hands to connect the stars.`;
}
  
if (mainText2) {
  if (weatherState.isDay) {
    mainText2.style.color = "black";
  } else {
    mainText2.style.color = "black";
  }
}
}

// =================================================
// 🚀 Init
// =================================================
fetchWeatherData();
setInterval(updateDateTime, 1000);
setInterval(fetchWeatherData, 10 * 60 * 1000);


const starLayer = document.querySelector("#starLayer");
let stars = [];

// =================================================
// 🌟 Generate stars
// =================================================
// const starImages = [
//   "./img/star.png",
// ];

// function generateStars(count = 60) {
//   starLayer.innerHTML = "";
//   stars = [];

//   for (let i = 0; i < count; i++) {

//     const star = document.createElement("img");
//     star.classList.add("star", "draggable");

//     // 🎲 随机选一张图片
//     const randomIndex = Math.floor(Math.random() * starImages.length);
//     star.src = starImages[randomIndex];

//     // 📍 随机位置
//    const CANVAS_WIDTH = 1980;
//    const CANVAS_HEIGHT = 1080;

//    const x = Math.random() * CANVAS_WIDTH;
//    const y = Math.random() * CANVAS_HEIGHT;

//     star.style.left = x + "px";
//     star.style.top = y + "px";

//     // 📏 随机大小（比 emoji 更重要）
//     const size = 10 + Math.random() * 60;
//     star.style.width = size + "px";

//     // 🌫 随机透明度
//     star.style.opacity = 0.5 + Math.random() * 0.5;

//   starLayer.appendChild(star);
//   stars.push(star);

//   }
// }

import {
  FilesetResolver,
  GestureRecognizer
} from "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.14";

const video = document.getElementById("video");
const boxes = document.querySelectorAll(".draggable");


// =================================================
// ✔️ Multi-hand State
// =================================================
const handState = {
  0: { selected: null, grabbing: false },
  1: { selected: null, grabbing: false }
};

let handPositions = {
  0: { x: 0, y: 0 },
  1: { x: 0, y: 0 }
};


// =================================================
// 📸 Webcam setup
// =================================================
const stream = await navigator.mediaDevices.getUserMedia({
  video: { facingMode: "user" }
});

video.srcObject = stream;
await video.play();
// let stream = null;

// async function startCamera() {
//   if (stream) return;

//   stream = await navigator.mediaDevices.getUserMedia({
//     video: { facingMode: "user" }
//   });

//   video.srcObject = stream;
//   await video.play();
// }

// =================================================
// ✔️ Mediapipe
// =================================================
const vision = await FilesetResolver.forVisionTasks(
  "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
);

const recognizer = await GestureRecognizer.createFromOptions(vision, {
  baseOptions: {
    modelAssetPath:
      "https://storage.googleapis.com/mediapipe-models/gesture_recognizer/gesture_recognizer/float16/1/gesture_recognizer.task"
  },
  numHands: 2
});


// =================================================
// ✔️ Distance
// =================================================
function dist(x1, y1, x2, y2) {
  return Math.hypot(x1 - x2, y1 - y2);
}


// =================================================
// ✔️ Main Loop
// =================================================
function isNightMode() {
  return document.body.classList.contains("night-mode");
}

async function loop() {
  if (!isNightMode() || !stream) {
    requestAnimationFrame(loop);
    return;
  }
  const result = await recognizer.recognize(video);

  if (result.landmarks && result.landmarks.length > 0) {

    for (let i = 0; i < result.landmarks.length; i++) {
      const lm = result.landmarks[i];

      // =================================================
      // ✅ Map hand position
      // =================================================
      let x = lm[9].x * window.innerWidth;
      let y = lm[9].y * window.innerHeight;

      // =================================================
      // ✔️ Flip horizontally
      // =================================================
      x = window.innerWidth - x;

      handPositions[i] = { x, y };
    }
  }

  const gestures = result.gestures || [];

  // =================================================
  // ✔️ Per hand process
  // =================================================
  for (let i = 0; i < gestures.length; i++) {

    const gesture = gestures[i][0].categoryName;
    const hand = handPositions[i];
    const state = handState[i];

    if (!hand) continue;


   // =================================================
   // ✊ Grab
   // =================================================
    if (gesture === "Closed_Fist") {

      if (!state.grabbing) {
        let minDist = Infinity;
        let nearest = null;

        boxes.forEach((box) => {
          const rect = box.getBoundingClientRect();
          const cx = rect.left + rect.width / 2;
          const cy = rect.top + rect.height / 2;

          const d = dist(hand.x, hand.y, cx, cy);

          if (d < minDist && d < 150) {
            minDist = d;
            nearest = box;
          }
        });

        state.selected = nearest;
        state.grabbing = true;
      }

      if (state.selected) {
        state.selected.style.left = hand.x - 60 + "px";
        state.selected.style.top = hand.y - 60 + "px";
      }
    }

   // =================================================
   // ✋ Release
   // =================================================
    if (gesture === "Open_Palm") {
      state.grabbing = false;
      state.selected = null;
    }
  }

  // =================================================
  // ✔️ Proximity Check
  // =================================================
  // const arr = Array.from(boxes);

  // for (let i = 0; i < arr.length; i++) {
  //   for (let j = i + 1; j < arr.length; j++) {

  //     const a = arr[i].getBoundingClientRect();
  //     const b = arr[j].getBoundingClientRect();

  //     const ax = a.left + a.width / 2;
  //     const ay = a.top + a.height / 2;

  //     const bx = b.left + b.width / 2;
  //     const by = b.top + b.height / 2;

  //     // =================================================
  //     // 🤲 Distance trigger
  //     // =================================================
  //     if (dist(ax, ay, bx, by) < 120) {
  //       document.querySelector("#special").style.display = "block";
  //     }
  //   }
  // }

  requestAnimationFrame(loop);
}

loop();