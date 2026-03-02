import Image from "next/image";
import { forwardRef } from "react";

type AvatarProps = React.HTMLAttributes<HTMLDivElement> & {
  src?: string;
  alt?: string;
  width?: number;
  height?: number;
};

const Avatar = forwardRef<HTMLDivElement, AvatarProps>(
  (
    {
      src,
      alt = "Avatar",
      width = 26,
      height = 26,
      className = "",
      style,
      ...props
    },
    ref,
  ) => {
    return (
      <div
        ref={ref}
        className={`relative flex items-center justify-center overflow-hidden rounded-full bg-muted text-muted-foreground ${className}`}
        style={{ width, height, ...style }}
        {...props}
      >
        {src ? (
          <Image
            src={src}
            alt={alt}
            width={width}
            height={height}
            className="object-cover"
          />
        ) : (
          <svg
            width={Math.floor(width * 0.6)}
            height={Math.floor(height * 0.6)}
            viewBox="0 0 24 24"
            fill="none"
            className="text-muted-foreground"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12 12c2.761 0 5-2.462 5-5.5S14.761 1 12 1 7 3.462 7 6.5 9.239 12 12 12Z"
              fill="currentColor"
            />
            <path
              d="M21 23c0-4.418-4.03-8-9-8s-9 3.582-9 8"
              fill="currentColor"
            />
          </svg>
        )}
      </div>
    );
  },
);

Avatar.displayName = "Avatar";

export default Avatar;
