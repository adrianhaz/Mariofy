const DELAY_IN_MS = 1500;
const VIDEO_LENGTH_IN_MS = 20000;
const MAX_Z_INDEX = 2147483647;

const SHOULD_MARIOFY = Math.floor(Math.random() * 30) === 20;

let hasLearnedWhoTheChampIs = false;
let timeoutId;

function getMariofyVideo() {
  const video = document.createElement("video");
  video.src = chrome.runtime.getURL("mario.mp4");
  Object.assign(video.style, {
    position: "fixed",
    background: "black",
    zIndex: MAX_Z_INDEX,
    height: "100vh",
    width: "100vw",
    inset: 0,
  });

  return video;
}

function mariofy() {
  if (hasLearnedWhoTheChampIs) {
    return;
  }

  // This acts as a basic debounce so that if the user is doing
  // something click intensive, we don't show them who the champ is
  // until they've taken a brief break
  if (timeoutId != null) {
    clearTimeout(timeoutId);
  }

  timeoutId = setTimeout(() => {
    // Don't show the video if the tab isn't active. We'll show
    // them who the champ is next time
    if (document.hidden) {
      return;
    }

    const body = document.body;
    const previousPointerEvents = body.style.pointerEvents;
    body.style.pointerEvents = "none";
    const previousBackgroundColor = body.style.backgroundColor;
    body.style.backgroundColor = "black";

    const video = getMariofyVideo();
    body.appendChild(video);

    // Prevent future clicks from spawning additional videos while
    // this is playing. In theory, pointer-events: none should guard
    // against this but child nodes could have pointer-events set
    // explicitly
    window.removeEventListener("mouseup", mariofy);

    video.addEventListener("ended", () => {
      body.style.backgroundColor = previousBackgroundColor;
      body.style.pointerEvents = previousPointerEvents;
      body.removeChild(video);
      hasLearnedWhoTheChampIs = true;
    });

    video.play();
  }, DELAY_IN_MS);
}

if (SHOULD_MARIOFY) {
  // Add this to mouse-up instead of on load so we can auto-play
  // the video with sound
  window.addEventListener("mouseup", mariofy);
}
