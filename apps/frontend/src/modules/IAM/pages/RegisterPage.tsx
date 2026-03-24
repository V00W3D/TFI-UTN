import './AuthPages.css';
import { form } from '@tools/sdk';
import {
  nameField,
  snameField,
  lnameField,
  sexField,
  usernameField,
  passwordField,
  cpasswordField,
  emailField,
  phoneField,
} from '@app/sdk';

const { Form, fields } = form.iam.register;

const RegisterPage = () => (
  <Form
    buttonText="Crear Cuenta"
    loadingText="Creando cuenta..."
    redirectTo="/iam/login"
    redirectOptions={{ replace: true }}
  >
    <fields.name
      label="Nombre"
      required
      fieldMode="register"
      addons={[{ type: 'rules', rules: nameField.rules }]}
    />
    <fields.sname
      label="Segundo Nombre"
      fieldMode="register"
      addons={[{ type: 'rules', rules: snameField.rules }]}
    />
    <fields.lname
      label="Apellido"
      required
      fieldMode="register"
      addons={[{ type: 'rules', rules: lnameField.rules }]}
    />
    <fields.sex
      label="Sexo"
      required
      fieldMode="register"
      control={[
        'radio',
        [
          { value: 'MALE', label: 'Masculino', icon: '/masculine-icon.png' },
          { value: 'FEMALE', label: 'Femenino', icon: '/femenine-icon.png' },
          { value: 'OTHER', label: 'Otro', icon: '/other-gender.png' },
        ],
      ]}
      addons={[{ type: 'rules', rules: sexField.rules }]}
    />
    <fields.username
      label="Usuario"
      required
      fieldMode="register"
      addons={[{ type: 'rules', rules: usernameField.rules }]}
    />
    <fields.password
      label="Contraseña"
      required
      fieldMode="register"
      control="password"
      addons={[
        { type: 'passwordToggle' },
        { type: 'strength' },
        { type: 'rules', rules: passwordField.rules },
      ]}
    />
    <fields.cpassword
      label="Confirmar Contraseña"
      required
      fieldMode="register"
      control="password"
      addons={[{ type: 'passwordToggle' }, { type: 'rules', rules: cpasswordField.rules }]}
    />
    <fields.email
      label="Email"
      required
      fieldMode="register"
      control="email"
      addons={[{ type: 'rules', rules: emailField.rules }]}
    />
    <fields.phone
      label="Teléfono"
      fieldMode="register"
      control="phone"
      addons={[{ type: 'rules', rules: phoneField.rules }]}
    />
  </Form>
);

export default RegisterPage;
