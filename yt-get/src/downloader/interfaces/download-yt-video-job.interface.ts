export interface DownloadYtVideoJob {
  /**
   * The Id used to delete the video from the playlist.
   */
  videoYoutubeId: string;

  /**
   * The Id used to download the video.
   */
  videoId: string;

  videoTitle: string;
}
