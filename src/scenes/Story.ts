export class Story {
  static getVideo(file: string, callback: Function) {
    const video = <HTMLVideoElement> document.createElement('VIDEO');
    video.setAttribute('src', file);
    video.setAttribute('width', "640");
    video.setAttribute('height', "480");
    video.play();
    document.body.appendChild(video);
    video.addEventListener('ended', () => {
      video.style.display = "none";
      callback();
    });
  }
}
