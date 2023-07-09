import { OntimeEvent, UserFields } from 'ontime-types';

import useUserFields from '../../common/hooks-query/useUserFields';

import style from './Info.module.scss';

interface InfoTitleProps {
  data: OntimeEvent | null;
}

export default function InfoTitles(props: InfoTitleProps) {
  const { data } = props;
  const { data: userFields } = useUserFields();
  return (
    <div className={style.labels}>
      <div>
        <span className={style.label}>Title:</span>
        <span className={style.content}>{data?.title || ''}</span>
      </div>
      <div>
        <span className={style.label}>Presenter:</span>
        <span className={style.content}>{data?.presenter || ''}</span>
      </div>
      <div>
        <span className={style.label}>Subtitle:</span>
        <span className={style.content}>{data?.subtitle || ''}</span>
      </div>
      <div>
        <span className={style.label}>Note:</span>
        <span className={style.content}>{data?.note || ''}</span>
      </div>
      {Object.entries(userFields || {}).find(([key, value]) => key.endsWith('Enabled') && value) ? (
        <>
          <hr className={style.divider} />
          {Object.entries(userFields || {})
            .filter(([key, value]) => key.endsWith('Enabled') && value)
            .map(([key]) => {
              const userKey = key.replace('Enabled', '') as keyof UserFields;
              return (
                <div key={key}>
                  <span className={style.label}>{userFields?.[userKey]}:</span>
                  <span className={style.content}>{data?.[userKey as keyof typeof data] || ''}</span>
                </div>
              );
            })}
        </>
      ) : null}
    </div>
  );
}
