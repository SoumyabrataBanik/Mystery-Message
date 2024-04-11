import { ReactElement } from "react";
import {
    Font,
    Head,
    Heading,
    Html,
    Preview,
    Row,
    Section,
    Text,
} from "@react-email/components";

interface VerificationEmailProps {
    userName: string;
    otp: string;
}

export default function VerficationEmail({
    userName,
    otp,
}: VerificationEmailProps): ReactElement {
    return (
        <Html>
            <Head>
                <title>Verification Code</title>
                <Font
                    fontFamily="Roboto"
                    fallbackFontFamily="Verdana"
                    webFont={{
                        url: "https://fonts.gstatic.com/s/roboto/v27/KFOmCnqEu92Fr1Mu4mxKKTU1Kg.woff2",
                        format: "woff2",
                    }}
                    fontWeight={400}
                    fontStyle="normal"
                />
            </Head>
            <Preview>Here&apos;s your verification code: {otp}</Preview>
            <Section>
                <Row>
                    <Heading as="h2">Hello {userName},</Heading>
                </Row>
                <Row>
                    <Text>
                        Thank you for registering to Mystery Message. Please use
                        this following verification code to complete your
                        registration:
                    </Text>
                </Row>
                <Row>
                    <Text>{otp}</Text>
                </Row>
            </Section>
        </Html>
    );
}
