import { useSearchParams } from 'react-router-dom';
import { OntimeEvent } from 'ontime-types';

import { useTranslation } from '../../../translation/TranslationProvider';

import './TitleCard.scss';

interface TitleCardProps {
  label: 'now' | 'next';
  event: OntimeEvent | null;
}

export default function TitleCard(props: TitleCardProps) {
  const { label, event } = props;
  const { getLocalizedString } = useTranslation();

  const accent = label === 'now';
  const [searchParams] = useSearchParams();

  return (
    <div className='title-card'>
      <div className='inline'>
        <span className='presenter'>{event?.presenter}</span>
      </div>
      <span className={accent ? 'label accent' : 'label'}>{getLocalizedString(`common.${label}`)}</span>
      <div className='title'>{event?.title}</div>
      <div className='subtitle'>
        {event?.cue}
        {searchParams.get('showField') && event?.[searchParams.get('showField')! as keyof OntimeEvent]
          ? ` - ${event?.[searchParams.get('showField')! as keyof OntimeEvent]}`
          : ''}
      </div>
    </div>
  );
}
