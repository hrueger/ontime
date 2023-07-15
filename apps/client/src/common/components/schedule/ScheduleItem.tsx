import { useSearchParams } from 'react-router-dom';
import { OntimeEvent } from 'ontime-types';

import { formatTime } from '../../utils/time';

import './Schedule.scss';

interface ScheduleItemProps {
  selected: 'past' | 'now' | 'future';
  event: OntimeEvent;
}

export default function ScheduleItem(props: ScheduleItemProps) {
  const { selected, event } = props;
  const [searchParams] = useSearchParams();

  const start = formatTime(event.timeStart, { format: 'hh:mm' });
  const end = formatTime(event.timeEnd, { format: 'hh:mm' });
  const userColour = event.colour !== '' ? event.colour : '';
  const selectStyle = `entry--${selected}`;

  return (
    <li className={`entry ${selectStyle} ${event.skip ? 'skip' : ''}`}>
      <div className='entry-title'>
        <span className='entry-colour' style={{ backgroundColor: userColour }} />
        {event.presenter && ` ${event.presenter} -`} {event.title}
        <small className='color-fg-muted asterisk'>{event.department}</small>
      </div>
      <div className='entry-times'>
        {event.subtitle} | {`${start} → ${end}`}
        <small>
          {searchParams.get('showField') && event?.[searchParams.get('showField')! as keyof OntimeEvent]
            ? ` - ${event?.[searchParams.get('showField')! as keyof OntimeEvent]}`
            : ''}
        </small>
      </div>
    </li>
  );
}
