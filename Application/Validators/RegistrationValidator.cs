using Application.User;
using FluentValidation;

namespace Application.Validators
{
    public class RegistrationValidator : AbstractValidator<Register.Command>
    {
        public RegistrationValidator()
        {
            RuleFor(x => x.Username).NotEmpty().WithMessage("Username Required");
            RuleFor(x => x.DisplayName).NotEmpty().WithMessage("DisplayName Required");
            RuleFor(x => x.Email).NotEmpty().WithMessage("Email Required").EmailAddress().WithMessage("Valid Email Required");
            RuleFor(x => x.Password).Password();
        }
    }
}