using Application.Errors;
using Domain;
using MediatR;
using Microsoft.AspNetCore.Identity;
using Persistence;
using System;
using System.Collections.Generic;
using System.Net;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace Application.User
{
    public class ConfirmEmail
    {
        public class Command : IRequest
        {
            public string Token { get; set; }
            public string UserId { get; set; }
        }
        public class Handler : IRequestHandler<Command>
        {
            private readonly ApplicationDbContext _db;
            private readonly UserManager<AppUser> _userManager;
            public Handler(ApplicationDbContext db, UserManager<AppUser> userManager)
            {
                _db = db;
                _userManager = userManager;
            }

            public async Task<Unit> Handle(Command request, CancellationToken cancellationToken)
            {
                var user = await _userManager.FindByIdAsync(request.UserId);

                if (user == null)
                    throw new RestException(HttpStatusCode.NotFound, new { User = "User Not Found" });
                
                var result = await _userManager.ConfirmEmailAsync(user, request.Token);

                if (result.Succeeded)
                    return Unit.Value;

                throw new Exception("Problem registering user.");
            }
        }
}
}
