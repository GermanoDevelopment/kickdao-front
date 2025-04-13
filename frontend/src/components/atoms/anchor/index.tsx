import classNames from "classnames";
import React from "react";

interface AnchorAtomProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  text: string;
  href: string;
  classname?: string;
}

const AnchorAtom: React.FC<AnchorAtomProps> = ({ 
  text,
  href,
  className,
  // ...props
}) => {
  const anchorClasses = classNames(
    className,
    {

    }
  );

  return (
    <a href={ href } className={ anchorClasses }>
      {text}
    </a>
  );
};

export default AnchorAtom;
