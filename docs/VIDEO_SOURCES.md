# Video sources

This is a historical replay game. View totals are fixed snapshots, not live metrics, forecasts, probabilities, or evidence that a creator's work is a failure. "Flop" means the lower-viewed clip in a comparison.

Captured on **30 September 2026, approximately 13:14–13:17 UTC** directly from each public YouTube watch page. The counts below came from `ytInitialPlayerResponse.videoDetails.viewCount`; titles and creator names came from the same object's `title` and `author` fields. Each returned `playabilityStatus.playableInEmbed: true` at capture time. This confirms embed permission in metadata, not playback in every browser or region. UI playback still needs an actual browser check.

Videos remain on YouTube and are played using the official embedded player. No video files were downloaded or rehosted. Link to each creator's original upload from the results. No crowd percentages or player counts are provided by this dataset.

Poster thumbnails are cached locally at `public/thumbnails/<youtubeId>.jpg` from YouTube's official `https://i.ytimg.com/vi/<youtubeId>/hqdefault.jpg` endpoints so previews remain visible when the browser cannot reach the image CDN. All 14 are 480×360 JPEGs and retain the attribution and original upload links listed below. These posters are still images, not locally hosted video playback.

| Video | Creator | View snapshot | Duration | Original source |
|---|---|---:|---:|---|
| Surprised Kitty (Original) | rozzzafly | 79,830,077 | 17s | [YouTube](https://www.youtube.com/watch?v=0Bmhjf0rKe8) |
| Cat with hiccups | Tango The Cat | 22,515 | 25s | [YouTube](https://www.youtube.com/watch?v=hC0PA9q_XDQ) |
| Ultimate Dog Tease | Talking Animals | 213,398,672 | 81s | [YouTube](https://www.youtube.com/watch?v=nGeKSiCQkPw) |
| Keyboard Cat REINCARNATED! | Keyboard Cat! | 14,888,180 | 34s | [YouTube](https://www.youtube.com/watch?v=xSE9Qk9wkig) |
| Sneezing Baby Panda \| Original Video | Wild Candy | 8,926,101 | 18s | [YouTube](https://www.youtube.com/watch?v=93hq0YU3Gqk) |
| Kitten hiccup | DHP Creative Agency | 24,298 | 25s | [YouTube](https://www.youtube.com/watch?v=KeTRuN-qjr8) |
| 1,000,000 Dominoes Falling is Oddly SATISFYING | Hevesh5 | 43,848,178 | 602s | [YouTube](https://www.youtube.com/watch?v=DQQN_79QrDY) |
| Don't Miss the Easiest Bottle Flip EVER | Colin Amazing | 31,293,885 | 1282s | [YouTube](https://www.youtube.com/watch?v=DD1I2EH0VLA) |
| Many too small boxes and Maru | I am Maru. | 16,893,922 | 177s | [YouTube](https://www.youtube.com/watch?v=2XID_W4neJo) |
| 24,000 Dominoes! (SATISFYING) with MarDominoes | Hevesh5 | 8,433,491 | 196s | [YouTube](https://www.youtube.com/watch?v=QO3do77Y9cY) |
| Yosemitebear Mountain Double Rainbow 1-8-10 | Yosemitebear62 | 52,740,774 | 209s | [YouTube](https://www.youtube.com/watch?v=OQSNhk5ICTI) |
| Keyboard Cat! - THE ORIGINAL! | Keyboard Cat! | 95,548,308 | 55s | [YouTube](https://www.youtube.com/watch?v=J---aiyznGQ) |
| Baby Laughing Hysterically at Ripping Paper (Original) | BruBearBaby | 129,303,551 | 104s | [YouTube](https://www.youtube.com/watch?v=RP4abiHdQpc) |
| The two talking cats | TheCatsPyjaaaamas | 115,036,213 | 56s | [YouTube](https://www.youtube.com/watch?v=z3U0udLH974) |

Maru's original title is `いろいろな小さ過ぎる箱とねこ。-Many too small boxes and Maru.-`; the UI uses its English portion. All clips start at zero. The dataset is arranged as seven adjacent candidate pairs: large differences first, closer comparisons later. The game may shuffle sides or draw different combinations.

## Playback integration

Use `https://www.youtube.com/embed/VIDEO_ID` or the official privacy-enhanced `https://www.youtube-nocookie.com/embed/VIDEO_ID` endpoint. Keep a working "Watch on YouTube" link available if a user's browser, consent settings, or network prevents embedding. Do not claim a video played if only its thumbnail loaded. Do not suppress the referrer with `no-referrer`; YouTube may require client identification. Hide view counts until a pick locks, but preserve the player's own controls and required attribution.

## Data limitations

YouTube counts change after capture. The small clips have tens of thousands of views and the largest has over 213 million; this spread supports surprising comparisons without inventing numbers. Several clips are recognizable internet classics. Watching excerpts of longer videos is a game convenience, and the count always refers to the complete linked upload.
