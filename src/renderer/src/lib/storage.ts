interface BooleanProps {
  key: string;
  initialValue: boolean;
}

interface NumberProps {
  key: string;
  initialValue: number;
}

export function getInitialBooleanSetting({ key, initialValue }: BooleanProps) {
  if (!localStorage.getItem(key)) {
    return initialValue;
  } else {
    return localStorage.getItem(key) === 'true';
  }
}

export function getInitialNumberSetting({ key, initialValue }: NumberProps) {
  if (!localStorage.getItem(key)) {
    return initialValue;
  } else {
    return Number(localStorage.getItem(key));
  }
}
