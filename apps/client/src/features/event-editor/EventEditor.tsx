import { useEffect, useState } from 'react';
import { OntimeEvent } from 'ontime-types';

import CopyTag from '../../common/components/copy-tag/CopyTag';
import InputCopyTag from '../../common/components/input-copy-tag/InputCopyTag';
import { useEventAction } from '../../common/hooks/useEventAction';
import useRundown from '../../common/hooks-query/useRundown';
import { useAppMode } from '../../common/stores/appModeStore';
import getDelayTo from '../../common/utils/getDelayTo';

import EventEditorTimes from './composite/EventEditorTimes';
import EventEditorTitles from './composite/EventEditorTitles';

import style from './EventEditor.module.scss';

export type EventEditorSubmitActions = keyof OntimeEvent;

export default function EventEditor() {
  const openId = useAppMode((state) => state.editId);
  const { data } = useRundown();
  const [event, setEvent] = useState<OntimeEvent | null>(null);
  const [delay, setDelay] = useState(0);

  useEffect(() => {
    if (!data || !openId) {
      return;
    }

    const eventIndex = data.findIndex((event) => event.id === openId);
    if (eventIndex > -1) {
      const event = data[eventIndex];
      if (event.type === 'event') {
        setDelay(getDelayTo(data, eventIndex));
        setEvent(data[eventIndex] as OntimeEvent);
      }
    }
  }, [data, event, openId]);

  const { updateEvent } = useEventAction();

  const handleSubmit = (eventId: string) => (value: string) => {
    updateEvent({ id: eventId, cue: value });
  };

  if (!event) {
    return <span>Loading...</span>;
  }

  return (
    <div className={style.eventEditor}>
      <div className={style.eventInfo}>
        Event ID
        <span className={style.eventId}>
          <CopyTag label={event.id}>{event.id}</CopyTag>
        </span>
        Cue
        <span className={style.cue}>
          <InputCopyTag label={event.cue} initialValue={event.cue} submitHandler={handleSubmit(event.id)} />
        </span>
      </div>
      <div className={style.eventActions}>
        <CopyTag label='OSC trigger ID'>{`/ontime/gotoid/${event.id}`}</CopyTag>
        {event.cue && <CopyTag label='OSC trigger CUE'>{`/ontime/gotocue/${event.cue}`}</CopyTag>}
      </div>
      <EventEditorTimes
        eventId={event.id}
        timeStart={event.timeStart}
        timeEnd={event.timeEnd}
        duration={event.duration}
        delay={delay}
        department={event.department}
        endAction={event.endAction}
        timerType={event.timerType}
      />
      <EventEditorTitles
        key={event.id}
        eventId={event.id}
        title={event.title}
        presenter={event.presenter}
        subtitle={event.subtitle}
        note={event.note}
        colour={event.colour}
        event={event}
      />
    </div>
  );
}
