import { useState } from 'react';
import { FiZoomIn } from '@react-icons/all-files/fi/FiZoomIn';
import { FiZoomOut } from '@react-icons/all-files/fi/FiZoomOut';
import { OntimeEvent } from 'ontime-types';

import { useRundownEditor } from '../../common/hooks/useSocket';
import useDepartments from '../../common/hooks-query/useDepartments';
import useRundown from '../../common/hooks-query/useRundown';
import { filterEvents } from '../../common/utils/eventFilter';

import Track from './Track';
import TrackHeader from './TrackHeader';

import style from './Timeline.module.scss';

export default function Timeline() {
  const { data } = useRundown() as { data: OntimeEvent[] };
  const [zoomFactor, setZoomFactor] = useState(1);
  const [verticalZoomFactor, setVerticalZoomFactor] = useState(1);
  const { data: departments } = useDepartments();
  const featureData = useRundownEditor();

  if (data.length === 0) return null;

  // render all events from the data array in a horizontal scrollable timeline with zooming and panning
  // the timeline should be able to be scrolled to the left and right
  // the timeline should be able to be zoomed in and out

  const earliestEvent = data?.reduce((prev, curr) => (prev.timeStart < curr.timeStart ? prev : curr));
  const latestEvent = data?.reduce((prev, curr) => (prev.timeEnd > curr.timeEnd ? prev : curr));
  const totalLength = latestEvent?.timeEnd - earliestEvent?.timeStart;

  function getPositions(event: OntimeEvent) {
    const start = (((event.timeStart - earliestEvent?.timeStart) / totalLength) * 100) / 1.2;
    const end = (((event.timeEnd - earliestEvent?.timeStart) / totalLength) * 100) / 1.2;
    const length = (((event.timeEnd - event.timeStart) / totalLength) * 100) / 1.2;
    return {
      start: `${start}%`,
      end: `${end}%`,
      length: `${length}%`,
    };
  }

  const initialWidth = window.innerWidth - 100;

  function handleScroll(event: React.WheelEvent<HTMLDivElement>) {
    if (event.altKey || event.metaKey) {
      // zoom in or out
      if (event.deltaY < 0) {
        zoom('in');
      } else {
        zoom('out');
      }
      event.preventDefault();
      event.stopPropagation();
    } else if (event.shiftKey) {
      // vertical scroll
      if (event.deltaY < 0) {
        zoomVertical('in');
      } else {
        zoomVertical('out');
      }
    } else {
      const timeline = document.querySelector(`.${style.timelineContainer}`) as HTMLDivElement;
      timeline.scrollLeft += event.deltaY;
    }
  }

  function zoom(type: 'in' | 'out') {
    // exponential zooming
    const factor = 0.1;
    if (type === 'in') {
      setZoomFactor(zoomFactor + factor);
    } else {
      setZoomFactor(zoomFactor - factor);
    }
    // also move the timeline respectivly
    const timeline = document.querySelector(`.${style.timelineContainer}`) as HTMLDivElement;
    timeline.scrollLeft += timeline.scrollWidth * factor;
  }

  function zoomVertical(type: 'in' | 'out') {
    const factor = 0.05;
    if (type === 'in') {
      setVerticalZoomFactor(verticalZoomFactor + factor);
    } else {
      setVerticalZoomFactor(verticalZoomFactor - factor);
    }
  }

  return (
    <>
      <div className={style.timelineContainer} onWheel={(event) => handleScroll(event)}>
        <div
          className={style.trackContainer}
          style={
            {
              '--track-width': `${initialWidth * zoomFactor}px`,
              '--track-height': `${100 * verticalZoomFactor}px`,
            } as React.CSSProperties
          }
        >
          {false && <TrackHeader start={earliestEvent!.timeStart} end={latestEvent!.timeEnd} length={totalLength!} />}
          {[{ id: '', enabled: true, name: 'General' }].concat(departments || []).map((department) => {
            const mappedEvents = filterEvents(data, department.id, false).map((event) => ({
              event,
              ...getPositions(event),
            }));
            return (
              <div className={style.trackLabelContainer} key={department.id}>
                <span className={style.trackLabel}>{department.name}</span>
                <Track
                  items={mappedEvents}
                  key={department.id}
                  runningCue={data.find((e) => e.id === featureData?.selectedEventId)?.cue}
                />
              </div>
            );
          })}
        </div>
      </div>
      <div className={style.timelineControls}>
        <button
          onClick={() => {
            zoom('in');
          }}
        >
          <FiZoomIn />
        </button>
        <button
          onClick={() => {
            zoom('out');
          }}
        >
          <FiZoomOut />
        </button>
      </div>
    </>
  );
}
