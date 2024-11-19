import { sendEmail } from "../emailmodule/email"
import { registerTemplate } from "../emailmodule/views/email-templates/registerEmail"
import { EmailSubjects } from "../utils/constants"

export const registrationEmail = async (data: { email: string, firstName: string, lastName: string, token: string }) => {
    try {
        const { email, firstName, lastName, token } = data;
        return await sendEmail([
            {
                Email: email,
                Name: firstName
            }
        ], registerTemplate({
            name: `${lastName} ${lastName}`,
            verificationLink: `${process.env.FRONTENDURL}/verifyToken?token=${token}`
        }), EmailSubjects.Welcome)
    } catch (err) {
        console.log('err', err);
        return err;
    }

}