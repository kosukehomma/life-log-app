'use strict'

/*
* クエリ取得
*/
window.getQuery = () => {
  const params = new URLSearchParams(window.location.search);
  return {
    year: params.get('year'),
    month: params.get('month')?.padStart(2, '0'),
  };
};

/*
* 運動内容タグ生成
*/
window.makeWorkTags = (text) => {
  if (!text) return '';

  const categories = {
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
    Object.keys(categories).forEach(keyword => {
      if (line.includes(keyword)) matchedClass = categories[keyword];
    });
    return `<span class="inline-block m-[2px_6px_2px_0] px-[8px] py-[3px] rounded-[14px] text-[12px] text-white font-medium leading-[1.2] whitespace-nowrap work-tag -${matchedClass}">${line.trim()}</span>`;
  }).join('');
};
