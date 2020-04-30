using Application.Errors;
using Application.Interfaces;
using Domain;
using MediatR;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Persistence;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace Application.Profiles
{
    public class UpdateProfile
    {
        public class Command : IRequest
        {
            public string DisplayName { get; set; }
            public string Bio { get; set; }
        }

        public class Handler : IRequestHandler<Command>
        {
            private readonly UserManager<AppUser> _userManager;
            private readonly IUserAccessor _userAccessor;
            private readonly ApplicationDbContext _db;
            public Handler(ApplicationDbContext db, UserManager<AppUser> userManager, IUserAccessor userAccessor)
            {
                _db = db;
                _userAccessor = userAccessor;
                _userManager = userManager;
            }
            public async Task<Unit> Handle(Command request, CancellationToken cancellationToken)
            {
                var currentUser = await _userManager.FindByNameAsync(_userAccessor.GetCurrentUsername());

                currentUser.Bio = request.Bio ?? currentUser.Bio;
                currentUser.DisplayName = request.DisplayName ?? currentUser.DisplayName;

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
