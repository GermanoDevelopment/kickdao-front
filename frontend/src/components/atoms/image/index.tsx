import React from "react";
import classNames from "classnames";

interface ImageProps {
  src: string;
  alt: string;
  className?: string;
}

const ImageAtom: React.FC<ImageProps> = ({ src, alt, className }) => {
    const imageClasses = classNames("inline-block", className);

    return <img src={src} alt={alt} className={ imageClasses } />;
};

export default ImageAtom;
