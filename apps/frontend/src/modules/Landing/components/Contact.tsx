import {
  ClockIcon,
  FacebookIcon,
  InstagramIcon,
  MapPinIcon,
  TikTokIcon,
  WhatsAppIcon,
} from '../../../components/shared/AppIcons';

const socialLinks = [
  { label: 'Instagram', href: '#', icon: <InstagramIcon className="size-[1.05rem]" /> },
  { label: 'Facebook', href: '#', icon: <FacebookIcon className="size-[1.05rem]" /> },
  { label: 'TikTok', href: '#', icon: <TikTokIcon className="size-[1.05rem]" /> },
  { label: 'WhatsApp', href: '#', icon: <WhatsAppIcon className="size-[1.05rem]" /> },
] as const;

const legalLinks = ['Términos de uso', 'Privacidad'] as const;

const Contact = () => {
  return (
    <footer id="contact" className="bg-qart-bg pt-20 pb-10 border-t-8 border-qart-border">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_0.9fr_0.8fr] gap-8 lg:gap-10">
          <div className="space-y-6">
            <div className="flex items-center gap-3 border-l-6 border-qart-accent pl-4">
              <span className="text-3xl font-display text-qart-primary tracking-tighter uppercase font-black">
                QART.
              </span>
            </div>

            <p className="max-w-xl text-qart-text-muted text-[0.96rem] font-bold uppercase tracking-tight leading-tight">
              Platos personalizables, una experiencia clara para pedir y una identidad bien local
              pensada para la tesis.
            </p>

            <div className="flex flex-wrap items-center gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  className="group inline-flex items-center justify-center w-11 h-11 border-2 border-qart-border bg-qart-surface text-qart-text transition-all duration-200 hover:-translate-x-[2px] hover:-translate-y-[2px] hover:border-qart-accent hover:bg-qart-accent hover:text-qart-text-on-accent"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          <div className="space-y-5">
            <h4 className="text-xs font-black text-qart-primary uppercase tracking-[0.3em]">
              Dirección
            </h4>

            <div className="flex items-start gap-3 border-2 border-qart-border bg-qart-surface px-4 py-4">
              <span className="inline-flex items-center justify-center w-10 h-10 border-2 border-qart-border bg-qart-bg-warm text-qart-accent shrink-0">
                <MapPinIcon className="size-[1.1rem]" />
              </span>

              <div className="space-y-1 text-qart-text-muted text-[0.92rem] font-bold uppercase tracking-tight leading-snug">
                <p className="text-qart-primary">Rivadavia 1050</p>
                <p>San Miguel de Tucumán</p>
                <p>Guiño UTN: bien cerquita de la Facultad Regional Tucumán.</p>
              </div>
            </div>
          </div>

          <div className="space-y-5">
            <h4 className="text-xs font-black text-qart-primary uppercase tracking-[0.3em]">
              Horarios
            </h4>

            <div className="flex items-start gap-3 border-2 border-qart-border bg-qart-surface px-4 py-4">
              <span className="inline-flex items-center justify-center w-10 h-10 border-2 border-qart-border bg-qart-bg-warm text-qart-accent shrink-0">
                <ClockIcon className="size-[1.1rem]" />
              </span>

              <div className="space-y-2 text-qart-text-muted text-[0.92rem] font-bold uppercase tracking-tight leading-snug">
                <p>Lunes a jueves: 12:00 a 23:00</p>
                <p>Viernes a domingo: 12:00 a 00:00</p>
                <div className="mt-1 px-3 py-1 inline-flex border-2 border-qart-accent bg-qart-accent text-qart-text-on-accent text-[0.7rem] tracking-[0.18em]">
                  ABIERTO
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t-2 border-qart-border flex flex-col md:flex-row justify-between items-center gap-5">
          <p className="text-[10px] font-black text-qart-text-muted uppercase tracking-widest">
            © 2026 QART. Proyecto académico para TFI UTN.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-6">
            {legalLinks.map((link) => (
              <a
                key={link}
                href="#"
                className="text-[10px] font-black text-qart-text-muted hover:text-qart-accent uppercase tracking-widest transition-colors duration-200"
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
