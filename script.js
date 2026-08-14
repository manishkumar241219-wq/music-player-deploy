/* =========================================================
   STATE CONFIGURATION
========================================================= */

const states = {


  /* =====================================================
     UTTARAKHAND
  ===================================================== */

  uttarakhand: {

      name:
          "Uttarakhand",

      playlist:
          "PLV39yHOvhSuKX-Y3HAUuuNnbKK9GDNPP-",

      horizontalVideo:
          "./assets/h-uttarakhand.mp4",

      verticalVideo:
          "./assets/v-uttarakhand.mp4"

  },


  /* =====================================================
     HARYANA
  ===================================================== */

  haryana: {

      name:
          "Haryana",

      playlist:
          "PLrtvJwFNtA_SmGn822XvODQYLmLW6YB-6",

      horizontalVideo:
          "./assets/h-haryana.mp4",

      verticalVideo:
          "./assets/v-haryana.mp4"

  },


  /* =====================================================
     TAMIL NADU
  ===================================================== */

  "tamil-nadu": {

      name:
          "Tamil Nadu",

      playlist:
          "PLHEbz5MHDUb4",

      horizontalVideo:
          "./assets/h-tamil-nadu.mp4",

      verticalVideo:
          "./assets/v-tamil-nadu.mp4"

  },


  /* =====================================================
     UTTAR PRADESH
  ===================================================== */

  "uttar-pradesh": {

      name:
          "Uttar Pradesh",

      playlist:
          "PLUA3hEXsgEvM",

      horizontalVideo:
          "./assets/h-uttar-pradesh.mp4",

      verticalVideo:
          "./assets/v-uttar-pradesh.mp4"

  }

};


/* =========================================================
 VARIABLES
========================================================= */

let player = null;

let youtubeAPIReady = false;

let currentState =
  "uttarakhand";

let isPlaying = false;

let progressInterval = null;

let playerGeneration = 0;


/*
* Which background video layer is currently visible?
*/

let activeBackground = "A";


/*
* Used to prevent old transitions from
* interfering with new selections.
*/

let backgroundTransitionId = 0;


/* =========================================================
 ELEMENTS
========================================================= */

const backgroundVideoA =
  document.getElementById(
      "backgroundVideoA"
  );


const backgroundVideoB =
  document.getElementById(
      "backgroundVideoB"
  );


const stateSelect =
  document.getElementById(
      "stateSelect"
  );


const songTitle =
  document.getElementById(
      "songTitle"
  );


const stateName =
  document.getElementById(
      "stateName"
  );


const playButton =
  document.getElementById(
      "playButton"
  );


const previousButton =
  document.getElementById(
      "previousButton"
  );


const nextButton =
  document.getElementById(
      "nextButton"
  );


const progress =
  document.getElementById(
      "progress"
  );


const progressBar =
  document.getElementById(
      "progressBar"
  );


const currentTime =
  document.getElementById(
      "currentTime"
  );


const duration =
  document.getElementById(
      "duration"
  );


const status =
  document.getElementById(
      "status"
  );


/* =========================================================
 MOBILE CHECK
========================================================= */

function isMobile() {

  return window.innerWidth <= 600;

}


/* =========================================================
 GET BACKGROUND SOURCE
========================================================= */

function getBackgroundSource(
  state
) {

  const config =
      states[state];


  if (!config) {

      return "";

  }


  if (isMobile()) {

      return config.verticalVideo;

  }


  return config.horizontalVideo;

}


/* =========================================================
 INITIAL BACKGROUND
========================================================= */

function loadInitialBackground() {

  const source =
      getBackgroundSource(
          currentState
      );


  if (!source) {

      return;

  }


  /*
   * Load first video into layer A.
   */

  backgroundVideoA.src =
      source;


  backgroundVideoA.load();


  /*
   * Play background.
   */

  backgroundVideoA.play()
      .catch(
          function(error) {

              console.log(
                  "Background autoplay:",
                  error
              );

          }
      );


  /*
   * Show layer A.
   */

  backgroundVideoA.style.opacity =
      "1";


  backgroundVideoB.style.opacity =
      "0";


  activeBackground =
      "A";

}


/* =========================================================
 CHANGE BACKGROUND
========================================================= */

function changeBackground(
  state
) {

  const source =
      getBackgroundSource(
          state
      );


  if (!source) {

      return;

  }


  /*
   * Generate unique transition ID.
   */

  const transitionId =
      ++backgroundTransitionId;


  let currentVideo;

  let nextVideo;


  /*
   * Determine current/next layers.
   */

  if (
      activeBackground ===
      "A"
  ) {

      currentVideo =
          backgroundVideoA;

      nextVideo =
          backgroundVideoB;

  }

  else {

      currentVideo =
          backgroundVideoB;

      nextVideo =
          backgroundVideoA;

  }


  /*
   * Stop the hidden layer.
   */

  nextVideo.pause();


  /*
   * Clear previous source.
   */

  nextVideo.removeAttribute(
      "src"
  );


  /*
   * Set new source.
   */

  nextVideo.src =
      source;


  /*
   * Keep it hidden while loading.
   */

  nextVideo.style.opacity =
      "0";


  /*
   * Load new video.
   */

  nextVideo.load();


  let transitionStarted =
      false;


  /*
   * Start transition.
   */

  function startTransition() {

      /*
       * Ignore old transition.
       */

      if (
          transitionId !==
          backgroundTransitionId
      ) {

          return;

      }


      /*
       * Don't execute twice.
       */

      if (transitionStarted) {

          return;

      }


      transitionStarted =
          true;


      /*
       * Remove listener.
       */

      nextVideo
          .removeEventListener(
              "canplay",
              startTransition
          );


      /*
       * Start new video first.
       */

      nextVideo.play()
          .catch(
              function(error) {

                  console.log(
                      "Background video:",
                      error
                  );

              }
          );


      /*
       * Crossfade.
       */

      nextVideo.style.opacity =
          "1";


      currentVideo.style.opacity =
          "0";


      /*
       * Change active layer.
       */

      activeBackground =
          activeBackground ===
          "A"
              ? "B"
              : "A";


      /*
       * Stop old video after fade.
       */

      setTimeout(
          function() {

              currentVideo.pause();

          },
          350
      );

  }


  /*
   * Wait for enough video data.
   */

  nextVideo
      .addEventListener(
          "canplay",
          startTransition,
          {
              once: true
          }
      );


  /*
   * Fallback if canplay doesn't fire quickly.
   */

  setTimeout(
      function() {

          if (
              transitionId !==
              backgroundTransitionId
          ) {

              return;

          }


          if (
              !transitionStarted &&
              nextVideo.readyState >= 2
          ) {

              startTransition();

          }

      },
      1000
  );

}


/* =========================================================
 INITIAL PAGE LOAD
========================================================= */

window.addEventListener(
  "load",
  function() {

      loadInitialBackground();

  }
);


/* =========================================================
 RESPONSIVE VIDEO SWITCHING
========================================================= */

let previousMobileState =
  isMobile();


window.addEventListener(
  "resize",
  function() {

      const mobile =
          isMobile();


      /*
       * Only change video when switching
       * between horizontal and vertical.
       */

      if (
          mobile !==
          previousMobileState
      ) {

          previousMobileState =
              mobile;


          changeBackground(
              currentState
          );

      }

  }
);


/* =========================================================
 LOAD YOUTUBE IFRAME API
========================================================= */

const youtubeScript =
  document.createElement(
      "script"
  );


youtubeScript.src =
  "https://www.youtube.com/iframe_api";


document.head.appendChild(
  youtubeScript
);


/* =========================================================
 YOUTUBE API READY
========================================================= */

window.onYouTubeIframeAPIReady =
  function() {

      youtubeAPIReady =
          true;


      createPlayer(
          currentState,
          true
      );

  };


/* =========================================================
 CREATE YOUTUBE PLAYER
========================================================= */

function createPlayer(
  state,
  autoplay
) {

  const config =
      states[state];


  if (
      !config ||
      !youtubeAPIReady
  ) {

      return;

  }


  playerGeneration++;


  const generation =
      playerGeneration;


  /*
   * Destroy old player.
   */

  if (player) {

      try {

          player.destroy();

      }

      catch (error) {

          console.log(
              "Player destroy error:",
              error
          );

      }


      player =
          null;

  }


  /* =====================================================
     RESET UI
  ===================================================== */

  isPlaying =
      false;


  playButton.innerHTML =
      "▶";


  playButton.title =
      "Play";


  songTitle.innerText =
      "Loading song...";


  stateName.innerText =
      config.name +
      " Music";


  status.innerText =
      "Loading playlist...";


  progressBar.style.width =
      "0%";


  currentTime.innerText =
      "0:00";


  duration.innerText =
      "0:00";


  /* =====================================================
     RECREATE YOUTUBE CONTAINER
  ===================================================== */

  const oldContainer =
      document.getElementById(
          "youtube-player"
      );


  if (oldContainer) {

      oldContainer.remove();

  }


  const newContainer =
      document.createElement(
          "div"
      );


  newContainer.id =
      "youtube-player";


  document.body.appendChild(
      newContainer
  );


  /* =====================================================
     CREATE YOUTUBE PLAYER
  ===================================================== */

  player =
      new YT.Player(
          "youtube-player",
          {

              width:
                  "200",

              height:
                  "200",


              playerVars: {

                  autoplay:
                      autoplay
                          ? 1
                          : 0,

                  controls:
                      0,

                  rel:
                      0,

                  playsinline:
                      1,

                  /*
                   * Playlist loop.
                   */

                  loop:
                      1,

                  listType:
                      "playlist",

                  list:
                      config.playlist

              },


              events: {


                  onReady:
                      function(event) {

                          if (
                              generation !==
                              playerGeneration
                          ) {

                              return;

                          }


                          onPlayerReady(
                              event,
                              autoplay
                          );

                      },


                  onStateChange:
                      function(event) {

                          if (
                              generation !==
                              playerGeneration
                          ) {

                              return;

                          }


                          onPlayerStateChange(
                              event
                          );

                      },


                  onError:
                      function(event) {

                          if (
                              generation !==
                              playerGeneration
                          ) {

                              return;

                          }


                          onPlayerError(
                              event
                          );

                      }

              }

          }
      );

}


/* =========================================================
 PLAYER READY
========================================================= */

function onPlayerReady(
  event,
  autoplay
) {

  status.innerText =
      "";


  setTimeout(
      function() {

          updateSongInfo();

          updateDuration();


          /*
           * Try autoplay.
           */

          if (autoplay) {

              try {

                  event.target
                      .playVideo();

              }

              catch (error) {

                  console.log(
                      "Music autoplay blocked:",
                      error
                  );

              }

          }

      },
      700
  );


  /*
   * Start progress updater.
   */

  if (!progressInterval) {

      progressInterval =
          setInterval(
              updateProgress,
              500
          );

  }

}


/* =========================================================
 PLAYER STATE CHANGE
========================================================= */

function onPlayerStateChange(
  event
) {


  /*
   * PLAYING
   */

  if (
      event.data ===
      YT.PlayerState.PLAYING
  ) {

      isPlaying =
          true;


      playButton.innerHTML =
          "⏸";


      playButton.title =
          "Pause";


      status.innerText =
          "";


      updateSongInfo();

      updateDuration();

  }


  /*
   * PAUSED
   */

  else if (
      event.data ===
      YT.PlayerState.PAUSED
  ) {

      isPlaying =
          false;


      playButton.innerHTML =
          "▶";


      playButton.title =
          "Play";

  }


  /*
   * CUED
   */

  else if (
      event.data ===
      YT.PlayerState.CUED
  ) {

      isPlaying =
          false;


      playButton.innerHTML =
          "▶";


      setTimeout(
          function() {

              updateSongInfo();

              updateDuration();

          },
          300
      );

  }


  /*
   * ENDED
   */

  else if (
      event.data ===
      YT.PlayerState.ENDED
  ) {

      isPlaying =
          false;


      playButton.innerHTML =
          "▶";


      /*
       * Move to next song.
       */

      playNextSong();

  }

}


/* =========================================================
 NEXT SONG
========================================================= */

function playNextSong() {

  if (!player) {

      return;

  }


  const playlist =
      player.getPlaylist();


  if (
      !playlist ||
      playlist.length === 0
  ) {

      return;

  }


  const currentIndex =
      player.getPlaylistIndex();


  let nextIndex =
      currentIndex + 1;


  /*
   * Last song → first song.
   */

  if (
      nextIndex >=
      playlist.length
  ) {

      nextIndex =
          0;

  }


  player.playVideoAt(
      nextIndex
  );


  status.innerText =
      "";

}


/* =========================================================
 PREVIOUS SONG
========================================================= */

function playPreviousSong() {

  if (!player) {

      return;

  }


  const playlist =
      player.getPlaylist();


  if (
      !playlist ||
      playlist.length === 0
  ) {

      return;

  }


  const currentIndex =
      player.getPlaylistIndex();


  let previousIndex =
      currentIndex - 1;


  /*
   * First song → last song.
   */

  if (
      previousIndex < 0
  ) {

      previousIndex =
          playlist.length - 1;

  }


  player.playVideoAt(
      previousIndex
  );


  status.innerText =
      "";

}


/* =========================================================
 PREVIOUS BUTTON
========================================================= */

previousButton.addEventListener(
  "click",
  function() {

      playPreviousSong();

  }
);


/* =========================================================
 NEXT BUTTON
========================================================= */

nextButton.addEventListener(
  "click",
  function() {

      playNextSong();

  }
);


/* =========================================================
 PLAY / PAUSE
========================================================= */

playButton.addEventListener(
  "click",
  function() {

      if (!player) {

          return;

      }


      if (isPlaying) {

          player.pauseVideo();

      }

      else {

          player.playVideo();

      }

  }
);


/* =========================================================
 STATE DROPDOWN
========================================================= */

stateSelect.addEventListener(
  "change",
  function() {

      currentState =
          stateSelect.value;


      /*
       * Change background.
       */

      changeBackground(
          currentState
      );


      /*
       * Change playlist.
       */

      if (youtubeAPIReady) {

          createPlayer(
              currentState,
              true
          );

      }

  }
);


/* =========================================================
 SONG INFORMATION
========================================================= */

function updateSongInfo() {

  if (!player) {

      return;

  }


  try {

      const data =
          player.getVideoData();


      if (
          data &&
          data.title
      ) {

          songTitle.innerText =
              data.title;

      }

  }

  catch (error) {

      console.log(
          "Song info error:",
          error
      );

  }

}


/* =========================================================
 DURATION
========================================================= */

function updateDuration() {

  if (!player) {

      return;

  }


  try {

      const total =
          player.getDuration();


      if (
          total &&
          total > 0
      ) {

          duration.innerText =
              formatTime(
                  total
              );

      }

  }

  catch (error) {

      console.log(
          "Duration error:",
          error
      );

  }

}


/* =========================================================
 PROGRESS
========================================================= */

function updateProgress() {

  if (!player) {

      return;

  }


  try {

      const current =
          player.getCurrentTime();


      const total =
          player.getDuration();


      if (
          !total ||
          total <= 0
      ) {

          return;

      }


      const percentage =
          (
              current /
              total
          ) * 100;


      progressBar.style.width =
          percentage + "%";


      currentTime.innerText =
          formatTime(
              current
          );


      duration.innerText =
          formatTime(
              total
          );

  }

  catch (error) {

      /*
       * Player may still be loading.
       */

  }

}


/* =========================================================
 SEEK
========================================================= */

progress.addEventListener(
  "click",
  function(event) {

      if (!player) {

          return;

      }


      const rect =
          progress.getBoundingClientRect();


      const position =
          event.clientX -
          rect.left;


      const percentage =
          position /
          rect.width;


      const total =
          player.getDuration();


      if (
          total &&
          total > 0
      ) {

          player.seekTo(
              total *
              percentage,
              true
          );

      }

  }
);


/* =========================================================
 YOUTUBE ERROR
========================================================= */

function onPlayerError(
  event
) {

  console.log(
      "YouTube error:",
      event.data
  );


  /*
   * Embedding disabled.
   */

  if (
      event.data === 101 ||
      event.data === 150
  ) {

      songTitle.innerText =
          "Song cannot be embedded";


      status.innerText =
          "This video does not allow embedding.";

  }


  /*
   * Video unavailable.
   */

  else if (
      event.data === 100
  ) {

      songTitle.innerText =
          "Song unavailable";


      status.innerText =
          "This video is unavailable.";

  }


  /*
   * Other error.
   */

  else {

      songTitle.innerText =
          "Unable to play song";


      status.innerText =
          "YouTube error: " +
          event.data;

  }

}


/* =========================================================
 FORMAT TIME
========================================================= */

function formatTime(
  seconds
) {

  if (
      !seconds ||
      isNaN(seconds)
  ) {

      return "0:00";

  }


  const minutes =
      Math.floor(
          seconds / 60
      );


  const remainingSeconds =
      Math.floor(
          seconds % 60
      );


  return (
      minutes +
      ":" +
      String(
          remainingSeconds
      ).padStart(
          2,
          "0"
      )
  );

}