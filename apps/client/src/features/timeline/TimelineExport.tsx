import { memo } from 'react';
import { IoArrowUp } from '@react-icons/all-files/io5/IoArrowUp';

import ErrorBoundary from '../../common/components/error-boundary/ErrorBoundary';
import { handleLinks } from '../../common/utils/linkUtils';

import Timeline from './Timeline';

import style from '../editors/Editor.module.scss';

const TimelineExport = () => {
  return (
    <div className={style.timeline} data-testid='panel-timeline'>
      <IoArrowUp className={style.corner} onClick={(event) => handleLinks(event, 'timeline')} />
      <div className={style.content}>
        <ErrorBoundary>
          <Timeline />
        </ErrorBoundary>
      </div>
    </div>
  );
};

export default memo(TimelineExport);
