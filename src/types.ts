import { youtube_v3 } from "googleapis"

export type ChannelDetail = {
  etag: string | null
  id: string | null
  kind: string | null
  statistics: youtube_v3.Schema$ChannelStatistics
  brandingSettings: youtube_v3.Schema$ChannelBrandingSettings
  contentDetails: youtube_v3.Schema$ChannelContentDetails
}