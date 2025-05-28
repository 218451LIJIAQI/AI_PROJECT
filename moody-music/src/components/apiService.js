// -------------------------------------------------------------
// apiService.js - Spotify API helper (100% full version)
// -------------------------------------------------------------
// ⚠️ 生产环境请务必改为后端代理，避免在前端暴露 client_secret。
// -------------------------------------------------------------

import axios from 'axios';

/* ************************************************************************* */
/*                           ♫  CONFIGURATION  ♫                           */
/* ************************************************************************* */

// 使用环境变量读取凭据；开发阶段请在 `.env` 文件中配置：
// REACT_APP_SPOTIFY_CLIENT_ID & REACT_APP_SPOTIFY_CLIENT_SECRET
const CLIENT_ID = process.env.REACT_APP_SPOTIFY_CLIENT_ID;
const CLIENT_SECRET = process.env.REACT_APP_SPOTIFY_CLIENT_SECRET;

// Spotify Token & 失效时间缓存
let accessToken = null;
let tokenExpiresAt = 0; // Epoch 毫秒

// 缓存搜索结果，减少 API 调用 (内存缓存即可)
const cache = new Map();

/* ************************************************************************* */
/*                      ♫  AUTHENTICATION & TOKEN  ♫                        */
/* ************************************************************************* */

const authenticateSpotify = async () => {
  // 若 token 依旧有效，直接返回
  if (accessToken && Date.now() < tokenExpiresAt - 60 * 1000) {
    return accessToken;
  }

  const basicAuth = btoa(`${CLIENT_ID}:${CLIENT_SECRET}`);

  try {
    const { data } = await axios.post(
      'https://accounts.spotify.com/api/token',
      new URLSearchParams({ grant_type: 'client_credentials' }),
      {
        headers: {
          Authorization: `Basic ${basicAuth}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );

    accessToken = data.access_token;
    tokenExpiresAt = Date.now() + data.expires_in * 1000; // expires_in 秒
    return accessToken;
  } catch (err) {
    console.error('🔥 Spotify auth failed', err);
    throw new Error('Spotify authentication failed');
  }
};

/* ************************************************************************* */
/*                            ♫  BLOCK LIST  ♫                              */
/* ************************************************************************* */

// 过滤不相关或敏感关键词
const BLOCKED_KEYWORDS = [
  'happy birthday',
  // ——— 以下保留原有关键词 ———
  'acoustic', 'afrobeat', 'alt-rock', 'alternative', 'ambient', 'anime',
  'black-metal', 'bluegrass', 'blues', 'bossanova', 'brazil', 'breakbeat',
  'british', 'cantopop', 'chicago-house', 'children', 'chill', 'classical',
  'club', 'comedy', 'country', 'dance', 'dancehall', 'death-metal',
  'deep-house', 'detroit-techno', 'disco', 'disney', 'drum-and-bass', 'dub',
  'dubstep', 'edm', 'electro', 'electronic', 'emo', 'folk', 'forro', 'french',
  'funk', 'garage', 'german', 'gospel', 'goth', 'grindcore', 'groove',
  'grunge', 'guitar', 'happy', 'hard-rock', 'hardcore', 'hardstyle',
  'heavy-metal', 'hip-hop', 'holidays', 'honky-tonk', 'house', 'idm',
  'indian', 'indie', 'indie-pop', 'industrial', 'iranian', 'j-dance',
  'j-idol', 'j-pop', 'j-rock', 'jazz', 'k-pop', 'kids', 'latin', 'latino',
  'malay', 'mandopop', 'metal', 'metal-misc', 'metalcore', 'minimal-techno',
  'movies', 'mpb', 'new-age', 'new-release', 'opera', 'pagode', 'party',
  'philippines-opm', 'piano', 'pop', 'pop-film', 'post-dubstep', 'power-pop',
  'progressive-house', 'psych-rock', 'punk', 'punk-rock', 'r-n-b', 'rainy-day',
  'reggae', 'reggaeton', 'road-trip', 'rock', 'rock-n-roll', 'rockabilly',
  'romance', 'sad', 'salsa', 'samba', 'sertanejo', 'show-tunes',
  'singer-songwriter', 'ska', 'sleep', 'songwriter', 'soul', 'soundtracks',
  'spanish', 'study', 'summer', 'swedish', 'synth-pop', 'tango', 'techno',
  'trance', 'trip-hop', 'turkish', 'work-out', 'world-music',
];

/* ************************************************************************* */
/*                        ♫  MAIN FETCH FUNCTION  ♫                         */
/* ************************************************************************* */

export const fetchSongsByMood = async (
  mood,
  market = 'US',
  playlistLimit = 5,
  trackLimit = 10
) => {
  const key = `${mood}_${market}`;
  if (cache.has(key)) {
    return cache.get(key);
  }

  await authenticateSpotify();
  const headers = { Authorization: `Bearer ${accessToken}` };

  try {
    // 1️⃣ 搜索播放列表
    const { data: searchData } = await axios.get(
      'https://api.spotify.com/v1/search',
      {
        headers,
        params: { q: mood, type: 'playlist', limit: playlistLimit, market },
      }
    );

    // 防御式拿到 items 数组，避免 null/undefined
    const playlists = Array.isArray(searchData.playlists?.items)
      ? searchData.playlists.items
      : [];

    const tracks = [];

    // 2️⃣ 并行拉取每个 playlist 的曲目
    await Promise.all(
      playlists.map(async (pl) => {
        if (!pl?.id) return; // 跳过无效 playlist

        try {
          const { data: trackData } = await axios.get(
            `https://api.spotify.com/v1/playlists/${pl.id}/tracks`,
            { headers, params: { limit: trackLimit, market } }
          );

          // 防御式遍历曲目列表
          (trackData.items || []).forEach((item) => {
            const t = item.track;
            if (!t?.id) return;

            const name = t.name.toLowerCase();
            if (BLOCKED_KEYWORDS.some((kw) => name.includes(kw))) return;

            tracks.push({
              id: t.id,
              title: t.name,
              artist: t.artists.map((a) => a.name).join(', '),
              url: t.external_urls.spotify,
              preview_url: t.preview_url,
              albumImageUrl: t.album.images[0]?.url || '',
            });
          });
        } catch (innerErr) {
          console.warn(`跳过 playlist ${pl.id}：拉歌失败`, innerErr);
        }
      })
    );

    // 3️⃣ 去重并缓存
    const uniqueTracks = Array.from(
      new Map(tracks.map((t) => [t.id, t])).values()
    );
    cache.set(key, uniqueTracks);
    return uniqueTracks;
  } catch (err) {
    console.error('🔥 Error fetching songs', err);
    return [];
  }
};
