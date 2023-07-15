import { useEffect } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { Input, Switch } from '@chakra-ui/react';
import { Department, Departments } from 'ontime-types';

import { postDepartments } from '../../../common/api/ontimeApi';
import useDepartments from '../../../common/hooks-query/useDepartments';
import { useEmitLog } from '../../../common/stores/logger';
import ModalLoader from '../modal-loader/ModalLoader';
import { inputProps } from '../modalHelper';
import ModalSplitInput from '../ModalSplitInput';
import OntimeModalFooter from '../OntimeModalFooter';

import style from './SettingsModal.module.scss';

export default function CuesheetSettings() {
  const { data, status, isFetching, refetch } = useDepartments();
  const { emitError } = useEmitLog();
  const {
    handleSubmit,
    register,
    reset,
    control,
    formState: { errors, isSubmitting, isDirty, isValid },
  } = useForm<{ departments: Departments }>({
    defaultValues: { departments: data },
    values: { departments: data || [] },
    resetOptions: {
      keepDirtyValues: true,
    },
  });

  const { fields, append } = useFieldArray({
    control,
    name: 'departments',
  });

  useEffect(() => {
    if (data) {
      reset({ departments: data });
    }
  }, [data, reset]);

  const onSubmit = async (formData: { departments: Departments }) => {
    try {
      await postDepartments(formData.departments);
    } catch (error) {
      emitError(`Error saving department settings: ${error}`);
    } finally {
      await refetch();
    }
  };

  const onReset = () => {
    reset({ departments: data });
  };

  const disableInputs = status === 'loading';

  if (isFetching) {
    return <ModalLoader />;
  }

  function addNewDepartment() {
    append({ id: '', enabled: false, name: 'New Department' });
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} id='department-settings' className={style.sectionContainer}>
      {fields.map((item, index) => {
        return (
          <ModalSplitInput
            field={`user${index}` as const}
            title={`Department ${index + 1}`}
            description=''
            error={errors.departments?.[index]?.message}
            key={item.id}
          >
            <Input
              {...inputProps}
              width='300px'
              variant='ontime-filled-on-light'
              isDisabled={disableInputs}
              placeholder='ID'
              {...register(`departments.${index}.id`)}
            />
            <Input
              {...inputProps}
              width='300px'
              variant='ontime-filled-on-light'
              isDisabled={disableInputs}
              placeholder='Display name for Department'
              {...register(`departments.${index}.name`)}
            />
            <Switch
              {...register(`departments.${index}.enabled`)}
              isDisabled={disableInputs}
              size='lg'
              defaultChecked={item.enabled}
            />
          </ModalSplitInput>
        );
      })}

      <a href='#' onClick={() => addNewDepartment()}>
        Add new department
      </a>

      <OntimeModalFooter
        formId='department-settings'
        handleRevert={onReset}
        isDirty={isDirty}
        isValid={isValid}
        isSubmitting={isSubmitting}
      />
    </form>
  );
}
