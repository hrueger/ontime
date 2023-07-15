import { OntimeEvent } from 'ontime-types';

import { formatTime } from '../../common/utils/time';

import style from './Timeline.module.scss';

interface TrackProps {
  items: { event: OntimeEvent; start: string; length: string }[];
}

export default function Track(props: TrackProps) {
  const { items } = props;
  return (
    <div className={style.track}>
      <div className={style.trackBody}>
        {items.map((entry) => (
          <div
            className={style.eventContainer}
            key={entry.event.id}
            style={{
              left: entry.start,
              width: entry.length,
            }}
          >
            <div className={style.event} style={{ backgroundColor: entry.event.colour }}>
              {entry.event.cue} | {entry.event.title}
              <br />
              {formatTime(entry.event.timeStart)} - {formatTime(entry.event.timeEnd)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
