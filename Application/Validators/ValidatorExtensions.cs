using System;
using System.Collections.Generic;
using System.Text;
using FluentValidation;

namespace Application.Validators
{
    public static class ValidatorExtensions
    {
        public static IRuleBuilder<T, string> Password<T>(this IRuleBuilder<T, string> ruleBuilder)
        {
            var options = ruleBuilder
                .NotEmpty().WithMessage("Password Required")
                .MinimumLength(6).WithMessage("Password Min Length Is 6 Characters")
                .Matches("[A-Z]").WithMessage("Password Must Contain An Upper Case Letter")
                .Matches("[a-z]").WithMessage("Password Must Contain A Lower Case Letter")
                .Matches("[0-9]").WithMessage("Password Must Contain A Number")
                .Matches("[^a-zA-Z0-9]").WithMessage("Password Must Contain A Special Character");
            return options;
        }
    }
}
