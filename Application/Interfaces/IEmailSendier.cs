using Application.User;
using System.Threading.Tasks;

namespace Application.Interfaces
{
    public interface IEmailSender
    {
        Task SendEmailAsync(string from, string to, string subject, string message);
    }
}
