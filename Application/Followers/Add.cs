using Application.Errors;
using Application.Interfaces;
using Domain;
using MediatR;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Persistence;
using System;
using System.Linq;
using System.Net;
using System.Threading;
using System.Threading.Tasks;

namespace Application.Followers
{
    public class Add
    {
        public class Command : IRequest
        {
            public string Username { get; set; }
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
                var observer = await _userManager.FindByNameAsync(_userAccessor.GetCurrentUsername());

                var target = await _userManager.FindByNameAsync(request.Username);

                if (target == null)
                        throw new RestException(HttpStatusCode.NotFound, new { target = "User Not Found" });

                var following = _db.Followings.Any(x => x.ObserverId == observer.Id && x.TargetId == target.Id);

                if (following)
                    throw new RestException(HttpStatusCode.BadRequest, new { following = "You already following this user" });


                await _db.Followings.AddAsync(new UserFollowing 
                {
                    Observer = observer,
                    Target = target,
                });

                var success = await _db.SaveChangesAsync() > 0;

                if (success)
                    return Unit.Value;

                throw new Exception("Problem creating following");
            }
        }
    }
}
