
// let photocell;
// let beforeCell = 0;
// let restart=true;
// boardReady({ device: 'nWxRb' }, function (board) {
//   board.systemReset();
//   board.samplingInterval = 500; // 光敏取樣頻率
//   photocell = getPhotocell(board, 1); // A1 腳位
//   onStart(); // 開始偵測光敏
// });

// function onStart(){
//   photocell.on(function (val) {
//     if (restart){
//       console.log('光敏初始化中...');
//       beforeCell = val;
//       restart=false;
//     }
      
//     else {
//       let absPhotocell = Math.abs(beforeCell - val);
//       console.log(`before: ${beforeCell} after: ${val} div: ${absPhotocell}`)
//       if (absPhotocell >= 0.02) {
//         console.log('機器人觸發...');
//         restart = true;
//         photocell.off();
//         call();
//       }
//       beforeCell = val;
//     }
//     photocell.detectedVal = val;
//     document.getElementById("status").innerHTML = '連接成功';
//     document.getElementById("demo-area-01-show").innerHTML = photocell.detectedVal;
//   });
// }

// // 語音辨識初始化
// if (!("webkitSpeechRecognition" in window)) {
//   alert("本瀏覽器不支援語音辨識，請更換瀏覽器！(Chrome 25 版以上才支援語音辨識)");
// } else {
//   window._recognition = new webkitSpeechRecognition();
//   window._recognition.continuous = true;
//   window._recognition.interimResults = true;
//   window._recognition.lang = "cmn-Hant-TW";
//   // 開始語音辨識
//   window._recognition.onstart = function () {
//     window._recognition.status = true;
//     console.log("Start recognize...");
//   };
//   // 結束語音辨識
//   window._recognition.onend = function () {
//     console.log("Stop recognize");
//     if (window._recognition.status) {
//       window._recognition.start();
//     }
//   };
// }

// function call() {
//   speak('請問您要查詢哪裡的天氣', ["zh-TW", 1, 1, 1], function () {
//     document.getElementById("status").innerHTML = '連接成功[語音辨識]';
//     // 開始語音辨識
//     window._recognition.onresult = function (event, result) {
//       result = {};
//       result.resultLength = event.results.length - 1;
//       result.resultTranscript = event.results[result.resultLength][0].transcript;
//       if (event.results[result.resultLength].isFinal === true) {
//         console.log(result.resultTranscript);
//         if (result.resultTranscript.indexOf("目前") !== -1) {
//           speak('搜尋中請稍候', ["zh-TW", 1, 1, 1], function () {
//             window._recognition.status = false;
//             window._recognition.stop();
//             //搜尋延遲等待
//             setTimeout(function () { 
//               speak('目前天氣晴', ["zh-TW", 1, 1, 1], function () {
//                 onStart(); // 開始偵測光敏
//               }, 0);
//             }, 3000);
//           }, 0);
//           console.log(event.results[result.resultLength]);
//         }
//         console.log("final");
//       } else if (event.results[result.resultLength].isFinal === false) {
//       }
//     };
//     window._recognition.start();
//   }, 0)
// }


// boardReady({ device: 'nWxRb' }, function (board) {
//   board.systemReset();
//   board.samplingInterval = 250;
//   console.log('光敏初始化中gdfl...ds');
//   speak('123', ["zh-TW", 1, 1, 1], function () {

//   }, 0);
// });

function myclick(){
  var msg = new SpeechSynthesisUtterance();
  var voices = window.speechSynthesis.getVoices();
  msg.voice = voices[10]; // Note: some voices don't support altering params
  msg.voiceURI = 'native';
  msg.volume = 1; // 0 to 1
  msg.rate = 1.2; // 0.1 to 10
  msg.pitch = 2; //0 to 2
  msg.text = 'Sure. This code plays "Hello World" for you';
  msg.lang = 'en-US';

  msg.onend = function (e) {
    var msg1 = new SpeechSynthesisUtterance('Now code plays audios for you');
    msg1.voice = speechSynthesis.getVoices().filter(function (voice) { return voice.name == 'Whisper'; })[0];
    msg1.pitch = 2; //0 to 2
    msg1.rate = 1.2; //0 to 2
    // start your audio loop.
    speechSynthesis.speak(msg1);
    console.log('Finished in ' + e.elapsedTime + ' seconds.');
  };
  console.log('dsfds');
  speechSynthesis.speak(msg);
}
  



