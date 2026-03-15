const DEFAULT_HTML_TAILWIND = `<div class="relative flex items-center justify-center w-screen h-screen bg-[#242424] overflow-hidden">

  <!-- Snow particles -->
  <div class="absolute inset-0 overflow-hidden">

    <div class="absolute left-[10%] top-[-10px] w-[4px] h-[4px] bg-white rounded-full animate-[snow_6s_linear_infinite]"></div>
    <div class="absolute left-[20%] top-[-10px] w-[4px] h-[4px] bg-white rounded-full animate-[snow_8s_linear_infinite]"></div>
    <div class="absolute left-[35%] top-[-10px] w-[4px] h-[4px] bg-white rounded-full animate-[snow_5s_linear_infinite]"></div>
    <div class="absolute left-[50%] top-[-10px] w-[4px] h-[4px] bg-white rounded-full animate-[snow_7s_linear_infinite]"></div>
    <div class="absolute left-[65%] top-[-10px] w-[4px] h-[4px] bg-white rounded-full animate-[snow_6s_linear_infinite]"></div>
    <div class="absolute left-[80%] top-[-10px] w-[4px] h-[4px] bg-white rounded-full animate-[snow_9s_linear_infinite]"></div>
    <div class="absolute left-[90%] top-[-10px] w-[4px] h-[4px] bg-white rounded-full animate-[snow_5s_linear_infinite]"></div>

  </div>

  <!-- Text -->
  <h1 class="text-white text-5xl font-bold uppercase tracking-wide z-10">
    <span class="text-[#429872]">code</span>harem
  </h1>

</div>

<style>
  @keyframes snow {
    0% {
      transform: translateY(-10px);
      opacity: 0
    }

    10% {
      opacity: 1
    }

    100% {
      transform: translateY(100vh);
      opacity: 0
    }
  }
</style>`;

const DEFAULT_HTML_CSS = `<div class="container">
  <div class="snow">
    <span></span>
    <span></span>
    <span></span>
    <span></span>
    <span></span>
    <span></span>
    <span></span>
  </div>

  <h1><span>code</span>harem</h1>
</div>`;

const DEFAULT_CSS_PLAIN = `.container {
  height: 100vh;
  width: 100vw;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #242424;
  position: relative;
  overflow: hidden;
}

.container h1 {
  font-size: 50px;
  font-weight: 700;
  color: white;
  text-transform: uppercase;
  letter-spacing: 1px;
  z-index: 2;
}

.container span {
  color: #429872;
}

/* Snow container */
.snow {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
}

.snow span {
  position: absolute;
  top: -10px;
  width: 4px;
  height:4px;
  background: white;
  border-radius: 50%;
  animation: snowFall linear infinite;
}

/* Random positions */
.snow span:nth-child(1) {
  left: 10%;
  animation-duration: 6s;
}

.snow span:nth-child(2) {
  left: 20%;
  animation-duration: 8s;
}

.snow span:nth-child(3) {
  left: 35%;
  animation-duration: 5s;
}

.snow span:nth-child(4) {
  left: 50%;
  animation-duration: 7s;
}

.snow span:nth-child(5) {
  left: 65%;
  animation-duration: 6s;
}

.snow span:nth-child(6) {
  left: 80%;
  animation-duration: 9s;
}

.snow span:nth-child(7) {
  left: 90%;
  animation-duration: 5s;
}

@keyframes snowFall {
  0% {
    transform: translateY(-10px);
    opacity: 0;
  }

  10% {
    opacity: 1;
  }

  100% {
    transform: translateY(100vh);
    opacity: 0;
  }
}`;

export { DEFAULT_HTML_TAILWIND, DEFAULT_HTML_CSS, DEFAULT_CSS_PLAIN };
