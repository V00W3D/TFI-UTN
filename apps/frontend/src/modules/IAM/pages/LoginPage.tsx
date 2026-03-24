import './AuthPages.css';
import { form } from '@tools/sdk';
const LoginPage = () => {
  const { Form, fields } = form.iam.login;
  return (
    <Form
      buttonText="Entrar"
      loadingText="Entrando..."
      redirectOptions={{ replace: true }}
      redirectTo="/"
    >
      <fields.identity
        placeholder="Tu nombre de usuario,teléfono o email con el que te registraste"
        label="Identidad"
        required
        fieldMode="login"
      />
      <fields.password
        placeholder="********"
        label="Contraseña"
        required
        fieldMode="login"
        addons={[{ type: 'passwordToggle' }]}
      />
    </Form>
  );
};

export default LoginPage;
