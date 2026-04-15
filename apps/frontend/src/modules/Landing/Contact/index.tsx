/**
 * @file Contact.tsx
 * @module Landing
 * @description Archivo Contact alineado a la arquitectura y trazabilidad QART.
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
 * dependencies: AppIcons
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
import {
  ClockIcon,
  FacebookIcon,
  InstagramIcon,
  MapPinIcon,
  TikTokIcon,
  WhatsAppIcon,
} from '@/shared/ui/AppIcons';
import { landingSectionStyles } from '@/styles/modules/landingSections';

const socialLinks = [
  { label: 'Instagram', href: '#', icon: <InstagramIcon width={17} height={17} /> },
  { label: 'Facebook', href: '#', icon: <FacebookIcon width={17} height={17} /> },
  { label: 'TikTok', href: '#', icon: <TikTokIcon width={17} height={17} /> },
  { label: 'WhatsApp', href: '#', icon: <WhatsAppIcon width={17} height={17} /> },
] as const;

const legalLinks = ['Términos de uso', 'Privacidad'] as const;

const Contact = () => {
  return (
    <footer id="contact" className={landingSectionStyles.contactFooter}>
      <div className={landingSectionStyles.contactInner}>
        <div className={landingSectionStyles.contactGrid}>
          <div className={landingSectionStyles.contactBrand}>
            <div className={landingSectionStyles.contactBrandMark}>
              <span className={landingSectionStyles.contactBrandText}>
                QART.
              </span>
            </div>

            <p className={landingSectionStyles.contactLead}>
              Platos de autor únicos, una experiencia gastronómica inolvidable con identidad local
              para deleitar tu paladar.
            </p>

            <div className={landingSectionStyles.contactSocials}>
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  className={landingSectionStyles.contactSocialLink}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          <div className={landingSectionStyles.contactColumn}>
            <h4 className={landingSectionStyles.contactColumnTitle}>
              Dirección
            </h4>

            <div className={landingSectionStyles.contactCard}>
              <span className={landingSectionStyles.contactIconBox}>
                <MapPinIcon width={18} height={18} />
              </span>

              <div className={landingSectionStyles.contactCardBody}>
                <p className={landingSectionStyles.contactCardPrimary}>Rivadavia 1050</p>
                <p>San Miguel de Tucumán</p>
                <p>En el epicentro histórico de la ciudad.</p>
              </div>
            </div>
          </div>

          <div className={landingSectionStyles.contactColumn}>
            <h4 className={landingSectionStyles.contactColumnTitle}>
              Horarios
            </h4>

            <div className={landingSectionStyles.contactCard}>
              <span className={landingSectionStyles.contactIconBox}>
                <ClockIcon width={18} height={18} />
              </span>

              <div className={landingSectionStyles.contactCardBody}>
                <p>Lunes a jueves: 12:00 a 23:00</p>
                <p>Viernes a domingo: 12:00 a 00:00</p>
                <div className={landingSectionStyles.contactStatus}>
                  ABIERTO
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className={landingSectionStyles.contactFooterBar}>
          <p className={landingSectionStyles.contactCopyright}>
            © 2026 QART RESTAURANTE. TODOS LOS DERECHOS RESERVADOS.
          </p>

          <div className={landingSectionStyles.contactLegal}>
            {legalLinks.map((link) => (
              <a
                key={link}
                href="#"
                className={landingSectionStyles.contactLegalLink}
              >
                {link}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Contact;
