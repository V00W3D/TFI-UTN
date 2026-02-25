import { useState } from 'react';
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import './register-page.css';

type SectionKey = 'personal' | 'credentials' | 'contact';
type Sex = 'male' | 'female' | 'other' | '';

const RegisterPage = () => {
  const [openSection, setOpenSection] = useState<SectionKey>('personal');

  const [form, setForm] = useState({
    firstName: '',
    middleName: '',
    lastName: '',
    username: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    sex: '' as Sex,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const isSectionComplete = (section: SectionKey) => {
    switch (section) {
      case 'personal':
        return form.firstName && form.lastName && form.sex;
      case 'credentials':
        return (
          form.username &&
          form.password &&
          form.confirmPassword &&
          form.password === form.confirmPassword
        );
      case 'contact':
        return form.email;
      default:
        return false;
    }
  };

  const isFormComplete =
    form.firstName &&
    form.lastName &&
    form.username &&
    form.password &&
    form.confirmPassword &&
    form.password === form.confirmPassword &&
    form.email &&
    form.sex;

  const toggleSection = (section: SectionKey) => {
    setOpenSection(section);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormComplete) return;
    console.log(form);
  };

  return (
    <div className="register-wrapper">
      <div className="register-card">
        <h2 className="register-title">Crear Cuenta</h2>

        <form onSubmit={handleSubmit} className="register-form">
          {/* ================= PERSONAL ================= */}
          <div className="register-section">
            <div
              className={`section-header ${
                isSectionComplete('personal') ? 'section-complete' : ''
              }`}
              onClick={() => toggleSection('personal')}
            >
              👤 Información Personal
            </div>

            {openSection === 'personal' && (
              <div className="section-content">
                <div className="register-grid">
                  <div className="input-group">
                    <label>Nombre</label>
                    <input name="firstName" value={form.firstName} onChange={handleChange} />
                  </div>

                  <div className="input-group">
                    <label>Segundo Nombre</label>
                    <input name="middleName" value={form.middleName} onChange={handleChange} />
                  </div>

                  <div className="input-group">
                    <label>Apellido</label>
                    <input name="lastName" value={form.lastName} onChange={handleChange} />
                  </div>
                </div>

                {/* SEX SELECTOR */}
                <div className="sex-selector">
                  <label>Sexo</label>
                  <div className="sex-options">
                    {['male', 'female', 'other'].map((option) => (
                      <button
                        key={option}
                        type="button"
                        className={`sex-button ${form.sex === option ? 'sex-selected' : ''}`}
                        onClick={() => setForm({ ...form, sex: option as Sex })}
                      >
                        {option === 'male' && 'Masculino'}
                        {option === 'female' && 'Femenino'}
                        {option === 'other' && 'Otro'}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* ================= CREDENTIALS ================= */}
          <div className="register-section">
            <div
              className={`section-header ${
                isSectionComplete('credentials') ? 'section-complete' : ''
              }`}
              onClick={() => toggleSection('credentials')}
            >
              🔐 Credenciales
            </div>

            {openSection === 'credentials' && (
              <div className="section-content">
                <div className="register-grid">
                  <div className="input-group">
                    <label>Usuario</label>
                    <input name="username" value={form.username} onChange={handleChange} />
                  </div>

                  <div className="input-group">
                    <label>Contraseña</label>
                    <input
                      type="password"
                      name="password"
                      value={form.password}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="input-group">
                    <label>Confirmar Contraseña</label>
                    <input
                      type="password"
                      name="confirmPassword"
                      value={form.confirmPassword}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* ================= CONTACT ================= */}
          <div className="register-section">
            <div
              className={`section-header ${isSectionComplete('contact') ? 'section-complete' : ''}`}
              onClick={() => toggleSection('contact')}
            >
              📩 Contacto
            </div>

            {openSection === 'contact' && (
              <div className="section-content">
                <div className="register-grid">
                  <div className="input-group">
                    <label>Email</label>
                    <input type="email" name="email" value={form.email} onChange={handleChange} />
                  </div>

                  <div className="input-group">
                    <label>Teléfono</label>
                    <PhoneInput
                      defaultCountry="AR"
                      value={form.phone}
                      onChange={(value) => setForm({ ...form, phone: value || '' })}
                      className="phone-input"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          <button type="submit" className="register-button" disabled={!isFormComplete}>
            Crear Cuenta
          </button>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;
