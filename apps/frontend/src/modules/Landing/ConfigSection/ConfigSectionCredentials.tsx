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
import { useAppStore } from '@/shared/store/appStore';
import { useToastStore } from '@/shared/store/toastStore';
import { ArrowRightIcon, CopyIcon, EditIcon } from '@/shared/ui/AppIcons';
import { SectionFactory } from '@/shared/ui/SectionFactory';
import { ProfileCard as GlobalProfileCard } from '@/shared/ui/ProfileCard';
import { MODE } from '@/shared/utils/qartEnv';
import { sdk } from '@/shared/utils/sdk';
import { inputStyles } from '@/styles/components/input';
import {
  settingsActionButtonStyles,
  settingsStyles,
  settingsVerificationBadgeStyles,
} from '@/styles/modules/settings';
import { cn } from '@/styles/utils/cn';

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
  (
    <span className={settingsVerificationBadgeStyles({ verified })}>
      {verified ? 'Verificado' : 'Pendiente'}
    </span>
  );

const ActionButton = ({
  label,
  onClick,
  variant = 'ghost',
  icon,
  hideLabel = false,
  disabled = false,
}: CredentialAction & { hideLabel?: boolean }) => (
  <button
    type="button"
    onClick={onClick}
    disabled={disabled}
    title={hideLabel ? label : undefined}
    className={settingsActionButtonStyles({
      tone: variant === 'primary' ? 'primary' : variant === 'secondary' ? 'secondary' : 'ghost',
    })}
  >
    {icon}
    {!hideLabel && label}
  </button>
);

const CredentialRow = ({ label, value, helper, badge, actions = [] }: CredentialRowProps) => (
  <article className={settingsStyles.rowCard}>
    <div className={settingsStyles.rowGrid}>
      <div className={settingsStyles.rowLabelWrap}>
        <p className={settingsStyles.rowLabel}>
          {label}
        </p>
      </div>

      <div className={settingsStyles.rowBody}>
        <div className={settingsStyles.rowBodyTop}>
          <div className={settingsStyles.rowValueWrap}>
            <div className={settingsStyles.rowValueTop}>
              <p className={settingsStyles.rowValue}>
                {value}
              </p>
              {badge}
            </div>
            {helper && (
              <p className={settingsStyles.rowHelper}>{helper}</p>
            )}
          </div>

          {actions.length > 0 && (
            <div className={settingsStyles.actionRow}>
              {actions.map(({ key, ...action }) => (
                <ActionButton
                  key={key}
                  {...action}
                  hideLabel={action.label === 'Copiar' || action.label === 'Editar'}
                />
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
      <div className={settingsStyles.credentialsLoading}>
        <span className={settingsStyles.credentialsLoadingText}>
          Cargando datos...
        </span>
      </div>
    );
  }

  const sidePanel = (
    <aside className={settingsStyles.sidePanel}>
      <div className={settingsStyles.sidePanelHead}>
        <div className={settingsStyles.sidePanelRule} />
        <h3 className={settingsStyles.sidePanelTitle}>
          Perfil activo
        </h3>
      </div>

      <GlobalProfileCard variant="default" />
    </aside>
  );

  const fullName = [user.name, user.sname, user.lname].filter(Boolean).join(' ');
  const customerTier = user.profile.tier;
  const rankLabel = formatTier(customerTier);
  const activeSecurityCopy = securityFlow
    ? SECURITY_COPY[securityFlow.type][securityFlow.intent]
    : null;

  const fieldEditor = (field: ProfileFieldKey) => (
    <div className={settingsStyles.fieldEditorGrid}>
      {field === 'sex' ? (
        <select
          className={inputStyles()}
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
          className={inputStyles()}
          value={form[field]}
          onChange={(e) => setForm((current) => ({ ...current, [field]: e.target.value }))}
          autoFocus
        />
      )}

      <div className={settingsStyles.actionRow}>
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
    <div className={settingsStyles.panel}>
      <div className={settingsStyles.panelBody}>
        <div className={settingsStyles.panelHeader}>
          <div>
            <p className={settingsStyles.panelEyebrow}>
              Editar dato
            </p>
            <h3 className={settingsStyles.panelTitle}>
              {editingLabelMap[editing]}
            </h3>
            <p className={settingsStyles.panelCopy}>
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
          icon: <CopyIcon width={14} height={14} />,
          onClick: () => void copyValue('Nombre', user.name),
        },
        {
          key: 'edit-name',
          label: 'Editar',
          variant: 'secondary' as const,
          icon: <EditIcon width={14} height={14} />,
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
          icon: <CopyIcon width={14} height={14} />,
          onClick: () => void copyValue('Otros nombres', user.sname || ''),
          disabled: !user.sname,
        },
        {
          key: 'edit-sname',
          label: user.sname ? 'Editar' : 'Agregar',
          variant: 'secondary' as const,
          icon: <EditIcon width={14} height={14} />,
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
          icon: <CopyIcon width={14} height={14} />,
          onClick: () => void copyValue('Apellido', user.lname),
        },
        {
          key: 'edit-lname',
          label: 'Editar',
          variant: 'secondary' as const,
          icon: <EditIcon width={14} height={14} />,
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
          icon: <CopyIcon width={14} height={14} />,
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
          icon: <CopyIcon width={14} height={14} />,
          onClick: () => void copyValue('Nombre de usuario', user.username),
        },
        {
          key: 'edit-username',
          label: 'Editar',
          variant: 'secondary' as const,
          icon: <EditIcon width={14} height={14} />,
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
          icon: <CopyIcon width={14} height={14} />,
          onClick: () => void copyValue('Sexo', formatSex(user.sex)),
        },
        {
          key: 'edit-sex',
          label: 'Editar',
          variant: 'secondary' as const,
          icon: <EditIcon width={14} height={14} />,
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
          icon: <CopyIcon width={14} height={14} />,
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
          icon: <CopyIcon width={14} height={14} />,
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
          icon: <CopyIcon width={14} height={14} />,
          onClick: () => void copyValue('Rango', rankLabel),
        },
        {
          key: 'plans-rank',
          label: 'Ir a facturacion',
          variant: 'secondary' as const,
          icon: <ArrowRightIcon width={14} height={14} />,
          onClick: () => navigate('/facturacion'),
        },
      ],
    },
  ];

  const sections = [
    {
      key: 'identity',
      content: (
        <div className={settingsStyles.visualList}>
          <div className={settingsStyles.sectionTitleRow}>
            <div className={settingsStyles.sectionAccent} />
            <div>
              <h2 className={settingsStyles.sectionTitle}>
                Datos de la cuenta
              </h2>
              <p className={settingsStyles.sectionCopy}>
                Vista ordenada de la información que devuelve <code>/iam/me</code>.
              </p>
            </div>
          </div>

          <div className={settingsStyles.rowsPanel}>
            <div className={settingsStyles.rowsPanelBody}>
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
        <div className={settingsStyles.visualList}>
          <div className={settingsStyles.sectionTitleRow}>
            <div className={settingsStyles.sectionAccent} />
            <div>
              <h2 className={settingsStyles.sectionTitle}>
                Direcciones
              </h2>
              <p className={settingsStyles.sectionCopy}>
                Guardá y editá tus domicilios para delivery.
              </p>
            </div>
          </div>

          {addresses.length === 0 && !showAddressForm ? (
            <div className={settingsStyles.addressEmpty}>
              No hay direcciones registradas
            </div>
          ) : (
            <div className={settingsStyles.addressGrid}>
              {addresses.map((address) => (
                <article key={address.id} className={settingsStyles.addressCard}>
                  <div className={settingsStyles.addressCardBody}>
                    <h3 className={settingsStyles.addressCardTitle}>
                      {address.street} {address.number}
                    </h3>
                    <div className={settingsStyles.addressPills}>
                      {address.floorApt && (
                        <span className={settingsStyles.addressPill}>
                          Piso/Depto: {address.floorApt}
                        </span>
                      )}
                      {address.notes && (
                        <span className={settingsStyles.addressPill}>
                          {address.notes}
                        </span>
                      )}
                      {address.isDefault && (
                        <span className={settingsStyles.addressPillPrimary}>
                          Principal
                        </span>
                      )}
                    </div>
                  </div>

                  <div className={settingsStyles.actionRow}>
                    <ActionButton
                      key={`copy-address-${address.id}`}
                      label="Copiar"
                      icon={<CopyIcon width={14} height={14} />}
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
              className={settingsStyles.addressForm}
            >
              <div className={settingsStyles.addressFormHead}>
                <div>
                  <h3 className={settingsStyles.addressCardTitle}>
                    {addressDraft.id ? 'Editar direccion' : 'Nueva direccion'}
                  </h3>
                  <p className={settingsStyles.sectionCopy}>
                    Podés marcarla como principal para delivery.
                  </p>
                </div>
                <ActionButton key="close-address-form" label="Cerrar" onClick={resetAddressDraft} />
              </div>

              <div className={settingsStyles.addressFormGrid}>
                <div className={settingsStyles.fieldStack}>
                  <label className={settingsStyles.fieldLabel}>
                    Calle
                  </label>
                  <input
                    required
                    className={inputStyles()}
                    value={addressDraft.street}
                    onChange={(e) =>
                      setAddressDraft((current) => ({ ...current, street: e.target.value }))
                    }
                  />
                </div>
                <div className={settingsStyles.fieldStack}>
                  <label className={settingsStyles.fieldLabel}>
                    Numero
                  </label>
                  <input
                    required
                    className={inputStyles()}
                    value={addressDraft.number}
                    onChange={(e) =>
                      setAddressDraft((current) => ({ ...current, number: e.target.value }))
                    }
                  />
                </div>
                <div className={settingsStyles.fieldStack}>
                  <label className={settingsStyles.fieldLabel}>
                    Piso / Depto
                  </label>
                  <input
                    className={inputStyles()}
                    value={addressDraft.floorApt}
                    onChange={(e) =>
                      setAddressDraft((current) => ({ ...current, floorApt: e.target.value }))
                    }
                  />
                </div>
                <div className={settingsStyles.fieldStack}>
                  <label className={settingsStyles.fieldLabel}>
                    Indicaciones
                  </label>
                  <input
                    className={inputStyles()}
                    value={addressDraft.notes}
                    onChange={(e) =>
                      setAddressDraft((current) => ({ ...current, notes: e.target.value }))
                    }
                    placeholder="TIMBRE ROTO, LLAMAR AL LLEGAR..."
                  />
                </div>
              </div>

              <label className={settingsStyles.checkboxRow}>
                <input
                  type="checkbox"
                  checked={addressDraft.isDefault}
                  onChange={(e) =>
                    setAddressDraft((current) => ({ ...current, isDefault: e.target.checked }))
                  }
                  className={settingsStyles.checkboxInput}
                />
                <span className={settingsStyles.checkboxLabel}>
                  Usar como direccion principal
                </span>
              </label>

              <div className={settingsStyles.actionRow}>
                <button
                  type="submit"
                  disabled={loading}
                  className={settingsActionButtonStyles({ tone: 'primary' })}
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
    <div className={settingsStyles.credentialsGrid}>
      <div className={settingsStyles.credentialsMain}>
        {editing ? (
          editPanel
        ) : mode === 'view' ? (
          <SectionFactory sections={sections} className={settingsStyles.credentialsSections} />
        ) : (
          <div className={settingsStyles.securityShell}>
            <div className={settingsStyles.securityHero}>
              <div className={settingsStyles.securityHeroIcon}>
                <span className={settingsStyles.securityHeroBang}>!</span>
              </div>
              <div>
                <h2 className={settingsStyles.sectionTitle}>
                  {activeSecurityCopy?.title}
                </h2>
                <p className={settingsStyles.sectionCopy}>
                  Verificación y cambio se manejan por separado.
                </p>
              </div>
            </div>

            {mode === 'requesting' && activeSecurityCopy && (
              <div className={settingsStyles.visualList}>
                <div className={settingsStyles.securityCallout}>
                  <p className={settingsStyles.securityCalloutText}>
                    {activeSecurityCopy.lead}
                  </p>
                  {MODE === 'dev' && (
                    <p className={settingsStyles.securityDevNote}>
                      En desarrollo, el codigo tambien se imprime en la consola del backend.
                    </p>
                  )}
                </div>

                {'targetLabel' in activeSecurityCopy && activeSecurityCopy.targetLabel && (
                  <div className={settingsStyles.fieldStack}>
                    <label className={settingsStyles.fieldLabel}>
                      {activeSecurityCopy.targetLabel}
                    </label>
                    <input
                      className={inputStyles()}
                      value={targetVal}
                      onChange={(e) => setTargetVal(e.target.value)}
                      placeholder={activeSecurityCopy.targetPlaceholder}
                    />
                  </div>
                )}

                <div className={settingsStyles.actionRow}>
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
              <div className={settingsStyles.visualList}>
                <div className={settingsStyles.successCallout}>
                  <p className={settingsStyles.successCalloutText}>
                    Ingresa el codigo recibido para confirmar la operacion.
                  </p>
                </div>

                <div className={settingsStyles.fieldStack}>
                  <label className={settingsStyles.fieldLabel}>
                    {activeSecurityCopy.codeLabel}
                  </label>
                  <input
                    className={cn(inputStyles(), settingsStyles.codeInput)}
                    maxLength={6}
                    value={token}
                    onChange={(e) => setToken(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    placeholder="000000"
                  />
                </div>

                {securityFlow?.type === 'PASSWORD_CHANGE' && (
                  <div className={settingsStyles.addressFormGrid}>
                    <div className={settingsStyles.fieldStack}>
                      <label className={settingsStyles.fieldLabel}>
                        Nueva contrasena
                      </label>
                      <input
                        type="password"
                        className={inputStyles()}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                      />
                    </div>
                    <div className={settingsStyles.fieldStack}>
                      <label className={settingsStyles.fieldLabel}>
                        Confirmar contrasena
                      </label>
                      <input
                        type="password"
                        className={inputStyles()}
                        value={cpassword}
                        onChange={(e) => setCpassword(e.target.value)}
                      />
                    </div>
                  </div>
                )}

                <div className={settingsStyles.actionRow}>
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
      <div className={settingsStyles.credentialsAside}>
        {sidePanel}
      </div>
    </div>
  );
};
