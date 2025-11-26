import {
    Body,
    Container,
    Head,
    Heading,
    Html,
    Link,
    Preview,
    Text,
} from '@react-email/components';
import * as React from 'react';

interface VerifyEmailProps {
    verificationLink: string;
}

export const VerifyEmail = ({ verificationLink }: VerifyEmailProps) => (
    <Html>
        <Head />
        <Preview>Verify your email address</Preview>
        <Body style={main}>
            <Container style={container}>
                <Heading style={h1}>Verify your email address</Heading>
                <Text style={text}>
                    Click the link below to verify your email address and complete your signup.
                </Text>
                <Link href={verificationLink} style={link}>
                    Verify Email
                </Link>
                <Text style={footer}>
                    If you didn't request this, you can safely ignore this email.
                </Text>
            </Container>
        </Body>
    </Html>
);

export default VerifyEmail;

const main = {
    backgroundColor: '#ffffff',
    fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
};

const container = {
    margin: '0 auto',
    padding: '20px 0 48px',
    maxWidth: '560px',
};

const h1 = {
    fontSize: '24px',
    fontWeight: 'bold',
    marginTop: '48px',
};

const text = {
    fontSize: '16px',
    lineHeight: '26px',
};

const link = {
    color: '#007ee6',
    fontSize: '16px',
    textDecoration: 'underline',
};

const footer = {
    color: '#898989',
    fontSize: '14px',
    marginTop: '24px',
};
