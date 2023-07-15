import { PropsWithChildren } from 'react';
import { Button, ButtonGroup, IconButton, Input, Tooltip } from '@chakra-ui/react';
import { IoCopy } from '@react-icons/all-files/io5/IoCopy';

import { tooltipDelayFast } from '../../../ontimeConfig';
import { Size } from '../../models/Util.type';
import copyToClipboard from '../../utils/copyToClipboard';
import useReactiveTextInput from '../input/text-input/useReactiveTextInput';

interface CopyTagProps {
  label: string;
  className?: string;
  size?: Size;
  initialValue: string;
  submitHandler: (value: string) => void;
}

export default function InputCopyTag(props: CopyTagProps) {
  const { label, className, size = 'xs', initialValue, submitHandler } = props;

  const handleClick = () => copyToClipboard(initialValue as string);

  const textInputProps = useReactiveTextInput(initialValue, submitHandler, { submitOnEnter: true });

  return (
    <Tooltip label={label} openDelay={tooltipDelayFast}>
      <ButtonGroup size={size} isAttached className={className}>
        <Input type='text' size='xs' width={20} variant='ontime-filled' {...textInputProps} />
        <IconButton aria-label={label} icon={<IoCopy />} variant='ontime-filled' tabIndex={-1} onClick={handleClick} />
      </ButtonGroup>
    </Tooltip>
  );
}
