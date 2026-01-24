import md5 from 'md5';

/**
 * メールアドレスからGravatar URLを生成
 * @param email メールアドレス
 * @param size 画像サイズ（デフォルト: 80）
 * @param defaultImage デフォルト画像タイプ（'mp', 'identicon', 'monsterid', 'wavatar', 'retro', 'robohash', 'blank'）
 * @returns Gravatar URL
 */
export function getGravatarUrl(
  email?: string | null,
  size: number = 80,
  defaultImage: string = 'mp'
): string {
  if (!email) {
    return `https://www.gravatar.com/avatar/?d=${defaultImage}&s=${size}`;
  }
  
  const hash = md5(email.toLowerCase().trim());
  return `https://www.gravatar.com/avatar/${hash}?d=${defaultImage}&s=${size}`;
}

/**
 * アバターURLを取得（avatar_urlがあればそれを使用、なければGravatar）
 * @param avatarUrl 設定されているアバターURL
 * @param email メールアドレス
 * @param size 画像サイズ
 * @returns アバターURL
 */
export function getAvatarUrl(
  avatarUrl?: string | null,
  email?: string | null,
  size: number = 80
): string {
  if (avatarUrl) {
    return avatarUrl;
  }
  return getGravatarUrl(email, size);
}

