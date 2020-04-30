using Application.Errors;
using Application.Interfaces;
using Domain;
using MediatR;
using Microsoft.AspNetCore.Identity;
using Persistence;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace Application.Photos
{
    public class Delete
    {
        public class Command : IRequest
        {
            public string Id { get; set; }
        }

        public class Handler : IRequestHandler<Command>
        {
            private readonly ApplicationDbContext _db;
            private readonly IPhotoAccessor _photoAccessor;
            private readonly IUserAccessor _userAccessor;
            private readonly UserManager<AppUser> _userManager;
            public Handler(ApplicationDbContext db, IPhotoAccessor photoAccessor, IUserAccessor userAccessor, UserManager<AppUser> userManager)
            {
                _db = db;
                _photoAccessor = photoAccessor;
                _userManager = userManager;
                _userAccessor = userAccessor;
            }
            public async Task<Unit> Handle(Command request, CancellationToken cancellationToken)
            {
                var user = await _userManager.FindByNameAsync(_userAccessor.GetCurrentUsername());

                var photo = user.Photos.FirstOrDefault(x => x.Id == request.Id);

                if (photo == null)
                {
                    throw new RestException(HttpStatusCode.NotFound, new { Photo = "Not found" });
                }

                if (photo.IsMainPhoto)
                {
                    throw new RestException(HttpStatusCode.BadRequest, new { Photo = "You cannot delete your main photo like this!" });
                }

                if (_photoAccessor.DeletePhoto(request.Id) == null)
                {
                    throw new Exception("Issue deleting photo!");
                }

                user.Photos.Remove(photo);

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
