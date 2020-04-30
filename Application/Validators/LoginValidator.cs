using Application.User;
using FluentValidation;

namespace Application.Validators
{
    public class LoginValidator : AbstractValidator<Login.Query>
    {
        public LoginValidator()
        {
            RuleFor(x => x.Email).NotEmpty().WithMessage("Email Required");
            RuleFor(x => x.Password).NotEmpty().WithMessage("Password Required");
        }
    }
}
