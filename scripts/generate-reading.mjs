import {mkdir, writeFile} from 'node:fs/promises';
import path from 'node:path';

const now = new Date();
const dateKey = new Intl.DateTimeFormat('en-CA', {
  timeZone: 'Asia/Tokyo',
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
}).format(now);

const displayDate = new Intl.DateTimeFormat('en-US', {
  timeZone: 'Asia/Tokyo',
  weekday: 'short',
  month: 'short',
  day: 'numeric',
  year: 'numeric',
}).format(now);

const timeParts = Object.fromEntries(
  new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Asia/Tokyo',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  })
    .formatToParts(now)
    .filter(({type}) => type !== 'literal')
    .map(({type, value}) => [type, value]),
);

const seed = [...dateKey].reduce((sum, char) => sum + char.charCodeAt(0), 0);
const pick = (items, offset = 0) => items[(seed + offset) % items.length];
const slugify = (value) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

const stories = [
  {
    title: 'The Umbrella I Almost Forgot',
    titleJa: '忘れかけた傘',
    opening: 'This morning, I looked out the window and saw dark clouds.',
    openingJa: '今朝、窓の外を見ると暗い雲が見えました。',
    problem: 'I was already late, so I almost left home without my umbrella.',
    problemJa: 'もう遅れていたので、傘を持たずに家を出そうになりました。',
    meeting: 'At the station, my neighbor pointed at the sky and smiled.',
    meetingJa: '駅で、近所の人が空を指さして笑いました。',
    question: 'Do you think it will rain soon?',
    questionJa: 'もうすぐ雨が降ると思いますか？',
    answer: 'Yes, I think so. I am glad I brought this umbrella.',
    answerJa: 'はい、そう思います。この傘を持ってきてよかったです。',
    turn: 'Then I remembered the small umbrella in my bag and felt relieved.',
    turnJa: 'そのとき、バッグの中の小さな傘を思い出してほっとしました。',
    ending: 'When the rain started, I was ready, and my morning felt a little lucky.',
    endingJa: '雨が降り始めたとき、私は準備ができていて、少し運のいい朝に感じました。',
  },
  {
    title: 'A Quiet Lunch With A Coworker',
    titleJa: '同僚との静かなランチ',
    opening: 'At noon, I wanted to eat lunch alone because I felt tired.',
    openingJa: '昼になって、疲れていたので一人で昼食を食べたいと思いました。',
    problem: 'But my coworker looked worried, so I asked if everything was okay.',
    problemJa: 'でも同僚が心配そうに見えたので、大丈夫かどうか聞きました。',
    meeting: 'We went to a small cafe near the office and sat by the window.',
    meetingJa: '私たちは会社の近くにある小さなカフェへ行き、窓際に座りました。',
    question: 'Do you want to talk about it?',
    questionJa: 'そのことについて話したい？',
    answer: 'Maybe a little. I just have too many things in my head.',
    answerJa: '少しだけ。頭の中に考えることが多すぎるんだ。',
    turn: 'I listened slowly, and we both felt calmer after a few minutes.',
    turnJa: '私はゆっくり話を聞き、数分後には二人とも少し落ち着きました。',
    ending: 'It was not a special lunch, but it made the afternoon easier.',
    endingJa: '特別なランチではなかったけれど、午後を少し楽にしてくれました。',
  },
  {
    title: 'The Message Before The Meeting',
    titleJa: '会議前のメッセージ',
    opening: 'Before an online meeting, I had to send one short message in English.',
    openingJa: 'オンライン会議の前に、英語で短いメッセージを一つ送る必要がありました。',
    problem: 'I understood the idea, but I was not sure how to say it naturally.',
    problemJa: '言いたいことは分かっていましたが、自然な言い方に自信がありませんでした。',
    meeting: 'I showed the message to my teammate and took a deep breath.',
    meetingJa: '私はそのメッセージをチームメイトに見せ、深呼吸しました。',
    question: 'Could you check this sentence for me?',
    questionJa: 'この文を確認してもらえますか？',
    answer: 'Of course. It is clear, but this phrase sounds a little softer.',
    answerJa: 'もちろん。意味は伝わるけど、この表現のほうが少し柔らかく聞こえます。',
    turn: 'I changed one line and sent the message before the meeting started.',
    turnJa: '私は一文を直して、会議が始まる前にメッセージを送りました。',
    ending: 'Small help at the right time gave me a little more confidence.',
    endingJa: 'ちょうどいいタイミングでの小さな助けが、少し自信をくれました。',
  },
  {
    title: 'Coffee For A Long Afternoon',
    titleJa: '長い午後のコーヒー',
    opening: 'After lunch, I walked into a cafe because the afternoon felt long.',
    openingJa: '昼食のあと、午後が長く感じたのでカフェに入りました。',
    problem: 'The menu had many choices, and the cashier was waiting kindly.',
    problemJa: 'メニューにはたくさんの選択肢があり、店員さんは親切に待ってくれていました。',
    meeting: 'I smiled, pointed to the menu, and tried to speak clearly.',
    meetingJa: '私は笑顔でメニューを指さし、はっきり話そうとしました。',
    question: 'What would you like today?',
    questionJa: '今日は何になさいますか？',
    answer: 'I would like an iced coffee, please. Could I have it with less ice?',
    answerJa: 'アイスコーヒーをお願いします。氷を少なめにしてもらえますか？',
    turn: 'The cashier nodded, and I realized the sentence was enough.',
    turnJa: '店員さんがうなずいてくれて、その文で十分だったのだと分かりました。',
    ending: 'I carried the coffee back to work and felt ready to continue.',
    endingJa: '私はコーヒーを持って職場に戻り、続きを頑張れそうな気持ちになりました。',
  },
  {
    title: 'A Short Call After Work',
    titleJa: '仕事帰りの短い電話',
    opening: 'In the evening, my friend called me while I was walking home.',
    openingJa: '夕方、家に歩いて帰っていると友人から電話がありました。',
    problem: 'I was tired, but I wanted to answer with a warm voice.',
    problemJa: '疲れていましたが、温かい声で出たいと思いました。',
    meeting: 'The street was quiet, and the lights were starting to turn on.',
    meetingJa: '通りは静かで、明かりがつき始めていました。',
    question: 'How has your week been so far?',
    questionJa: '今週はここまでどう？',
    answer: 'It has been pretty full, but I am learning a lot.',
    answerJa: 'かなり予定が多いけれど、たくさん学んでいるよ。',
    turn: 'We talked about small plans for the weekend and laughed once or twice.',
    turnJa: '私たちは週末の小さな予定について話し、一度か二度笑いました。',
    ending: 'After the call, the way home felt shorter than usual.',
    endingJa: '電話のあと、家までの道のりがいつもより短く感じました。',
  },
];

const reflections = [
  {
    en: 'I did not speak perfectly, but I kept the conversation moving.',
    ja: '完璧には話せませんでしたが、会話を止めずに続けることができました。',
  },
  {
    en: 'I used simple words, and that was enough for the moment.',
    ja: '簡単な言葉を使いましたが、その場ではそれで十分でした。',
  },
  {
    en: 'I noticed that a calm voice helped me think more clearly.',
    ja: '落ち着いた声で話すと、考えがはっきりしやすいと気づきました。',
  },
  {
    en: 'I felt nervous at first, but the other person understood me.',
    ja: '最初は緊張しましたが、相手は私の言いたいことを分かってくれました。',
  },
  {
    en: 'I learned that small conversations can become good practice.',
    ja: '小さな会話も、良い練習になるのだと分かりました。',
  },
];

const story = pick(stories);
const reflection = pick(reflections, 3);
const finalPracticeLine = 'For a moment, I was proud because I did not stay silent.';
const finalPracticeLineJa = 'その瞬間、黙ったままでいなかった自分を少し誇らしく感じました。';
const tomorrowLine = 'Tomorrow, I want to find one more small chance to speak English.';
const tomorrowLineJa = '明日も、英語を話す小さなチャンスをもう一つ見つけたいです。';
const closing = 'Read it again, and make the story sound natural.';
const closingJa = 'もう一度読んで、自然な物語に聞こえるようにしましょう。';

const reading = {
  dateLabel: displayDate,
  title: story.title,
  level: 'A2-B1',
  intro: 'Read this short story aloud before each line leaves the screen.',
  paragraphs: [
    story.opening,
    story.problem,
    story.meeting,
    `The other person asked, "${story.question}"`,
    `I answered, "${story.answer}"`,
    story.turn,
    reflection.en,
    finalPracticeLine,
    story.ending,
    tomorrowLine,
  ],
  closing,
};

const translationJa = [
  story.titleJa,
  '',
  story.openingJa,
  '',
  story.problemJa,
  '',
  story.meetingJa,
  '',
  `相手は「${story.questionJa}」と聞きました。`,
  '',
  `私は「${story.answerJa}」と答えました。`,
  '',
  story.turnJa,
  '',
  reflection.ja,
  '',
  finalPracticeLineJa,
  '',
  story.endingJa,
  '',
  tomorrowLineJa,
  '',
  closingJa,
  '',
].join('\n');

const postCaption = [
  `${story.titleJa}`,
  '',
  '今日の60秒音読。',
  `${story.openingJa}`,
  '',
  '画面から英文が消える前に、声に出して読んでみてください。',
  '短い文だけで、日常会話のスピード感を少しずつ作る練習です。',
  '',
  `Level: ${reading.level}`,
  'Read it before it disappears.',
  '',
  '#英語学習 #英語音読 #日常英会話 #やさしい英語 #1分英語 #英語リスニング #英語スピーキング #毎日英語',
  '',
].join('\n');

const runId = `${dateKey}-${timeParts.hour}${timeParts.minute}${timeParts.second}-${slugify(
  story.title,
)}`;
const runDir = path.join('out', runId);
const runReadingPath = path.join(runDir, 'reading.json');
const runCaptionPath = path.join(runDir, 'caption.txt');
const runTranslationJaPath = path.join(runDir, 'translation-ja.txt');
const runCaptionsPath = path.join(runDir, 'captions-ja.txt');
const runVideoPath = path.join(runDir, 'daily-english-reading.mp4');

const latestRun = {
  runId,
  runDir,
  readingPath: runReadingPath,
  captionPath: runCaptionPath,
  translationJaPath: runTranslationJaPath,
  captionsPath: runCaptionsPath,
  videoPath: runVideoPath,
};

await mkdir('data', {recursive: true});
await mkdir(runDir, {recursive: true});

await writeFile(path.join('data', 'today-reading.json'), `${JSON.stringify(reading, null, 2)}\n`);
await writeFile(path.join('data', 'today-caption.txt'), postCaption);
await writeFile(path.join('data', 'today-translation-ja.txt'), translationJa);
await writeFile(path.join('data', 'today-captions-ja.txt'), translationJa);
await writeFile(path.join('data', 'latest-run.json'), `${JSON.stringify(latestRun, null, 2)}\n`);
await writeFile(runReadingPath, `${JSON.stringify(reading, null, 2)}\n`);
await writeFile(runCaptionPath, postCaption);
await writeFile(runTranslationJaPath, translationJa);
await writeFile(runCaptionsPath, translationJa);

console.log(`Generated ${runDir}`);
