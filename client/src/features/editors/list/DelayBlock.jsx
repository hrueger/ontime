import { millisToMinutes } from '../../../common/dateConfig';
import TimeInput from '../../../common/input/TimeInput';
import style from './Block.module.css';
import ActionButtons from './ActionButtons';
import DeleteIconBtn from '../../../common/components/buttons/DeleteIconBtn';

export default function DelayBlock(props) {
  const { data, eventsHandler, index } = props;

  const addHandler = () => {
    eventsHandler('add', { type: 'event', order: index + 1 });
  };

  const submitHandler = (value) => {
    // convert to ms and patch
    eventsHandler('patch', { id: data.id, duration: value * 1000 * 60 });
  };

  const deleteHandler = () => {
    eventsHandler('delete', data.id);
  };

  let delayValue = (data.duration != null) ? millisToMinutes(data.duration) : undefined;
  return (
    <div className={style.delay}>
      <TimeInput
        value={delayValue}
        submitHandler={submitHandler}
      />
      <div className={style.actionOverlay}>
        <DeleteIconBtn clickhandler={deleteHandler} />
        <ActionButtons showAdd addHandler={addHandler} />
      </div>
    </div>
  );
}
