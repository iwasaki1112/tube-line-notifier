// import dotenv from "dotenv"
// import path from 'path'
import { google, youtube_v3 } from "googleapis"

// const envPath = path.join(__dirname, '..', '.env')
// dotenv.config({ path: envPath })

export class YoutubeClient {
  private _service: youtube_v3.Youtube
  private _apiKey: string

  constructor(apiKey: string) {
    this._service = google.youtube('v3')
    this._apiKey = apiKey
  }

  private async _fetchChannelDetails(service: youtube_v3.Youtube, channelId: string, apiKey: string): Promise<youtube_v3.Schema$Channel> {
    try {
      const response = await service.channels.list({
        key: apiKey,
        part: ['contentDetails'],
        id: [channelId],
      })
      const channels = response?.data.items
      if (!channels || channels.length === 0) throw new Error(`No channel found for id: ${channelId}`)
      return channels[0]
    } catch (err) {
      console.error(`Error fetching channel details: ${err}`)
      throw err
    }
  }

  private async _fetchVideosByPlaylistId(service: youtube_v3.Youtube, apiKey: string, playListId: string): Promise<youtube_v3.Schema$PlaylistItem[]> {
    try {
      let videos: youtube_v3.Schema$PlaylistItem[] = []
      let nextPageToken: string | undefined | null = ''

      // Use pageToken in a while loop to fetch all videos
      while (nextPageToken !== undefined) {
        const params: youtube_v3.Params$Resource$Playlistitems$List = {
          key: apiKey,
          part: ['snippet', 'contentDetails'],
          playlistId: playListId,
          maxResults: 50,
          pageToken: nextPageToken || undefined,
        }
        const response = await service.playlistItems.list(params)
        response?.data.items?.forEach((video) => videos.push(video))
        nextPageToken = response?.data.nextPageToken
      }

      if (!videos || videos.length === 0) throw new Error(`No videos found in playlist: ${playListId}`)

      return videos
    } catch (err) {
      console.error(err)
      throw err
    }
  }

  async fetchAllVideos(channelId: string): Promise<youtube_v3.Schema$PlaylistItem[]> {
    const channelDetail = await this._fetchChannelDetails(this._service, channelId, this._apiKey) as youtube_v3.Schema$Channel
    const playlistId = channelDetail.contentDetails?.relatedPlaylists?.uploads
    if (!playlistId) throw new Error(`Uploads playlist not found for channel: ${channelId}`)
    const videos = await this._fetchVideosByPlaylistId(this._service, this._apiKey, playlistId)
    return videos
  }

}
