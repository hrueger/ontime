import { formatTime } from '../../common/utils/time';

import style from './Timeline.module.scss';

interface TrackHeaderProps {
  length: number;
  start: number;
  end: number;
}

export default function TrackHeader(props: TrackHeaderProps) {
  const { end, length, start } = props;
  return (
    <div className='track trackHeader'>
      <div className={style.trackBody}>
        <span className={style.trackHeaderItem} style={{ left: 0 }}>
          {formatTime(start)}
          <br />|
        </span>
        <span className={style.trackHeaderItem} style={{ left: '100%' }}>
          {formatTime(start)}
          <br />|
        </span>
      </div>
    </div>
  );
}
