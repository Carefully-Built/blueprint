import type { SVGProps } from 'react';

type LogoProps = SVGProps<SVGSVGElement>;

export function NextjsLogo(props: LogoProps): React.ReactElement {
  return (
    <svg viewBox="0 0 180 180" fill="none" {...props}>
      <mask id="mask0_408_134" style={{ maskType: 'alpha' }} maskUnits="userSpaceOnUse" x="0" y="0" width="180" height="180">
        <circle cx="90" cy="90" r="90" fill="black" />
      </mask>
      <g mask="url(#mask0_408_134)">
        <circle cx="90" cy="90" r="87" fill="black" stroke="white" strokeWidth="6" />
        <path d="M149.508 157.52L69.142 54H54V125.97H66.1136V69.3836L139.999 164.845C143.333 162.614 146.509 160.165 149.508 157.52Z" fill="url(#paint0_linear_408_134)" />
        <rect x="115" y="54" width="12" height="72" fill="url(#paint1_linear_408_134)" />
      </g>
      <defs>
        <linearGradient id="paint0_linear_408_134" x1="109" y1="116.5" x2="144.5" y2="160.5" gradientUnits="userSpaceOnUse">
          <stop stopColor="white" />
          <stop offset="1" stopColor="white" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="paint1_linear_408_134" x1="121" y1="54" x2="120.799" y2="106.875" gradientUnits="userSpaceOnUse">
          <stop stopColor="white" />
          <stop offset="1" stopColor="white" stopOpacity="0" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export function ConvexLogo(props: LogoProps): React.ReactElement {
  return (
    <svg viewBox="0 0 128 128" fill="none" {...props}>
      <path d="M0 64C0 28.654 28.654 0 64 0s64 28.654 64 64-28.654 64-64 64S0 99.346 0 64z" fill="#F3B01C" />
      <path fillRule="evenodd" clipRule="evenodd" d="M64 24c-22.091 0-40 17.909-40 40s17.909 40 40 40c9.625 0 18.455-3.4 25.35-9.06L64 64V24z" fill="white" />
    </svg>
  );
}

export function WorkOSLogo(props: LogoProps): React.ReactElement {
  return (
    <svg viewBox="0 0 256 256" fill="none" {...props}>
      <rect width="256" height="256" rx="40" fill="#6363F1" />
      <path d="M68 80h24v96H68V80zm48 48h24v48h-24v-48zm48-24h24v72h-24v-72z" fill="white" />
    </svg>
  );
}

export function ShadcnLogo(props: LogoProps): React.ReactElement {
  return (
    <svg viewBox="0 0 256 256" fill="none" {...props}>
      <rect width="256" height="256" fill="black" rx="40" />
      <path d="M208 128L128 208" stroke="white" strokeWidth="24" strokeLinecap="round" />
      <path d="M192 64L64 192" stroke="white" strokeWidth="24" strokeLinecap="round" />
    </svg>
  );
}

export function TailwindLogo(props: LogoProps): React.ReactElement {
  return (
    <svg viewBox="0 0 256 154" fill="none" {...props}>
      <path d="M128 0C93.867 0 72.533 17.067 64 51.2 76.8 34.133 91.733 27.733 108.8 32c9.737 2.434 16.697 9.499 24.401 17.318C145.751 62.057 160.275 77 192 77c34.133 0 55.467-17.067 64-51.2-12.8 17.067-27.733 23.467-44.8 19.2-9.737-2.434-16.697-9.499-24.401-17.318C174.249 14.943 159.725 0 128 0zM64 77C29.867 77 8.533 94.067 0 128.2c12.8-17.067 27.733-23.467 44.8-19.2 9.737 2.434 16.697 9.499 24.401 17.318C81.751 139.057 96.275 154 128 154c34.133 0 55.467-17.067 64-51.2-12.8 17.067-27.733 23.467-44.8 19.2-9.737-2.434-16.697-9.499-24.401-17.318C110.249 91.943 95.725 77 64 77z" fill="#06B6D4" />
    </svg>
  );
}

export function TypeScriptLogo(props: LogoProps): React.ReactElement {
  return (
    <svg viewBox="0 0 256 256" fill="none" {...props}>
      <rect width="256" height="256" rx="20" fill="#3178C6" />
      <path fillRule="evenodd" clipRule="evenodd" d="M150.518 200.475v27.62c4.492 2.302 9.805 4.028 15.938 5.179 6.133 1.151 12.597 1.726 19.393 1.726 6.622 0 12.914-.633 18.874-1.899 5.96-1.266 11.187-3.352 15.678-6.257 4.492-2.906 8.048-6.704 10.669-11.394 2.621-4.689 3.932-10.486 3.932-17.391 0-5.018-.749-9.348-2.247-12.99-1.499-3.641-3.602-6.893-6.31-9.756a50.552 50.552 0 00-9.629-7.857c-3.698-2.39-7.753-4.632-12.166-6.727a291.089 291.089 0 01-10.67-5.353c-3.192-1.727-5.912-3.454-8.162-5.18-2.249-1.727-3.991-3.57-5.226-5.528-1.235-1.959-1.853-4.149-1.853-6.569 0-2.187.56-4.143 1.679-5.87 1.119-1.726 2.679-3.22 4.678-4.481 2-1.262 4.38-2.245 7.14-2.95 2.76-.705 5.775-1.058 9.044-1.058 2.353 0 4.82.173 7.397.519 2.578.345 5.142.879 7.69 1.6a56.623 56.623 0 017.34 2.716 41.562 41.562 0 016.31 3.643v-25.406c-4.024-1.611-8.455-2.832-13.293-3.664-4.838-.831-10.379-1.247-16.621-1.247-6.565 0-12.784.69-18.66 2.073-5.875 1.382-11.043 3.528-15.504 6.438-4.462 2.91-7.978 6.645-10.549 11.205-2.571 4.56-3.856 9.946-3.856 16.16 0 8.095 2.46 15.063 7.378 20.901 4.919 5.838 12.181 10.695 21.786 14.573 3.872 1.553 7.48 3.097 10.824 4.633 3.343 1.536 6.242 3.152 8.698 4.848 2.455 1.697 4.39 3.56 5.805 5.59 1.414 2.03 2.122 4.31 2.122 6.84 0 2.071-.531 3.967-1.592 5.687-1.061 1.72-2.578 3.2-4.55 4.44-1.972 1.24-4.365 2.2-7.178 2.882-2.814.68-5.96 1.021-9.438 1.021-6.215 0-12.298-1.096-18.249-3.29-5.951-2.193-11.263-5.426-15.936-9.697zM56.611 115.665V89.09h101.77v26.574H121.18v108.163H93.812V115.665H56.611z" fill="white" />
    </svg>
  );
}

export function ZodLogo(props: LogoProps): React.ReactElement {
  return (
    <svg viewBox="0 0 256 256" fill="none" {...props}>
      <rect width="256" height="256" rx="40" fill="#3E67B1" />
      <path d="M200 80H136L80 176H144L200 80Z" fill="white" />
      <path d="M56 80H120L176 176H112L56 80Z" fill="#274D82" />
    </svg>
  );
}

export function ResendLogo(props: LogoProps): React.ReactElement {
  return (
    <svg viewBox="0 0 256 256" fill="none" {...props}>
      <rect width="256" height="256" rx="40" fill="black" />
      <path d="M80 64h56c22.091 0 40 17.909 40 40s-17.909 40-40 40H80V64z" fill="white" />
      <path d="M80 144h16v48H80v-48zm56 0l40 48h-24l-40-48h24z" fill="white" />
    </svg>
  );
}

export function StripeLogo(props: LogoProps): React.ReactElement {
  return (
    <svg viewBox="0 0 256 256" fill="none" {...props}>
      <rect width="256" height="256" rx="40" fill="#635BFF" />
      <path fillRule="evenodd" clipRule="evenodd" d="M116.5 94.5c0-7.4 6.1-10.3 16.2-10.3 14.5 0 32.8 4.4 47.3 12.2V55.6c-15.8-6.3-31.5-8.8-47.3-8.8-38.7 0-64.4 20.2-64.4 54 0 52.7 72.5 44.3 72.5 67 0 8.8-7.6 11.6-18.3 11.6-15.8 0-36.1-6.5-52.1-15.2v41.1c17.7 7.6 35.6 10.9 52.1 10.9 39.6 0 66.8-19.6 66.8-53.8-.1-56.9-72.8-46.8-72.8-67.1z" fill="white" />
    </svg>
  );
}

export function OpenAILogo(props: LogoProps): React.ReactElement {
  return (
    <svg viewBox="0 0 256 256" fill="none" {...props}>
      <rect width="256" height="256" rx="40" fill="#000" />
      <path d="M197.4 107.4c4.3-12.8.7-27-9.2-35.8-6.9-6.1-15.8-9.1-24.8-8.4-2.1-8.6-7.1-16.2-14.2-21.4-10-7.3-23.1-9.1-34.6-4.8-5.3-7.5-13.2-12.8-22.3-14.7-13-2.8-26.5 1.6-35.2 11.4-8.2 1.2-15.8 5.3-21.3 11.6-7.8 8.8-10.2 21.2-6.4 32.3-4.3 12.8-.7 27 9.2 35.8 6.9 6.1 15.8 9.1 24.8 8.4 2.1 8.6 7.1 16.2 14.2 21.4 10 7.3 23.1 9.1 34.6 4.8 5.3 7.5 13.2 12.8 22.3 14.7 13 2.8 26.5-1.6 35.2-11.4 8.2-1.2 15.8-5.3 21.3-11.6 7.8-8.8 10.2-21.2 6.4-32.3zm-69.1 64.2c-8.1 0-14.7-6.6-14.7-14.7v-29.3l25.4 14.7c2.5 1.4 4 4.1 4 7v7.6c0 8.1-6.6 14.7-14.7 14.7zm-51.4-29.7c-4-7-2-16 4.5-20.8l25.4-14.7v29.3c0 2.9 1.5 5.6 4 7l25.4 14.7c-4 7-12.6 9.9-20.1 6.7l-25.4-14.7c-6.2-3.6-10.8-10-13.8-17.5zm-9.4-56.7c4-7 12.6-9.9 20.1-6.7l25.4 14.7c6.2 3.6 10.8 10 13.8 17.5 4 7 2 16-4.5 20.8l-25.4 14.7V116c0-2.9-1.5-5.6-4-7L67.5 94.3c4-7 12.6-9.9 20-6.7v-2.4zm51.4 29.7c8.1 0 14.7 6.6 14.7 14.7v29.3l-25.4-14.7c-2.5-1.4-4-4.1-4-7v-7.6c0-8.1 6.6-14.7 14.7-14.7z" fill="white" />
    </svg>
  );
}

export function TanStackLogo(props: LogoProps): React.ReactElement {
  return (
    <svg viewBox="0 0 256 256" fill="none" {...props}>
      <rect width="256" height="256" rx="40" fill="#FF4154" />
      <ellipse cx="128" cy="128" rx="80" ry="32" stroke="white" strokeWidth="12" fill="none" />
      <ellipse cx="128" cy="128" rx="80" ry="32" stroke="white" strokeWidth="12" fill="none" transform="rotate(60 128 128)" />
      <ellipse cx="128" cy="128" rx="80" ry="32" stroke="white" strokeWidth="12" fill="none" transform="rotate(120 128 128)" />
      <circle cx="128" cy="128" r="16" fill="white" />
    </svg>
  );
}

export function I18nLogo(props: LogoProps): React.ReactElement {
  return (
    <svg viewBox="0 0 256 256" fill="none" {...props}>
      <rect width="256" height="256" rx="40" fill="#26A69A" />
      <path d="M128 48C84.1 48 48 84.1 48 128s36.1 80 80 80 80-36.1 80-80-36.1-80-80-80zm0 144c-35.3 0-64-28.7-64-64s28.7-64 64-64 64 28.7 64 64-28.7 64-64 64z" fill="white" />
      <path d="M128 80v96M80 128h96" stroke="white" strokeWidth="12" strokeLinecap="round" />
      <text x="128" y="138" textAnchor="middle" fill="white" fontSize="40" fontWeight="bold" fontFamily="system-ui">A文</text>
    </svg>
  );
}
