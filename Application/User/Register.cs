using System;
using System.Linq;
using System.Net;
using System.Security.Policy;
using System.Threading;
using System.Threading.Tasks;
using System.Web;
using Application.Activities;
using Application.Errors;
using Application.Interfaces;
using Domain;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
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
            private readonly IEmailSender _emailSender;
            public Handler(ApplicationDbContext db, UserManager<AppUser> userManager, IJwtGenerator jwtGenerator, IEmailSender emailSender)
            {
                _db = db;
                _userManager = userManager;
                _jwtGenerator = jwtGenerator;
                _emailSender = emailSender;
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
                    user = await _userManager.FindByNameAsync(user.UserName);

                    var token = await _userManager.GenerateEmailConfirmationTokenAsync(user);

                    var confirmatrionLink = new Uri($"https://localhost:44396/api/user/confirmEmail?userId={user.Id}&token={HttpUtility.UrlEncode(token)}");

                    await _emailSender.SendEmailAsync("russellkemmitdeveloper@gmail.com", user.Email, "Kemmittech Email Confirmation", $"Please confirm your account, by selecting this link: {confirmatrionLink}");

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
