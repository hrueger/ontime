import { useInfoPanel } from '../../common/hooks/useSocket';

import CollapsableInfo from './CollapsableInfo';
import InfoLogger from './InfoLogger';
import InfoNif from './InfoNif';
import InfoTitles from './InfoTitles';

import style from './Info.module.scss';

export default function Info() {
  const data = useInfoPanel();

  const selected = !data.numEvents
    ? 'No events'
    : `Event ${data.selectedEventIndex !== null ? data.selectedEventIndex + 1 : '-'} / ${
        data.numEvents ? data.numEvents : '-'
      }`;

  return (
    <>
      <div className={style.panelHeader}>
        <span>{selected}</span>
      </div>
      <CollapsableInfo title='Network Info'>
        <InfoNif />
      </CollapsableInfo>
      <CollapsableInfo title='Playing Now'>
        <InfoTitles data={data.titles.eventNow} />
      </CollapsableInfo>
      <CollapsableInfo title='Playing Next'>
        <InfoTitles data={data.titles.eventNext} />
      </CollapsableInfo>
      <CollapsableInfo title='Log'>
        <InfoLogger />
      </CollapsableInfo>
    </>
  );
}
