'use strict'

/*
* クエリ取得
*/
export const getQuery = (): { year: string | null; month: string | null } => {
  const params = new URLSearchParams(window.location.search);
  const year = params.get("year");
  const month = params.get("month");
  return { year, month };
};

/*
* 運動内容タグ生成
*/
export const makeWorkTags = (text: string): string => {
  if (!text) return '';

  const categories: Record<string, string> = {
    'ランニング': 'aerobic',
    'ジョギング': 'aerobic',
    '縄跳び': 'aerobic',
    'ウォーキング': 'aerobic',
    '筋トレ': 'muscle',
    '腹筋': 'muscle',
    '腕立て': 'muscle',
    'スクワット': 'muscle',
    'ダンベル': 'muscle',
    'ベンチプレス': 'muscle',
    'デッドリフト': 'muscle',
    'ラットプル': 'muscle',
    'シャドウ': 'boxing',
    'サンドバッグ': 'boxing',
    'ミット': 'boxing',
    'ストレッチ': 'stretch'
  };

  const lines = text.split(/[\n,、]+/).map(line => line.trim()).filter(line => line !== '');
  return lines.map(line => {
    let matchedClass = 'other';
    for (const [keyword, value] of Object.entries(categories)) {
      if (line.includes(keyword)) matchedClass = value;
    }
    return `<span class="inline-block m-[2px_6px_2px_0] px-[8px] py-[3px] rounded-[14px] text-[12px] text-white font-medium leading-[1.2] whitespace-nowrap work-tag -${matchedClass}">${line}</span>`;
  }).join('');
};
