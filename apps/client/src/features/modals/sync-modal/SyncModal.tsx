import { useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  Alert,
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from '@chakra-ui/react';

import { postSync } from '../../../common/api/ontimeApi';
import { useEmitLog } from '../../../common/stores/logger';

import style from './SyncModal.module.scss';

interface SyncModalProps {
  onClose: () => void;
  isOpen: boolean;
}

export default function SyncModal({ onClose, isOpen }: SyncModalProps) {
  const { emitError } = useEmitLog();
  const {
    handleSubmit,
    formState: { isSubmitting },
  } = useForm({
    defaultValues: {},
    values: {},
  });

  const [success, setSuccess] = useState(false);

  const onSubmit = async () => {
    console.log('submit');
    try {
      await postSync();
      setSuccess(true);
    } catch (error) {
      emitError(`Error syncing: ${error}`);
    }
  };

  function handleClose() {
    onClose();
    setSuccess(false);
  }

  return (
    <Modal
      onClose={() => handleClose()}
      isOpen={isOpen}
      closeOnOverlayClick
      motionPreset='slideInBottom'
      size='xl'
      scrollBehavior='inside'
      preserveScrollBarGap
      variant='ontime-small'
    >
      <ModalOverlay />
      <ModalContent>
        <form onSubmit={handleSubmit(onSubmit)} id='form-sync' className={style.sectionContainer}>
          <ModalHeader>Sync Project File</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {(success && (
              <Alert status='success' mb={4}>
                Sync Successful
              </Alert>
            )) || <>Press Sync to Start</>}
          </ModalBody>
          <ModalFooter className={`${style.buttonSection} ${style.pad}`}>
            <Button onClick={() => handleClose()} isDisabled={isSubmitting} variant='ontime-ghost-on-light' size='sm'>
              Cancel
            </Button>
            <Button
              form='form-sync'
              type='submit'
              isLoading={isSubmitting}
              isDisabled={success}
              variant='ontime-filled'
              padding='0 2em'
              size='sm'
            >
              Sync
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
}
