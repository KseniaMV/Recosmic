export class Story {
  static getVideo(file: string, callback: Function) {
    const video = <HTMLVideoElement> document.createElement('VIDEO');
    video.setAttribute('src', file);
    video.setAttribute('width', "640");
    video.setAttribute('height', "480");
    video.play();
    document.body.appendChild(video);

    const skipButton = <HTMLButtonElement> document.createElement('BUTTON');
    skipButton.classList.add('skipButton');
    skipButton.textContent = 'SKIP';
    document.body.appendChild(skipButton);
    skipButton.addEventListener('click', () => {
      document.body.removeChild(skipButton);
      video.currentTime = 999999999999999;
    });

    video.addEventListener('ended', () => {
      video.style.display = "none";
      document.body.removeChild(video);
      document.body.removeChild(skipButton);
      callback();
    });
  }
}
