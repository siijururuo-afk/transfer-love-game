# Native app revision

Visual references inspected for this revision:
- Melon iPhone screenshots, developer listing: https://apps.apple.com/kr/app/%EB%A9%9C%EB%A1%A0-melon/id415597317
  - Music drawer: compact category shortcuts, cover art, song rows, mini player, green selection, dark appearance.
- Apple Messages guide: https://support.apple.com/guide/iphone/send-and-reply-to-messages-iph82fb73ba3/27/ios/27
  - Conversation list, contact header, incoming gray bubbles, conversation grouping, bottom composer.
- KakaoTalk developer listing: https://apps.apple.com/kr/app/%EC%B9%B4%EC%B9%B4%EC%98%A4%ED%86%A1-kakaotalk/id362057947
- TVING developer listing: https://apps.apple.com/kr/app/tving/id400101401
  - Reading view deliberately follows the user's explicit white-background, black-text request rather than the video app's presentation.

Music uses a single native HTML audio element. SUN OR SUCK retains the existing repository audio. Other songs use their official Apple catalog preview URLs, labeled as previews; no embedded video or extracted full audio. Metadata and cover art were matched by song AND artist through Apple's public catalog.

YouTube stage sources inspected:
- Viu Philippines full performance: https://www.youtube.com/watch?v=grSI7CZL7cQ
- Mnet K-POP, Cho Seungyoun fancam: https://www.youtube.com/watch?v=n5jARp26V1w
- Mnet K-POP, Kim Wooseok fancam: https://www.youtube.com/watch?v=LhfCFnZlJBs

A stage video is a standalone library item. It does not replace fictional programme clips or change story order. Existing novel translations and photograph sequence are preserved.

Progress fix: all three received SMS advance on open. Other records advance at the visible end with a 40px tolerance, including short and fractional-height pages. No timed delay or exact-pixel sentinel is required. Notifications stay until opened or dismissed; current pending content remains in the notification center. The existing save key and chapter-one completion migration remain intact.

Validation: npm run check:chapter; npm run check:interactions; npm run build. Browser QA covers all 3 received SMS, short and long records, small-screen layout, native preview audio playback and stage player rendering.
