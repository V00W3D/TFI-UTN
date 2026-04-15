import React from 'react';
import { iamStyles } from '@/styles/modules/iam';

interface HelpContext {
  label: string;
  required: boolean | null;
  rules: readonly string[];
}

interface RegisterHelpPanelProps {
  activeHelp: HelpContext;
}

/**
 * @component RegisterHelpPanel
 * @description Panel didáctico que muestra las reglas dinámicas del formulario de registro.
 */
export const RegisterHelpPanel: React.FC<RegisterHelpPanelProps> = ({ activeHelp }) => {
  return (
    <section className={iamStyles.contextPanel} aria-live="polite">
      <p className={iamStyles.contextKicker}>REGLAS DEL CAMPO</p>
      <div className={iamStyles.contextHeader}>
        <h2 className={iamStyles.contextTitle}>{activeHelp.label}</h2>
        {activeHelp.required !== null && (
          <span className={iamStyles.contextBadge}>
            {activeHelp.required ? 'OBLIGATORIO' : 'OPCIONAL'}
          </span>
        )}
      </div>

      <div className={iamStyles.contextScroll}>
        <ul className={iamStyles.contextRules}>
          {activeHelp.rules.map((rule) => (
            <li key={`${activeHelp.label}-${rule}`} className={iamStyles.contextRule}>
              {rule.toUpperCase()}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default RegisterHelpPanel;
