/**
 * @file ConfigSectionCredentials.tsx
 * @module Landing
 * @description Archivo ConfigSectionCredentials alineado a la arquitectura y trazabilidad QART.
 *
 * @tfi
 * section: IEEE 830 11
 * rf: RF-18
 * rnf: RNF-03
 *
 * @business
 * inputs: props de presentacion, estado derivado y callbacks
 * outputs: bloques de UI interactivos reutilizables
 * rules: mantener componentes composables y sin logica persistente
 *
 * @technical
 * dependencies: react, appStore, env, SectionFactory, GlobalProfileCard, AppIcons, toastStore, sdk
 * flow: recibe props o estado derivado; calcula etiquetas, listas o variantes visuales; renderiza la seccion interactiva; delega eventos a callbacks, stores o modales del nivel superior.
 *
 * @estimation
 * complexity: Medium
 * fpa: EQ
 * story_points: 3
 * estimated_hours: 2
 *
 * @testing
 * cases: TC-AUDIT-01
 *
 * @notes
 * decisions: se prioriza composicion de interfaz y reutilizacion de piezas visuales
 */
import { useCallback, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../../../appStore';
import { MODE } from '../../../qartEnv';
import { SectionFactory } from '../../../components/shared/SectionFactory';
import { GlobalProfileCard } from '../../../components/shared/GlobalProfileCard';
import { ArrowRightIcon, CopyIcon, EditIcon } from '../../../components/shared/AppIcons';
import { useToastStore } from '../../../toastStore';
import { sdk } from '../../../tools/sdk';

type ProfileFieldKey = 'name' | 'sname' | 'lname' | 'username' | 'sex';
type SecurityFieldType = 'EMAIL_CHANGE' | 'PHONE_CHANGE' | 'PASSWORD_CHANGE';
type EditingState = null | ProfileFieldKey;
type SecurityIntent = 'verify' | 'change' | 'password';
type ConfigViewMode = 'view' | 'requesting' | 'verifying';

interface Address {
  id: string;
  street: string;
  number: string;
  floorApt: string | null;
  notes: string | null;
  isDefault: boolean;
}

interface AddressDraft {
  id: string | null;
  street: string;
  number: string;
  floorApt: string;
  notes: string;
  isDefault: boolean;
}

interface SecurityFlow {
  type: SecurityFieldType;
  intent: SecurityIntent;
}

interface CredentialAction {
  key: string;
  label: string;
  onClick: () => void;
  variant?: 'primary' | 'secondary' | 'ghost';
  icon?: ReactNode;
  disabled?: boolean;
}

interface CredentialRowProps {
  label: string;
  value: string;
  helper?: string;
  badge?: ReactNode;
  actions?: CredentialAction[];
}

const EMPTY_ADDRESS_DRAFT: AddressDraft = {
  id: null,
  street: '',
  number: '',
  floorApt: '',
  notes: '',
  isDefault: false,
};

const SECURITY_COPY = {
  EMAIL_CHANGE: {
    verify: {
      title: 'Verificar correo electronico',
      lead: 'Vamos a enviarte un codigo por email para confirmar que ese canal te pertenece.',
      deliveryLabel: 'email',
      codeLabel: 'Codigo enviado por email',
    },
    change: {
      title: 'Cambiar correo electronico',
      lead: 'Primero indica el nuevo correo y luego confirmalo con un codigo de verificacion.',
      targetLabel: 'Nuevo correo electronico',
      targetPlaceholder: 'correo@dominio.com',
      deliveryLabel: 'email',
      codeLabel: 'Codigo enviado por email',
    },
    password: {
      title: 'Correo electronico',
      lead: '',
      deliveryLabel: 'email',
      codeLabel: 'Codigo',
    },
  },
  PHONE_CHANGE: {
    verify: {
      title: 'Verificar telefono',
      lead: 'Te vamos a mandar un SMS con un codigo para validar el numero actual.',
      deliveryLabel: 'SMS',
      codeLabel: 'Codigo enviado por SMS',
    },
    change: {
      title: 'Cambiar telefono',
      lead: 'Indica el nuevo numero y validalo con un SMS antes de guardarlo.',
      targetLabel: 'Nuevo telefono',
      targetPlaceholder: '+54 9 ...',
      deliveryLabel: 'SMS',
      codeLabel: 'Codigo enviado por SMS',
    },
    password: {
      title: 'Telefono',
      lead: '',
      deliveryLabel: 'SMS',
      codeLabel: 'Codigo',
    },
  },
  PASSWORD_CHANGE: {
    verify: {
      title: 'Contrasena',
      lead: '',
      deliveryLabel: 'canal seguro',
      codeLabel: 'Codigo',
    },
    change: {
      title: 'Contrasena',
      lead: '',
      deliveryLabel: 'canal seguro',
      codeLabel: 'Codigo',
    },
    password: {
      title: 'Cambiar contrasena',
      lead: 'Te pedimos un codigo de seguridad antes de permitir la actualizacion de tu contrasena.',
      deliveryLabel: 'canal seguro',
      codeLabel: 'Codigo de seguridad',
    },
  },
} as const;

const formatSex = (sex: 'MALE' | 'FEMALE' | 'OTHER') =>
  sex === 'MALE' ? 'Masculino' : sex === 'FEMALE' ? 'Femenino' : 'Otro';

const formatTier = (tier?: string) =>
  tier === 'PREMIUM' ? 'Cliente Premium' : tier === 'VIP' ? 'Cliente VIP' : 'Cliente Regular';

const VerificationBadge = ({ verified }: { verified: boolean }) =>
  verified ? (
    <span className="border border-qart-border bg-qart-success px-2.5 py-1 text-[9px] font-black uppercase tracking-[0.12em] text-white">
      Verificado
    </span>
  ) : (
    <span className="border border-qart-border bg-qart-error px-2.5 py-1 text-[9px] font-black uppercase tracking-[0.12em] text-white">
      Pendiente
    </span>
  );

const ActionButton = ({
  label,
  onClick,
  variant = 'ghost',
  icon,
  disabled = false,
}: CredentialAction) => (
  <button
    type="button"
    onClick={onClick}
    disabled={disabled}
    className={
      variant === 'primary'
        ? 'btn-primary min-h-0! px-4! py-2.5! text-[10px]! tracking-[0.12em]! cursor-pointer disabled:cursor-not-allowed'
        : variant === 'secondary'
          ? 'btn-outline min-h-0! px-4! py-2.5! text-[10px]! tracking-[0.12em]! cursor-pointer disabled:cursor-not-allowed'
          : 'inline-flex cursor-pointer items-center gap-2 border border-qart-border bg-qart-bg-warm px-3 py-2 text-[10px] font-black uppercase tracking-[0.12em] text-qart-primary transition-colors hover:bg-qart-primary hover:text-white disabled:cursor-not-allowed'
    }
  >
    {icon}
    {label}
  </button>
);

const CredentialRow = ({ label, value, helper, badge, actions = [] }: CredentialRowProps) => (
  <article className="overflow-hidden rounded-none border border-qart-border bg-qart-surface">
    <div className="grid grid-cols-1 lg:grid-cols-[190px_minmax(0,1fr)]">
      <div className="border-b border-qart-border bg-qart-bg-warm px-4 py-3.5 lg:border-b-0 lg:border-r">
        <p className="text-[10px] font-black uppercase tracking-[0.14em] text-qart-text-muted">
          {label}
        </p>
      </div>

      <div className="space-y-3 px-4 py-4 md:px-5">
        <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
          <div className="min-w-0 space-y-1.5">
            <div className="flex flex-wrap items-center gap-3">
              <p className="break-words text-base font-black tracking-tight text-qart-primary md:text-lg">
                {value}
              </p>
              {badge}
            </div>
            {helper && (
              <p className="text-sm font-medium leading-relaxed text-qart-text-muted">{helper}</p>
            )}
          </div>

          {actions.length > 0 && (
            <div className="flex flex-wrap gap-2 xl:justify-end">
              {actions.map(({ key, ...action }) => (
                <ActionButton key={key} {...action} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  </article>
);

export const ConfigSectionCredentials = () => {
  const { user, setUser } = useAppStore();
  const { error, success, warning } = useToastStore();
  const navigate = useNavigate();

  const [editing, setEditing] = useState<EditingState>(null);
  const [securityFlow, setSecurityFlow] = useState<SecurityFlow | null>(null);
  const [mode, setMode] = useState<ConfigViewMode>('view');
  const [loading, setLoading] = useState(false);
  const [showAddressForm, setShowAddressForm] = useState(false);

  const [form, setForm] = useState({
    name: '',
    sname: '',
    lname: '',
    username: '',
    sex: 'OTHER' as 'MALE' | 'FEMALE' | 'OTHER',
  });
  const [targetVal, setTargetVal] = useState('');
  const [token, setToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [cpassword, setCpassword] = useState('');
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [addressDraft, setAddressDraft] = useState<AddressDraft>(EMPTY_ADDRESS_DRAFT);

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
  }, [editing, user]);

  const fetchAddresses = useCallback(async () => {
    try {
      const res = await sdk.customers.addresses({});
      if ('data' in res && res.data) setAddresses(res.data as Address[]);
    } catch {
      error('No pudimos cargar tus direcciones.');
    }
  }, [error]);

  useEffect(() => {
    if (!user) return;
    void fetchAddresses();
  }, [fetchAddresses, user]);

  const copyValue = async (label: string, value: string) => {
    if (!value) {
      warning(`No hay valor para copiar en ${label.toLowerCase()}.`);
      return;
    }

    try {
      if (navigator.clipboard?.writeText && window.isSecureContext) {
        await navigator.clipboard.writeText(value);
      } else {
        const textarea = document.createElement('textarea');
        textarea.value = value;
        textarea.setAttribute('readonly', 'true');
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        textarea.style.pointerEvents = 'none';
        document.body.appendChild(textarea);
        textarea.focus();
        textarea.select();
        const copied = document.execCommand('copy');
        document.body.removeChild(textarea);

        if (!copied) throw new Error('copy_failed');
      }

      success(`${label} copiado.`);
    } catch {
      error(`No pudimos copiar ${label.toLowerCase()}.`);
    }
  };

  const resetSecurityFlow = () => {
    setMode('view');
    setSecurityFlow(null);
    setTargetVal('');
    setToken('');
    setNewPassword('');
    setCpassword('');
  };

  const resetAddressDraft = () => {
    setAddressDraft(EMPTY_ADDRESS_DRAFT);
    setShowAddressForm(false);
  };

  const startProfileEdit = (field: ProfileFieldKey) => {
    if (!user) return;
    setMode('view');
    setSecurityFlow(null);
    setEditing(field);
    setForm((current) => ({
      ...current,
      [field]: field === 'sex' ? user.sex || 'OTHER' : (user[field] as string | null) || '',
    }));
  };

  const updateSimpleField = async (field: ProfileFieldKey) => {
    setLoading(true);
    try {
      const res = await sdk.iam.patchMe({ [field]: form[field] });
      if ('data' in res && res.data) {
        setUser(res.data);
        success('Dato actualizado.');
        setEditing(null);
      }
    } catch {
      error('No pudimos actualizar ese dato.');
    } finally {
      setLoading(false);
    }
  };

  const startSecurity = (type: SecurityFieldType, intent: SecurityIntent) => {
    setEditing(null);
    setSecurityFlow({ type, intent });
    setMode('requesting');
    setTargetVal('');
    setToken('');
    setNewPassword('');
    setCpassword('');
  };

  const requestToken = async () => {
    if (!securityFlow) return;
    if (
      securityFlow.intent === 'change' &&
      securityFlow.type !== 'PASSWORD_CHANGE' &&
      !targetVal.trim()
    ) {
      warning('Necesitamos el nuevo valor antes de pedir el token.');
      return;
    }

    setLoading(true);
    try {
      await sdk.iam['request-token']({
        type: securityFlow.type,
        targetVal:
          securityFlow.intent === 'change' && securityFlow.type !== 'PASSWORD_CHANGE'
            ? targetVal.trim()
            : undefined,
      });
      setMode('verifying');
      success(
        `Te enviamos un codigo por ${SECURITY_COPY[securityFlow.type][securityFlow.intent].deliveryLabel}.`,
      );
    } catch {
      error('No pudimos generar el codigo de verificacion.');
    } finally {
      setLoading(false);
    }
  };

  const verifyToken = async () => {
    if (!securityFlow) return;
    if (securityFlow.type === 'PASSWORD_CHANGE' && newPassword !== cpassword) {
      warning('Las contrasenas no coinciden.');
      return;
    }

    setLoading(true);
    try {
      const res = await sdk.iam['verify-update']({
        type: securityFlow.type,
        token,
        newPassword: securityFlow.type === 'PASSWORD_CHANGE' ? newPassword : undefined,
        cpassword: securityFlow.type === 'PASSWORD_CHANGE' ? cpassword : undefined,
      });
      if ('data' in res && res.data) setUser(res.data);
      success('Validacion completada.');
      resetSecurityFlow();
    } catch {
      error('El codigo es invalido o vencio.');
    } finally {
      setLoading(false);
    }
  };

  const openAddressForm = (address?: Address) => {
    if (!address) {
      setAddressDraft(EMPTY_ADDRESS_DRAFT);
      setShowAddressForm(true);
      return;
    }
    setAddressDraft({
      id: address.id,
      street: address.street,
      number: address.number,
      floorApt: address.floorApt ?? '',
      notes: address.notes ?? '',
      isDefault: address.isDefault,
    });
    setShowAddressForm(true);
  };

  const handleAddressSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        street: addressDraft.street,
        number: addressDraft.number,
        floorApt: addressDraft.floorApt || undefined,
        notes: addressDraft.notes || undefined,
        isDefault: addressDraft.isDefault,
      };
      const res = addressDraft.id
        ? await sdk.customers.putAddresses({ id: addressDraft.id, ...payload })
        : await sdk.customers.postAddresses(payload);

      if ('data' in res && res.data) {
        success(addressDraft.id ? 'Direccion actualizada.' : 'Direccion agregada.');
        resetAddressDraft();
        await fetchAddresses();
      }
    } catch {
      error('No pudimos guardar la direccion.');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="p-20 flex flex-col items-center justify-center border-4 border-dashed border-qart-primary bg-qart-bg-warm animate-pulse">
        <span className="text-2xl font-black uppercase tracking-[0.3em] text-qart-primary">
          Cargando datos...
        </span>
      </div>
    );
  }

  const sidePanel = (
    <aside className="space-y-4">
      <div className="flex items-center gap-3">
        <div className="h-1.5 w-8 bg-qart-primary" />
        <h3 className="text-xs font-black uppercase tracking-[0.18em] text-qart-text-muted">
          Perfil activo
        </h3>
      </div>

      <GlobalProfileCard />
    </aside>
  );

  const fullName = [user.name, user.sname, user.lname].filter(Boolean).join(' ');
  const customerTier = user.profile.tier;
  const rankLabel = formatTier(customerTier);
  const activeSecurityCopy = securityFlow
    ? SECURITY_COPY[securityFlow.type][securityFlow.intent]
    : null;

  const fieldEditor = (field: ProfileFieldKey) => (
    <div className="grid grid-cols-1 sm:grid-cols-[minmax(0,1fr)_auto] gap-3 pt-2 border-t border-qart-border-subtle">
      {field === 'sex' ? (
        <select
          className="input-base"
          value={form[field]}
          onChange={(e) =>
            setForm((current) => ({
              ...current,
              [field]: e.target.value as 'MALE' | 'FEMALE' | 'OTHER',
            }))
          }
        >
          <option value="MALE">Masculino</option>
          <option value="FEMALE">Femenino</option>
          <option value="OTHER">Otro</option>
        </select>
      ) : (
        <input
          className="input-base"
          value={form[field]}
          onChange={(e) => setForm((current) => ({ ...current, [field]: e.target.value }))}
          autoFocus
        />
      )}

      <div className="flex flex-wrap gap-2">
        <ActionButton
          key={`save-${field}`}
          label="Guardar"
          variant="primary"
          onClick={() => void updateSimpleField(field)}
          disabled={loading}
        />
        <ActionButton
          key={`cancel-${field}`}
          label="Cancelar"
          variant="secondary"
          onClick={() => setEditing(null)}
        />
      </div>
    </div>
  );

  const editingLabelMap: Record<ProfileFieldKey, string> = {
    name: 'Nombre',
    sname: 'Otros nombres',
    lname: 'Apellido',
    username: 'Nombre de usuario',
    sex: 'Sexo',
  };

  const editPanel = editing ? (
    <div className="overflow-hidden border-2 border-qart-primary bg-qart-surface shadow-[12px_12px_0_var(--qart-primary)]">
      <div className="space-y-4 p-5 md:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.14em] text-qart-text-muted">
              Editar dato
            </p>
            <h3 className="mt-2 text-2xl font-black uppercase tracking-tight text-qart-primary">
              {editingLabelMap[editing]}
            </h3>
            <p className="mt-2 text-sm text-qart-text-muted">
              La edición reemplaza temporalmente la ficha para que el cambio se haga con más foco.
            </p>
          </div>
          <ActionButton
            key="close-edit-panel"
            label="Cerrar"
            variant="secondary"
            onClick={() => setEditing(null)}
          />
        </div>

        {fieldEditor(editing)}
      </div>
    </div>
  ) : null;

  const identityRows = [
    {
      label: 'Nombre',
      value: user.name,
      actions: [
        {
          key: 'copy-name',
          label: 'Copiar',
          icon: <CopyIcon className="w-3.5 h-3.5" />,
          onClick: () => void copyValue('Nombre', user.name),
        },
        {
          key: 'edit-name',
          label: 'Editar',
          variant: 'secondary' as const,
          icon: <EditIcon className="w-3.5 h-3.5" />,
          onClick: () => startProfileEdit('name'),
        },
      ],
    },
    {
      label: 'Otros nombres',
      value: user.sname || 'No definido',
      actions: [
        {
          key: 'copy-sname',
          label: 'Copiar',
          icon: <CopyIcon className="w-3.5 h-3.5" />,
          onClick: () => void copyValue('Otros nombres', user.sname || ''),
          disabled: !user.sname,
        },
        {
          key: 'edit-sname',
          label: user.sname ? 'Editar' : 'Agregar',
          variant: 'secondary' as const,
          icon: <EditIcon className="w-3.5 h-3.5" />,
          onClick: () => startProfileEdit('sname'),
        },
      ],
    },
    {
      label: 'Apellido',
      value: user.lname,
      actions: [
        {
          key: 'copy-lname',
          label: 'Copiar',
          icon: <CopyIcon className="w-3.5 h-3.5" />,
          onClick: () => void copyValue('Apellido', user.lname),
        },
        {
          key: 'edit-lname',
          label: 'Editar',
          variant: 'secondary' as const,
          icon: <EditIcon className="w-3.5 h-3.5" />,
          onClick: () => startProfileEdit('lname'),
        },
      ],
    },
    {
      label: 'Nombre completo',
      value: fullName,
      actions: [
        {
          key: 'copy-fullname',
          label: 'Copiar',
          icon: <CopyIcon className="w-3.5 h-3.5" />,
          onClick: () => void copyValue('Nombre completo', fullName),
        },
      ],
    },
    {
      label: 'Nombre de usuario',
      value: `@${user.username}`,
      actions: [
        {
          key: 'copy-username',
          label: 'Copiar',
          icon: <CopyIcon className="w-3.5 h-3.5" />,
          onClick: () => void copyValue('Nombre de usuario', user.username),
        },
        {
          key: 'edit-username',
          label: 'Editar',
          variant: 'secondary' as const,
          icon: <EditIcon className="w-3.5 h-3.5" />,
          onClick: () => startProfileEdit('username'),
        },
      ],
    },
    {
      label: 'Sexo',
      value: formatSex(user.sex),
      actions: [
        {
          key: 'copy-sex',
          label: 'Copiar',
          icon: <CopyIcon className="w-3.5 h-3.5" />,
          onClick: () => void copyValue('Sexo', formatSex(user.sex)),
        },
        {
          key: 'edit-sex',
          label: 'Editar',
          variant: 'secondary' as const,
          icon: <EditIcon className="w-3.5 h-3.5" />,
          onClick: () => startProfileEdit('sex'),
        },
      ],
    },
  ];

  const securityRows = [
    {
      label: 'Correo electronico',
      value: user.email,
      badge: <VerificationBadge verified={user.emailVerified} />,
      actions: [
        {
          key: 'copy-email',
          label: 'Copiar',
          icon: <CopyIcon className="w-3.5 h-3.5" />,
          onClick: () => void copyValue('Correo electronico', user.email),
        },
        ...(!user.emailVerified
          ? [
              {
                key: 'verify-email',
                label: 'Verificar correo',
                variant: 'secondary' as const,
                onClick: () => startSecurity('EMAIL_CHANGE', 'verify'),
              },
            ]
          : []),
        {
          key: 'change-email',
          label: 'Cambiar correo',
          variant: 'primary' as const,
          onClick: () => startSecurity('EMAIL_CHANGE', 'change'),
        },
      ],
    },
    {
      label: 'Telefono',
      value: user.phone || 'No registrado',
      badge: user.phone ? <VerificationBadge verified={user.phoneVerified} /> : undefined,
      actions: [
        {
          key: 'copy-phone',
          label: 'Copiar',
          icon: <CopyIcon className="w-3.5 h-3.5" />,
          onClick: () => void copyValue('Telefono', user.phone || ''),
          disabled: !user.phone,
        },
        ...(user.phone && !user.phoneVerified
          ? [
              {
                key: 'verify-phone',
                label: 'Verificar telefono',
                variant: 'secondary' as const,
                onClick: () => startSecurity('PHONE_CHANGE', 'verify'),
              },
            ]
          : []),
        {
          key: 'change-phone',
          label: user.phone ? 'Cambiar telefono' : 'Agregar telefono',
          variant: 'primary' as const,
          onClick: () => startSecurity('PHONE_CHANGE', 'change'),
        },
      ],
    },
    {
      label: 'Contrasena',
      value: 'Protegida por seguridad',
      actions: [
        {
          key: 'change-password',
          label: 'Cambiar contrasena',
          variant: 'primary' as const,
          onClick: () => startSecurity('PASSWORD_CHANGE', 'password'),
        },
      ],
    },
    {
      label: 'Rango',
      value: rankLabel,
      helper: 'Los planes y precios ahora viven en Facturacion para separar cuenta de membresias.',
      actions: [
        {
          key: 'copy-rank',
          label: 'Copiar',
          icon: <CopyIcon className="w-3.5 h-3.5" />,
          onClick: () => void copyValue('Rango', rankLabel),
        },
        {
          key: 'plans-rank',
          label: 'Ir a facturacion',
          variant: 'secondary' as const,
          icon: <ArrowRightIcon className="w-3.5 h-3.5" />,
          onClick: () => navigate('/facturacion'),
        },
      ],
    },
  ];

  const sections = [
    {
      key: 'identity',
      content: (
        <div className="space-y-6">
          <div className="flex items-start gap-4">
            <div className="mt-1 h-8 w-1.5 bg-qart-accent" />
            <div>
              <h2 className="text-2xl font-black uppercase tracking-tight text-qart-primary md:text-3xl">
                Datos de la cuenta
              </h2>
              <p className="mt-2 text-sm text-qart-text-muted">
                Vista ordenada de la información que devuelve <code>/iam/me</code>.
              </p>
            </div>
          </div>

          <div className="overflow-hidden border-2 border-qart-primary bg-qart-surface shadow-[10px_10px_0_var(--qart-primary)]">
            <div className="space-y-3 p-4 md:p-5">
              {editPanel}
              {identityRows.map((row) => (
                <CredentialRow key={row.label} {...row} />
              ))}
              {securityRows.map((row) => (
                <CredentialRow key={row.label} {...row} />
              ))}
            </div>
          </div>
        </div>
      ),
    },
    {
      key: 'addresses',
      content: (
        <div className="space-y-6">
          <div className="flex items-start gap-4">
            <div className="mt-1 h-8 w-1.5 bg-qart-accent" />
            <div>
              <h2 className="text-2xl font-black uppercase tracking-tight text-qart-primary md:text-3xl">
                Direcciones
              </h2>
              <p className="mt-2 text-sm text-qart-text-muted">
                Guardá y editá tus domicilios para delivery.
              </p>
            </div>
          </div>

          {addresses.length === 0 && !showAddressForm ? (
            <div className="border-2 border-dashed border-qart-border bg-qart-bg-warm p-10 text-center text-xs font-black uppercase tracking-[0.18em] text-qart-text-muted">
              No hay direcciones registradas
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {addresses.map((address) => (
                <article
                  key={address.id}
                  className="flex flex-col gap-4 border border-qart-border bg-qart-surface p-5 md:flex-row md:items-start md:justify-between"
                >
                  <div className="space-y-3">
                    <h3 className="text-xl font-black uppercase tracking-tight text-qart-primary">
                      {address.street} {address.number}
                    </h3>
                    <div className="flex flex-wrap gap-2 text-[10px] font-black uppercase tracking-[0.12em] text-qart-text-muted">
                      {address.floorApt && (
                        <span className="border border-qart-border bg-qart-bg-warm px-2 py-1">
                          Piso/Depto: {address.floorApt}
                        </span>
                      )}
                      {address.notes && (
                        <span className="border border-qart-border bg-qart-bg-warm px-2 py-1">
                          {address.notes}
                        </span>
                      )}
                      {address.isDefault && (
                        <span className="border border-qart-border bg-qart-accent px-2 py-1 text-white">
                          Principal
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <ActionButton
                      key={`copy-address-${address.id}`}
                      label="Copiar"
                      icon={<CopyIcon className="w-3.5 h-3.5" />}
                      onClick={() =>
                        void copyValue(
                          'Direccion',
                          `${address.street} ${address.number}${address.floorApt ? `, ${address.floorApt}` : ''}${address.notes ? `, ${address.notes}` : ''}`,
                        )
                      }
                    />
                    <ActionButton
                      key={`edit-address-${address.id}`}
                      label="Editar direccion"
                      variant="secondary"
                      onClick={() => openAddressForm(address)}
                    />
                  </div>
                </article>
              ))}
            </div>
          )}

          {!showAddressForm ? (
            <ActionButton
              key="add-address"
              label="Agregar direccion"
              variant="primary"
              onClick={() => openAddressForm()}
            />
          ) : (
            <form
              onSubmit={handleAddressSubmit}
              className="space-y-6 border-2 border-qart-primary bg-qart-surface p-6 shadow-[10px_10px_0_var(--qart-primary)]"
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h3 className="text-xl font-black uppercase tracking-tight text-qart-primary">
                    {addressDraft.id ? 'Editar direccion' : 'Nueva direccion'}
                  </h3>
                  <p className="mt-2 text-sm text-qart-text-muted">
                    Podés marcarla como principal para delivery.
                  </p>
                </div>
                <ActionButton key="close-address-form" label="Cerrar" onClick={resetAddressDraft} />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.14em] text-qart-text-muted">
                    Calle
                  </label>
                  <input
                    required
                    className="input-base"
                    value={addressDraft.street}
                    onChange={(e) =>
                      setAddressDraft((current) => ({ ...current, street: e.target.value }))
                    }
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.14em] text-qart-text-muted">
                    Numero
                  </label>
                  <input
                    required
                    className="input-base"
                    value={addressDraft.number}
                    onChange={(e) =>
                      setAddressDraft((current) => ({ ...current, number: e.target.value }))
                    }
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.14em] text-qart-text-muted">
                    Piso / Depto
                  </label>
                  <input
                    className="input-base"
                    value={addressDraft.floorApt}
                    onChange={(e) =>
                      setAddressDraft((current) => ({ ...current, floorApt: e.target.value }))
                    }
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.14em] text-qart-text-muted">
                    Indicaciones
                  </label>
                  <input
                    className="input-base"
                    value={addressDraft.notes}
                    onChange={(e) =>
                      setAddressDraft((current) => ({ ...current, notes: e.target.value }))
                    }
                    placeholder="TIMBRE ROTO, LLAMAR AL LLEGAR..."
                  />
                </div>
              </div>

              <label className="flex items-center gap-4 border border-qart-border bg-qart-bg-warm p-4">
                <input
                  type="checkbox"
                  checked={addressDraft.isDefault}
                  onChange={(e) =>
                    setAddressDraft((current) => ({ ...current, isDefault: e.target.checked }))
                  }
                  className="w-6 h-6 accent-qart-accent"
                />
                <span className="text-[10px] font-black uppercase tracking-[0.14em] text-qart-primary">
                  Usar como direccion principal
                </span>
              </label>

              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary py-3! px-5! min-h-0! text-[10px]! tracking-[0.18em]!"
                >
                  {addressDraft.id ? 'Guardar cambios' : 'Guardar direccion'}
                </button>
                <ActionButton
                  key="cancel-address"
                  label="Cancelar"
                  variant="secondary"
                  onClick={resetAddressDraft}
                />
              </div>
            </form>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="grid grid-cols-1 items-start gap-6 pb-20 xl:grid-cols-[minmax(0,1fr)_300px] xl:gap-8 2xl:grid-cols-[minmax(0,1fr)_320px]">
      <div className="order-2 min-w-0 space-y-8 xl:order-1">
        {editing ? (
          editPanel
        ) : mode === 'view' ? (
          <SectionFactory sections={sections} className="space-y-10" />
        ) : (
          <div className="space-y-6 border-2 border-qart-primary bg-qart-surface p-6 shadow-[12px_12px_0_var(--qart-primary)]">
            <div className="flex items-center gap-4">
              <div className="flex h-11 w-11 items-center justify-center border border-qart-border bg-qart-accent">
                <span className="text-white text-2xl font-black">!</span>
              </div>
              <div>
                <h2 className="text-2xl font-black uppercase tracking-tight text-qart-primary md:text-3xl">
                  {activeSecurityCopy?.title}
                </h2>
                <p className="mt-2 text-sm text-qart-text-muted">
                  Verificación y cambio se manejan por separado.
                </p>
              </div>
            </div>

            {mode === 'requesting' && activeSecurityCopy && (
              <div className="space-y-6">
                <div className="border-l-4 border-qart-accent bg-qart-bg-warm p-5">
                  <p className="text-sm font-black text-qart-primary leading-relaxed">
                    {activeSecurityCopy.lead}
                  </p>
                  {MODE === 'dev' && (
                    <p className="mt-3 text-xs text-qart-text-muted">
                      En desarrollo, el codigo tambien se imprime en la consola del backend.
                    </p>
                  )}
                </div>

                {'targetLabel' in activeSecurityCopy && activeSecurityCopy.targetLabel && (
                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-[0.14em] text-qart-text-muted">
                      {activeSecurityCopy.targetLabel}
                    </label>
                    <input
                      className="input-base"
                      value={targetVal}
                      onChange={(e) => setTargetVal(e.target.value)}
                      placeholder={activeSecurityCopy.targetPlaceholder}
                    />
                  </div>
                )}

                <div className="flex flex-col sm:flex-row gap-3">
                  <ActionButton
                    key="request-token"
                    label="Solicitar token"
                    variant="primary"
                    onClick={() => void requestToken()}
                    disabled={loading}
                  />
                  <ActionButton
                    key="cancel-security-request"
                    label="Volver"
                    variant="secondary"
                    onClick={resetSecurityFlow}
                  />
                </div>
              </div>
            )}

            {mode === 'verifying' && activeSecurityCopy && (
              <div className="space-y-6">
                <div className="border-l-4 border-qart-success bg-qart-success/10 p-5">
                  <p className="text-sm font-black text-qart-success leading-relaxed">
                    Ingresa el codigo recibido para confirmar la operacion.
                  </p>
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-[0.14em] text-qart-text-muted">
                    {activeSecurityCopy.codeLabel}
                  </label>
                  <input
                    className="input-base font-mono tracking-[0.6em] text-3xl text-center font-black h-20!"
                    maxLength={6}
                    value={token}
                    onChange={(e) => setToken(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    placeholder="000000"
                  />
                </div>

                {securityFlow?.type === 'PASSWORD_CHANGE' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-[0.14em] text-qart-text-muted">
                        Nueva contrasena
                      </label>
                      <input
                        type="password"
                        className="input-base"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-[0.14em] text-qart-text-muted">
                        Confirmar contrasena
                      </label>
                      <input
                        type="password"
                        className="input-base"
                        value={cpassword}
                        onChange={(e) => setCpassword(e.target.value)}
                      />
                    </div>
                  </div>
                )}

                <div className="flex flex-col sm:flex-row gap-3">
                  <ActionButton
                    key="confirm-security"
                    label="Confirmar"
                    variant="primary"
                    onClick={() => void verifyToken()}
                    disabled={loading || token.length !== 6}
                  />
                  <ActionButton
                    key="cancel-security"
                    label="Cancelar"
                    variant="secondary"
                    onClick={resetSecurityFlow}
                  />
                </div>
              </div>
            )}
          </div>
        )}
      </div>
      <div className="order-1 min-w-0 xl:order-2 xl:self-start xl:sticky xl:top-[112px]">
        {sidePanel}
      </div>
    </div>
  );
};
