using System;
using System.Threading;
using System.Threading.Tasks;
using Application.Interfaces;
using Domain;
using FluentValidation;
using MediatR;
using Microsoft.AspNetCore.Identity;
using Persistence;

namespace Application.Activities
{
    public class CreateActivity
    {
        public class Command : IRequest
        {
            public Guid Id { get; set; }
            public string Title { get; set; }
            public string Description { get; set; }
            public string Category { get; set; }
            public string City { get; set; }
            public string Venue { get; set; }
            public DateTime Date { get; set; }
        }

        public class Handler : IRequestHandler<Command>
        {
            private readonly ApplicationDbContext _db;
            private readonly UserManager<AppUser> _userManager;
            private readonly IUserAccessor _userAccessor;
            public Handler(ApplicationDbContext db, UserManager<AppUser> userManager, IUserAccessor userAccessor)
            {
                _db = db;
                _userManager = userManager;
                _userAccessor = userAccessor;
            }
            public async Task<Unit> Handle(Command request, CancellationToken cancellationToken)
            {
                var user = await _userManager.FindByNameAsync(_userAccessor.GetCurrentUsername());

                var activity = new Activity
                {
                    Id = request.Id,
                    Title = request.Title,
                    Description = request.Description,
                    Category = request.Category,
                    City = request.City,
                    Venue = request.Venue,
                    Date = request.Date,
                };

                _db.Activities.Add(activity);

                var userActivity = new UserActivity
                {
                    Activity = activity,
                    AppUser = user,
                    DateJoined = DateTime.Now,
                    IsHost = true
                };

                _db.UserActivities.Add(userActivity);

                var success = await _db.SaveChangesAsync() > 0;

                if (success)
                {
                    return Unit.Value;
                }

                throw new Exception("Problem saving new activity");
            }
        }
    }
}
