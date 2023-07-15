import { memo } from 'react';
import { OntimeEvent } from 'ontime-types';

import SwatchSelect from '../../../common/components/input/colour-input/SwatchSelect';
import { useEventAction } from '../../../common/hooks/useEventAction';
import useUserFields from '../../../common/hooks-query/useUserFields';

import CountedTextArea from './CountedTextArea';
import CountedTextInput from './CountedTextInput';

import style from '../EventEditor.module.scss';

interface EventEditorTitlesProps {
  eventId: string;
  title: string;
  presenter: string;
  subtitle: string;
  note: string;
  colour: string;
  event: OntimeEvent;
}

export type TitleActions =
  | 'title'
  | 'presenter'
  | 'subtitle'
  | 'note'
  | 'colour'
  | 'user0'
  | 'user1'
  | 'user2'
  | 'user3'
  | 'user4'
  | 'user5'
  | 'user6'
  | 'user7'
  | 'user8'
  | 'user9';

const EventEditorTitles = (props: EventEditorTitlesProps) => {
  const { eventId, title, presenter, subtitle, note, colour, event } = props;
  const { updateEvent } = useEventAction();

  const handleSubmit = (field: TitleActions, value: string) => {
    updateEvent({ id: eventId, [field]: value });
  };

  const { data: userFields } = useUserFields();

  return (
    <div className={style.titles}>
      <div className={style.left}>
        <CountedTextInput field='title' label='Title' initialValue={title} submitHandler={handleSubmit} />
        <CountedTextInput field='presenter' label='Presenter' initialValue={presenter} submitHandler={handleSubmit} />
        <CountedTextInput field='subtitle' label='Subtitle' initialValue={subtitle} submitHandler={handleSubmit} />
      </div>
      <div className={style.right}>
        <div className={style.column}>
          <label className={style.inputLabel}>Colour</label>
          <div className={style.inline}>
            <SwatchSelect name='colour' value={colour} handleChange={handleSubmit} />
          </div>
        </div>
        <CountedTextInput field='note' label='Note' initialValue={note} submitHandler={handleSubmit} />
        <div className={style.row}>
          {Array(10)
            .fill(null)
            .map((_, index) => {
              return (
                userFields?.[`user${index}Enabled` as keyof typeof userFields] && (
                  <div className={style.rowColumn2} key={index}>
                    <CountedTextInput
                      field={`user${index}` as TitleActions}
                      label={userFields[`user${index}` as keyof typeof userFields] as string}
                      initialValue={event[`user${index}` as keyof OntimeEvent] as string}
                      submitHandler={handleSubmit}
                    />
                  </div>
                )
              );
            })}
        </div>
      </div>
    </div>
  );
};

export default memo(EventEditorTitles);
