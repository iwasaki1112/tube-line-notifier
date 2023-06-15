# YouTube Channel Analyzer

`youtube-channel-analyzer` is a Node.js package that makes it easy to retrieve and analyze information from YouTube channels. It uses the YouTube Data API v3 to fetch details about a specific channel and all videos within that channel. This tool is useful for developers seeking to gain insights from YouTube channels or wanting to integrate YouTube channel data into their applications.

## Prerequisites
- Node.js and npm installed
- YouTube Data API v3 key. See [here](https://developers.google.com/youtube/registering_an_application) for instructions on how to get one.

### Installation

```shell
npm install youtube-channel-analyzer --save
```

### Usage

Firstly, import the package and initialize with your YouTube Data API v3 key.

```javascript
import { YouTubeChannelAnalyzer } from 'youtube-channel-analyzer'

const apiKey = YOUR_API_KEY
const youTubeChannelAnalyzer = new YouTubeChannelAnalyzer(apiKey)
```

#### fetchAllVideos
Fetches all videos from a specific YouTube channel. Returns a promise that resolves with an array of video details.
```typescript
const channelId = "CHANNEL_ID"
youTubeChannelAnalyzer.fetchAllVideos(channelId)
  .then(videos => console.log(videos))
  .catch(err => console.error(err))
```

#### fetchChannelDetail
Fetches details of a specific YouTube channel. Returns a promise that resolves with a ChannelDetail object.
```typescript
const channelId = "CHANNEL_ID"
youTubeChannelAnalyzer.fetchChannelDetail(channelId)
  .then(detail => console.log(detail))
  .catch(err => console.error(err))
```



