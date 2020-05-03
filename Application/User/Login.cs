using System.Linq;
using System.Net;
using System.Threading;
using System.Threading.Tasks;
using Application.Errors;
using Application.Interfaces;
using Domain;
using MediatR;
using Microsoft.AspNetCore.Identity;

namespace Application.User
{
    public class Login
    {
        //specify what param is expected to be passed for this Query
        public class Query : IRequest<User>
        {
            public string Email { get; set; }
            public string Password { get; set; }
        }

        public class Handler : IRequestHandler<Query, User>
        {
            private readonly UserManager<AppUser> _userManager;
            private readonly SignInManager<AppUser> _signInManager;
            private readonly IJwtGenerator _jwtGenerator;

            public Handler(UserManager<AppUser> userManager, SignInManager<AppUser> signInManager, IJwtGenerator jwtGenerator)
            {
                _userManager = userManager;
                _signInManager = signInManager;
                _jwtGenerator = jwtGenerator;
            }
            //using Query defined above wih a param Id of type Guid, we will locate a single activity in the db associated with the Guid id.
            public async Task<User> Handle(Query request, CancellationToken cancellationToken)
            {
                var user = await _userManager.FindByEmailAsync(request.Email);

                if (user == null)
                {
                    throw new RestException(HttpStatusCode.Unauthorized);
                }

                var result = await _signInManager.CheckPasswordSignInAsync(user, request.Password, false);

                var emailConfirmed = await _userManager.IsEmailConfirmedAsync(user);

                if (!emailConfirmed)
                    throw new RestException(HttpStatusCode.Unauthorized, new { Email = "You must confirm your email" });

                if (result.Succeeded)
                {
                    // Return Token
                    return new User
                    {
                        DisplayName = user.DisplayName,
                        Image = user.Photos.FirstOrDefault(x => x.IsMainPhoto == true)?.Url,
                        Token = _jwtGenerator.CreateToken(user),
                        Username = user.UserName
                    };
                }
                else
                {
                    throw new RestException(HttpStatusCode.Unauthorized);
                }
            }
        }
    }
}
