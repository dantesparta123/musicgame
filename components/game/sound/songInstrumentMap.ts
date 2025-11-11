export type SongInstrumentOverrides = Record<number, string>;

export type SongInstrumentMap = Record<string, SongInstrumentOverrides>;

/**
 * 手动配置：每首歌曲的特定 MIDI 通道使用的默认乐器。
 * key 采用去掉扩展名的小写文件名，例如：
 *   /sfx/background-music/Sweet-Child-O-Mine4.mid -> sweet-child-o-mine4
 */
export const songInstrumentMap: SongInstrumentMap = {
  'sweet-child-o-mine4': {
    0: 'ukulele',
    1: 'ukulele',
    2: 'bass',
    3: 'piano',
    9: 'drums',
  },
  'love-story': {
    0: 'piano',
    1: 'ukulele',
  },
  'my-heart-will-go-on': {
    0: 'piano',
    1: 'ukulele',
    2: 'bass',
  },
  'he-is-a-pirate': {
    0: 'piano',
    1: 'guitar',
    2: 'bass',
    9: 'drums',
  },
  'mz-311': {
    0: 'piano',
  },
  'the-thrill-is-gone': {
    0: 'guitar',
    1: 'bass',
    9: 'drums',
  },
};

export function getSongInstrumentOverrides(songKey: string): SongInstrumentOverrides | undefined {
  return songInstrumentMap[songKey];
}

