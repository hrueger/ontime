import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Alert, AlertDescription, AlertIcon, AlertTitle, Input, Switch } from '@chakra-ui/react';
import { UserFields } from 'ontime-types';

import { postUserFields } from '../../../common/api/ontimeApi';
import useUserFields from '../../../common/hooks-query/useUserFields';
import { useEmitLog } from '../../../common/stores/logger';
import ModalLoader from '../modal-loader/ModalLoader';
import { inputProps } from '../modalHelper';
import ModalLink from '../ModalLink';
import ModalSplitInput from '../ModalSplitInput';
import OntimeModalFooter from '../OntimeModalFooter';

import style from './SettingsModal.module.scss';

const userFieldsDocsUrl = 'https://ontime.gitbook.io/v2/features/user-fields';

export default function CuesheetSettings() {
  const { data, status, isFetching, refetch } = useUserFields();
  const { emitError } = useEmitLog();
  const {
    handleSubmit,
    register,
    reset,
    formState: { errors, isSubmitting, isDirty, isValid },
  } = useForm<UserFields>({
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

  const onSubmit = async (formData: UserFields) => {
    try {
      await postUserFields(formData);
    } catch (error) {
      emitError(`Error saving cuesheet settings: ${error}`);
    } finally {
      await refetch();
    }
  };

  const onReset = () => {
    reset(data);
  };

  const disableInputs = status === 'loading';

  if (isFetching) {
    return <ModalLoader />;
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} id='cuesheet-settings' className={style.sectionContainer}>
      <div style={{ height: '16px' }} />
      <Alert status='info' variant='ontime-on-light-info'>
        <AlertIcon />
        <div className={style.column}>
          <AlertTitle>User Fields</AlertTitle>
          <AlertDescription>
            Allow for custom naming of additional data fields on each event (eg. light, sound, camera). <br />
            <ModalLink href={userFieldsDocsUrl}>See the docs</ModalLink>
          </AlertDescription>
        </div>
      </Alert>
      <div style={{ height: '16px' }} />
      {Array(10)
        .fill(null)
        .map((_, index) => {
          return (
            <ModalSplitInput
              field={`user${index}` as const}
              title={`User ${index}`}
              description=''
              error={errors[`user${index}` as keyof UserFields]?.message}
              key={index}
            >
              <Switch
                {...register(`user${index}Enabled` as keyof UserFields)}
                isDisabled={disableInputs}
                size='lg'
                defaultChecked={data?.[`user${index}Enabled` as keyof UserFields] as boolean}
              />
              <Input
                {...inputProps}
                width='300px'
                variant='ontime-filled-on-light'
                isDisabled={disableInputs}
                placeholder='Display name for user field'
                {...register(`user${index}` as keyof UserFields)}
              />
            </ModalSplitInput>
          );
        })}

      <OntimeModalFooter
        formId='cuesheet-settings'
        handleRevert={onReset}
        isDirty={isDirty}
        isValid={isValid}
        isSubmitting={isSubmitting}
      />
    </form>
  );
}
