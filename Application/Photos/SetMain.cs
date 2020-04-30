using Application.Interfaces;
using Domain;
using MediatR;
using Microsoft.AspNetCore.Identity;
using Persistence;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace Application.Photos
{
    public class SetMain
    {
        public class Command : IRequest
        {
            public string Id { get; set; }
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

                var photoToUnset = user.Photos.FirstOrDefault(x => x.IsMainPhoto == true);

                var photoToSet = user.Photos.FirstOrDefault(x => x.Id == request.Id);

                if (photoToSet == null)
                {
                    throw new Exception("Photo not found!");
                }

                photoToUnset.IsMainPhoto = false;
                photoToSet.IsMainPhoto = true;

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
