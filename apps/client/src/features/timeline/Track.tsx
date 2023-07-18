import { Tooltip } from '@chakra-ui/react';
import { OntimeEvent, Playback } from 'ontime-types';

import { formatTime } from '../../common/utils/time';
import EventBlockProgressBar from '../../features/rundown/event-block/composite/EventBlockProgressBar';

import style from './Timeline.module.scss';

interface TrackProps {
  items: { event: OntimeEvent; start: string; length: string }[];
  runningCue?: string;
}

export default function Track(props: TrackProps) {
  const { items, runningCue } = props;
  return (
    <div className={style.track}>
      <div className={style.trackBody}>
        {items.map((entry) => {
          const presenter = entry.event.presenter ? `(${entry.event.presenter})` : '';
          const isRunning = runningCue === entry.event.cue;
          return (
            <div
              className={style.eventContainer}
              key={entry.event.id}
              style={{
                left: entry.start,
                width: entry.length,
              }}
            >
              <Tooltip label={`${entry.event.title} ${presenter}`} aria-label={`${entry.event.title} ${presenter}`}>
                <div
                  className={isRunning ? style['event-running'] : style.event}
                  style={{ backgroundColor: entry.event.colour }}
                >
                  {entry.event.cue} <b>{entry.event.title}</b> {presenter}
                  <br />
                  <u>
                    {formatTime(entry.event.timeStart)} - {formatTime(entry.event.timeEnd)}
                  </u>
                  <br />
                  {(entry.event.note && entry.event.subtitle && entry.event.note !== entry.event.subtitle && (
                    <>
                      {entry.event.subtitle} <br />
                      {entry.event.note} <br />
                    </>
                  )) ||
                    ((entry.event.note || entry.event.subtitle) && (
                      <>
                        {entry.event.note || entry.event.subtitle} <br />
                      </>
                    ))}
                  <br />
                  {isRunning && (
                    <div className={style['progressbar']}>
                      <EventBlockProgressBar playback={Playback.Play} />
                    </div>
                  )}
                </div>
              </Tooltip>
            </div>
          );
        })}
      </div>
    </div>
  );
}
