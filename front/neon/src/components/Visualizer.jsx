import { React, useEffect, useRef, useState } from "react";
import "./style.css";
import On from "../img/items/on.png";
import Off from "../img/items/off.png";
import Start from "../img/items/play.png";
import LikeSound from "./LikeSound";
const { REACT_APP_API_ENDPOINT } = process.env;



let gainNode;
let context;
let source;


const Visualizer = (props) => {
  const gainNodeRef = useRef(0);
  const canvasRef = useRef(null);
  const [sound, setSound] = useState(true);
  const [startRadio, setStartRadio] = useState(true);
  const [name, setName] = useState('');
  const [imageData, setImageData] = useState(null);
  const [render, setRender] = useState(0);
  const [duration, setDuration] = useState(0);
  const [visualSource, setVisualSource] = useState(null);
  const [ct, setCt] = useState(null);

  const mutePlay = () => {
    if (!gainNode.gain.value) {
      gainNode.gain.value = 0.7;
      gainNodeRef.current = 0.7;
      if (source.buffer) {
        setSound(!sound);
      }
    } else {
      gainNode.gain.value = 0;
      gainNodeRef.current = 0;
      if (source.buffer) {
        setSound(!sound);
      }
    }
  };

  const start = () => {
    context.resume();
    gainNode.gain.value = 0.7;
    gainNodeRef.current = 0.7;
    setStartRadio(false);
  };


  const fetchData = async () => {
    try {
      const response = await fetch(`${REACT_APP_API_ENDPOINT}/info_data`);
      const json = await response.json();
      return json;
    } catch (error) {
    }
  };

  const visual = () => {
    const canvas = canvasRef.current;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const ctx = canvas.getContext("2d");

    const analyser = context.createAnalyser();
    source.connect(analyser);
    analyser.fftSize = 1024;
    const bufferLength = analyser.frequencyBinCount,
      dataArray = new Uint8Array(bufferLength),
      WIDTH = canvas.width,
      HEIGHT = canvas.height;

    const timeouts = [];
    const renderFrame = () => {
      requestAnimationFrame(renderFrame);

      analyser.getByteFrequencyData(dataArray);

      const barSpacing = 4;
      const bW = 5;
      const bH = 5;
      const radiusReduction = 200;
      const amplitudeReduction = 2;
      const cx = canvas.width / 2;
      const cy = canvas.height / 2;
      const radius = Math.min(cx, cy) - radiusReduction;
      const maxBarNum = Math.floor((radius * 2 * Math.PI) / (bW + barSpacing));
      const slicedPercent = Math.floor(maxBarNum / 5 / 100);
      const barNum = maxBarNum - slicedPercent;
      const freqJump = Math.floor(dataArray.length / maxBarNum);

      for (let i = 0; i < barNum; i++) {
        const amplitude = dataArray[i * freqJump];
        const theta = (i * 2 * Math.PI) / maxBarNum;
        const delta = ((3 * 45 - bW) * Math.PI) / 180;
        const x = 0;
        const y = radius - (amplitude / 12 - bH);
        const w = bW;
        const h = amplitude / amplitudeReduction + bH;

        ctx.save();
        ctx.fillStyle = "rgb(255, 255, 255)";
        ctx.translate(cx + barSpacing, cy + barSpacing);
        ctx.rotate(theta - delta);
        ctx.fillRect(x, y, w, h);
        ctx.restore();
        if(i === 0){
          ctx.clearRect(0, 0, WIDTH, HEIGHT);
        };
      }
    };
    renderFrame();
  };

  useEffect(() => {
    const fetchImg = async () => {
    try {
      const name_img = localStorage.getItem('track_name');
      const response = await fetch(`${REACT_APP_API_ENDPOINT}/get_img/${name_img}`);
      const blob = await response.blob();
      setImageData(URL.createObjectURL(blob));
    } catch (error) {
    }
  };

    function play(track_name, second) {
      
      try {
        fetch(`${REACT_APP_API_ENDPOINT}/get_track/${track_name}`)
          .then((response) => response.arrayBuffer())
          .then((response) => {
            context.decodeAudioData(response, (buffer) => {
              source.buffer = buffer;
              source.connect(gainNode);
              gainNode.connect(context.destination);
              source.start(0, second);
              gainNode.gain.value = gainNodeRef.current;
            });
          });
      } catch (err) {
        throw err;
      }
    }

    async function get_play_track() {
      context = new (window.AudioContext || window.webkitAudioContext)();
      source = context.createBufferSource();
      visual();
      setVisualSource(source);
      setCt(context);
      gainNode = context.createGain();
      const data = await fetchData();
      const reset = data[0]["duration"] - data[0]["seconds"];
      setDuration(reset - 1);
      play(data[0]["name"], data[0]["seconds"]);
      setName(data[0]["name"]);
      localStorage.setItem('track_name', data[0]["name"]);
      fetchImg();
      await new Promise(resolve => setTimeout(resolve, (reset + 1) * 1000));
      get_play_track();
    }
    get_play_track();
  }, []);

  return (
    <div>
      <button>
        <div className="canvas_box">
          <canvas ref={canvasRef} className="canvas"></canvas>
        </div>
        <div className="icon_block">
          <img src={imageData} className="icon_img" />
        </div>
        <div className="name">
          <div className="name__song">{name}</div>
        </div>
        {startRadio ? (
          <div className="mute" onClick={start}>
            {" "}
            <img src={Start} className="mute__img" />{" "}
          </div>
        ) : (
          <div className="mute" onClick={mutePlay}>
            {sound ? (
              <img src={On} className="mute__img" />
            ) : (
              <img src={Off} className="mute__img" />
            )}
          </div>
        )}

        <div className="likesound">
          <LikeSound name={name} globalName={props.globalName} delLike={props.delLike} setAddorDel={props.setAddorDel} />
        </div>
      </button>
    </div>
  );
};

export default Visualizer;
