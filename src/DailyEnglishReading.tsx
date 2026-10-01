import React from 'react';
import {
  AbsoluteFill,
  interpolate,
  interpolateColors,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import {z} from 'zod';

export const dailyEnglishReadingSchema = z.object({
  dateLabel: z.string(),
  title: z.string(),
  level: z.string(),
  intro: z.string(),
  paragraphs: z.array(z.string()).min(4),
  closing: z.string(),
});

export type DailyReadingProps = z.infer<typeof dailyEnglishReadingSchema>;

const skyMotifs = [
  {left: 168, top: 378, scale: 0.9, delay: 0},
  {left: 328, top: 468, scale: 0.7, delay: 16},
  {left: 710, top: 360, scale: 0.8, delay: 28},
  {left: 858, top: 548, scale: 0.62, delay: 42},
  {left: 132, top: 690, scale: 0.58, delay: 54},
  {left: 640, top: 760, scale: 0.7, delay: 68},
];

export const DailyEnglishReading: React.FC<DailyReadingProps> = ({
  dateLabel,
  title,
  level,
  intro,
  paragraphs,
  closing,
}) => {
  const frame = useCurrentFrame();
  const {durationInFrames, fps} = useVideoConfig();
  const firstLineY = 940;
  const paragraphHeight = 330;
  const closingHeight = 430;
  const contentHeight = paragraphs.length * paragraphHeight + closingHeight;
  const scrollDurationSeconds = durationInFrames / fps;
  const targetEndY = -contentHeight + 460;
  const scrollPixelsPerSecond =
    (firstLineY - targetEndY) / Math.max(1, scrollDurationSeconds - 5);
  const scrollStartY = firstLineY + scrollPixelsPerSecond * 5;

  const entrance = spring({
    frame,
    fps,
    config: {
      damping: 22,
      stiffness: 80,
    },
  });

  const scrollY = scrollStartY - (frame / fps) * scrollPixelsPerSecond;

  const pulse = interpolate(frame % 90, [0, 45, 90], [0.88, 1, 0.88]);
  const floatY = interpolate(frame % 180, [0, 90, 180], [0, -18, 0]);
  const slowFloatY = interpolate(frame % 240, [0, 120, 240], [0, 20, 0]);
  const nightProgress = interpolate(
    frame,
    [durationInFrames * 0.5, durationInFrames],
    [0, 1],
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    },
  );
  const inkColor = '#0077d0';
  const ruleColor = interpolateColors(nightProgress, [0, 1], ['#0077d0', '#bfeaff']);
  const readingColor = '#0077d0';
  const nightTextShadow = `0 5px 18px rgba(3,25,82,${interpolate(
    nightProgress,
    [0, 1],
    [0, 0.52],
  )}), 0 1px 2px rgba(3,25,82,${interpolate(nightProgress, [0, 1], [0, 0.68])})`;
  const sunriseOpacity = interpolate(frame, [0, durationInFrames * 0.5], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const skyOrbColor = interpolateColors(nightProgress, [0, 1], ['#ffd35a', '#fff7bd']);
  const skyOrbGlow = interpolateColors(
    nightProgress,
    [0, 1],
    ['rgba(255,154,55,0.36)', 'rgba(255,247,189,0.72)'],
  );
  const moonShadowColor = interpolateColors(
    nightProgress,
    [0, 1],
    ['rgba(255,239,183,0)', 'rgba(232,239,232,0.98)'],
  );
  const birdOpacity = interpolate(frame, [0, durationInFrames * 0.3], [0.92, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const skyStarOpacity = interpolate(
    frame,
    [durationInFrames * 0.46, durationInFrames * 0.62],
    [0, 0.94],
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    },
  );

  return (
    <AbsoluteFill style={styles.screen}>
      <div style={{...styles.sunriseGlow, opacity: sunriseOpacity}} />
      <div style={{...styles.nightSky, opacity: nightProgress}} />
      {skyMotifs.map((motif, index) => {
        const motifFloat = interpolate(
          (frame + motif.delay) % 180,
          [0, 90, 180],
          [0, -10, 0],
        );

        return (
          <div
            key={`${motif.left}-${motif.top}`}
            style={{
              ...styles.skyMotif,
              left: motif.left,
              top: motif.top,
              transform: `translateY(${motifFloat}px) scale(${motif.scale})`,
            }}
          >
            <div style={{...styles.birdMotif, opacity: birdOpacity}}>
              <span style={{...styles.birdWing, ...styles.birdWingLeft}} />
              <span style={{...styles.birdWing, ...styles.birdWingRight}} />
            </div>
            <div style={{...styles.skyStarMotif, opacity: skyStarOpacity}}>
              {index % 2 === 0 ? '✦' : '✧'}
            </div>
          </div>
        );
      })}
      <div
        style={{
          ...styles.skyOrb,
          background: skyOrbColor,
          boxShadow: `0 0 42px ${skyOrbGlow}, 0 0 118px ${skyOrbGlow}`,
          transform: `translateY(${-floatY}px)`,
        }}
      >
        <span
          style={{
            ...styles.moonShadow,
            opacity: nightProgress,
            background: moonShadowColor,
          }}
        />
      </div>
      <div style={{...styles.nightStar, ...styles.nightStarOne, opacity: nightProgress}}>✦</div>
      <div style={{...styles.nightStar, ...styles.nightStarTwo, opacity: nightProgress}}>✧</div>
      <div style={{...styles.nightStar, ...styles.nightStarThree, opacity: nightProgress}}>✦</div>
      <div style={{...styles.seaGlow, opacity: nightProgress}} />
      <div style={{...styles.bubbleCluster, transform: `translateY(${floatY}px)`}}>
        <span style={{...styles.bubble, ...styles.bubbleOne}} />
        <span style={{...styles.bubble, ...styles.bubbleTwo}} />
        <span style={{...styles.bubble, ...styles.bubbleThree}} />
        <span style={{...styles.bubble, ...styles.bubbleFour}} />
      </div>
      <div style={{...styles.popcornCluster, transform: `translateY(${slowFloatY}px)`}}>
        <span style={{...styles.kernel, ...styles.kernelOne}} />
        <span style={{...styles.kernel, ...styles.kernelTwo}} />
        <span style={{...styles.kernel, ...styles.kernelThree}} />
        <span style={{...styles.kernel, ...styles.kernelFour}} />
      </div>
      <div style={styles.starTrail} />
      <div style={styles.star}>★</div>
      <div style={styles.header}>
        <div />
        <div style={styles.headerMeta}>
          <div style={styles.date}>{dateLabel}</div>
          <div style={styles.level}>{level}</div>
        </div>
      </div>

      <div
        style={{
          ...styles.titleBlock,
          opacity: entrance,
          transform: `translateY(${interpolate(entrance, [0, 1], [36, 0])}px)`,
        }}
      >
        <h1 style={styles.title}>{title}</h1>
        <p style={styles.intro}>{intro}</p>
      </div>

      <div style={{...styles.readingWindow, borderTopColor: ruleColor, borderBottomColor: ruleColor}}>
        <div
          style={{
            ...styles.scroller,
            transform: `translateY(${scrollY}px)`,
          }}
        >
          {paragraphs.map((paragraph, index) => (
            <section key={paragraph} style={styles.paragraphBlock}>
              <div style={{...styles.number, color: readingColor, textShadow: nightTextShadow}}>
                {String(index + 1).padStart(2, '0')}
              </div>
              <p
                style={{
                  ...styles.paragraph,
                  color: readingColor,
                  textShadow: nightTextShadow,
                }}
              >
                {paragraph}
              </p>
            </section>
          ))}
          <section style={styles.closingBlock}>
            <p
              style={{
                ...styles.closing,
                color: readingColor,
                textShadow: nightTextShadow,
              }}
            >
              {closing}
            </p>
          </section>
        </div>
      </div>

      <div style={{...styles.footer, color: inkColor}}>
        <span style={{...styles.dot, opacity: pulse}} />
        <span>Read it before it disappears</span>
      </div>
    </AbsoluteFill>
  );
};

const styles: Record<string, React.CSSProperties> = {
  screen: {
    background: '#ffffff',
    color: '#0077d0',
    fontFamily:
      '"Zen Kaku Gothic New", "Noto Sans JP", "Gothic A1", Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    overflow: 'hidden',
  },
  sunriseGlow: {
    position: 'absolute',
    inset: 0,
    background:
      'radial-gradient(circle at 82% 12%, rgba(255,199,62,0.42) 0%, rgba(255,176,62,0.2) 20%, rgba(255,216,133,0.1) 40%, rgba(255,255,255,0) 70%)',
  },
  nightSky: {
    position: 'absolute',
    inset: 0,
    background:
      'linear-gradient(180deg, rgba(255,255,255,0) 0%, rgba(104,197,245,0.36) 35%, rgba(28,73,168,0.78) 76%, rgba(8,25,88,0.92) 100%)',
  },
  skyOrb: {
    position: 'absolute',
    top: 150,
    right: 150,
    width: 128,
    height: 128,
    borderRadius: 999,
    overflow: 'hidden',
  },
  skyMotif: {
    position: 'absolute',
    width: 92,
    height: 60,
    pointerEvents: 'none',
  },
  birdMotif: {
    position: 'absolute',
    inset: 0,
  },
  birdWing: {
    position: 'absolute',
    top: 22,
    width: 34,
    height: 18,
    borderTop: '5px solid rgba(0,119,208,0.42)',
    borderRadius: '50% 50% 0 0',
  },
  birdWingLeft: {
    left: 12,
    transform: 'rotate(18deg)',
    transformOrigin: 'right center',
  },
  birdWingRight: {
    left: 42,
    transform: 'rotate(-18deg)',
    transformOrigin: 'left center',
  },
  skyStarMotif: {
    position: 'absolute',
    left: 20,
    top: 0,
    width: 52,
    height: 52,
    color: '#fff7bd',
    fontSize: 42,
    lineHeight: '52px',
    textAlign: 'center',
    fontWeight: 900,
    textShadow: '0 0 20px rgba(255,247,189,0.72)',
  },
  moonShadow: {
    position: 'absolute',
    top: -10,
    right: -33,
    width: 128,
    height: 148,
    borderRadius: 999,
  },
  nightStar: {
    position: 'absolute',
    color: '#fff7bd',
    fontWeight: 900,
    textShadow: '0 0 22px rgba(255,247,189,0.62)',
  },
  nightStarOne: {
    top: 318,
    left: 170,
    fontSize: 38,
  },
  nightStarTwo: {
    top: 660,
    right: 120,
    fontSize: 34,
  },
  nightStarThree: {
    top: 1030,
    left: 104,
    fontSize: 30,
  },
  seaGlow: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 420,
    background:
      'radial-gradient(circle at 50% 100%, rgba(116,216,255,0.34) 0%, rgba(116,216,255,0.18) 34%, rgba(116,216,255,0) 72%)',
  },
  bubbleCluster: {
    position: 'absolute',
    top: 76,
    left: 104,
    width: 140,
    height: 110,
  },
  bubble: {
    position: 'absolute',
    border: '5px solid #0077d0',
    borderRadius: 999,
    background: '#ffffff',
  },
  bubbleOne: {
    width: 46,
    height: 46,
    left: 42,
    top: 0,
  },
  bubbleTwo: {
    width: 38,
    height: 38,
    left: 16,
    top: 38,
  },
  bubbleThree: {
    width: 36,
    height: 36,
    left: 76,
    top: 40,
  },
  bubbleFour: {
    width: 28,
    height: 28,
    left: 52,
    top: 72,
  },
  popcornCluster: {
    position: 'absolute',
    right: -76,
    bottom: -36,
    width: 380,
    height: 280,
    filter: 'drop-shadow(0 24px 42px rgba(247,174,0,0.22))',
  },
  kernel: {
    position: 'absolute',
    borderRadius: '48% 52% 55% 45%',
    background: '#ffbf00',
  },
  kernelOne: {
    width: 140,
    height: 112,
    left: 22,
    bottom: 22,
    transform: 'rotate(-18deg)',
  },
  kernelTwo: {
    width: 120,
    height: 150,
    left: 112,
    bottom: 68,
    transform: 'rotate(12deg)',
  },
  kernelThree: {
    width: 128,
    height: 112,
    left: 196,
    bottom: 20,
    transform: 'rotate(24deg)',
  },
  kernelFour: {
    width: 88,
    height: 104,
    left: 128,
    bottom: 30,
    background: '#ff7f2a',
    transform: 'rotate(-8deg)',
  },
  starTrail: {
    position: 'absolute',
    left: -42,
    bottom: 248,
    width: 320,
    height: 12,
    background: '#ffe37c',
    transform: 'rotate(24deg)',
    transformOrigin: 'left center',
  },
  star: {
    position: 'absolute',
    left: 150,
    bottom: 180,
    color: '#ffc526',
    fontSize: 96,
    lineHeight: 1,
    filter: 'drop-shadow(0 18px 40px rgba(255,197,38,0.38))',
  },
  header: {
    position: 'absolute',
    top: 88,
    left: 112,
    right: 112,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    fontSize: 28,
    fontWeight: 700,
    letterSpacing: 0,
  },
  headerMeta: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
    gap: 10,
  },
  date: {
    color: '#0077d0',
    fontSize: 28,
    fontWeight: 800,
  },
  level: {
    border: '3px solid #0077d0',
    borderRadius: 999,
    padding: '9px 18px 10px',
    color: '#0077d0',
    background: '#ffffff',
    fontSize: 26,
    fontWeight: 900,
  },
  titleBlock: {
    position: 'absolute',
    top: 250,
    left: 112,
    right: 112,
  },
  title: {
    margin: 0,
    fontSize: 70,
    lineHeight: 1.16,
    fontWeight: 900,
    letterSpacing: '0.05em',
    maxWidth: 820,
    color: '#0077d0',
  },
  intro: {
    margin: '28px 0 0',
    fontSize: 28,
    lineHeight: 1.8,
    color: '#0077d0',
    fontWeight: 800,
    letterSpacing: '0.08em',
    maxWidth: 760,
  },
  readingWindow: {
    position: 'absolute',
    inset: '610px 112px 240px',
    overflow: 'hidden',
    borderTop: '4px solid #0077d0',
    borderBottom: '4px solid #0077d0',
  },
  scroller: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
  },
  paragraphBlock: {
    minHeight: 330,
    display: 'grid',
    gridTemplateColumns: '76px 1fr',
    columnGap: 20,
    alignItems: 'start',
    padding: '34px 26px',
  },
  number: {
    fontSize: 28,
    lineHeight: 1,
    color: '#0077d0',
    fontWeight: 900,
    paddingTop: 20,
    letterSpacing: '0.08em',
  },
  paragraph: {
    margin: 0,
    fontSize: 48,
    lineHeight: 1.55,
    fontWeight: 900,
    letterSpacing: '0.04em',
    textShadow: 'none',
  },
  closingBlock: {
    minHeight: 430,
    display: 'flex',
    alignItems: 'center',
    padding: '0 52px 0 102px',
  },
  closing: {
    margin: 0,
    fontSize: 56,
    lineHeight: 1.42,
    color: '#0077d0',
    fontWeight: 900,
    letterSpacing: '0.05em',
  },
  footer: {
    position: 'absolute',
    left: 112,
    right: 112,
    bottom: 112,
    display: 'flex',
    alignItems: 'center',
    gap: 18,
    color: '#0077d0',
    fontSize: 28,
    fontWeight: 900,
    letterSpacing: '0.08em',
  },
  dot: {
    width: 18,
    height: 18,
    borderRadius: 9,
    background: '#ffc526',
    boxShadow: '0 0 28px rgba(255,197,38,0.9)',
  },
};
