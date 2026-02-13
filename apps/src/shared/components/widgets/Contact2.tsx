'use client';

import { contact2Contact } from '@/shared/data/pages/contact.data';
import { RootState } from '@/store/store';
import { SettingsForm } from '@/types/settings';
import { Globe, Mail } from 'lucide-react';
import { FaFacebookF, FaFacebookMessenger, FaInstagram, FaLinkedin, FaTwitter } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import Headline from '../../../features/common/Headline';
import Form from '../../../features/public/contact/Form';
import ContactSchema from '../../seo/ContactSchema';

const Contact2 = () => {
    const { header, form } = contact2Contact;

    const settings = useSelector((state: RootState) => state.frontendNav.settings) as SettingsForm;

    const socials = settings?.socialLinks;

    return (
        <>
            <ContactSchema />
            <section className="relative not-prose scroll-mt-12.5">
                <div className="relative mx-auto max-w-6xl px-4 md:px-6 py-6 md:py-8 lg:py-10 text-default">
                    <div className="bg-gray-50 flex flex-col-reverse lg:flex-row lg:items-stretch justify-center">
                        <div className="w-full">
                            <Form {...form} containerClass="h-fit p-4 md:p-6 bg-white" btnPosition="center" />
                        </div>

                        <div className="bg-blue-700 text-white p-4 md:p-6 lg:max-w-4/5">
                            {header && <Headline header={header} titleClass="text-2xl sm:text-3xl" />}

                            <div className="space-y-2">
                                <div className="flex items-start">
                                    <Mail className="w-6 h-6 mr-4 mt-1 shrink-0" />
                                    <div>
                                        <p className="font-semibold mb-1">Email:</p>
                                        <p className="text-blue-100">
                                            <a
                                                href="mailto:support@savesmoney.net"
                                                className="hover:underline hover:text-blue-300"
                                            >
                                                support@savesmoney.net
                                            </a>
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start">
                                    <Globe className="w-6 h-6 mr-4 mt-1 shrink-0" />
                                    <div>
                                        <p className="font-semibold mb-1">Website:</p>
                                        <a
                                            href="https://savesmoney.net"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-blue-100 hover:text-blue-300"
                                        >
                                            https://www.savesmoney.net
                                        </a>
                                    </div>
                                </div>

                                {socials && (
                                    <div className="flex items-center gap-4 mt-3">
                                        {socials.facebookPage && (
                                            <a
                                                href={socials.facebookPage}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                title="Facebook Page"
                                                className="text-white hover:text-gray-200 transition-colors"
                                            >
                                                <FaFacebookF size={24} />
                                            </a>
                                        )}
                                        {socials.facebookGroup && (
                                            <a
                                                href={socials.facebookGroup}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                title="Facebook Group"
                                                className="text-white hover:text-gray-200 transition-colors"
                                            >
                                                <FaFacebookMessenger size={24} />
                                            </a>
                                        )}
                                        {socials.x && (
                                            <a
                                                href={socials.x}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                title="X / Twitter"
                                                className="text-white hover:text-gray-200 transition-colors"
                                            >
                                                <FaTwitter size={24} />
                                            </a>
                                        )}
                                        {socials.instagram && (
                                            <a
                                                href={socials.instagram}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                title="Instagram"
                                                className="text-white hover:text-gray-200 transition-colors"
                                            >
                                                <FaInstagram size={24} />
                                            </a>
                                        )}
                                        {socials.linkedin && (
                                            <a
                                                href={socials.linkedin}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                title="LinkedIn"
                                                className="text-white hover:text-gray-200 transition-colors"
                                            >
                                                <FaLinkedin size={24} />
                                            </a>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
};

export default Contact2;
