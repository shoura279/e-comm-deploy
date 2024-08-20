import nodemailer from 'nodemailer'
export const sendEmail = async ({ to = "", subject = "", html = '' }) => {
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: "ahmedshoura279@gmail.com",
            pass: "yqmx sabr vtfj gmul"
        }
    })
    const info = await transporter.sendMail({
        from: '"Route Academy"<ahmedshoura279@gmail.com>',
        to,
        subject,
        html
    })

}