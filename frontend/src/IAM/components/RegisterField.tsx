import { useMemo } from 'react';
import AuthFieldBuilder from '../common/AuthFieldBuilder';
import PasswordStrengthPlugin from '../utils/PasswordStrength';
import { useRegisterStore, type SexType } from '@IAM/store/IAMStore';

import {
  createRegisterBindings,
  REGISTER_CONFIG,
  type RegisterFieldType,
} from '../common/registerfield.config';
/* =========================================================
   FIELD TYPE (DERIVADO AUTOMÁTICAMENTE DE LA CONFIG)
========================================================= */

/* =========================================================
   PROPS
========================================================= */

interface Props {
  for: RegisterFieldType;
}

/* =========================================================
   COMPONENT
========================================================= */

const RegisterField = ({ for: field }: Props) => {
  const store = useRegisterStore();

  const bindings = createRegisterBindings(store);
  const config = REGISTER_CONFIG[field];

  const { value, validate } = bindings[field];

  const plugins = useMemo(() => {
    if (field !== 'password') return [];
    if (!store.password) return [];

    return [
      {
        render: () => <PasswordStrengthPlugin password={store.password} mode="register" />,
      },
    ];
  }, [field, store.password]);

  const handleChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const value = e.target.value;

    if (field === 'sex') {
      bindings.sex.setter(value as SexType);
    } else {
      bindings[field]?.setter(value as (typeof bindings)[typeof field]['value']);
    }
  };

  return (
    <AuthFieldBuilder
      {...config}
      value={value}
      onChange={handleChange}
      validate={validate}
      required={field !== 'phone' && field !== 'middleName'}
      plugins={plugins}
      fieldMode="register"
    />
  );
};
export default RegisterField;
