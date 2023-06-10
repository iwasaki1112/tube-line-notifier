import { youtube_v3, google } from "googleapis"
import { ChannelDetail } from "./types"

export class YouTubeChannelAnalyzer {
  private _service: youtube_v3.Youtube
  private _apiKey: string

  constructor(apiKey: string) {
    this._service = google.youtube('v3')
    this._apiKey = apiKey
  }

  private async _fetchAllVideosByPlaylistId(playListId: string): Promise<youtube_v3.Schema$PlaylistItem[]> {
    try {
      let videos: youtube_v3.Schema$PlaylistItem[] = []
      let nextPageToken: string | undefined | null = ''

      // Use pageToken in a while loop to fetch all videos
      while (nextPageToken !== undefined) {
        const params: youtube_v3.Params$Resource$Playlistitems$List = {
          key: this._apiKey,
          part: ['snippet', 'contentDetails'],
          playlistId: playListId,
          maxResults: 50,
          pageToken: nextPageToken || undefined,
        }
        const response = await this._service.playlistItems.list(params)
        response?.data.items?.forEach((video) => videos.push(video))
        nextPageToken = response?.data.nextPageToken
      }

      if (!videos || videos.length === 0) throw new Error(`No videos found in playlist: ${playListId}`)

      return videos
    } catch (err: any) {
      console.error(err)
      throw err
    }
  }

  public async fetchChannelDetail(channelId: string): Promise<ChannelDetail> {
    try {
      const response = await this._service.channels.list({
        key: this._apiKey,
        part: ['contentDetails', 'statistics', 'brandingSettings'],
        id: [channelId],
      })
      const channels = response?.data.items
      if (!channels || channels.length === 0) throw new Error(`No channel found for id: ${channelId}`)
      return channels[0] as ChannelDetail
    } catch (err: any) {      
      console.error(`Error fetching channel details: ${err}`)
      throw err
    }
  }

  public async fetchAllVideos(channelId: string): Promise<youtube_v3.Schema$PlaylistItem[]> {
    const channelDetail = await this.fetchChannelDetail(channelId) as youtube_v3.Schema$Channel
    const playlistId = channelDetail.contentDetails?.relatedPlaylists?.uploads
    if (!playlistId) throw new Error(`Uploads playlist not found for channel: ${channelId}`)
    const videos = await this._fetchAllVideosByPlaylistId(playlistId)
    return videos
  }

}