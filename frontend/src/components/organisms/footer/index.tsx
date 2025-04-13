export const Footer = () => {
    const socials = [
      { link: "https://facebook.com", arialabel: "Facebook", icon: "" },
      { link: "https://x.com", arialabel: "X", icon: "" },
      { link: "https://linkedin.com", arialabel: "LinkedIn", icon: "" },
    ];
  
    return (
        <footer className="bg-gray-900 text-white py-8">
            <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
                {/* Informações de Copyright */}
                <p className="text-sm md:text-base">
                    © {new Date().getFullYear()} <b>Projeto</b>. All rights reserved.
                </p>

                {/* Links de Navegação */}
                <nav className="mt-4 md:mt-0">
                    <ul className="flex space-x-4">
                        <li>
                            <a
                                href="/about"
                                className="hover:text-gray-300 transition-colors"
                            >
                                About Us
                            </a>
                        </li>
                        <li>
                            <a
                                href="/services"
                                className="hover:text-gray-300 transition-colors"
                            >
                                Services
                            </a>
                        </li>
                        <li>
                            <a
                                href="/contact"
                                className="hover:text-gray-300 transition-colors"
                            >
                                Contact
                            </a>
                        </li>
                    </ul>
                </nav>

                {/* Redes Sociais */}
                <div className="flex space-x-4 mt-4 md:mt-0">
                  {
                    socials.map((social) => {
                      return <a
                            href={social.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:text-gray-300 transition-colors"
                            aria-label={social.arialabel}
                        >
                            <i className="fab fa-facebook"></i>
                        </a>
                    })
                  }
                </div>
            </div>
        </footer>
    );
};
