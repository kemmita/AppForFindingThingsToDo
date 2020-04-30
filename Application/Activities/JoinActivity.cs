using System;
using System.Linq;
using System.Net;
using System.Threading;
using System.Threading.Tasks;
using Application.Errors;
using Application.Interfaces;
using Domain;
using MediatR;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Activities
{
    public class JoinActivity
    {
        public class Command : IRequest
        {
            public Guid Id { get; set; }

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

                var activity = await _db.Activities.FindAsync(request.Id);

                if (activity == null)
                    throw new RestException(HttpStatusCode.NotFound, new { activity = "Activity Not Found" });

                var attending = await _db.UserActivities.SingleOrDefaultAsync(x => x.AppUserId == user.Id && x.ActivityId == activity.Id);

                if (attending != null)
                {
                    throw new  RestException(HttpStatusCode.BadRequest, "User already attending.");
                }

                activity.UserActivities.Add(
                    new UserActivity
                    {
                        DateJoined = DateTime.Now,
                        Activity = activity,
                        AppUser = user,
                        IsHost = false
                    }
                );

                var success = await _db.SaveChangesAsync() > 0;
                if (success)
                {
                    return Unit.Value;
                }
                throw new Exception("Problem saving changes");
            }
        }
    }
}
