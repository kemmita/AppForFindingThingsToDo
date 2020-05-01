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

namespace Application.User
{
    public class ExternalLogin
    {
        //specify what param is expected to be passed for this Query
        public class Query : IRequest<User>
        {
            public string AccessToken { get; set; }
        }

        public class Handler : IRequestHandler<Query, User>
        {
            private readonly UserManager<AppUser> _userManager;
            private readonly IJwtGenerator _jwtGenerator;
            private readonly IFacebookAccessor _facebookAccessor;

            public Handler(UserManager<AppUser> userManager, IJwtGenerator jwtGenerator, IFacebookAccessor facebookAccessor)
            {
                _userManager = userManager;
                _jwtGenerator = jwtGenerator;
                _facebookAccessor = facebookAccessor;
            }
            //using Query defined above wih a param Id of type Guid, we will locate a single activity in the db associated with the Guid id.
            public async Task<User> Handle(Query request, CancellationToken cancellationToken)
            {
                var userInfo = await _facebookAccessor.FacebookLogin(request.AccessToken);

                if (userInfo == null)
                    throw new RestException(HttpStatusCode.BadRequest, new { User = "problem validating facebook token." });

                var user = await _userManager.FindByIdAsync(userInfo.Id);

                if (user == null)
                {
                    user = new AppUser
                    {
                        DisplayName = userInfo.Name,
                        Id = userInfo.Id,
                        Email = userInfo.Email,
                        UserName = "fb_" + userInfo.Id
                    };
                    var photo = new Photo
                    {
                        Id = "fb_" + userInfo.Id,
                        IsMainPhoto = true,
                        Url = userInfo.Picture.Data.Url
                    };

                    user.Photos.Add(photo);

                    var result = await _userManager.CreateAsync(user);

                    if (!result.Succeeded)
                        throw new RestException(HttpStatusCode.BadRequest, new { User = "Problem creating new user via facebook" });
                }

                return new User
                {
                    DisplayName = user.DisplayName,
                    Image = user.Photos.FirstOrDefault(x => x.IsMainPhoto == true)?.Url,
                    Token = _jwtGenerator.CreateToken(user),
                    Username = user.UserName
                };
            }
        }
    }
}
