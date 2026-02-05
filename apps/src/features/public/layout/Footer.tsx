'use client';

import { RootState } from '@/store/store';
import { SettingsForm } from '@/types/settings';
import { FaFacebookF, FaFacebookMessenger, FaInstagram, FaLinkedin, FaTwitter } from 'react-icons/fa';
import { useSelector } from 'react-redux';

const Footer2 = () => {
    const settings = useSelector((state: RootState) => state.frontendNav.settings) as SettingsForm;

    const socials = settings?.socialLinks;

    return (
        <footer className="bg-blue-900 text-gray-300">
            <div className="mx-auto container px-4 sm:px-6 py-6 text-center">
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
                        When you buy through links on <span className="font-semibold text-white">Savesmoney.net</span>,
                        we may earn a commission.
                    </p>
                    <p>
                        For more support, please send us an email at{' '}
                        <a href="mailto:support@savesmoney.net" className="underline hover:text-gray-200">
                            support@savesmoney.net
                        </a>
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer2;
