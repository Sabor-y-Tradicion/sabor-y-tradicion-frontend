import * as React from "react"
import Image from "next/image"

interface IconProps extends React.SVGProps<SVGSVGElement> {
  useCustomLogo?: boolean;
}

export function Logo({ className, useCustomLogo = false, ...props }: IconProps) {
  // Si quieres usar tu logo personalizado, coloca la imagen en:
  // public/images/logo/logo.png (o logo.svg)
  // Y cambia useCustomLogo a true en los componentes

  if (useCustomLogo) {
    return (
      <div className="relative" style={{ width: '40px', height: '40px' }}>
        <Image
          src="/images/logo/logo.png"
          alt="Logo Sabor y Tradición"
          fill
          className="object-contain"
          priority
        />
      </div>
    );
  }

  // Logo SVG por defecto
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2" />
      <path d="M7 2v20" />
      <path d="M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7" />
    </svg>
  )
}



