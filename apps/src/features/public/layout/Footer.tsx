'use client';

import { RootState } from '@/store/store';
import { SettingsForm } from '@/types/settings';
import { FaFacebookF, FaFacebookMessenger, FaInstagram, FaLinkedin, FaTwitter } from 'react-icons/fa';
import { useSelector } from 'react-redux';

const Footer = () => {
    const settings = useSelector((state: RootState) => state.frontendNav.settings) as SettingsForm;

    const socials = settings?.socialLinks;

    return (
        <footer className="bg-blue-900 text-gray-300">
            <div className="container flex flex-col md:flex-row justify-center items-center gap-4 md:gap-6 lg:gap-20 xl:gap-30 py-6">
                <div className="px-3 text-center md:text-left max-w-lg">
                    <div className="mx-auto container text-center">
                        {socials && (
                            <div className="flex justify-center items-center gap-4 mb-4">
                                {socials.facebookPage && (
                                    <a
                                        href={socials.facebookPage}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-white hover:text-gray-200 transition-colors"
                                        title="Facebook Page"
                                    >
                                        <FaFacebookF size={20} />
                                    </a>
                                )}
                                {socials.facebookGroup && (
                                    <a
                                        href={socials.facebookGroup}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-white hover:text-gray-200 transition-colors"
                                        title="Facebook Group"
                                    >
                                        <FaFacebookMessenger size={20} />
                                    </a>
                                )}
                                {socials.x && (
                                    <a
                                        href={socials.x}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-white hover:text-gray-200 transition-colors"
                                        title="X / Twitter"
                                    >
                                        <FaTwitter size={20} />
                                    </a>
                                )}
                                {socials.instagram && (
                                    <a
                                        href={socials.instagram}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-white hover:text-gray-200 transition-colors"
                                        title="Instagram"
                                    >
                                        <FaInstagram size={20} />
                                    </a>
                                )}
                                {socials.linkedin && (
                                    <a
                                        href={socials.linkedin}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-white hover:text-gray-200 transition-colors"
                                        title="LinkedIn"
                                    >
                                        <FaLinkedin size={20} />
                                    </a>
                                )}
                            </div>
                        )}

                        <div className="text-[13px]">
                            <p className="mb-2">
                                <span className="font-semibold text-white">Savesmoney and/or users</span> can earn
                                commission through referral links.
                                <br />
                                We strike to provide best deals to the community.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="px-3 text-center md:text-right max-w-md">
                    <blockquote className="text-xl md:text-lg font-semibold text-white italic leading-snug">
                        {settings?.footerQuote}
                    </blockquote>

                    <div className="mt-3 text-base md:text-base text-gray-300">{settings?.footerQuoteAuthor}</div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
