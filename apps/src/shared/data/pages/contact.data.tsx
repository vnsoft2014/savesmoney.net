import { ContactProps } from '@/shared/types';

export const contact2Contact: ContactProps = {
    id: 'contactTwo-on-contact',
    hasBackground: true,
    header: {
        title: 'Welcome to SavesMoney.Net',
        subtitle: (
            <>
                Please take a moment to fill out this form.{' '}
                <span className="hidden md:inline">{`So we can better understand your needs and get the process started smoothly.`}</span>
            </>
        ),
    },
    form: {
        title: 'Ready to Get Started?',
        inputs: [
            {
                type: 'text',
                label: 'First name',
                name: 'name',
                autocomplete: 'off',
                placeholder: 'First name',
            },
            {
                type: 'text',
                label: 'Last name',
                name: 'lastName',
                autocomplete: 'off',
                placeholder: 'Last name',
            },
            {
                type: 'email',
                label: 'Email address',
                name: 'email',
                autocomplete: 'on',
                placeholder: 'Email address',
            },
        ],
        radioBtns: {
            label: 'What is the reason for your contact?',
            radios: [
                {
                    label: 'General inquiries',
                },
                {
                    label: 'Technical help',
                },
                {
                    label: 'Claims',
                },
                {
                    label: 'Others',
                },
            ],
        },
        textarea: {
            cols: 30,
            rows: 5,
            label: 'How can we help you?',
            name: 'textarea',
            placeholder: 'Write your message...',
        },
        checkboxes: [
            {
                label: 'Have you read our privacy policy?',
                value: '',
            },
            {
                label: 'Do you want to receive monthly updates by email?',
                value: '',
            },
        ],
        btn: {
            title: 'Send Message',
            type: 'submit',
        },
    },
};
