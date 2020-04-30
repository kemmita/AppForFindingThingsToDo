using FluentValidation;
using System;
using System.Collections.Generic;
using System.Text;
using Application.Activities;

namespace Application.Validators
{
    public class CreateCommandValidator : AbstractValidator<CreateActivity.Command>
    {
        public CreateCommandValidator()
        {
            RuleFor(x => x.City).NotEmpty().WithMessage("City must be provided");
            RuleFor(x => x.Title).NotEmpty().WithMessage("Title must be provided");
            RuleFor(x => x.Description).NotEmpty().WithMessage("Description must be provided");
            RuleFor(x => x.Category).NotEmpty().WithMessage("Category must be provided");
            RuleFor(x => x.Venue).NotEmpty().WithMessage("Venue must be provided");
            RuleFor(x => x.Date).NotEmpty().WithMessage("Date must be provided");
        }
    }
}
