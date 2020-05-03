using Application.Interfaces;
using Application.User;
using Microsoft.Extensions.Options;
using System;
using System.Net;
using System.Net.Mail;
using System.Threading.Tasks;

namespace Infrastructure.Security
{
    public class EmailSender : IEmailSender
    {
        private readonly IOptions<SmtpOptions> _config;

        public EmailSender(IOptions<SmtpOptions> config)
        {
            _config = config;
        }

        public async Task SendEmailAsync(string from, string to, string subject, string message)
        {
            var mailMessage = new MailMessage(from, to, subject, message);

            using (var client = new SmtpClient(_config.Value.Host, _config.Value.Port)
            {
                Credentials = new NetworkCredential(_config.Value.Username, _config.Value.Password)
            })
            {
                await client.SendMailAsync(mailMessage);
            }
        }
    }
}
