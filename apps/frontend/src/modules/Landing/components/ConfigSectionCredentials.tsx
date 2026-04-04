import React, { useState, useEffect } from 'react';
import { useAppStore } from '../../../appStore';
import { useToastStore } from '../../../toastStore';
import { sdk } from '../../../tools/sdk';
import { GlobalProfileCard } from '../../../components/shared/GlobalProfileCard';
import { EditIcon } from '../../../components/shared/AppIcons';

type EditingState =
  | null
  | 'name'
  | 'sname'
  | 'lname'
  | 'username'
  | 'sex'
  | 'EMAIL_CHANGE'
  | 'PHONE_CHANGE'
  | 'PASSWORD_CHANGE';

interface Address {
  id: string;
  street: string;
  number: string;
  floorApt?: string;
  notes?: string;
  isDefault: boolean;
}

export const ConfigSectionCredentials = () => {
  const { user, setUser } = useAppStore();
  const { error, success } = useToastStore();

  const [editing, setEditing] = useState<EditingState>(null);
  const [form, setForm] = useState({
    name: '',
    sname: '',
    lname: '',
    username: '',
    sex: 'OTHER' as 'MALE' | 'FEMALE' | 'OTHER',
  });

  const [loading, setLoading] = useState(false);

  // Sync form with user data
  useEffect(() => {
    if (user && !editing) {
      setForm({
        name: user.name || '',
        sname: user.sname || '',
        lname: user.lname || '',
        username: user.username || '',
        sex: user.sex || 'OTHER',
      });
    }
  }, [user, editing]);

  // Security flows
  const [targetVal, setTargetVal] = useState('');
  const [token, setToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [cpassword, setCpassword] = useState('');

  const [mode, setMode] = useState<'view' | 'requesting' | 'verifying'>('view');

  // Addresses State
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [addressForm, setAddressForm] = useState({
    street: '',
    number: '',
    floorApt: '',
    notes: '',
    isDefault: false,
  });

  useEffect(() => {
    if (user) {
      fetchAddresses();
    }
  }, [user]);

  const fetchAddresses = async () => {
    try {
      const res = await sdk.customers.addresses({});
      if ('data' in res && res.data) setAddresses(res.data as Address[]);
    } catch {
      // Fallback
    }
  };

  const handleCreateAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await sdk.customers.postAddresses(addressForm);
      if ('data' in res) {
        success('Domicilio agregado exitosamente');
        setShowAddressForm(false);
        setAddressForm({ street: '', number: '', floorApt: '', notes: '', isDefault: false });
        fetchAddresses();
      }
    } catch {
      error('Hubo un error al guardar el domicilio');
    } finally {
      setLoading(false);
    }
  };

  const updateSimpleField = async (field: keyof typeof form) => {
    setLoading(true);
    try {
      const res = await sdk.iam.patchMe({ [field]: form[field] });
      if ('data' in res && res.data) {
        setUser(res.data);
        success('Dato actualizado');
        setEditing(null);
      }
    } catch {
      error('Hubo un error al actualizar el dato');
    } finally {
      setLoading(false);
    }
  };

  const startSecurityChange = (type: 'EMAIL_CHANGE' | 'PHONE_CHANGE' | 'PASSWORD_CHANGE') => {
    setEditing(type);
    setMode('requesting');
    setTargetVal('');
    setToken('');
    setNewPassword('');
    setCpassword('');
  };

  const cancel = () => {
    setMode('view');
    setEditing(null);
  };

  const requestToken = async () => {
    setLoading(true);
    try {
      await sdk.iam['request-token']({ type: editing as 'EMAIL_CHANGE' | 'PHONE_CHANGE' | 'PASSWORD_CHANGE', targetVal });
      setMode('verifying');
      success('Se ha enviado un token/link de verificación.');
    } catch {
      error('Ocurrió un error al solicitar la verificación.');
    } finally {
      setLoading(false);
    }
  };

  const verifyToken = async () => {
    setLoading(true);
    try {
      const res = await sdk.iam['verify-update']({
        type: editing as 'EMAIL_CHANGE' | 'PHONE_CHANGE' | 'PASSWORD_CHANGE',
        token,
        newPassword,
        cpassword,
      });
      if ('data' in res && res.data) setUser(res.data);
      setMode('view');
      success('Actualización completada exitosamente.');
      setEditing(null);
    } catch {
      error('El token ingresado es inválido o se produjo un error al actualizar datos.');
    } finally {
      setLoading(false);
    }
  };

  const renderFieldRow = (label: string, field: keyof typeof form) => {
    const isEditing = editing === field;
    if (!user) return null;

    const displayValue = field === 'sex'
      ? (user.sex === 'MALE' ? 'MASCULINO' : user.sex === 'FEMALE' ? 'FEMENINO' : 'OTRO')
      : (user[field as keyof typeof user] as string) || 'NO DEFINIDO';

    return (
      <div key={field} className="p-5 border-4 border-qart-border bg-qart-surface flex flex-col gap-2 relative group shadow-sharp hover:translate-y-[-2px] transition-transform">
        <div className="flex justify-between items-start">
          <div className="w-full">
            <h3 className="text-[10px] font-black uppercase tracking-widest text-qart-text-muted mb-2">{label}</h3>
            {isEditing ? (
              <div className="flex flex-col sm:flex-row items-center gap-3 mt-2 w-full">
                {field === 'sex' ? (
                  <select
                    className="input-base flex-1"
                    value={form[field]}
                    onChange={(e) => setForm({ ...form, [field]: e.target.value as 'MALE' | 'FEMALE' | 'OTHER' })}
                  >
                    <option value="MALE">MASCULINO</option>
                    <option value="FEMALE">FEMENINO</option>
                    <option value="OTHER">OTRO</option>
                  </select>
                ) : (
                  <input
                    className="input-base flex-1"
                    value={form[field]}
                    onChange={(e) => setForm({ ...form, [field]: e.target.value })}
                    autoFocus
                  />
                )}
                <div className="flex gap-2 w-full sm:w-auto">
                  <button
                    onClick={() => updateSimpleField(field)}
                    disabled={loading}
                    className="btn-primary flex-1 sm:flex-initial py-2! px-6! min-h-0! text-[11px]!"
                  >
                    LISTO
                  </button>
                  <button onClick={cancel} className="btn-outline flex-1 sm:flex-initial py-2! px-6! min-h-0! text-[11px]!">
                    X
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between group/row min-h-8">
                <span className="text-xl font-black uppercase tracking-tighter text-qart-primary truncate">
                  {displayValue}
                </span>
                <button
                  onClick={() => {
                    setForm({ ...form, [field]: (user as unknown as Record<string, string | null>)[field] || '' });
                    setEditing(field);
                  }}
                  className="w-10 h-10 flex items-center justify-center border-2 border-qart-border bg-qart-bg-warm hover:bg-qart-primary hover:text-white transition-all opacity-0 group-hover/row:opacity-100"
                >
                  <EditIcon className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderSecurityRow = (
    label: string,
    fieldType: 'EMAIL_CHANGE' | 'PHONE_CHANGE' | 'PASSWORD_CHANGE',
    value: string,
    badge?: React.ReactNode,
  ) => {
    if (!user) return null;

    return (
      <div key={fieldType} className="p-6 border-4 border-qart-border bg-qart-surface flex flex-col gap-4 relative group shadow-sharp hover:translate-y-[-2px] transition-transform">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="w-full">
            <h3 className="text-[10px] font-black uppercase tracking-widest text-qart-text-muted mb-2">
              {label}
            </h3>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4 overflow-hidden">
                <span className="text-xl font-black uppercase tracking-tighter text-qart-primary truncate">
                  {value}
                </span>
                {badge}
              </div>
              <button
                onClick={() => startSecurityChange(fieldType)}
                className="w-10 h-10 flex items-center justify-center border-2 border-qart-border bg-qart-bg-warm hover:bg-qart-primary hover:text-white transition-all opacity-0 group-hover:opacity-100"
              >
                <EditIcon className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (!user) {
    return (
      <div className="p-20 flex flex-col items-center justify-center border-4 border-dashed border-qart-primary bg-qart-bg-warm animate-pulse">
        <span className="text-2xl font-black uppercase tracking-[0.3em] text-qart-primary">Cargando Datos...</span>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 xl:grid-cols-[1fr_400px] gap-12 items-start relative pb-20">
      <div className="order-2 xl:order-1 space-y-16">
        {mode === 'view' ? (
          <>
            <section className="space-y-8">
              <div className="flex items-center gap-4">
                <div className="w-2.5 h-10 bg-qart-accent shadow-sharp" />
                <h2 className="text-3xl font-black uppercase tracking-tight text-qart-primary">
                  Mis Datos <span className="text-qart-accent">Personales</span>
                </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {renderFieldRow('Nombre', 'name')}
                {renderFieldRow('Segundo Nombre', 'sname')}
                {renderFieldRow('Apellido', 'lname')}
                {renderFieldRow('Género', 'sex')}
                {renderFieldRow('Nombre de Usuario', 'username')}
              </div>
            </section>

            <section className="space-y-8">
              <div className="flex items-center gap-4">
                <div className="w-2.5 h-10 bg-qart-accent shadow-sharp" />
                <h2 className="text-3xl font-black uppercase tracking-tight text-qart-primary">
                  Seguridad <span className="text-qart-accent">&</span> Acceso
                </h2>
              </div>
              <div className="grid grid-cols-1 gap-6">
                {renderSecurityRow(
                  'Correo Electrónico',
                  'EMAIL_CHANGE',
                  user.email,
                  user.emailVerified ? (
                    <div className="w-6 h-6 bg-qart-success border-2 border-qart-border flex items-center justify-center shadow-[2px_2px_0_var(--qart-border)]">
                      <span className="text-white text-[10px] font-black">✓</span>
                    </div>
                  ) : (
                    <span className="text-[9px] font-black bg-qart-error text-white px-2 py-0.5 border-2 border-qart-border shadow-[2px_2px_0_var(--qart-border)] uppercase tracking-tighter">
                      POR VERIFICAR
                    </span>
                  ),
                )}
                {renderSecurityRow(
                  'Número de Teléfono',
                  'PHONE_CHANGE',
                  user.phone || 'NO REGISTRADO',
                  user.phone ? (
                    user.phoneVerified ? (
                      <div className="w-6 h-6 bg-qart-success border-2 border-qart-border flex items-center justify-center shadow-[2px_2px_0_var(--qart-border)]">
                        <span className="text-white text-[10px] font-black">✓</span>
                      </div>
                    ) : (
                      <span className="text-[9px] font-black bg-qart-error text-white px-2 py-0.5 border-2 border-qart-border shadow-[2px_2px_0_var(--qart-border)] uppercase tracking-tighter">
                        POR VERIFICAR
                      </span>
                    )
                  ) : null,
                )}
                {renderSecurityRow('Contraseña', 'PASSWORD_CHANGE', '••••••••••••')}
              </div>
            </section>

            <section className="space-y-8">
              <div className="flex items-center gap-4">
                <div className="w-2.5 h-10 bg-qart-accent shadow-sharp" />
                <h2 className="text-3xl font-black uppercase tracking-tight text-qart-primary">
                  Mis <span className="text-qart-accent">Direcciones</span>
                </h2>
              </div>
              <div className="space-y-6">
                {addresses.length === 0 && !showAddressForm ? (
                  <div className="p-12 bg-qart-bg-warm border-4 border-dashed border-qart-border text-qart-text-muted text-xs font-black uppercase tracking-[0.3em] text-center">
                    No hay direcciones registradas
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-4">
                    {addresses.map((addr) => (
                      <div
                        key={addr.id}
                        className="p-6 border-4 border-qart-border bg-qart-surface flex justify-between items-center group shadow-sharp hover:translate-x-2 transition-transform"
                      >
                        <div>
                          <div className="font-black text-2xl uppercase tracking-tighter text-qart-primary leading-none mb-2">
                            {addr.street} {addr.number}
                          </div>
                          <div className="text-[10px] font-black text-qart-text-muted uppercase tracking-widest flex items-center gap-3">
                            {addr.floorApt && (
                              <span className="bg-qart-bg-warm px-2 py-0.5 border border-qart-border">PISO/DEPTO: {addr.floorApt}</span>
                            )}
                            {addr.notes && (
                              <span className="opacity-70 italic tracking-tight">{addr.notes}</span>
                            )}
                          </div>
                        </div>
                        {addr.isDefault && (
                          <span className="text-[9px] font-black bg-qart-accent text-white px-3 py-1 border-2 border-qart-border shadow-sharp uppercase tracking-widest">
                            PRINCIPAL
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {!showAddressForm ? (
                  <button
                    onClick={() => setShowAddressForm(true)}
                    className="btn-outline w-full text-xs! font-black! tracking-[0.2em]!"
                  >
                    + AGREGAR NUEVA DIRECCIÓN
                  </button>
                ) : (
                  <form
                    onSubmit={handleCreateAddress}
                    className="p-10 border-4 border-qart-primary bg-qart-surface space-y-8 mt-6 relative shadow-[12px_12px_0_var(--qart-primary)]"
                  >
                    <button
                      type="button"
                      onClick={() => setShowAddressForm(false)}
                      className="absolute top-6 right-8 w-10 h-10 border-2 border-qart-border bg-qart-bg-warm font-black text-qart-text-muted hover:text-qart-error hover:border-qart-error transition-all"
                    >
                      X
                    </button>
                    <h3 className="text-xl font-black uppercase tracking-tighter text-qart-primary border-b-4 border-qart-accent w-fit pr-8 pb-1">
                      Nuevo Domicilio
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                      <div className="space-y-3">
                        <label className="block text-[10px] font-black uppercase tracking-widest text-qart-text-muted">
                          Calle
                        </label>
                        <input
                          required
                          className="input-base"
                          value={addressForm.street}
                          onChange={(e) =>
                            setAddressForm({ ...addressForm, street: e.target.value })
                          }
                        />
                      </div>
                      <div className="space-y-3">
                        <label className="block text-[10px] font-black uppercase tracking-widest text-qart-text-muted">
                          Número
                        </label>
                        <input
                          required
                          className="input-base"
                          value={addressForm.number}
                          onChange={(e) =>
                            setAddressForm({ ...addressForm, number: e.target.value })
                          }
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                      <div className="space-y-3">
                        <label className="block text-[10px] font-black uppercase tracking-widest text-qart-text-muted">
                          Piso / Depto
                        </label>
                        <input
                          className="input-base"
                          value={addressForm.floorApt}
                          onChange={(e) =>
                            setAddressForm({ ...addressForm, floorApt: e.target.value })
                          }
                        />
                      </div>
                      <div className="flex items-center gap-6 pt-6">
                        <label className="text-[10px] font-black uppercase tracking-widest text-qart-text-muted">
                          ¿Es tu dirección principal?
                        </label>
                        <input
                          type="checkbox"
                          checked={addressForm.isDefault}
                          onChange={(e) =>
                            setAddressForm({ ...addressForm, isDefault: e.target.checked })
                          }
                          className="w-8 h-8 border-4 border-qart-border accent-qart-accent cursor-pointer"
                        />
                      </div>
                    </div>
                    <div className="space-y-3">
                      <label className="block text-[10px] font-black uppercase tracking-widest text-qart-text-muted">
                        Indicaciones para el repartidor
                      </label>
                      <input
                        className="input-base"
                        placeholder="EJ: TIMBRE ROTO, LLAMAR AL LLEGAR..."
                        value={addressForm.notes}
                        onChange={(e) => setAddressForm({ ...addressForm, notes: e.target.value })}
                      />
                    </div>
                    <div className="pt-6 flex justify-end">
                      <button type="submit" disabled={loading} className="btn-primary w-full sm:w-auto px-16!">
                        GUARDAR DIRECCIÓN
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </section>
          </>
        ) : (
          <div className="p-10 border-4 border-qart-primary bg-qart-surface space-y-10 shadow-[16px_16px_0_var(--qart-primary)] relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-2 bg-qart-accent" />
            <div className="flex items-center gap-4">
               <div className="w-12 h-12 bg-qart-accent border-2 border-qart-border shadow-sharp flex items-center justify-center shrink-0">
                  <span className="text-white text-2xl font-black">!</span>
               </div>
               <h2 className="text-3xl font-black uppercase tracking-tighter text-qart-primary leading-none">
                 Validación de Seguridad
               </h2>
            </div>
            
            {mode === 'requesting' && (
              <div className="space-y-10">
                <div className="p-6 bg-qart-bg-warm border-l-8 border-qart-accent text-sm font-black text-qart-primary leading-relaxed uppercase tracking-tight">
                  Para tu seguridad, necesitamos enviarte un código de 6 dígitos antes de realizar este cambio.
                </div>
                {editing !== 'PASSWORD_CHANGE' && (
                  <div className="space-y-4">
                    <label className="block text-[10px] font-black uppercase tracking-widest text-qart-text-muted">
                      Ingresa el nuevo {editing === 'EMAIL_CHANGE' ? 'Email' : 'Teléfono'} (Opcional)
                    </label>
                    <input
                      className="input-base text-xl font-bold"
                      value={targetVal}
                      onChange={(e) => setTargetVal(e.target.value)}
                      placeholder="Dejar vacío para verificar el actual..."
                    />
                  </div>
                )}
                <div className="flex flex-col sm:flex-row gap-4 pt-6">
                  <button onClick={requestToken} disabled={loading} className="btn-primary flex-1 py-5!">
                    ENVIAR CÓDIGO
                  </button>
                  <button onClick={cancel} className="btn-outline flex-1 py-5!">
                    VOLVER
                  </button>
                </div>
              </div>
            )}
            {mode === 'verifying' && (
              <div className="space-y-10">
                <div className="p-6 bg-qart-success/10 border-l-8 border-qart-success text-sm font-black text-qart-success leading-relaxed uppercase tracking-tight">
                  TE HEMOS ENVIADO UN PIN POR CORREO. POR FAVOR, INGRÉSALO DEBAJO.
                </div>
                <div className="space-y-6">
                  <label className="block text-xs font-black uppercase tracking-[0.4em] text-center text-qart-text-muted">
                    PIN DE 6 DÍGITOS
                  </label>
                  <input
                    className="input-base font-mono tracking-[1em] text-5xl text-center font-black h-24! border-4! shadow-sharp"
                    maxLength={6}
                    value={token}
                    onChange={(e) => setToken(e.target.value.toUpperCase())}
                    placeholder="000000"
                  />
                </div>
                {editing === 'PASSWORD_CHANGE' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-3">
                      <label className="block text-[10px] font-black uppercase tracking-widest text-qart-text-muted">
                        Nueva Contraseña
                      </label>
                      <input
                        type="password"
                        placeholder="••••••••"
                        className="input-base"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                      />
                    </div>
                    <div className="space-y-3">
                      <label className="block text-[10px] font-black uppercase tracking-widest text-qart-text-muted">
                        Confirmar Nueva Contraseña
                      </label>
                      <input
                        type="password"
                        placeholder="••••••••"
                        className="input-base"
                        value={cpassword}
                        onChange={(e) => setCpassword(e.target.value)}
                      />
                    </div>
                  </div>
                )}
                <div className="flex flex-col sm:flex-row gap-4 pt-6">
                  <button
                    onClick={verifyToken}
                    disabled={loading || token.length !== 6}
                    className="btn-primary flex-1 py-5!"
                  >
                    CONFIRMAR CAMBIO
                  </button>
                  <button onClick={cancel} className="btn-outline flex-1 py-5!">
                    CANCELAR
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="order-1 xl:order-2 sticky top-[120px] transition-all hover:translate-y-[-5px]">
        <div className="flex items-center gap-3 mb-6">
           <div className="w-8 h-1.5 bg-qart-primary" />
           <h3 className="text-sm font-black uppercase text-qart-text-muted tracking-[0.3em] overflow-hidden whitespace-nowrap">
             Mi Perfil Actual
           </h3>
        </div>
        <GlobalProfileCard />
        
        <div className="mt-8 p-6 border-4 border-dashed border-qart-border-subtle bg-qart-bg-warm/30">
           <p className="text-[10px] font-black text-qart-text-muted uppercase leading-relaxed tracking-widest">
             <span className="text-qart-accent">NOTA:</span> El sistema de restaurant no es una red social. Tus datos son privados y solo se utilizan para facturación y envío.
           </p>
        </div>
      </div>
    </div>
  );
};
