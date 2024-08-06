export default () => ({
  mail: {
    host: process.env.MAIL_HOST || 'smtp.mailtrap.io',
    port: parseInt(process.env.MAIL_PORT, 10) || 587,
    user: process.env.MAIL_USER || 'user',
    pass: process.env.MAIL_PASS || 'password',
    from: process.env.MAIL_FROM || 'noreply@example.com',
  },
});
