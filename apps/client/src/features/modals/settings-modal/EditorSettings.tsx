import { Select, Switch } from '@chakra-ui/react';

import useDepartments from '../../../common/hooks-query/useDepartments';
import { useLocalEvent } from '../../../common/stores/localEvent';
import ModalSplitInput from '../ModalSplitInput';

import style from './SettingsModal.module.scss';

export default function EditorSettings() {
  const eventSettings = useLocalEvent((state) => state.eventSettings);
  const setShowQuickEntry = useLocalEvent((state) => state.setShowQuickEntry);
  const setStartTimeIsLastEnd = useLocalEvent((state) => state.setStartTimeIsLastEnd);
  const setDefaultDepartment = useLocalEvent((state) => state.setDefaultDepartment);
  const { data: departments } = useDepartments();

  return (
    <div className={style.sectionContainer}>
      <span className={style.title}>Rundown settings</span>
      <ModalSplitInput field='' title='Show quick entry' description='Whether quick entry shows under selected event'>
        <Switch
          variant='ontime-on-light'
          defaultChecked={eventSettings.showQuickEntry}
          onChange={(event) => setShowQuickEntry(event.target.checked)}
        />
      </ModalSplitInput>
      <ModalSplitInput
        field=''
        title='Start time is last end'
        description='New events start time will be previous event end'
      >
        <Switch
          variant='ontime-on-light'
          defaultChecked={eventSettings.startTimeIsLastEnd}
          onChange={(event) => setStartTimeIsLastEnd(event.target.checked)}
        />
      </ModalSplitInput>
      <ModalSplitInput field='' title='Default department' description='Default department for new events'>
        <Select
          size='sm'
          width={40}
          name='defaultDepartment'
          value={eventSettings.defaultDepartment}
          onChange={(event) => setDefaultDepartment(event.target.value)}
        >
          <option value=''>None</option>
          {(departments || []).map((department) => (
            <option key={department.id} value={department.id}>
              {department.name}
            </option>
          ))}
        </Select>
      </ModalSplitInput>
    </div>
  );
}
