import Mailjet from "node-mailjet";
import { EmailSubjects } from "../utils/constants";
import { registerTemplate } from "./views/email-templates/registerEmail";


export const mailjet = new Mailjet({
    apiKey: process.env.MAILJETAPIKEY,
    apiSecret: process.env.MAILJETSECRET
});

export const sendEmail = async (toList: { Email: string, Name: string }[], htmlContent: any, Subject = EmailSubjects.Default) => {
    try {
        return await mailjet.post('send', { version: 'v3.1' }).request({
            Messages: [
                {
                    From: {
                        Email: "temailsending@gmail.com",
                        Name: "TechDenali"
                    },
                    To: toList,
                    Subject: Subject,
                    HTMLPart: htmlContent
                }
            ]
        });
    } catch (err) {
        console.log('err', err);
        return err;
    }

}