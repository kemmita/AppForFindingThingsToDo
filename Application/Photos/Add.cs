using Application.Interfaces;
using Domain;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Persistence;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace Application.Photos
{
    public class Add 
    {
        public class Command : IRequest<Photo>
        {
            public IFormFile file { get; set; }
        }

        public class Handler : IRequestHandler<Command, Photo>
        {
            private readonly ApplicationDbContext _db;
            private readonly IUserAccessor _userAccessor;
            private readonly IPhotoAccessor _photoAccessor;
            public Handler(ApplicationDbContext db, IUserAccessor userAccessor, IPhotoAccessor photoAccessor)
            {
                _db = db;
                _userAccessor = userAccessor;
                _photoAccessor = photoAccessor;
            }

            public async Task<Photo> Handle(Command request, CancellationToken cancellationToken)
            {
                var photoUploadResult = _photoAccessor.AddPhoto(request.file);

                var user = await _db.Users.SingleOrDefaultAsync(x => x.UserName == _userAccessor.GetCurrentUsername());

                var photo = new Photo
                {
                    Url = photoUploadResult.Url,
                    Id = photoUploadResult.PublicId
                };

                if (!user.Photos.Any(x => x.IsMainPhoto))
                {
                    photo.IsMainPhoto = true;
                }

                user.Photos.Add(photo);

                var success = await _db.SaveChangesAsync() > 0;

                if (success)
                {
                    return photo;
                }

                throw new Exception("Problem saving photo!");
            }

        }
    }
}
