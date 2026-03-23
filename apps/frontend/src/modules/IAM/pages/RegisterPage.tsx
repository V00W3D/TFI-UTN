import './AuthPages.css';
import { sdk, form } from '@tools/sdk';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
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

const RegisterPage = () => {
  const { fields, submit } = form.iam.register;
  // isFormValid y error ahora vienen del SDK — completamente tipados.
  // error.code → literal union del contrato
  // error.params → ('name' | 'sname' | 'email' | ...)[]
  // isFormValid → sincronizado automáticamente con el formStore interno
  const { data, error, isFetching, isFormValid } = sdk.iam.register.$use();
  const navigate = useNavigate();

  useEffect(() => {
    sdk.iam.register.$reset();
  }, []);

  useEffect(() => {
    if (data && !error) {
      navigate('/iam/login', { replace: true });
    }
  }, [data, error, navigate]);

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <form
          onSubmit={submit(async (values) => {
            if (isFetching) return;
            try {
              await sdk.iam.register(values);
            } catch (e) {
              console.error(e);
            }
          })}
          className="auth-form"
        >
          <h3 className="auth-section-title">Información Personal</h3>

          <fields.name
            label="Nombre"
            required
            fieldMode="register"
            addons={[{ type: 'rubber' }, { type: 'rules', rules: nameField.rules }]}
          />
          <fields.sname
            label="Segundo Nombre"
            fieldMode="register"
            addons={[{ type: 'rubber' }, { type: 'rules', rules: snameField.rules }]}
          />
          <fields.lname
            label="Apellido"
            required
            fieldMode="register"
            addons={[{ type: 'rubber' }, { type: 'rules', rules: lnameField.rules }]}
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

          <h3 className="auth-section-title">Credenciales</h3>

          <fields.username
            label="Usuario"
            required
            fieldMode="register"
            addons={[{ type: 'rubber' }, { type: 'rules', rules: usernameField.rules }]}
          />
          <fields.password
            label="Contraseña"
            required
            fieldMode="register"
            control="password"
            addons={[
              { type: 'passwordToggle' },
              { type: 'strength' },
              { type: 'rubber' },
              { type: 'rules', rules: passwordField.rules },
            ]}
          />
          <fields.cpassword
            label="Confirmar Contraseña"
            required
            fieldMode="register"
            control="password"
            addons={[
              { type: 'passwordToggle' },
              { type: 'rubber' },
              { type: 'rules', rules: cpasswordField.rules },
            ]}
          />

          <h3 className="auth-section-title">Contacto</h3>

          <fields.email
            label="Email"
            required
            fieldMode="register"
            control="email"
            addons={[{ type: 'rubber' }, { type: 'rules', rules: emailField.rules }]}
          />
          <fields.phone
            label="Teléfono"
            fieldMode="register"
            control="phone"
            addons={[{ type: 'rubber' }, { type: 'rules', rules: phoneField.rules }]}
          />

          <button type="submit" className="auth-button" disabled={isFetching || !isFormValid}>
            {isFetching ? 'Creando cuenta...' : 'Crear Cuenta'}
          </button>

          {error && <p className="auth-error">{error.code}</p>}
          {data && <p className="auth-success">Registro exitoso</p>}
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;
