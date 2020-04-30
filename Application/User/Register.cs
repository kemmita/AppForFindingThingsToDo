using System;
using System.Linq;
using System.Net;
using System.Threading;
using System.Threading.Tasks;
using Application.Activities;
using Application.Errors;
using Application.Interfaces;
using Domain;
using MediatR;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.User
{
    public class Register
    {
        public class Command : IRequest<User>
        {
            public string DisplayName { get; set; }
            public string Username { get; set; }
            public string Email { get; set; }
            public string Password { get; set; }
        }
        public class Handler : IRequestHandler<Command, User>
        {
            private readonly ApplicationDbContext _db;
            private readonly UserManager<AppUser> _userManager;
            private readonly IJwtGenerator _jwtGenerator;
            public Handler(ApplicationDbContext db, UserManager<AppUser> userManager, IJwtGenerator jwtGenerator)
            {
                _db = db;
                _userManager = userManager;
                _jwtGenerator = jwtGenerator;
            }

            public async Task<User> Handle(Command request, CancellationToken cancellationToken)
            {
                if (await _db.Users.AnyAsync(u => u.Email == request.Email))
                {
                    throw new RestException(HttpStatusCode.BadRequest, new {Email = "Email Already Exists"});
                }

                if (await _db.Users.AnyAsync(u => u.UserName == request.Username))
                {
                    throw new RestException(HttpStatusCode.BadRequest, new { Username = "Username Already Exists" });
                }

                var user = new AppUser
                {
                    DisplayName = request.DisplayName,
                    Email = request.Email,
                    UserName = request.Username
                };

                var results = await _userManager.CreateAsync(user, request.Password);

                if (results.Succeeded)
                {
                    return new User
                    {
                        DisplayName = user.DisplayName,
                        Token = _jwtGenerator.CreateToken(user),
                        Username = user.UserName,
                        Image = user.Photos.FirstOrDefault(p => p.IsMainPhoto)?.Url
                    };
                }

                throw new Exception("Problem registering user.");
            }
        }
    }
}
