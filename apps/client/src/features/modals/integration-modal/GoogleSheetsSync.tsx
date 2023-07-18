import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { FormControl, Input, Switch } from '@chakra-ui/react';
import { SheetsSyncSettings } from 'ontime-types';

import useSheetsSyncSettings, {
  useSheetsSyncSettingsMutation,
} from '../../../common/hooks-query/useSheetsSyncSettings';
import { useEmitLog } from '../../../common/stores/logger';
import ModalLoader from '../modal-loader/ModalLoader';
import OntimeModalFooter from '../OntimeModalFooter';

import styles from '../Modal.module.scss';

export default function GoogleSheetsSync() {
  const { data, isFetching } = useSheetsSyncSettings();
  const { mutateAsync } = useSheetsSyncSettingsMutation();
  const { emitError } = useEmitLog();
  const {
    handleSubmit,
    register,
    reset,
    setError,
    formState: { errors, isSubmitting, isDirty, isValid },
  } = useForm<SheetsSyncSettings>({
    defaultValues: data,
    values: data,
    resetOptions: {
      keepDirtyValues: true,
    },
  });

  useEffect(() => {
    if (data) {
      reset(data);
    }
  }, [data, reset]);
  const onSubmit = async (values: SheetsSyncSettings) => {
    try {
      await mutateAsync(values);
    } catch (error) {
      emitError(`Error setting sheet sync settings: ${error}`);
    }
  };

  const resetForm = () => {
    reset(data);
  };

  if (isFetching) {
    return <ModalLoader />;
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={styles.sectionContainer} id='sheetsSyncSettings'>
      <div className={styles.splitSection}>
        <div>
          <span className={`${styles.sectionTitle} ${styles.main}`}>Enable Google Sheets Sync</span>
          <span className={styles.sectionSubtitle}>Pull all your data from Google Sheets for easy editing</span>
        </div>
        <Switch {...register('enabled')} variant='ontime-on-light' />
      </div>

      <FormControl isInvalid={!!errors.sheetId} className={styles.splitSection}>
        <label htmlFor='sheetId'>
          <span className={styles.sectionTitle}>Sheet ID</span>
          {errors.sheetId ? (
            <span className={styles.error}>{errors.sheetId.message}</span>
          ) : (
            <span className={styles.sectionSubtitle}>The ID can be found in the URL</span>
          )}
        </label>
        <Input
          id='sheetId'
          placeholder='abcdefghijklmnopqrstuvwxyz'
          size='sm'
          textAlign='right'
          variant='ontime-filled-on-light'
          {...register('sheetId', {})}
        />
      </FormControl>
      <div style={{ height: '16px' }} />
      <div className={styles.splitSection}>
        <div>
          <span className={styles.sectionTitle} style={{ fontWeight: 600 }}>
            Sheet Name
          </span>
          <span className={styles.sectionSubtitle}>The name of the sheet</span>
        </div>
        <Input
          {...register('sheetName')}
          placeholder='My Rundown'
          size='sm'
          textAlign='right'
          variant='ontime-filled-on-light'
        />
      </div>

      <FormControl isInvalid={!!errors.apiKey} className={styles.splitSection}>
        <label htmlFor='apiKey'>
          <span className={styles.sectionTitle}>API Key</span>
          {errors.apiKey ? (
            <span className={styles.error}>{errors.apiKey.message}</span>
          ) : (
            <span className={styles.sectionSubtitle}>Can be generated in the Google Console</span>
          )}
        </label>
        <Input
          id='apiKey'
          placeholder='whr9coa2z35n90pacu4ö91241pn0'
          size='sm'
          textAlign='right'
          variant='ontime-filled-on-light'
          {...register('apiKey')}
        />
      </FormControl>
      <OntimeModalFooter
        formId='sheetsSyncSettings'
        handleRevert={resetForm}
        isDirty={isDirty}
        isValid={isValid}
        isSubmitting={isSubmitting}
      />
    </form>
  );
}
