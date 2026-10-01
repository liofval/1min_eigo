import {Composition} from 'remotion';
import {DailyEnglishReading, dailyEnglishReadingSchema} from './DailyEnglishReading';
import {defaultReading} from './defaultReading';

export const Root: React.FC = () => {
  return (
    <Composition
      id="DailyEnglishReading"
      component={DailyEnglishReading}
      width={1080}
      height={1920}
      fps={30}
      durationInFrames={30 * 70}
      schema={dailyEnglishReadingSchema}
      defaultProps={defaultReading}
    />
  );
};
